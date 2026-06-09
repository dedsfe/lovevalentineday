import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  bg?: string;
}

export function DemoPageLayout({ children, bg = '#0F172A' }: Props) {
  return (
    <div style={{
      minHeight: '100dvh',
      background: bg,
      display: 'flex',
      justifyContent: 'center',
    }}>
      <div style={{ width: '100%', maxWidth: 430 }}>
        {children}
      </div>
    </div>
  );
}
