'use client';

import React from 'react';
import { Heart, Sparkles, Calendar } from 'lucide-react';

/* ── Props ────────────────────────────────────────────────────────────── */

export interface WrappedProductProps {
  giverName: string;
  receiverName: string;
  romanticMessage?: string;
  meetCouple?: boolean;
  meetCards?: Array<{
    title: string;
    photo: string;
    description: string;
  }>;
  timelineEvents?: Array<{
    date: string;
    title: string;
    description: string;
    photo?: string;
  }>;
  compact?: boolean;
}

/* ── Component ────────────────────────────────────────────────────────── */

export function WrappedProduct({
  giverName,
  receiverName,
  romanticMessage = '',
  meetCouple = false,
  meetCards = [],
  timelineEvents = [],
  compact = false,
}: WrappedProductProps) {
  return (
    <div
      className={`relative flex flex-col bg-gradient-to-b from-rose-50 via-white to-rose-50/50 ${
        compact ? 'rounded-2xl text-[10px]' : 'min-h-screen'
      }`}
    >
      {/* ── Content Container ── */}
      <div
        className={`mx-auto flex w-full max-w-md flex-col ${
          compact ? 'gap-3 p-3' : 'gap-8 px-5 py-10'
        }`}
      >
        {/* ──────────────────────────────────────────────────────────── */}
        {/*  HEADER                                                     */}
        {/* ──────────────────────────────────────────────────────────── */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-1.5">
            <Sparkles
              className={`text-rose-500 ${compact ? 'h-3 w-3' : 'h-5 w-5'}`}
            />
            <h1
              className={`font-extrabold text-slate-800 ${
                compact ? 'text-sm' : 'text-2xl'
              }`}
            >
              {giverName}{' '}
              <span className="text-rose-500">&</span>{' '}
              {receiverName}
            </h1>
            <Sparkles
              className={`text-rose-500 ${compact ? 'h-3 w-3' : 'h-5 w-5'}`}
            />
          </div>
          <p
            className={`mt-1 font-medium text-slate-500 ${
              compact ? 'text-[8px]' : 'text-sm'
            }`}
          >
            Nossa história de amor ✨
          </p>
        </div>

        {/* ──────────────────────────────────────────────────────────── */}
        {/*  MEET THE COUPLE                                            */}
        {/* ──────────────────────────────────────────────────────────── */}
        {meetCouple && meetCards.length > 0 && (
          <section>
            <div className="mb-3 flex items-center gap-2">
              <Heart
                className={`text-rose-500 ${compact ? 'h-3 w-3' : 'h-4 w-4'}`}
                fill="currentColor"
              />
              <h2
                className={`font-extrabold text-slate-800 ${
                  compact ? 'text-xs' : 'text-lg'
                }`}
              >
                Conheça o Casal
              </h2>
            </div>

            <div
              className={`grid gap-3 ${
                compact ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'
              }`}
            >
              {meetCards.map((card, idx) => (
                <div
                  key={idx}
                  className={`overflow-hidden border-2 border-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                    compact ? 'rounded-xl' : 'rounded-[1.2rem]'
                  }`}
                >
                  {/* Card Photo */}
                  <div
                    className={`relative w-full overflow-hidden bg-rose-100 ${
                      compact ? 'h-20' : 'h-40'
                    }`}
                  >
                    {card.photo ? (
                      <img
                        src={card.photo}
                        alt={card.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Heart
                          className={`text-rose-300 ${
                            compact ? 'h-6 w-6' : 'h-10 w-10'
                          }`}
                        />
                      </div>
                    )}
                  </div>

                  {/* Card Info */}
                  <div className={compact ? 'p-2' : 'p-4'}>
                    <h3
                      className={`font-extrabold text-slate-800 ${
                        compact ? 'text-[9px]' : 'text-sm'
                      }`}
                    >
                      {card.title}
                    </h3>
                    <p
                      className={`mt-0.5 font-medium leading-relaxed text-slate-500 ${
                        compact ? 'text-[7px]' : 'text-xs'
                      }`}
                    >
                      {card.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ──────────────────────────────────────────────────────────── */}
        {/*  TIMELINE                                                   */}
        {/* ──────────────────────────────────────────────────────────── */}
        {timelineEvents.length > 0 && (
          <section>
            <div className="mb-3 flex items-center gap-2">
              <Calendar
                className={`text-rose-500 ${compact ? 'h-3 w-3' : 'h-4 w-4'}`}
              />
              <h2
                className={`font-extrabold text-slate-800 ${
                  compact ? 'text-xs' : 'text-lg'
                }`}
              >
                Nossa Linha do Tempo
              </h2>
            </div>

            <div className="relative">
              {/* Vertical line */}
              <div
                className={`absolute top-0 bottom-0 border-l-2 border-black ${
                  compact ? 'left-3' : 'left-5'
                }`}
              />

              <div className={compact ? 'space-y-3' : 'space-y-6'}>
                {timelineEvents.map((event, idx) => (
                  <div
                    key={idx}
                    className={`relative flex items-start ${
                      compact ? 'pl-8' : 'pl-12'
                    }`}
                  >
                    {/* Numbered node */}
                    <div
                      className={`absolute flex items-center justify-center rounded-full border-2 border-black bg-rose-500 font-extrabold text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                        compact
                          ? 'left-0.5 top-0 h-5 w-5 text-[7px]'
                          : 'left-1 top-0 h-8 w-8 text-xs'
                      }`}
                    >
                      {idx + 1}
                    </div>

                    {/* Event card */}
                    <div
                      className={`flex-1 overflow-hidden border-2 border-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                        compact ? 'rounded-xl p-2' : 'rounded-[1.2rem] p-4'
                      }`}
                    >
                      {/* Date badge */}
                      <span
                        className={`inline-block rounded-full bg-rose-500 font-bold text-white ${
                          compact
                            ? 'mb-1 px-1.5 py-0.5 text-[6px]'
                            : 'mb-2 px-3 py-1 text-[10px]'
                        }`}
                      >
                        {formatDateBR(event.date)}
                      </span>

                      <h3
                        className={`font-extrabold text-slate-800 ${
                          compact ? 'text-[9px]' : 'text-sm'
                        }`}
                      >
                        {event.title}
                      </h3>
                      <p
                        className={`mt-0.5 font-medium leading-relaxed text-slate-500 ${
                          compact ? 'text-[7px]' : 'text-xs'
                        }`}
                      >
                        {event.description}
                      </p>

                      {/* Optional event photo */}
                      {event.photo && (
                        <div
                          className={`mt-2 overflow-hidden rounded-lg border border-black/10 ${
                            compact ? 'h-16' : 'h-32'
                          }`}
                        >
                          <img
                            src={event.photo}
                            alt={event.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ──────────────────────────────────────────────────────────── */}
        {/*  ROMANTIC MESSAGE                                           */}
        {/* ──────────────────────────────────────────────────────────── */}
        {romanticMessage && (
          <section
            className={`border-2 border-black bg-amber-50/40 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
              compact ? 'rounded-xl p-3' : 'rounded-2xl p-6'
            }`}
          >
            <div className="mb-2 flex items-center gap-1.5">
              <Heart
                className={`text-rose-600 ${compact ? 'h-3 w-3' : 'h-4 w-4'}`}
                fill="currentColor"
              />
              <span
                className={`font-extrabold uppercase tracking-wider text-rose-600 ${
                  compact ? 'text-[7px]' : 'text-[11px]'
                }`}
              >
                Mensagem de Amor
              </span>
            </div>

            <p
              className={`whitespace-pre-line font-medium leading-relaxed text-slate-700 ${
                compact ? 'text-[8px]' : 'text-sm'
              }`}
            >
              {romanticMessage}
            </p>

            <p
              className={`mt-3 text-right font-bold italic text-rose-500 ${
                compact ? 'text-[7px]' : 'text-xs'
              }`}
            >
              — Com amor, {giverName} ❤️
            </p>
          </section>
        )}
      </div>
    </div>
  );
}

/* ── Utils ─────────────────────────────────────────────────────────────── */

function formatDateBR(isoDate: string): string {
  try {
    const d = new Date(isoDate);
    return d.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return isoDate;
  }
}
