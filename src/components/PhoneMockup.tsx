import { ReactNode } from 'react';

interface Props {
  children:     ReactNode;
  maxWidth?:    number;
  screenHeight?: number | 'auto'; // 'auto' → cresce com o conteúdo
}

export function PhoneMockup({ children, maxWidth = 340, screenHeight = 560 }: Props) {
  const isAuto = screenHeight === 'auto';

  return (
    <>
      {/* Scrollbar invisível em webkit */}
      <style>{`.ph-scr::-webkit-scrollbar{display:none}`}</style>

      <div style={{
        width: '100%',
        maxWidth,
        background: 'linear-gradient(160deg, #1c1c1e 0%, #111 100%)',
        borderRadius: 44,
        padding: '14px 10px',
        border: '2px solid #2a2a2a',
        boxShadow: '0 30px 70px rgba(0,0,0,0.45), 6px 6px 0px 0px #0A0A0A',
      }}>

        {/* Dynamic island */}
        <div style={{ width: 88, height: 26, background: '#000', borderRadius: 99, margin: '0 auto 8px' }} />

        {/* Screen */}
        <div style={{
          width: '100%',
          ...(isAuto ? {} : { height: screenHeight }),
          borderRadius: 10,
          overflowX: 'hidden',
          overflowY: isAuto ? 'visible' : 'hidden',
          background: '#0F172A',
        }}>
          {children}
        </div>

        {/* Home indicator */}
        <div style={{ width: 80, height: 4, background: '#444', borderRadius: 99, margin: '8px auto 0' }} />
      </div>
    </>
  );
}
