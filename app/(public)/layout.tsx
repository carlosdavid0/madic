import { PublicWrapper } from '@/components/public-wrapper';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return <PublicWrapper>{children}</PublicWrapper>;
}