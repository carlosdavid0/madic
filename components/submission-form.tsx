'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { createSubmission } from '@/lib/actions/submissions';
import { FileIcon, Loader2, Upload, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface FileWithPreview extends File {
  preview?: string;
}

interface SubmissionFormProps {
  challengeId: string;
  userId: string;
}

export function SubmissionForm({ challengeId, userId }: SubmissionFormProps) {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const filesWithPreview = selectedFiles.map((file) => {
      const fileWithPreview = file as FileWithPreview;
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
    setIsSubmitting(true);
    setError(null);
    
    try {
      setUploadProgress('Criando submissão...');
      const formData = new FormData(e.currentTarget);
      formData.set('isFeatured', isFeatured ? 'true' : 'false');
      
      // Add files to formData
      files.forEach((file) => {
        formData.append('files', file);
      });
      
      const result = await createSubmission(challengeId, userId, formData);
      
      if (!result.success) {
        setError(result.error || 'Erro ao criar submissão');
        setIsSubmitting(false);
        setUploadProgress(null);
        return;
      }
      
      setUploadProgress('Concluído!');
      router.push(`/desafios/${challengeId}`);
      router.refresh();
      
    } catch (error) {
      console.error('Erro ao criar submissão:', error);
      setError(error instanceof Error ? error.message : 'Erro ao criar submissão');
      setIsSubmitting(false);
      setUploadProgress(null);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="description">Descrição da Submissão *</Label>
        <Textarea
          id="description"
          name="description"
          required
          rows={8}
          placeholder="Descreva seu trabalho, as tecnologias utilizadas, desafios enfrentados e soluções implementadas..."
          className="w-full resize-none"
          disabled={isSubmitting}
        />
        <p className="text-sm text-muted-foreground">
          Explique detalhadamente seu projeto e como você abordou o desafio.
        </p>
      </div>

      <div className="space-y-3">
        <Label htmlFor="files">Arquivos Anexos (opcional)</Label>
        <div className="flex items-center gap-2">
          <Input
            id="files"
            type="file"
            multiple
            onChange={handleFileChange}
            className="hidden"
            disabled={isSubmitting}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById('files')?.click()}
            disabled={isSubmitting}
            className="w-full"
          >
            <Upload className="w-4 h-4 mr-2" />
            Adicionar Arquivos
          </Button>
        </div>
        
        {files.length > 0 && (
          <div className="space-y-2 mt-3">
            <p className="text-sm text-muted-foreground">
              {files.length} arquivo(s) selecionado(s)
            </p>
            <div className="grid gap-2">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  {file.preview ? (
                    <img
                      src={file.preview}
                      alt={file.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  ) : (
                    <div className="w-12 h-12 flex items-center justify-center bg-muted rounded">
                      <FileIcon className="w-6 h-6 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
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
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-2 p-4 border rounded-lg bg-muted/30">
        <Checkbox
          id="isFeatured"
          checked={isFeatured}
          onCheckedChange={(checked: boolean) => setIsFeatured(checked === true)}
          disabled={isSubmitting}
        />
        <div className="flex-1">
          <Label
            htmlFor="isFeatured"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
          >
            ⭐ Marcar como Submissão Principal
          </Label>
          <p className="text-xs text-muted-foreground mt-1">
            Esta será destacada como sua melhor submissão para este desafio
          </p>
        </div>
      </div>

      {uploadProgress && (
        <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-center gap-3">
            <Loader2 className="w-5 h-5 animate-spin text-blue-600 dark:text-blue-400" />
            <span className="text-sm text-blue-600 dark:text-blue-400">
              {uploadProgress}
            </span>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
          className="flex-1"
        >
          Cancelar
        </Button>
        <Button 
          type="submit" 
          disabled={isSubmitting} 
          className="flex-1"
          size="lg"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Enviando...
            </>
          ) : (
            'Enviar Submissão'
          )}
        </Button>
      </div>
    </form>
  );
}
