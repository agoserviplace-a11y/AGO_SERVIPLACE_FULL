import React, { useState } from 'react';
import { Search, MapPin, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { ECUADOR_PROVINCES } from '../../lib/constants';

interface HeroProps {
  onSearch: (term: string, province?: string) => void;
  onOpenAuth: (tab: 'login' | 'register', accountType: 'requester' | 'specialist' | 'both') => void;
  onNavigate: (view: 'home' | 'services' | 'requests' | 'dashboard' | 'specialists') => void;
}

export const Hero: React.FC<HeroProps> = ({ onSearch, onOpenAuth, onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm, selectedProvince);
    onNavigate('services');
  };

  const sampleTags = [
    'Programador',
    'Diseñador gráfico',
    'Electricista',
    'Contador',
    'Fotógrafo',
    'Técnico',
    'Community Manager'
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#0A0A0B] via-[#0D0D0E] to-[#0A0A0B] py-16 sm:py-24 border-b border-[#27272A]/80">
      {/* Subtle geometric background accents */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-tr from-blue-600/15 via-purple-600/10 to-transparent blur-3xl -z-10" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">

        {/* Trust pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#161618] border border-[#27272A] text-slate-200 text-xs font-semibold mb-8 shadow-xs animate-in fade-in slide-in-from-bottom-2">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>Marketplace de Servicios Profesionales en Ecuador</span>
        </div>

        {/* Main Hero Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12] mb-6">
          Encuentra al <span className="text-blue-500 underline decoration-blue-500/40 decoration-wavy decoration-2">Especialista</span> que necesitas.
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
          Conecta, contrata y gestiona tus servicios de forma segura desde un solo lugar.
        </p>

        {/* Search Box */}
        <form
          onSubmit={handleSearchSubmit}
          className="max-w-3xl mx-auto bg-[#161618] p-2 sm:p-2.5 rounded-2xl shadow-2xl border border-[#27272A] flex flex-col sm:flex-row gap-2 mb-6 transition-all focus-within:border-blue-500/80 focus-within:ring-4 focus-within:ring-blue-500/20"
        >
          {/* Query input */}
          <div className="flex-1 flex items-center gap-3 px-3 py-2 border-b sm:border-b-0 sm:border-r border-[#27272A]">
            <Search className="w-5 h-5 text-slate-400 shrink-0" />
            <input
              id="hero-search-input"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="¿Qué servicio necesitas? (Ej: Electricista, Diseñador...)"
              className="w-full text-sm text-white placeholder:text-slate-500 focus:outline-none bg-transparent"
            />
          </div>

          {/* Location select */}
          <div className="flex items-center gap-2 px-3 py-2 sm:w-56">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              id="hero-province-select"
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
              className="w-full text-xs font-medium text-slate-200 bg-transparent focus:outline-none cursor-pointer [&>option]:bg-[#161618] [&>option]:text-slate-200"
            >
              <option value="">Todo el Ecuador / Remoto</option>
              {ECUADOR_PROVINCES.map((p) => (
                <option key={p.name} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <button
            id="hero-search-submit-btn"
            type="submit"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            Buscar
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick sample pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10 text-xs text-slate-400">
          <span className="font-medium text-slate-500 mr-1">Populares:</span>
          {sampleTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => {
                setSearchTerm(tag);
                onSearch(tag);
                onNavigate('services');
              }}
              className="px-2.5 py-1 rounded-lg bg-[#161618] hover:bg-[#202024] border border-[#27272A] text-slate-300 hover:text-white font-medium transition-all shadow-2xs"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Dual Primary Call to Actions (Section 9 & 10) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 border-t border-[#27272A]/80 max-w-xl mx-auto">
          <button
            id="hero-find-specialist-cta"
            onClick={() => onNavigate('services')}
            className="w-full sm:w-auto px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2"
          >
            <span>Encontrar un Especialista</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            id="hero-offer-services-cta"
            onClick={() => onOpenAuth('register', 'specialist')}
            className="w-full sm:w-auto px-6 py-3.5 bg-[#161618] hover:bg-[#202024] text-slate-200 border border-[#27272A] font-semibold text-sm rounded-xl shadow-2xs transition-colors flex items-center justify-center gap-2"
          >
            <span>Ofrecer mis servicios</span>
          </button>
        </div>

        {/* Under-CTA Trust micro-copy */}
        <div className="mt-8 flex items-center justify-center gap-6 text-xs text-slate-400 font-medium">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Contrataciones trazadas en AGO</span>
          </div>
          <span className="text-slate-600">•</span>
          <div>Sin comisiones sorpresa</div>
          <span className="text-slate-600">•</span>
          <div>Pagos en USD garantizados</div>
        </div>

      </div>
    </section>
  );
};
