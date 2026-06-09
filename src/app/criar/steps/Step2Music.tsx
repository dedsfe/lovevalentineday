'use client';

import { useState } from 'react';
import type { SpotifyData } from '@/lib/types';
import { FieldCard, StepHeader, SectionDivider, inlineInput } from './shared';

interface Props {
  spotify:  SpotifyData;
  onChange: (payload: Partial<SpotifyData>) => void;
}

export function Step2Music({ spotify, onChange }: Props) {
  const [focused, setFocused] = useState<string | null>(null);
  const focus = (id: string) => setFocused(id);
  const blur  = () => setFocused(null);
  const isFoc = (id: string) => focused === id;

  return (
    <div>
      <StepHeader title="Música" description="A trilha sonora do amor" />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* Título da música */}
        <FieldCard icon="🎵" label="Título da música" focused={isFoc('title')}>
          <input
            style={inlineInput}
            type="text"
            value={spotify.musicTitle}
            placeholder="Ex: Perfect"
            maxLength={80}
            onFocus={() => focus('title')}
            onBlur={blur}
            onChange={e => onChange({ musicTitle: e.target.value })}
          />
        </FieldCard>

        {/* Artista */}
        <FieldCard icon="🎤" label="Artista" focused={isFoc('artist')}>
          <input
            style={inlineInput}
            type="text"
            value={spotify.musicArtist}
            placeholder="Ex: Ed Sheeran"
            maxLength={80}
            onFocus={() => focus('artist')}
            onBlur={blur}
            onChange={e => onChange({ musicArtist: e.target.value })}
          />
        </FieldCard>

        {/* Link do áudio (opcional) */}
        <FieldCard
          icon="🔗"
          label="Link do áudio (opcional)"
          focused={isFoc('url')}
          note="Cole um link direto de MP3 para ativar a reprodução no presente."
        >
          <input
            style={inlineInput}
            type="url"
            value={spotify.musicUrl ?? ''}
            placeholder="https://…/musica.mp3"
            onFocus={() => focus('url')}
            onBlur={blur}
            onChange={e => onChange({ musicUrl: e.target.value })}
          />
        </FieldCard>

        <SectionDivider label="Textos do player" />

        {/* Texto do topo */}
        <FieldCard
          icon="✨"
          label="Texto do topo"
          focused={isFoc('top')}
          note="Aparece como título no topo do player."
        >
          <input
            style={inlineInput}
            type="text"
            value={spotify.topText}
            placeholder="Nossa música ❤️"
            maxLength={50}
            onFocus={() => focus('top')}
            onBlur={blur}
            onChange={e => onChange({ topText: e.target.value })}
          />
        </FieldCard>

        {/* Texto do contador */}
        <FieldCard
          icon="⏳"
          label="Texto do contador"
          focused={isFoc('bottom')}
          note="Aparece antes do número de anos juntos."
        >
          <input
            style={inlineInput}
            type="text"
            value={spotify.bottomText}
            placeholder="Namorados há"
            maxLength={40}
            onFocus={() => focus('bottom')}
            onBlur={blur}
            onChange={e => onChange({ bottomText: e.target.value })}
          />
        </FieldCard>

      </div>
    </div>
  );
}
