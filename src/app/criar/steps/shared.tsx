'use client';

// ─── Shared FieldCard used by all funnel steps ────────────────────────────────

export const inlineInput: React.CSSProperties = {
  width: '100%', border: 'none', outline: 'none', background: 'transparent',
  fontSize: 15, fontWeight: 600, color: '#111827', padding: 0,
  fontFamily: 'system-ui, -apple-system, sans-serif',
};

export function FieldCard({
  icon, label, focused, note, children,
}: {
  icon: string; label: string; focused: boolean; note?: string; children: React.ReactNode;
}) {
  return (
    <div>
      <div style={{
        background: '#fff',
        border: `1.5px solid ${focused ? '#E11D48' : '#E5E7EB'}`,
        borderRadius: 14,
        padding: '13px 16px',
        display: 'flex', alignItems: 'center', gap: 14,
        boxShadow: focused ? '0 0 0 3.5px rgba(225,29,72,0.09)' : 'none',
        transition: 'border-color 0.15s, box-shadow 0.15s',
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: 11,
          background: focused ? '#FFF1F2' : '#F9FAFB',
          border: `1.5px solid ${focused ? 'rgba(225,29,72,0.18)' : '#F0F0F0'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 19, flexShrink: 0,
          transition: 'background 0.15s, border-color 0.15s',
        }}>
          {icon}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 10, fontWeight: 800,
            color: focused ? '#E11D48' : '#9CA3AF',
            textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4,
            transition: 'color 0.15s', fontFamily: 'system-ui',
          }}>
            {label}
          </div>
          {children}
        </div>
      </div>
      {note && (
        <p style={{ fontSize: 11.5, color: '#9CA3AF', margin: '5px 0 0 8px', fontFamily: 'system-ui' }}>
          {note}
        </p>
      )}
    </div>
  );
}

export function StepHeader({
  title, description, optional,
}: {
  title: string; description: string; optional?: boolean;
}) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
        <h1 style={{
          fontSize: 30, fontWeight: 800, color: '#111827',
          margin: 0, letterSpacing: '-0.02em', lineHeight: 1.15,
          fontFamily: 'system-ui',
        }}>
          {title}
        </h1>
        {optional && (
          <span style={{
            fontSize: 11, fontWeight: 700, color: '#6B7280',
            background: '#F3F4F6', borderRadius: 6, padding: '3px 8px',
            fontFamily: 'system-ui', letterSpacing: '0.03em',
          }}>
            Opcional
          </span>
        )}
      </div>
      <p style={{ fontSize: 16, color: '#6B7280', margin: 0, fontFamily: 'system-ui' }}>
        {description}
      </p>
    </div>
  );
}

export function SectionDivider({ label }: { label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0 20px' }}>
      <div style={{ flex: 1, height: 1, background: '#F3F4F6' }} />
      <span style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'system-ui', whiteSpace: 'nowrap' }}>
        {label}
      </span>
      <div style={{ flex: 1, height: 1, background: '#F3F4F6' }} />
    </div>
  );
}
