'use client';

import { Button } from '@/components/ui/button';
import { uploadAvatarAction } from '@/lib/actions/profile';
import { useAuth } from '@/lib/contexts/auth-context';
import { useFileUpload } from '@/lib/hooks/use-file-upload';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { CircleUserRoundIcon, XIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AvatarUploadProps {
  currentAvatar?: string | null;
  userName: string;
}

export function AvatarUpload({
  currentAvatar,
  userName,
}: AvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const uploadedFileIdRef = useRef<string | null>(null);
  const { refreshUser } = useAuth();

  const [
    { files, isDragging },
    {
      removeFile,
      openFileDialog,
      getInputProps,
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
    },
  ] = useFileUpload({
    accept: 'image/jpeg,image/jpg,image/png,image/webp',
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: false,
  });

  const [avatarUrl, setAvatarUrl] = useState<string | null>(currentAvatar || null);
  const previewUrl = files[0]?.preview || null;
  const displayAvatar = previewUrl || avatarUrl;
  const hasPreview = !!previewUrl;
  
  // Atualizar avatarUrl quando currentAvatar mudar (após refreshUser)
  useEffect(() => {
    if (currentAvatar) {
      setAvatarUrl(currentAvatar);
    }
  }, [currentAvatar]);

  // Upload automático quando um arquivo é selecionado
  useEffect(() => {
    const uploadFile = async () => {
      if (
        files.length > 0 &&
        files[0]?.file instanceof File &&
        !isUploading &&
        files[0].id !== uploadedFileIdRef.current
      ) {
        const file = files[0].file;
        const fileId = files[0].id;
        uploadedFileIdRef.current = fileId;
        setIsUploading(true);
        setError(null);

        try {
          const formData = new FormData();
          formData.append('avatar', file);

          const result = await uploadAvatarAction(formData);

          if (result.success && result.avatarUrl) {
            // Atualizar o estado local imediatamente com a nova URL
            setAvatarUrl(result.avatarUrl);
            await refreshUser();
            window.dispatchEvent(new Event('auth-change'));
            // Limpar o preview após upload bem-sucedido
            removeFile(fileId);
            uploadedFileIdRef.current = null;
          } else {
            setError(result.error || 'Erro ao fazer upload do avatar.');
            uploadedFileIdRef.current = null;
          }
        } catch (err) {
          const errorMessage =
            err instanceof Error
              ? err.message
              : 'Erro ao fazer upload do avatar.';
          setError(errorMessage);
          uploadedFileIdRef.current = null;
        } finally {
          setIsUploading(false);
        }
      }
    };

    uploadFile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files.length]);

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <div className="relative inline-flex">
        {/* Drop area */}
        <button
          aria-label={displayAvatar ? 'Alterar imagem' : 'Enviar imagem'}
          className={cn(
            'relative flex size-32 items-center justify-center overflow-hidden rounded-full border-4 border-primary border-dashed outline-none transition-colors',
            'hover:bg-accent/50',
            'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
            'has-disabled:pointer-events-none has-[img]:border-solid has-disabled:opacity-50',
            'data-[dragging=true]:bg-accent/50',
            displayAvatar && 'border-solid',
            isUploading && 'opacity-50 pointer-events-none'
          )}
          data-dragging={isDragging || undefined}
          onClick={openFileDialog}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          type="button"
          disabled={isUploading}
        >
          {displayAvatar ? (
            <Image
              alt={files[0]?.file?.name || 'Avatar'}
              className="size-full object-cover"
              height={128}
              src={displayAvatar}
              width={128}
            />
          ) : (
            <div aria-hidden="true">
              <CircleUserRoundIcon className="size-8 opacity-60 text-zinc-300" />
            </div>
          )}
        </button>
        {hasPreview && (
          <Button
            aria-label="Remover imagem"
            className="-top-1 -right-1 absolute size-6 rounded-full border-2 border-background shadow-none focus-visible:border-background bg-red-500 hover:bg-red-600 text-white"
            onClick={() => removeFile(files[0]?.id || '')}
            size="icon"
            type="button"
          >
            <XIcon className="size-3.5" />
          </Button>
        )}
        <input
          {...getInputProps()}
          aria-label="Enviar arquivo de imagem"
          className="sr-only"
          tabIndex={-1}
        />
      </div>

      {isUploading && (
        <div className="flex items-center gap-2 text-sm text-zinc-300">
          <div className="w-4 h-4 border-2 border-zinc-300/30 border-t-zinc-300 rounded-full animate-spin"></div>
          Enviando...
        </div>
      )}

      {error && (
        <p className="text-sm text-red-400 text-center max-w-xs">{error}</p>
      )}

      {files[0]?.file instanceof File && files[0].file.name && (
        <p className="text-xs text-zinc-400">{files[0].file.name}</p>
      )}
    </div>
  );
}

