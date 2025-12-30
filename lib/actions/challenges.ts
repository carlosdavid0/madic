'use server';

import { db } from '@/lib/db';
import {
    challengeFiles,
    challenges,
    challengeUserFiles,
    challengeUsers,
    files,
} from '@/lib/db/schema';
import { deleteFileFromS3, extractS3KeyFromUrl, uploadFileToS3 } from '@/lib/s3';
import { randomUUID } from 'crypto';
import { and, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export interface ChallengeActionResult {
  success: boolean;
  error?: string;
  challengeId?: string;
}

export async function createChallenge(formData: FormData): Promise<ChallengeActionResult> {
  try {
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const firstPlacePoints = parseInt(formData.get('firstPlacePoints') as string) || 100;
    const secondPlacePoints = parseInt(formData.get('secondPlacePoints') as string) || 75;
    const thirdPlacePoints = parseInt(formData.get('thirdPlacePoints') as string) || 50;
    const otherPlacesPoints = parseInt(formData.get('otherPlacesPoints') as string) || 25;
    
    // Parse dates
    const participationStartDate = formData.get('participationStartDate') 
      ? new Date(formData.get('participationStartDate') as string) 
      : null;
    const participationEndDate = formData.get('participationEndDate') 
      ? new Date(formData.get('participationEndDate') as string) 
      : null;
    const votingStartDate = formData.get('votingStartDate') 
      ? new Date(formData.get('votingStartDate') as string) 
      : null;
    const votingEndDate = formData.get('votingEndDate') 
      ? new Date(formData.get('votingEndDate') as string) 
      : null;

    // Handle thumbnail upload
    const thumbnailFile = formData.get('thumbnail') as File | null;
    let thumbnailFileId: string | null = null;

    if (thumbnailFile && thumbnailFile.size > 0) {
      // Create file entry
      const [fileEntry] = await db
        .insert(files)
        .values({
          filename: thumbnailFile.name,
          mimeType: thumbnailFile.type,
          url: '',
        })
        .returning();

      // Upload to S3
      const arrayBuffer = await thumbnailFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const key = `challenges/thumbnails/${randomUUID()}-${thumbnailFile.name}`;
      const uploaded = await uploadFileToS3(buffer, thumbnailFile.name, thumbnailFile.type, key);

      // Update file with URL
      await db
        .update(files)
        .set({ url: uploaded.url })
        .where(eq(files.id, fileEntry.id));

      thumbnailFileId = fileEntry.id;
    }

    // Create challenge
    const [newChallenge] = await db
      .insert(challenges)
      .values({
        name,
        description,
        thumbnailFileId,
        participationStartDate,
        participationEndDate,
        votingStartDate,
        votingEndDate,
        firstPlacePoints,
        secondPlacePoints,
        thirdPlacePoints,
        otherPlacesPoints,
      })
      .returning();

    revalidatePath('/admin/challenges');
    
    return {
      success: true,
      challengeId: newChallenge.id,
    };
  } catch (error) {
    console.error('Erro ao criar challenge:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao criar challenge',
    };
  }
}

export async function updateChallenge(
  id: string,
  formData: FormData
): Promise<ChallengeActionResult> {
  try {
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const firstPlacePoints = parseInt(formData.get('firstPlacePoints') as string) || 100;
    const secondPlacePoints = parseInt(formData.get('secondPlacePoints') as string) || 75;
    const thirdPlacePoints = parseInt(formData.get('thirdPlacePoints') as string) || 50;
    const otherPlacesPoints = parseInt(formData.get('otherPlacesPoints') as string) || 25;
    
    // Parse dates
    const participationStartDate = formData.get('participationStartDate') 
      ? new Date(formData.get('participationStartDate') as string) 
      : null;
    const participationEndDate = formData.get('participationEndDate') 
      ? new Date(formData.get('participationEndDate') as string) 
      : null;
    const votingStartDate = formData.get('votingStartDate') 
      ? new Date(formData.get('votingStartDate') as string) 
      : null;
    const votingEndDate = formData.get('votingEndDate') 
      ? new Date(formData.get('votingEndDate') as string) 
      : null;

    // Handle thumbnail upload
    const thumbnailFile = formData.get('thumbnail') as File | null;
    let thumbnailFileId: string | undefined = undefined;

    if (thumbnailFile && thumbnailFile.size > 0) {
      // Get current challenge to delete old thumbnail if exists
      const currentChallenge = await db.query.challenges.findFirst({
        where: eq(challenges.id, id),
        with: { thumbnailFile: true },
      });

      // Delete old thumbnail from S3 if exists
      if (currentChallenge?.thumbnailFile?.url) {
        const oldKey = extractS3KeyFromUrl(currentChallenge.thumbnailFile.url);
        if (oldKey) {
          try {
            await deleteFileFromS3(oldKey);
            await db.delete(files).where(eq(files.id, currentChallenge.thumbnailFile.id));
          } catch (error) {
            console.error('Error deleting old thumbnail:', error);
          }
        }
      }

      // Create new file entry
      const [fileEntry] = await db
        .insert(files)
        .values({
          filename: thumbnailFile.name,
          mimeType: thumbnailFile.type,
          url: '',
        })
        .returning();

      // Upload to S3
      const arrayBuffer = await thumbnailFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const key = `challenges/thumbnails/${randomUUID()}-${thumbnailFile.name}`;
      const uploaded = await uploadFileToS3(buffer, thumbnailFile.name, thumbnailFile.type, key);

      // Update file with URL
      await db
        .update(files)
        .set({ url: uploaded.url })
        .where(eq(files.id, fileEntry.id));

      thumbnailFileId = fileEntry.id;
    }

    await db
      .update(challenges)
      .set({
        name,
        description,
        ...(thumbnailFileId !== undefined && { thumbnailFileId }),
        participationStartDate,
        participationEndDate,
        votingStartDate,
        votingEndDate,
        firstPlacePoints,
        secondPlacePoints,
        thirdPlacePoints,
        otherPlacesPoints,
        updatedAt: new Date(),
      })
      .where(eq(challenges.id, id));

    revalidatePath('/admin/challenges');
    revalidatePath(`/admin/challenges/${id}`);
    
    return {
      success: true,
      challengeId: id,
    };
  } catch (error) {
    console.error('Erro ao atualizar challenge:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao atualizar challenge',
    };
  }
}

export async function deleteChallenge(id: string): Promise<ChallengeActionResult> {
  try {
    // Buscar todos os arquivos relacionados ao challenge
    const challengeFilesList = await db.query.challengeFiles.findMany({
      where: eq(challengeFiles.challengeId, id),
      with: {
        file: true,
      },
    });

    // Buscar todos os arquivos de usuários relacionados ao challenge
    const challengeUserFilesList = await db.query.challengeUserFiles.findMany({
      where: eq(challengeUserFiles.challengeId, id),
      with: {
        file: true,
      },
    });

    return await db.transaction(async (tx) => {
      // Deletar arquivos do S3 e do banco
      for (const cf of challengeFilesList) {
        if (cf.file?.url) {
          const key = extractS3KeyFromUrl(cf.file.url);
          if (key) {
            try {
              await deleteFileFromS3(key);
            } catch (error) {
              console.error(`Erro ao deletar arquivo do S3: ${key}`, error);
            }
          }
        }
      }

      for (const cuf of challengeUserFilesList) {
        if (cuf.file?.url) {
          const key = extractS3KeyFromUrl(cuf.file.url);
          if (key) {
            try {
              await deleteFileFromS3(key);
            } catch (error) {
              console.error(`Erro ao deletar arquivo do S3: ${key}`, error);
            }
          }
        }
      }

      // Deletar challenge (cascade vai deletar as relações)
      await tx.delete(challenges).where(eq(challenges.id, id));

      revalidatePath('/admin/challenges');
      redirect('/admin/challenges');
    });
  } catch (error) {
    console.error('Erro ao deletar challenge:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao deletar challenge',
    };
  }
}

export async function updateUserPosition(
  challengeId: string,
  userId: string,
  position: number
): Promise<ChallengeActionResult> {
  try {
    const challenge = await db.query.challenges.findFirst({
      where: eq(challenges.id, challengeId),
    });

    if (!challenge) {
      return {
        success: false,
        error: 'Challenge não encontrado',
      };
    }

    let pointsEarned = challenge.otherPlacesPoints || 25;
    if (position === 1) pointsEarned = challenge.firstPlacePoints || 100;
    else if (position === 2) pointsEarned = challenge.secondPlacePoints || 75;
    else if (position === 3) pointsEarned = challenge.thirdPlacePoints || 50;

    await db
      .update(challengeUsers)
      .set({
        position,
        pointsEarned,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(challengeUsers.challengeId, challengeId),
          eq(challengeUsers.userId, userId)
        )
      );

    revalidatePath(`/admin/challenges/${challengeId}`);
    return { success: true };
  } catch (error) {
    console.error('Erro ao atualizar posição do usuário:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao atualizar posição',
    };
  }
}

export async function addFilesToChallenge(
  challengeId: string,
  formData: FormData
): Promise<ChallengeActionResult> {
  try {
    const uploadedFiles = formData.getAll('files') as File[];

    if (uploadedFiles.length === 0) {
      return {
        success: false,
        error: 'Nenhum arquivo enviado',
      };
    }

    return await db.transaction(async (tx) => {
      for (const file of uploadedFiles) {
        if (file.size === 0) continue;

        // Criar registro do arquivo no banco
        const [fileEntry] = await tx
          .insert(files)
          .values({
            filename: file.name,
            mimeType: file.type,
            url: '', // Será atualizado após upload
          })
          .returning();

        // Converter arquivo para buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Gerar chave S3
        const key = `challenges/${challengeId}/${randomUUID()}-${file.name}`;

        // Fazer upload para S3
        const uploaded = await uploadFileToS3(buffer, file.name, file.type, key);

        // Atualizar registro com URL
        await tx
          .update(files)
          .set({ url: uploaded.url })
          .where(eq(files.id, fileEntry.id));

        // Criar relação challenge_files
        await tx.insert(challengeFiles).values({
          challengeId,
          fileId: fileEntry.id,
        });
      }

      revalidatePath(`/admin/challenges/${challengeId}`);
      return { success: true };
    });
  } catch (error) {
    console.error('Erro ao adicionar arquivos ao challenge:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao adicionar arquivos',
    };
  }
}

export async function addUserFilesToChallenge(
  challengeId: string,
  userId: string,
  formData: FormData
): Promise<ChallengeActionResult> {
  try {
    const uploadedFiles = formData.getAll('files') as File[];

    if (uploadedFiles.length === 0) {
      return {
        success: false,
        error: 'Nenhum arquivo enviado',
      };
    }

    return await db.transaction(async (tx) => {
      for (const file of uploadedFiles) {
        if (file.size === 0) continue;

        // Criar registro do arquivo no banco
        const [fileEntry] = await tx
          .insert(files)
          .values({
            filename: file.name,
            mimeType: file.type,
            url: '', // Será atualizado após upload
            userId,
          })
          .returning();

        // Converter arquivo para buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Gerar chave S3
        const key = `challenges/${challengeId}/users/${userId}/${randomUUID()}-${file.name}`;

        // Fazer upload para S3
        const uploaded = await uploadFileToS3(buffer, file.name, file.type, key);

        // Atualizar registro com URL
        await tx
          .update(files)
          .set({ url: uploaded.url })
          .where(eq(files.id, fileEntry.id));

        // Criar relação challenge_user_files
        await tx.insert(challengeUserFiles).values({
          challengeId,
          userId,
          fileId: fileEntry.id,
        });
      }

      revalidatePath(`/admin/challenges/${challengeId}`);
      return { success: true };
    });
  } catch (error) {
    console.error('Erro ao adicionar arquivos do usuário ao challenge:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao adicionar arquivos do usuário',
    };
  }
}

