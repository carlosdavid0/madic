'use client';

import { GripVertical, Pencil, Trash2 } from 'lucide-react';
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
            // It dropped somewhere handled? 
            // Actually we just want to save whenever the drag ends successfully or effectively.
            // Since we reorder in hover, we should save on end.
             onDragEnd();
        } else {
             // If dropped outside, should we reset? Ideally yes, but for now let's just save or ignore.
             // If we saved state in parent on hover (we did via setLinks), then the UI is already updated.
             // So we must persist it.
             onDragEnd(); // Simplest approach: save whatever the current state is on drop.
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
        "flex items-center gap-4 p-4 mb-3 bg-card border rounded-lg shadow-sm transition-colors",
        !link.active && "opacity-60 bg-muted/50"
      )}
    >
      <div className="cursor-move text-muted-foreground hover:text-foreground">
        <GripVertical size={20} />
      </div>
      
      <div className="flex-1 min-w-0">
        <h3 className="font-medium truncate">{link.name}</h3>
        <p className="text-sm text-muted-foreground truncate">{link.url}</p>
      </div>

      <div className="flex items-center gap-2">
        <Switch
          checked={link.active}
          onCheckedChange={(checked) => onToggleActive(link.id, checked)}
        />
        
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/admin/links/${link.id}`}>
            <Pencil size={18} />
          </Link>
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
          onClick={() => {
            if (confirm('Are you sure you want to delete this link?')) {
              onDelete(link.id);
            }
          }}
        >
          <Trash2 size={18} />
        </Button>
      </div>
    </div>
  );
}
