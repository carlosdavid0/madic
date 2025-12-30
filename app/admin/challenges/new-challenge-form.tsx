'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { addFilesToChallenge, createChallenge } from '@/lib/actions/challenges';
import { FileIcon, Loader2, Upload, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface FileWithPreview extends File {
  preview?: string;
}

export function NewChallengeForm() {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [thumbnail, setThumbnail] = useState<FileWithPreview | null>(null);
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

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (thumbnail?.preview) {
        URL.revokeObjectURL(thumbnail.preview);
      }
      const fileWithPreview = file as FileWithPreview;
      if (file.type.startsWith('image/')) {
        fileWithPreview.preview = URL.createObjectURL(file);
      }
      setThumbnail(fileWithPreview);
    }
  };

  const removeThumbnail = () => {
    if (thumbnail?.preview) {
      URL.revokeObjectURL(thumbnail.preview);
    }
    setThumbnail(null);
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
      setUploadProgress('Criando desafio...');
      const formData = new FormData(e.currentTarget);
      const result = await createChallenge(formData);
      
      if (!result.success || !result.challengeId) {
        setError(result.error || 'Erro ao criar desafio');
        setIsSubmitting(false);
        setUploadProgress(null);
        return;
      }
      
      if (files.length > 0) {
        setUploadProgress(`Enviando arquivos (${files.length})...`);
        
        const fileFormData = new FormData();
        files.forEach((file) => {
          fileFormData.append('files', file);
        });
        
        const uploadResult = await addFilesToChallenge(result.challengeId, fileFormData);
        
        if (!uploadResult.success) {
          setError(`Desafio criado, mas houve erro ao enviar arquivos: ${uploadResult.error}`);
          setIsSubmitting(false);
          setTimeout(() => {
            router.push(`/admin/challenges/${result.challengeId}`);
          }, 2000);
          return;
        }
      }
      
      setUploadProgress('Concluído!');
      router.push(`/admin/challenges/${result.challengeId}`);
      
    } catch (error) {
      console.error('Erro ao criar challenge:', error);
      setError(error instanceof Error ? error.message : 'Erro ao criar challenge');
      setIsSubmitting(false);
      setUploadProgress(null);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna 1: Informações Básicas */}
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Informações Básicas</h3>
            
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Desafio *</Label>
              <Input
                id="name"
                name="name"
                required
                placeholder="Ex: Desafio de Design UI/UX"
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição *</Label>
              <Textarea
                id="description"
                name="description"
                required
                rows={8}
                placeholder="Descreva o desafio, seus objetivos e requisitos..."
                className="resize-none"
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Datas */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Período</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="participationStartDate" className="text-sm">
                  📅 Início das Participações
                </Label>
                <Input
                  id="participationStartDate"
                  name="participationStartDate"
                  type="datetime-local"
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="participationEndDate" className="text-sm">
                  📅 Fim das Participações
                </Label>
                <Input
                  id="participationEndDate"
                  name="participationEndDate"
                  type="datetime-local"
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="votingStartDate" className="text-sm">
                  🗳️ Início da Votação
                </Label>
                <Input
                  id="votingStartDate"
                  name="votingStartDate"
                  type="datetime-local"
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="votingEndDate" className="text-sm">
                  🗳️ Fim da Votação
                </Label>
                <Input
                  id="votingEndDate"
                  name="votingEndDate"
                  type="datetime-local"
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Coluna 2: Pontuação e Thumbnail */}
        <div className="space-y-6">
          {/* Pontuação */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Pontuação</h3>
            
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="firstPlacePoints" className="text-sm">
                  🥇 1º Lugar
                </Label>
                <Input
                  id="firstPlacePoints"
                  name="firstPlacePoints"
                  type="number"
                  defaultValue={100}
                  min={0}
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="secondPlacePoints" className="text-sm">
                  🥈 2º Lugar
                </Label>
                <Input
                  id="secondPlacePoints"
                  name="secondPlacePoints"
                  type="number"
                  defaultValue={75}
                  min={0}
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="thirdPlacePoints" className="text-sm">
                  🥉 3º Lugar
                </Label>
                <Input
                  id="thirdPlacePoints"
                  name="thirdPlacePoints"
                  type="number"
                  defaultValue={50}
                  min={0}
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="otherPlacesPoints" className="text-sm">
                  🎖️ Outros
                </Label>
                <Input
                  id="otherPlacesPoints"
                  name="otherPlacesPoints"
                  type="number"
                  defaultValue={25}
                  min={0}
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>

          {/* Thumbnail */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Thumbnail</h3>
          
            <div className="space-y-3">
              <Input
                id="thumbnail"
                name="thumbnail"
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
                className="hidden"
                disabled={isSubmitting}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('thumbnail')?.click()}
                disabled={isSubmitting}
                className="w-full"
              >
                <Upload className="w-4 h-4 mr-2" />
                Selecionar Imagem
              </Button>
            
              {thumbnail && (
                <div className="border rounded-lg overflow-hidden">
                  {thumbnail.preview && (
                    <img
                      src={thumbnail.preview}
                      alt="Thumbnail preview"
                      className="w-full h-32 object-cover"
                    />
                  )}
                  <div className="flex items-center justify-between p-2 bg-muted">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{thumbnail.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(thumbnail.size)}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={removeThumbnail}
                      disabled={isSubmitting}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Arquivos - Full Width */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2">Arquivos do Desafio</h3>
        
        <div className="space-y-3">
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
            Selecionar Arquivos
          </Button>
          
          {files.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                {files.length} arquivo(s) selecionado(s)
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
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

      <div className="flex gap-3 pt-2 border-t">
        <Button 
          type="submit" 
          disabled={isSubmitting} 
          className="flex-1"
          size="lg"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Criando...
            </>
          ) : (
            'Criar Desafio'
          )}
        </Button>
      </div>
    </form>
  );
}