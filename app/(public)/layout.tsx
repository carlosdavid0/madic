import { PublicWrapper } from '@/src/components/public-wrapper';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return <PublicWrapper>{children}</PublicWrapper>;
}