'use server';

import { db } from '@/lib/db';
import {
    challengeSubmissionFiles,
    challengeSubmissions,
    files
} from '@/lib/db/schema';
import { deleteFileFromS3, extractS3KeyFromUrl, uploadFileToS3 } from '@/lib/s3';
import { randomUUID } from 'crypto';
import { and, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export interface SubmissionActionResult {
  success: boolean;
  error?: string;
  submissionId?: string;
}

export async function createSubmission(
  challengeId: string,
  userId: string,
  formData: FormData
): Promise<SubmissionActionResult> {
  try {
    const description = formData.get('description') as string;
    const isFeatured = formData.get('isFeatured') === 'true' ? 1 : 0;

    if (!description || description.trim().length === 0) {
      return {
        success: false,
        error: 'Descrição é obrigatória',
      };
    }

    // Check if submission already exists
    const existingSubmission = await db.query.challengeSubmissions.findFirst({
      where: and(
        eq(challengeSubmissions.challengeId, challengeId),
        eq(challengeSubmissions.userId, userId)
      ),
    });

    if (existingSubmission) {
      return {
        success: false,
        error: 'Você já possui uma submissão para este desafio',
      };
    }

    // Create submission
    const [newSubmission] = await db
      .insert(challengeSubmissions)
      .values({
        challengeId,
        userId,
        description: description.trim(),
        isFeatured,
      })
      .returning();

    // Handle file uploads
    const uploadedFiles = formData.getAll('files') as File[];
    
    if (uploadedFiles.length > 0) {
      await db.transaction(async (tx) => {
        for (const file of uploadedFiles) {
          if (file.size === 0) continue;

          // Create file entry
          const [fileEntry] = await tx
            .insert(files)
            .values({
              filename: file.name,
              mimeType: file.type,
              url: '',
              userId,
            })
            .returning();

          // Upload to S3
          const arrayBuffer = await file.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          const key = `challenges/${challengeId}/submissions/${userId}/${randomUUID()}-${file.name}`;
          const uploaded = await uploadFileToS3(buffer, file.name, file.type, key);

          // Update file with URL
          await tx
            .update(files)
            .set({ url: uploaded.url })
            .where(eq(files.id, fileEntry.id));

          // Create submission file relation
          await tx.insert(challengeSubmissionFiles).values({
            submissionId: newSubmission.id,
            fileId: fileEntry.id,
          });
        }
      });
    }

    revalidatePath(`/desafios/${challengeId}`);
    revalidatePath(`/admin/challenges/${challengeId}`);

    return {
      success: true,
      submissionId: newSubmission.id,
    };
  } catch (error) {
    console.error('Erro ao criar submissão:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao criar submissão',
    };
  }
}

export async function updateSubmission(
  submissionId: string,
  formData: FormData
): Promise<SubmissionActionResult> {
  try {
    const description = formData.get('description') as string;
    const isFeatured = formData.get('isFeatured') === 'true' ? 1 : 0;

    if (!description || description.trim().length === 0) {
      return {
        success: false,
        error: 'Descrição é obrigatória',
      };
    }

    // Get submission to find challengeId for revalidation
    const submission = await db.query.challengeSubmissions.findFirst({
      where: eq(challengeSubmissions.id, submissionId),
    });

    if (!submission) {
      return {
        success: false,
        error: 'Submissão não encontrada',
      };
    }

    await db
      .update(challengeSubmissions)
      .set({
        description: description.trim(),
        isFeatured,
        updatedAt: new Date(),
      })
      .where(eq(challengeSubmissions.id, submissionId));

    revalidatePath(`/desafios/${submission.challengeId}`);
    revalidatePath(`/admin/challenges/${submission.challengeId}`);

    return {
      success: true,
      submissionId,
    };
  } catch (error) {
    console.error('Erro ao atualizar submissão:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao atualizar submissão',
    };
  }
}

export async function deleteSubmission(submissionId: string): Promise<SubmissionActionResult> {
  try {
    // Get submission with files
    const submission = await db.query.challengeSubmissions.findFirst({
      where: eq(challengeSubmissions.id, submissionId),
      with: {
        files: {
          with: {
            file: true,
          },
        },
      },
    });

    if (!submission) {
      return {
        success: false,
        error: 'Submissão não encontrada',
      };
    }

    return await db.transaction(async (tx) => {
      // Delete files from S3
      for (const sf of submission.files) {
        if (sf.file?.url) {
          const key = extractS3KeyFromUrl(sf.file.url);
          if (key) {
            try {
              await deleteFileFromS3(key);
            } catch (error) {
              console.error(`Erro ao deletar arquivo do S3: ${key}`, error);
            }
          }
        }
      }

      // Delete submission (cascade will delete relations)
      await tx.delete(challengeSubmissions).where(eq(challengeSubmissions.id, submissionId));

      revalidatePath(`/desafios/${submission.challengeId}`);
      revalidatePath(`/admin/challenges/${submission.challengeId}`);

      return { success: true };
    });
  } catch (error) {
    console.error('Erro ao deletar submissão:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao deletar submissão',
    };
  }
}

export async function toggleSubmissionFeatured(
  submissionId: string,
  isFeatured: boolean
): Promise<SubmissionActionResult> {
  try {
    const submission = await db.query.challengeSubmissions.findFirst({
      where: eq(challengeSubmissions.id, submissionId),
    });

    if (!submission) {
      return {
        success: false,
        error: 'Submissão não encontrada',
      };
    }

    await db
      .update(challengeSubmissions)
      .set({
        isFeatured: isFeatured ? 1 : 0,
        updatedAt: new Date(),
      })
      .where(eq(challengeSubmissions.id, submissionId));

    revalidatePath(`/desafios/${submission.challengeId}`);
    revalidatePath(`/admin/challenges/${submission.challengeId}`);

    return {
      success: true,
      submissionId,
    };
  } catch (error) {
    console.error('Erro ao atualizar featured:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao atualizar featured',
    };
  }
}

export async function addFilesToSubmission(
  submissionId: string,
  formData: FormData
): Promise<SubmissionActionResult> {
  try {
    const uploadedFiles = formData.getAll('files') as File[];

    if (uploadedFiles.length === 0) {
      return {
        success: false,
        error: 'Nenhum arquivo enviado',
      };
    }

    const submission = await db.query.challengeSubmissions.findFirst({
      where: eq(challengeSubmissions.id, submissionId),
    });

    if (!submission) {
      return {
        success: false,
        error: 'Submissão não encontrada',
      };
    }

    return await db.transaction(async (tx) => {
      for (const file of uploadedFiles) {
        if (file.size === 0) continue;

        // Create file entry
        const [fileEntry] = await tx
          .insert(files)
          .values({
            filename: file.name,
            mimeType: file.type,
            url: '',
            userId: submission.userId,
          })
          .returning();

        // Upload to S3
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const key = `challenges/${submission.challengeId}/submissions/${submission.userId}/${randomUUID()}-${file.name}`;
        const uploaded = await uploadFileToS3(buffer, file.name, file.type, key);

        // Update file with URL
        await tx
          .update(files)
          .set({ url: uploaded.url })
          .where(eq(files.id, fileEntry.id));

        // Create submission file relation
        await tx.insert(challengeSubmissionFiles).values({
          submissionId,
          fileId: fileEntry.id,
        });
      }

      revalidatePath(`/desafios/${submission.challengeId}`);
      revalidatePath(`/admin/challenges/${submission.challengeId}`);

      return { success: true };
    });
  } catch (error) {
    console.error('Erro ao adicionar arquivos:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao adicionar arquivos',
    };
  }
}

export async function removeFileFromSubmission(
  submissionId: string,
  fileId: string
): Promise<SubmissionActionResult> {
  try {
    // Get file info
    const submissionFile = await db.query.challengeSubmissionFiles.findFirst({
      where: and(
        eq(challengeSubmissionFiles.submissionId, submissionId),
        eq(challengeSubmissionFiles.fileId, fileId)
      ),
      with: {
        file: true,
        submission: true,
      },
    });

    if (!submissionFile) {
      return {
        success: false,
        error: 'Arquivo não encontrado',
      };
    }

    return await db.transaction(async (tx) => {
      // Delete from S3
      if (submissionFile.file?.url) {
        const key = extractS3KeyFromUrl(submissionFile.file.url);
        if (key) {
          try {
            await deleteFileFromS3(key);
          } catch (error) {
            console.error(`Erro ao deletar arquivo do S3: ${key}`, error);
          }
        }
      }

      // Delete file relation
      await tx
        .delete(challengeSubmissionFiles)
        .where(
          and(
            eq(challengeSubmissionFiles.submissionId, submissionId),
            eq(challengeSubmissionFiles.fileId, fileId)
          )
        );

      // Delete file entry
      await tx.delete(files).where(eq(files.id, fileId));

      revalidatePath(`/desafios/${submissionFile.submission.challengeId}`);
      revalidatePath(`/admin/challenges/${submissionFile.submission.challengeId}`);

      return { success: true };
    });
  } catch (error) {
    console.error('Erro ao remover arquivo:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao remover arquivo',
    };
  }
}
