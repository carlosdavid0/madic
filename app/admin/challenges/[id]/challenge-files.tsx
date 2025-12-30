import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { File, Image as ImageIcon, Download } from 'lucide-react';
import { AddFilesForm } from './add-files-form';
import Image from 'next/image';

interface ChallengeFilesProps {
  challengeId: string;
  files: Array<{
    id: string;
    file: {
      id: string;
      filename: string | null;
      url: string;
      mimeType: string | null;
    } | null;
  }>;
}

export function ChallengeFiles({ challengeId, files }: ChallengeFilesProps) {
  return (
    <Card>
      <CardHeader>
        <div className="space-y-3">
          <div>
            <CardTitle className="flex items-center gap-2">
              📎 Arquivos do Desafio
            </CardTitle>
            <CardDescription className="mt-1">
              {files.length === 0 
                ? 'Nenhum arquivo anexado ainda' 
                : `${files.length} arquivo(s) anexado(s)`
              }
            </CardDescription>
          </div>
          <AddFilesForm challengeId={challengeId} />
        </div>
      </CardHeader>
      <CardContent>
        {files.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <File className="w-16 h-16 mx-auto mb-3 opacity-30" />
            <p className="text-sm">Use o formulário acima para adicionar arquivos</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {files.map((cf) => {
              if (!cf.file) return null;
              const isImage = cf.file.mimeType?.startsWith('image/');
              return (
                <div
                  key={cf.id}
                  className="border rounded-lg overflow-hidden hover:shadow-md transition-all"
                >
                  {isImage && (
                    <div className="relative w-full h-52 bg-muted">
                      <Image
                        src={cf.file.url}
                        alt={cf.file.filename || 'Imagem'}
                        fill
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                  )}
                  <div className="flex items-center justify-between p-3 bg-muted/30">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {isImage ? (
                        <div className="p-2 rounded bg-blue-100 dark:bg-blue-900/30">
                          <ImageIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                      ) : (
                        <div className="p-2 rounded bg-gray-100 dark:bg-gray-800">
                          <File className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {cf.file.filename || 'Arquivo'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {cf.file.mimeType || 'Tipo desconhecido'}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <a 
                        href={cf.file.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        download={cf.file.filename || 'arquivo'}
                      >
                        <Download className="w-3 h-3 mr-1" />
                        {isImage ? 'Ver' : 'Baixar'}
                      </a>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}


