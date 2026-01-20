'use client';

import { deleteLink, reorderLinks, updateLink } from '@/app/actions/links';
import { Link } from '@/lib/db/schema/links';
import update from 'immutability-helper';
import { useCallback, useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { toast } from 'sonner';
import { SortableLinkItem } from './SortableLinkItem';

interface LinksListProps {
  initialLinks: Link[];
}

export function LinksList({ initialLinks }: LinksListProps) {
  const [links, setLinks] = useState(initialLinks);

  // Sync state if initialLinks changes
  useEffect(() => {
    setLinks(initialLinks);
  }, [initialLinks]);

  const moveLink = useCallback((dragIndex: number, hoverIndex: number) => {
    setLinks((prevLinks) =>
      update(prevLinks, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, prevLinks[dragIndex] as Link],
        ],
      })
    );
  }, []);

  const handleDragEnd = async () => {
    const reorderedItems = links.map((link, index) => ({
      id: link.id,
      order: index,
    }));
    
    try {
      await reorderLinks(reorderedItems);
      // toast.success('Order saved');
    } catch (error) {
      console.error('Failed to save order', error);
      toast.error('Failed to save order');
    }
  };

  const handleToggleActive = async (id: string, active: boolean) => {
    setLinks(links.map(l => l.id === id ? { ...l, active } : l));
    try {
      await updateLink(id, { active });
    } catch (e) {
      setLinks(initialLinks); 
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id: string) => {
    setLinks(links.filter(l => l.id !== id));
    try {
      await deleteLink(id);
      toast.success('Link deleted');
    } catch (e) {
      setLinks(initialLinks);
      toast.error('Failed to delete link');
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-2">
        {links.map((link, index) => (
          <SortableLinkItem
            key={link.id}
            index={index}
            link={link}
            moveLink={moveLink}
            onToggleActive={handleToggleActive}
            onDelete={handleDelete}
            onDragEnd={handleDragEnd} 
          />
        ))}
        {links.length === 0 && (
            <div className="text-center p-8 text-muted-foreground border rounded-lg border-dashed">
                No links created yet.
            </div>
        )}
      </div>
    </DndProvider>
  );
}
