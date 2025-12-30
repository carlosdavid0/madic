import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { env } from './utils/env';

// Configuração do cliente S3
const s3Client = new S3Client({
  region: env.AWS_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID.trim(),
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY.trim(),
  },
});

// Tipos de arquivo permitidos para avatar
const ALLOWED_AVATAR_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

// Tamanho máximo do arquivo (5MB em bytes)
const MAX_AVATAR_SIZE = 5 * 1024 * 1024;

/**
 * Remove acentos de uma string
 */
function removeAccents(str: string): string {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/**
 * Valida se o arquivo de avatar é permitido
 */
export function validateAvatarFile(file: { type: string; size: number }): void {
  if (!ALLOWED_AVATAR_MIME_TYPES.includes(file.type)) {
    throw new Error(
      'Tipo de arquivo não permitido. Apenas JPG, PNG e WEBP são aceitos para avatar.'
    );
  }

  if (file.size > MAX_AVATAR_SIZE) {
    throw new Error('Arquivo muito grande. O tamanho máximo permitido é 5MB.');
  }
}

/**
 * Gera uma chave S3 única para o avatar do usuário
 * Formato: avatars/{userId}.{extension}
 * Sempre substitui o arquivo anterior do mesmo usuário
 */
export function generateAvatarS3Key(userId: string, fileName: string): string {
  const sanitizedFileName = removeAccents(fileName.replace(/[^a-zA-Z0-9.-]/g, '_'));
  const extension = sanitizedFileName.split('.').pop() || 'jpg';
  // Usa apenas o userId como nome, sempre substituindo o arquivo anterior
  return `avatars/${userId}.${extension}`;
}

/**
 * Faz upload de um buffer para o S3 como avatar
 */
export async function uploadAvatarToS3(
  buffer: Buffer,
  fileName: string,
  fileType: string,
  userId: string
): Promise<{ key: string; url: string }> {
  validateAvatarFile({ type: fileType, size: buffer.length });

  const cleanFileName = removeAccents(fileName);
  const key = generateAvatarS3Key(userId, cleanFileName);

  const command = new PutObjectCommand({
    Bucket: env.AWS_S3_BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: fileType,
    Metadata: {
      originalName: cleanFileName,
      uploadTime: new Date().toISOString(),
      userId,
    },
  });

  try {
    await s3Client.send(command);

    // Retorna URL pública (sem assinatura) para salvar no banco
    // A URL assinada será gerada quando necessário (1 hora de validade)
    const publicUrl = `https://${env.AWS_S3_BUCKET_NAME}.s3.${env.AWS_REGION}.amazonaws.com/${key}`;

    return { key, url: publicUrl };
  } catch (error: unknown) {
    console.error('Erro ao fazer upload do avatar para S3:', error);

    // Tratamento específico de erros AWS
    if (error && typeof error === 'object' && 'Code' in error) {
      const awsError = error as { Code: string; message?: string };
      
      switch (awsError.Code) {
        case 'SignatureDoesNotMatch':
          throw new Error(
            'Erro de autenticação AWS. Verifique se as credenciais AWS_ACCESS_KEY_ID e AWS_SECRET_ACCESS_KEY estão corretas e se não têm espaços em branco.'
          );
        case 'InvalidAccessKeyId':
          throw new Error(
            'AWS_ACCESS_KEY_ID inválida. Verifique se a chave de acesso está correta.'
          );
        case 'AccessDenied':
          throw new Error(
            'Acesso negado ao bucket S3. Verifique se as credenciais têm permissão para escrever no bucket.'
          );
        case 'NoSuchBucket':
          throw new Error(
            `Bucket "${env.AWS_S3_BUCKET_NAME}" não encontrado. Verifique se o nome do bucket está correto.`
          );
        default:
          throw new Error(
            `Erro AWS S3 (${awsError.Code}): ${awsError.message || 'Erro desconhecido'}`
          );
      }
    }

    const errorMessage =
      error instanceof Error ? error.message : 'Erro desconhecido ao fazer upload do avatar.';
    throw new Error(errorMessage);
  }
}

/**
 * Exclui um arquivo do S3
 */
export async function deleteFileFromS3(key: string): Promise<void> {
  if (!key || !key.trim()) {
    throw new Error('Chave S3 inválida para exclusão');
  }

  const command = new DeleteObjectCommand({
    Bucket: env.AWS_S3_BUCKET_NAME,
    Key: key.trim(),
  });

  try {
    await s3Client.send(command);
    console.log(`[S3] Arquivo excluído com sucesso: ${key}`);
  } catch (error: unknown) {
    console.error(`[S3] Erro ao excluir arquivo "${key}":`, error);
    
    // Se o arquivo não existir, não é um erro crítico
    if (
      error &&
      typeof error === 'object' &&
      ('name' in error || '$metadata' in error || 'Code' in error)
    ) {
      const s3Error = error as {
        name?: string;
        Code?: string;
        $metadata?: { httpStatusCode?: number };
      };
      if (
        s3Error.name === 'NoSuchKey' ||
        s3Error.Code === 'NoSuchKey' ||
        s3Error.$metadata?.httpStatusCode === 404
      ) {
        console.log(`[S3] Arquivo "${key}" não existe, ignorando exclusão`);
        return; // Não é um erro se o arquivo já não existe
      }
    }
    
    throw new Error(`Erro ao excluir o arquivo: ${key}`);
  }
}

/**
 * Gera uma URL assinada válida por um período específico
 */
export async function getSignedFileUrl(
  key: string,
  expiresIn: number = 3600
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: env.AWS_S3_BUCKET_NAME,
    Key: key,
  });

  try {
    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn,
    });
    return signedUrl;
  } catch (error) {
    console.error('Erro ao gerar URL assinada:', error);
    throw new Error('Erro ao gerar URL de acesso ao arquivo.');
  }
}

/**
 * Gera URL assinada para avatar (válida por 1 hora)
 */
export async function getSignedAvatarUrl(key: string): Promise<string> {
  return getSignedFileUrl(key, 3600); // 1 hora
}

/**
 * Garante que a URL do avatar está assinada
 * Sempre gera uma nova URL assinada válida por 1 hora
 * Extrai a chave S3 da URL pública e gera URL assinada
 */
export async function ensureSignedAvatarUrl(avatarUrl: string | null): Promise<string | null> {
  if (!avatarUrl) {
    return null;
  }

  // Extrair chave S3 da URL (remove query parameters se existirem)
  const key = extractS3KeyFromUrl(avatarUrl);
  if (!key) {
    console.warn(`[Avatar] Não foi possível extrair chave S3 da URL: ${avatarUrl}`);
    return avatarUrl; // Retornar URL original se não conseguir extrair
  }

  try {
    // Sempre gerar nova URL assinada válida por 1 hora
    const signedUrl = await getSignedAvatarUrl(key);
    return signedUrl;
  } catch (error) {
    console.error(`[Avatar] Erro ao gerar URL assinada para ${key}:`, error);
    return avatarUrl; // Retornar URL original em caso de erro
  }
}

/**
 * Garante que a URL do arquivo está assinada
 * Sempre gera uma nova URL assinada válida por 1 hora
 * Extrai a chave S3 da URL pública e gera URL assinada
 */
export async function ensureSignedFileUrl(fileUrl: string | null): Promise<string | null> {
  if (!fileUrl) {
    return null;
  }

  // Extrair chave S3 da URL (remove query parameters se existirem)
  const key = extractS3KeyFromUrl(fileUrl);
  if (!key) {
    console.warn(`[File] Não foi possível extrair chave S3 da URL: ${fileUrl}`);
    return fileUrl; // Retornar URL original se não conseguir extrair
  }

  try {
    // Sempre gerar nova URL assinada válida por 1 hora
    const signedUrl = await getSignedFileUrl(key, 3600);
    return signedUrl;
  } catch (error) {
    console.error(`[File] Erro ao gerar URL assinada para ${key}:`, error);
    return fileUrl; // Retornar URL original em caso de erro
  }
}

/**
 * Verifica se um arquivo existe no S3
 */
export async function checkFileExists(key: string): Promise<boolean> {
  const command = new GetObjectCommand({
    Bucket: env.AWS_S3_BUCKET_NAME,
    Key: key,
  });

  try {
    await s3Client.send(command);
    return true;
  } catch (error) {
    if (
      error &&
      typeof error === 'object' &&
      ('name' in error || '$metadata' in error)
    ) {
      const s3Error = error as { name?: string; $metadata?: { httpStatusCode?: number } };
      if (s3Error.name === 'NoSuchKey' || s3Error.$metadata?.httpStatusCode === 404) {
        return false;
      }
    }
    throw error;
  }
}

/**
 * Extrai a chave S3 de uma URL completa do S3 (suporta URLs assinadas e públicas)
 */
export function extractS3KeyFromUrl(url: string): string | null {
  if (!url) return null;

  try {
    const urlObj = new URL(url);
    // Remove a barra inicial do pathname
    // URLs assinadas têm query parameters, mas o pathname contém a chave
    const key = urlObj.pathname.substring(1);
    
    // Validar se a chave parece válida (deve começar com 'avatars/' ou 'challenges/')
    if (key && (key.startsWith('avatars/') || key.startsWith('challenges/'))) {
      return key;
    }
    
    return null;
  } catch {
    // Se não for uma URL válida, tentar extrair manualmente
    // Procurar por 'avatars' ou 'challenges' na URL
    const urlParts = url.split('/');
    const keyIndex = urlParts.findIndex((part) => part === 'avatars' || part === 'challenges');
    
    if (keyIndex !== -1) {
      // Pegar tudo a partir de 'avatars' ou 'challenges' até o final (antes dos query params)
      const pathPart = urlParts.slice(keyIndex).join('/');
      // Remover query parameters se existirem
      const key = pathPart.split('?')[0];
      
      if (key && (key.startsWith('avatars/') || key.startsWith('challenges/'))) {
        return key;
      }
    }
    
    return null;
  }
}

/**
 * Faz upload de um arquivo genérico para o S3
 */
export async function uploadFileToS3(
  buffer: Buffer,
  fileName: string,
  fileType: string,
  key: string
): Promise<{ key: string; url: string }> {
  const cleanFileName = removeAccents(fileName);
  const sanitizedKey = key.replace(/[^a-zA-Z0-9./_-]/g, '_');

  const command = new PutObjectCommand({
    Bucket: env.AWS_S3_BUCKET_NAME,
    Key: sanitizedKey,
    Body: buffer,
    ContentType: fileType,
    Metadata: {
      originalName: cleanFileName,
      uploadTime: new Date().toISOString(),
    },
  });

  try {
    await s3Client.send(command);

    // Retorna URL pública (sem assinatura) para salvar no banco
    const publicUrl = `https://${env.AWS_S3_BUCKET_NAME}.s3.${env.AWS_REGION}.amazonaws.com/${sanitizedKey}`;

    return { key: sanitizedKey, url: publicUrl };
  } catch (error: unknown) {
    console.error('Erro ao fazer upload do arquivo para S3:', error);

    // Tratamento específico de erros AWS
    if (error && typeof error === 'object' && 'Code' in error) {
      const awsError = error as { Code: string; message?: string };
      
      switch (awsError.Code) {
        case 'SignatureDoesNotMatch':
          throw new Error(
            'Erro de autenticação AWS. Verifique se as credenciais AWS_ACCESS_KEY_ID e AWS_SECRET_ACCESS_KEY estão corretas e se não têm espaços em branco.'
          );
        case 'InvalidAccessKeyId':
          throw new Error(
            'AWS_ACCESS_KEY_ID inválida. Verifique se a chave de acesso está correta.'
          );
        case 'AccessDenied':
          throw new Error(
            'Acesso negado ao bucket S3. Verifique se as credenciais têm permissão para escrever no bucket.'
          );
        case 'NoSuchBucket':
          throw new Error(
            `Bucket "${env.AWS_S3_BUCKET_NAME}" não encontrado. Verifique se o nome do bucket está correto.`
          );
        default:
          throw new Error(
            `Erro AWS S3 (${awsError.Code}): ${awsError.message || 'Erro desconhecido'}`
          );
      }
    }

    const errorMessage =
      error instanceof Error ? error.message : 'Erro desconhecido ao fazer upload do arquivo.';
    throw new Error(errorMessage);
  }
}

