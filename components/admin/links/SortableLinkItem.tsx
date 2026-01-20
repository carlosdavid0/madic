/* eslint-disable react-hooks/refs */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { ExternalLink, GripVertical, Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';

import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Link as LinkType } from '@/lib/db/schema/links';
import clsx from 'clsx';

interface SortableLinkItemProps {
  link: LinkType;
  index: number;
  moveLink: (dragIndex: number, hoverIndex: number) => void;
  onToggleActive: (id: string, active: boolean) => void;
  onDelete: (id: string) => void;
  onDragEnd: () => void;
}

interface DragItem {
  index: number;
  id: string;
  type: string;
}

export function SortableLinkItem({ link, index, moveLink, onToggleActive, onDelete, onDragEnd }: SortableLinkItemProps) {
  const ref = useRef<HTMLDivElement>(null);

  const [{ handlerId }, drop] = useDrop<DragItem, void, { handlerId: string | symbol | null }>({
    accept: 'link',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = (clientOffset as any).y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      moveLink(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'link',
    item: () => {
      return { id: link.id, index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (item, monitor) => {
        if (monitor.didDrop()) {
             onDragEnd();
        } else {
             onDragEnd(); 
        }
    }
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      data-handler-id={handlerId}
      className={clsx(
        "group flex items-center gap-4 p-4 mb-3 rounded-xl border transition-all duration-300",
        link.active 
            ? "bg-white/5 border-white/10 hover:border-primary/30 hover:shadow-[0_0_15px_rgba(239,199,60,0.1)]" 
            : "bg-white/[0.02] border-white/5 opacity-70 hover:opacity-100"
      )}
    >
      <div className="cursor-move text-muted-foreground/50 group-hover:text-primary transition-colors p-1 rounded hover:bg-white/5">
        <GripVertical size={20} />
      </div>
      
      <div className="flex-1 min-w-0">
        <h3 className={clsx(
            "font-medium truncate transition-colors",
            link.active ? "text-foreground" : "text-muted-foreground",
            "group-hover:text-primary"
        )}>
            {link.name}
        </h3>
        <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground/60 truncate hover:text-primary/80 transition-colors flex items-center gap-1">
            {link.url}
            <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-50" />
        </a>
      </div>

      <div className="flex items-center gap-2 lg:gap-4">
        <div className="flex items-center gap-2">
            <span className={clsx("text-xs font-medium uppercase tracking-wider", link.active ? "text-primary" : "text-muted-foreground")}>
                {link.active ? 'Ativo' : 'Inativo'}
            </span>
            <Switch
            checked={link.active}
            onCheckedChange={(checked) => onToggleActive(link.id, checked)}
            className="data-[state=checked]:bg-primary"
            />
        </div>

        <div className="w-px h-8 bg-white/10 mx-1 hidden lg:block" />
        
        <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" asChild className="hover:bg-primary/10 hover:text-primary h-8 w-8">
            <Link href={`/admin/links/${link.id}`}>
                <Pencil size={16} />
            </Link>
            </Button>
            
            <Button 
            variant="ghost" 
            size="icon" 
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 w-8"
            onClick={() => {
                if (confirm('Tem certeza que deseja excluir este link?')) {
                onDelete(link.id);
                }
            }}
            >
            <Trash2 size={16} />
            </Button>
        </div>
      </div>
    </div>
  );
}
