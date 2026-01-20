'use server';

import { db } from '@/lib/db';
import { links, NewLink } from '@/lib/db/schema/links';
import { asc, desc, eq } from 'drizzle-orm'; // Added inArray import
import { revalidatePath } from 'next/cache';

export async function getLinks() {
  return await db.query.links.findMany({
    orderBy: [asc(links.order)],
  });
}

export async function getPublicLinks() {
  return await db.query.links.findMany({
    where: eq(links.active, true),
    orderBy: [asc(links.order)],
  });
}

export async function createLink(data: Omit<NewLink, 'id' | 'order'>) {
  // Get the current max order
  const existingLinks = await db.select().from(links).orderBy(desc(links.order)).limit(1);
  const maxOrder = existingLinks.length > 0 ? existingLinks[0].order : -1;

  await db.insert(links).values({
    ...data,
    order: maxOrder + 1,
  });

  revalidatePath('/admin/links');
  revalidatePath('/links'); 
  // No returning here as void is generally safer for client components unless ID is needed immediately
}

export async function updateLink(id: string, data: Partial<NewLink>) {
  await db.update(links).set(data).where(eq(links.id, id));
  revalidatePath('/admin/links');
  revalidatePath('/links');
}

export async function deleteLink(id: string) {
  await db.delete(links).where(eq(links.id, id));
  revalidatePath('/admin/links');
  revalidatePath('/links');
}

export async function reorderLinks(items: { id: string; order: number }[]) {
  // Use a transaction or Promise.all to update all items
  // Promise.all is often simpler for this if specific transactional integrity isn't strictly required for UI order
  await Promise.all(
    items.map((item) =>
      db.update(links).set({ order: item.order }).where(eq(links.id, item.id))
    )
  );
  revalidatePath('/admin/links');
  revalidatePath('/links');
}
