'use client';

import { useState } from 'react';
import { addFilesToChallenge } from '@/lib/actions/challenges';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, X, FileIcon, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface AddFilesFormProps {
  challengeId: string;
}

interface FileWithPreview extends File {
  preview?: string;
}

export function AddFilesForm({ challengeId }: AddFilesFormProps) {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const filesWithPreview = selectedFiles.map((file) => {
      const fileWithPreview = file as FileWithPreview;
      // Criar preview para imagens
      if (file.type.startsWith('image/')) {
        fileWithPreview.preview = URL.createObjectURL(file);
      }
      return fileWithPreview;
    });
    setFiles((prev) => [...prev, ...filesWithPreview]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => {
      const newFiles = prev.filter((_, i) => i !== index);
      // Revogar URL do preview se existir
      const removedFile = prev[index];
      if (removedFile.preview) {
        URL.revokeObjectURL(removedFile.preview);
      }
      return newFiles;
    });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (files.length === 0) return;

    setIsSubmitting(true);
    setError(null);
    
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('files', file);
      });

      const result = await addFilesToChallenge(challengeId, formData);
      
      if (result.success) {
        // Limpar arquivos e revogar previews
        files.forEach((file) => {
          if (file.preview) {
            URL.revokeObjectURL(file.preview);
          }
        });
        setFiles([]);
        router.refresh();
      } else {
        setError(result.error || 'Erro ao adicionar arquivos');
      }
    } catch (error) {
      console.error('Erro ao adicionar arquivos:', error);
      setError(error instanceof Error ? error.message : 'Erro ao adicionar arquivos');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex items-center gap-2">
        <Input
          type="file"
          multiple
          onChange={handleFileChange}
          className="hidden"
          id={`file-input-${challengeId}`}
          disabled={isSubmitting}
        />
        <label htmlFor={`file-input-${challengeId}`} className="flex-1">
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            className="w-full" 
            asChild
            disabled={isSubmitting}
          >
            <span>
              <Upload className="w-4 h-4 mr-2" />
              Selecionar Arquivos
            </span>
          </Button>
        </label>
        {files.length > 0 && (
          <Button type="submit" size="sm" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                Enviando...
              </>
            ) : (
              `Enviar (${files.length})`
            )}
          </Button>
        )}
      </div>
      
      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">
            {files.length} arquivo(s) selecionado(s)
          </p>
          <div className="grid gap-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-2 p-2 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                {file.preview ? (
                  <img
                    src={file.preview}
                    alt={file.name}
                    className="w-10 h-10 object-cover rounded"
                  />
                ) : (
                  <div className="w-10 h-10 flex items-center justify-center bg-muted rounded">
                    <FileIcon className="w-5 h-5 text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                  disabled={isSubmitting}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {error && (
        <div className="p-2 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded text-red-600 dark:text-red-400 text-xs">
          {error}
        </div>
      )}
    </form>
  );
}


