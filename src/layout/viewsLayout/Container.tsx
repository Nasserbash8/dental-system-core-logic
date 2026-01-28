// components/Container.tsx
import { ReactNode } from 'react';

export default function Container({ children }: { children: ReactNode }) {
  return <main className="mx-auto px-3 py-8 sm:px-8 rounded-xl bg-transparent">{children}</main>;
}
