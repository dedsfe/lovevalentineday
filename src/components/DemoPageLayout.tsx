import Link from 'next/link';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  bg?: string;
}

export function DemoPageLayout({ children, bg = '#0F172A' }: Props) {
  return (
    <div style={{ minHeight: '100dvh', background: bg }}>
      <style>{`html,body{background:${bg}!important}`}</style>

      {/* Branded header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 20px',
        background: '#0A0A0A',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        position: 'sticky', top: 0, zIndex: 10,
      }}>
        <span style={{
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontSize: 17, fontWeight: 900, color: '#fff', letterSpacing: '-0.01em',
        }}>
          Love<span style={{ color: '#E11D48' }}>Valentine</span>
        </span>
        <Link href="/criar" style={{
          display: 'inline-flex', alignItems: 'center',
          padding: '8px 16px', borderRadius: 10,
          background: '#E11D48', color: '#fff',
          fontSize: 13, fontWeight: 800, textDecoration: 'none',
          border: '2px solid rgba(255,255,255,0.25)',
          letterSpacing: '-0.01em',
        }}>
          Criar o meu →
        </Link>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: 430 }}>
          {children}
        </div>
      </div>
    </div>
  );
}
