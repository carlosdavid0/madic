import { z } from 'zod';

const envSchema = z.object({
  AWS_ACCESS_KEY_ID: z.string().min(1, 'AWS_ACCESS_KEY_ID é obrigatória'),
  AWS_SECRET_ACCESS_KEY: z.string().min(1, 'AWS_SECRET_ACCESS_KEY é obrigatória'),
  AWS_REGION: z.string().min(1, 'AWS_REGION é obrigatória'),
  AWS_S3_BUCKET_NAME: z.string().min(1, 'AWS_S3_BUCKET_NAME é obrigatório'),
});

export type Env = z.infer<typeof envSchema>;

function getEnv(): Env {
  const awsAccessKeyId = process.env.AWS_ACCESS_KEY_ID?.trim() || '';
  const awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY?.trim() || '';
  const awsRegion = process.env.AWS_REGION?.trim() || '';
  const awsS3BucketName = process.env.AWS_S3_BUCKET_NAME?.trim() || '';

  const parsed = envSchema.safeParse({
    AWS_ACCESS_KEY_ID: awsAccessKeyId,
    AWS_SECRET_ACCESS_KEY: awsSecretAccessKey,
    AWS_REGION: awsRegion,
    AWS_S3_BUCKET_NAME: awsS3BucketName,
  });

  if (!parsed.success) {
    console.error('❌ Variáveis de ambiente inválidas:', parsed.error.flatten().fieldErrors);
    throw new Error('Variáveis de ambiente AWS não configuradas corretamente');
  }

  // Validar formato básico das credenciais
  if (parsed.data.AWS_ACCESS_KEY_ID.length < 16) {
    console.warn('⚠️ AWS_ACCESS_KEY_ID parece estar muito curta. Verifique se está correta.');
  }

  if (parsed.data.AWS_SECRET_ACCESS_KEY.length < 40) {
    console.warn('⚠️ AWS_SECRET_ACCESS_KEY parece estar muito curta. Verifique se está correta.');
  }

  return parsed.data;
}

export const env = getEnv();

