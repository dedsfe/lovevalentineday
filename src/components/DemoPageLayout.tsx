import Link from 'next/link';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  bgColor?: string;
}

export function DemoPageLayout({ children, bgColor = '#0F172A' }: Props) {
  return (
    <>
      <style>{`
        .demo-grad {
          background: linear-gradient(135deg, #E11D48, #FB7185);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        body { margin: 0; }
      `}</style>

      {/* ── Header mínimo ─────────────────────────────────── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(255,255,255,0.96)',
        backdropFilter: 'blur(12px)',
        borderBottom: '2px solid #0A0A0A',
        padding: '12px 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <Link href="/" style={{ textDecoration: 'none', fontWeight: 900, fontSize: 18, color: '#0A0A0A', letterSpacing: '-0.02em' }}>
          Love<span className="demo-grad">Valentine</span>
        </Link>
        <Link
          href="/"
          style={{
            textDecoration: 'none', fontWeight: 800, fontSize: 13,
            background: '#E11D48', color: '#fff',
            padding: '8px 16px', borderRadius: 10,
            border: '2px solid #0A0A0A',
            boxShadow: '2px 2px 0px 0px #0A0A0A',
            whiteSpace: 'nowrap',
          }}
        >
          Criar meu presente →
        </Link>
      </header>

      {/* ── Produto centralizado ───────────────────────────── */}
      <main style={{
        minHeight: 'calc(100dvh - 57px)',
        background: bgColor,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '32px 0 48px',
      }}>
        <div style={{ width: '100%', maxWidth: 430 }}>
          {children}
        </div>

        {/* CTA embaixo */}
        <div style={{ marginTop: 32, padding: '0 20px', width: '100%', maxWidth: 430 }}>
          <Link
            href="/"
            style={{
              display: 'block', textAlign: 'center',
              background: '#E11D48', color: '#fff',
              fontWeight: 900, fontSize: 15,
              padding: '16px 24px', borderRadius: 16,
              border: '2px solid #0A0A0A',
              boxShadow: '4px 4px 0px 0px #0A0A0A',
              textDecoration: 'none',
            }}
          >
            Criar meu presente agora →
          </Link>
          <p style={{ textAlign: 'center', marginTop: 12, fontSize: 12, color: 'rgba(255,255,255,0.35)', fontWeight: 500 }}>
            Sem app · Link na hora · Funciona pelo WhatsApp
          </p>
        </div>
      </main>
    </>
  );
}
