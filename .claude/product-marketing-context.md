# Product Marketing Context — LoveValentine (LovePanda)

## Produto
Presente digital interativo para casais: uma página personalizada acessada por link único, enviada pelo WhatsApp. Sem app, link disponível na hora, não expira.

**Produtos no link:**
- **Spotify Player** (base, R$ 29,90) — música do casal, até 10 fotos em carrossel, contador ao vivo do tempo juntos, mensagem especial + motivos
- **Wordle do Amor** (extra, R$ 9,90) — jogo de palavras com palavra secreta do casal, dica e mensagem ao acertar
- **Roleta do Casal** (extra, R$ 9,90) — roleta com programas/atividades do casal
- Em breve: Galeria de fotos, Mapa estelar, Retrospectiva do casal

Fonte de preço: `src/lib/pricing.ts` (única fonte da verdade).

## Público
- Pessoas em relacionamento (namoro ou casamento) buscando presente emocional de baixo custo e alto impacto para datas: aniversário de namoro, Dia dos Namorados, aniversário, Natal.
- **Pronome: NEUTRALIZAR.** A copy fala com qualquer pessoa apaixonada — usar "quem você ama", "seu amor", "a pessoa". NÃO assumir comprador homem/destinatária mulher. Exceção: depoimentos reais mantêm o gênero original da citação.
- Dor: quer surpreender de verdade, sem cair no presente genérico; pouco tempo/habilidade para fazer algo personalizado à mão.
- Objeções: "precisa de app?", "é difícil de fazer?", "o link some?", "vale o preço?"

## Tráfego
- **Ads Instagram/TikTok** — visitante frio, headline precisa entregar a promessa do criativo em segundos.
- **Orgânico/SEO** — buscas como "presente dia dos namorados criativo", "presente aniversário de namoro" — metadata e títulos importam.

## Prova social (REAL — pode usar)
- Depoimentos da landing são reais (nomes e citações verídicas).
- Contador "+500 presentes criados" é real.

## Voz e tom
- pt-BR informal, caloroso, direto. Emocional sem ser meloso demais.
- Headlines ousadas, body claro, CTAs orientados a ação ("Criar meu presente").
- Sem exclamações em excesso, sem buzzword, sem promessa fabricada.

## Ação primária
Conversão: clicar em "Criar meu presente" → completar o funil `/criar` (6 steps) → pagar via Mercado Pago (Pix/cartão) → receber link em `/criar/entrega/[id]`.
