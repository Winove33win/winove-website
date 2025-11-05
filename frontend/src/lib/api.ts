'use client';

import React from 'react';
import type { Template } from '@/src/lib/api'; // ou '@/src/types/Template' se você separar o type

function buildWaLink(
  msg: string,
  waIntl = '5519982403845',
  base = 'Olá! Vim da página do Template Advocacia Blue Mode.'
) {
  const href = typeof window !== 'undefined' ? window.location.href : '';
  const sep = href.includes('?') ? '&' : '?';
  const withUtm = href ? `${href}${sep}utm_source=template-advocacia` : 'https://winove.com.br/templates';
  const final = `${base} ${msg} | Página: ${withUtm}`;
  return `https://wa.me/${waIntl}?text=${encodeURIComponent(final)}`;
}

type Props = { template: Template };

const PriceBox: React.FC<Props> = ({ template }) => {
  const wa   = template.contact?.whatsappIntl   ?? '5519982403845';
  const base = template.contact?.defaultMessage ?? 'Olá! Vim da página do Template Advocacia Blue Mode.';
  const CTA  = template.ctaTexts ?? {};

  const price = template.price ?? 0;
  const priceStr = price.toLocaleString('pt-BR', { style: 'currency', currency: template.currency ?? 'BRL' });
  const oldStr   = template.originalPrice != null
    ? template.originalPrice.toLocaleString('pt-BR', { style: 'currency', currency: template.currency ?? 'BRL' })
    : '';

  return (
    <aside className="rounded-2xl border border-[#1f2a3a] bg-[#0f1722] p-5 space-y-3">
      <div>
        <div className="text-3xl font-extrabold bg-gradient-to-r from-[#ff8a00] to-[#ffbd66] bg-clip-text text-transparent">
          {priceStr}
        </div>
        {oldStr && <div className="text-sm opacity-60 line-through">{oldStr}</div>}
        <div className="text-xs opacity-80">Pagamento único</div>
      </div>

      <a
        className="block w-full rounded-xl bg-[#ff8a00] px-4 py-3 text-center font-semibold text-[#111] hover:opacity-90"
        href={buildWaLink(`Quero comprar o Template (${priceStr}).`, wa, base)}
        target="_blank" rel="noopener noreferrer"
      >
        {CTA.buyTemplate ?? `Comprar Template — ${priceStr}`}
      </a>

      <a
        className="block w-full rounded-xl border border-[#2b3b4d] px-4 py-3 text-center text-[#e6eaf0] hover:bg-[#121c29]"
        href={buildWaLink('Quero adicionar Hospedagem Plesk 3GB (R$ 564/ano).', wa, base)}
        target="_blank" rel="noopener noreferrer"
      >
        {CTA.hosting ?? 'Adicionar Hospedagem Plesk 3GB — R$ 564/ano'}
      </a>

      <a
        className="block w-full rounded-xl border border-[#2b3b4d] px-4 py-3 text-center text-[#e6eaf0] hover:bg-[#121c29]"
        href={buildWaLink('Quero adicionar E-mail corporativo 3GB (R$ 250/ano).', wa, base)}
        target="_blank" rel="noopener noreferrer"
      >
        {CTA.email ?? 'Adicionar E-mail Corporativo 3GB — R$ 250/ano'}
      </a>

      <a
        className="block w-full rounded-xl bg-[#e0b14c] px-4 py-3 text-center font-extrabold text-[#0c1b2a] hover:opacity-95"
        href={buildWaLink('Quero o Combo: Site + Hospedagem + E-mail (1º ano R$ 1.564; renovação R$ 814/ano).', wa, base)}
        target="_blank" rel="noopener noreferrer"
      >
        {CTA.bundle ?? 'Combo (Site + Hospedagem + E-mail) — R$ 1.564 (1º ano)'}
      </a>
    </aside>
  );
};

export default PriceBox;
