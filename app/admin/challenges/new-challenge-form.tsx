'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { addFilesToChallenge, createChallenge } from '@/lib/actions/challenges';
import { cn } from '@/lib/utils';
import { Calendar, FileIcon, FileText, Image as ImageIcon, Loader2, Sparkles, Trophy, Upload, X } from 'lucide-react';
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
    <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Coluna 1: Informações Básicas e Datas */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Informações Básicas */}
          <section className="rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm p-6 lg:p-8 space-y-6">
            <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                    <FileText className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                     <h3 className="text-lg font-semibold text-foreground/90">Informações Básicas</h3>
                     <p className="text-sm text-muted-foreground">Detalhes principais do desafio</p>
                </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">Nome do Desafio</Label>
                <Input
                  id="name"
                  name="name"
                  required
                  placeholder="Ex: Redesign da Dashboard 2024"
                  disabled={isSubmitting}
                  className="h-12 bg-white/5 border-white/10 focus-visible:ring-primary/20 text-lg placeholder:text-muted-foreground/30"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">Descrição Detalhada</Label>
                <Textarea
                  id="description"
                  name="description"
                  required
                  rows={8}
                  placeholder="Descreva o desafio, seus objetivos, requisitos de entrega e critérios de avaliação..."
                  className="resize-none bg-white/5 border-white/10 focus-visible:ring-primary/20 placeholder:text-muted-foreground/30 min-h-[200px]"
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </section>

          {/* Datas */}
          <section className="rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm p-6 lg:p-8 space-y-6">
            <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                    <Calendar className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                     <h3 className="text-lg font-semibold text-foreground/90">Cronograma</h3>
                     <p className="text-sm text-muted-foreground">Defina os prazos importantes</p>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <h4 className="text-sm font-medium text-purple-400 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                    Fase de Participação
                </h4>
                <div className="space-y-3">
                    <div className="space-y-1.5">
                        <Label htmlFor="participationStartDate" className="text-xs text-muted-foreground">Início</Label>
                        <Input
                        id="participationStartDate"
                        name="participationStartDate"
                        type="datetime-local"
                        disabled={isSubmitting}
                        className="bg-white/5 border-white/10"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="participationEndDate" className="text-xs text-muted-foreground">Término</Label>
                        <Input
                        id="participationEndDate"
                        name="participationEndDate"
                        type="datetime-local"
                        disabled={isSubmitting}
                        className="bg-white/5 border-white/10"
                        />
                    </div>
                </div>
              </div>

              <div className="space-y-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <h4 className="text-sm font-medium text-pink-400 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
                    Fase de Votação
                </h4>
                <div className="space-y-3">
                    <div className="space-y-1.5">
                        <Label htmlFor="votingStartDate" className="text-xs text-muted-foreground">Início</Label>
                        <Input
                        id="votingStartDate"
                        name="votingStartDate"
                        type="datetime-local"
                        disabled={isSubmitting}
                        className="bg-white/5 border-white/10"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="votingEndDate" className="text-xs text-muted-foreground">Término</Label>
                        <Input
                        id="votingEndDate"
                        name="votingEndDate"
                        type="datetime-local"
                        disabled={isSubmitting}
                        className="bg-white/5 border-white/10"
                        />
                    </div>
                </div>
              </div>
            </div>
          </section>

          {/* Arquivos */}
          <section className="rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm p-6 lg:p-8 space-y-6">
            <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                    <Upload className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                     <h3 className="text-lg font-semibold text-foreground/90">Arquivos de Apoio</h3>
                     <p className="text-sm text-muted-foreground">Materiais para os participantes</p>
                </div>
            </div>

            <div className="space-y-4">
                <div 
                    onClick={() => document.getElementById('files')?.click()}
                    className="border-2 border-dashed border-white/10 rounded-xl p-8 hover:bg-white/5 hover:border-primary/30 transition-all cursor-pointer text-center group"
                >
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <Upload className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <h4 className="text-sm font-medium mb-1">Clique para selecionar arquivos</h4>
                    <p className="text-xs text-muted-foreground">Documentos, imagens ou briefs</p>
                    <Input
                        id="files"
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        className="hidden"
                        disabled={isSubmitting}
                    />
                </div>
              
              {files.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                    {files.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 border border-white/10 rounded-xl bg-white/5 hover:border-white/20 transition-colors group relative"
                      >
                        {file.preview ? (
                          <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-white/10">
                              <img
                                src={file.preview}
                                alt={file.name}
                                className="w-full h-full object-cover"
                              />
                          </div>
                        ) : (
                          <div className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-lg shrink-0">
                            <FileIcon className="w-5 h-5 text-muted-foreground" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0 pr-8">
                          <p className="text-sm font-medium truncate">{file.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={(e) => { e.stopPropagation(); removeFile(index); }}
                          disabled={isSubmitting}
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/20 hover:text-red-500"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Coluna 2: Pontuação e Thumbnail (Sidebar) */}
        <div className="space-y-6">
          
          {/* Pontuação */}
          <section className="rounded-2xl border border-white/5 bg-gradient-to-br from-white/[0.05] to-transparent backdrop-blur-sm p-6 space-y-6 sticky top-6">
            <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                </div>
                <div>
                     <h3 className="text-lg font-semibold text-foreground/90">Premiação</h3>
                     <p className="text-xs text-muted-foreground">Pontos por colocação</p>
                </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center text-lg">🥇</div>
                 <div className="flex-1">
                    <Label htmlFor="firstPlacePoints" className="text-xs font-semibold text-yellow-500">1º Lugar</Label>
                    <Input
                      id="firstPlacePoints"
                      name="firstPlacePoints"
                      type="number"
                      defaultValue={100}
                      min={0}
                      disabled={isSubmitting}
                      className="h-9 bg-black/20 border-white/5 text-right font-mono"
                    />
                 </div>
              </div>
              
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-gray-400/20 flex items-center justify-center text-lg">🥈</div>
                 <div className="flex-1">
                    <Label htmlFor="secondPlacePoints" className="text-xs font-semibold text-gray-400">2º Lugar</Label>
                    <Input
                      id="secondPlacePoints"
                      name="secondPlacePoints"
                      type="number"
                      defaultValue={75}
                      min={0}
                      disabled={isSubmitting}
                      className="h-9 bg-black/20 border-white/5 text-right font-mono"
                    />
                 </div>
              </div>

              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center text-lg">🥉</div>
                 <div className="flex-1">
                    <Label htmlFor="thirdPlacePoints" className="text-xs font-semibold text-orange-500">3º Lugar</Label>
                    <Input
                      id="thirdPlacePoints"
                      name="thirdPlacePoints"
                      type="number"
                      defaultValue={50}
                      min={0}
                      disabled={isSubmitting}
                      className="h-9 bg-black/20 border-white/5 text-right font-mono"
                    />
                 </div>
              </div>
              
              <div className="pt-2 border-t border-white/5">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-sm">🎖️</div>
                    <div className="flex-1">
                        <Label htmlFor="otherPlacesPoints" className="text-xs text-muted-foreground">Demais</Label>
                        <Input
                        id="otherPlacesPoints"
                        name="otherPlacesPoints"
                        type="number"
                        defaultValue={25}
                        min={0}
                        disabled={isSubmitting}
                        className="h-8 bg-transparent border-transparent text-right font-mono text-muted-foreground focus:bg-black/20 focus:border-white/10"
                        />
                    </div>
                </div>
              </div>
            </div>
          </section>

          {/* Thumbnail */}
          <section className="rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm p-6 space-y-4">
             <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-pink-500/10 flex items-center justify-center border border-pink-500/20">
                    <ImageIcon className="w-4 h-4 text-pink-500" />
                </div>
                <h3 className="text-base font-semibold text-foreground/90">Imagem de Capa</h3>
            </div>
          
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
              
              {!thumbnail ? (
                  <div 
                    onClick={() => document.getElementById('thumbnail')?.click()}
                    className="aspect-video rounded-xl border-2 border-dashed border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer flex flex-col items-center justify-center gap-2 group"
                  >
                      <div className="p-3 rounded-full bg-white/5 group-hover:scale-110 transition-transform">
                          <ImageIcon className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <span className="text-xs text-muted-foreground">Selecionar capa</span>
                  </div>
              ) : (
                <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10 group">
                    <img
                      src={thumbnail.preview}
                      alt="Thumbnail preview"
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={() => document.getElementById('thumbnail')?.click()}
                            className="h-8 text-xs"
                        >
                            Trocar
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            onClick={removeThumbnail}
                            className="h-8 w-8"
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
              )}
            </div>
          </section>

          {/* Botão de Ação */}
          <div className="pt-4 sticky bottom-6">
              <Button 
                type="submit" 
                disabled={isSubmitting} 
                className="w-full h-14 text-base font-semibold shadow-[0_0_20px_rgba(239,199,60,0.2)] hover:shadow-[0_0_30px_rgba(239,199,60,0.4)] transition-all bg-gradient-to-r from-primary to-yellow-400 text-black hover:scale-[1.02] active:scale-[0.98]"
            >
                {isSubmitting ? (
                    <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Criando Desafio...
                    </>
                ) : (
                    <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Publicar Desafio
                    </>
                )}
            </Button>
            
            {(uploadProgress || error) && (
                <div className={cn(
                    "mt-4 p-4 rounded-xl text-sm border backdrop-blur-md animate-in slide-in-from-bottom-2",
                    error ? "bg-red-500/10 border-red-500/20 text-red-500" : "bg-blue-500/10 border-blue-500/20 text-blue-400"
                )}>
                    {error || (
                        <div className="flex items-center gap-3">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            {uploadProgress}
                        </div>
                    )}
                </div>
            )}
          </div>

        </div>
      </div>
    </form>
  );
}