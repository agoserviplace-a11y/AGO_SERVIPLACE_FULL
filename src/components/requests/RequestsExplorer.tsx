import React, { useState } from 'react';
import {
  Search,
  MapPin,
  Clock,
  DollarSign,
  Plus,
  Send,
  MessageSquare,
  SlidersHorizontal,
  Briefcase
} from 'lucide-react';
import { ServiceRequest } from '../../types';
import { ECUADOR_PROVINCES, INITIAL_CATEGORIES } from '../../lib/constants';
import { useAuth } from '../../context/AuthContext';

interface RequestsExplorerProps {
  requests: ServiceRequest[];
  onOpenNewRequest: () => void;
  onOpenSendProposal: (request: ServiceRequest) => void;
  onOpenChat: (userId: string, userName: string) => void;
  onSelectCategory: (categoryId: string) => void;
  selectedCategory: string;
}

export const RequestsExplorer: React.FC<RequestsExplorerProps> = ({
  requests,
  onOpenNewRequest,
  onOpenSendProposal,
  onOpenChat,
  onSelectCategory,
  selectedCategory
}) => {
  const { currentUser, activeMode } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [provinceFilter, setProvinceFilter] = useState('');

  const filteredRequests = requests.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.location && r.location.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'all' || !selectedCategory || r.categoryId === selectedCategory;

    const matchesProvince =
      !provinceFilter || (r.location && r.location.toLowerCase().includes(provinceFilter.toLowerCase()));

    return matchesSearch && matchesCategory && matchesProvince;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-bold text-blue-500 uppercase tracking-wider mb-1 block">
            Bolsa de Requerimientos
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Solicitudes de Trabajo Publicadas
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Clientes en Ecuador buscando activamente cotizaciones de Especialistas.
          </p>
        </div>

        <button
          onClick={onOpenNewRequest}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          Publicar Nueva Solicitud
        </button>
      </div>

      {/* Filter bar */}
      <div className="bg-[#0D0D0E] p-3 rounded-2xl border border-[#27272A] shadow-xl mb-8 flex flex-col md:flex-row gap-3">
        {/* Search */}
        <div className="flex-1 flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#27272A] bg-[#161618]">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por palabras clave o necesidad..."
            className="w-full text-xs text-white placeholder:text-slate-500 bg-transparent focus:outline-none"
          />
        </div>

        {/* Category select */}
        <div className="md:w-56">
          <select
            value={selectedCategory}
            onChange={(e) => onSelectCategory(e.target.value)}
            className="w-full text-xs px-3 py-2.5 rounded-xl border border-[#27272A] bg-[#161618] text-slate-200 focus:outline-none cursor-pointer [&>option]:bg-[#161618] [&>option]:text-slate-200"
          >
            <option value="all">Todas las Categorías</option>
            {INITIAL_CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        {/* Province select */}
        <div className="md:w-56">
          <select
            value={provinceFilter}
            onChange={(e) => setProvinceFilter(e.target.value)}
            className="w-full text-xs px-3 py-2.5 rounded-xl border border-[#27272A] bg-[#161618] text-slate-200 focus:outline-none cursor-pointer [&>option]:bg-[#161618] [&>option]:text-slate-200"
          >
            <option value="">Cualquier Ubicación / Remoto</option>
            {ECUADOR_PROVINCES.map((p) => (
              <option key={p.name} value={p.name}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Requests List */}
      {filteredRequests.length === 0 ? (
        <div className="p-12 text-center bg-[#0D0D0E] rounded-3xl border border-[#27272A]">
          <Briefcase className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-200">No encontramos solicitudes con estos filtros</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Prueba ajustando los términos de búsqueda o sé el primero en publicar una necesidad en esta categoría.
          </p>
          <button
            onClick={onOpenNewRequest}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl transition-colors"
          >
            Publicar Solicitud
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((req) => (
            <div
              key={req.id}
              className="bg-[#0D0D0E] rounded-2xl border border-[#27272A] p-5 sm:p-6 hover:border-blue-500/60 hover:bg-[#161618] hover:shadow-xl transition-all"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">

                {/* Left side details */}
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30">
                      {req.categoryName || 'General'}
                    </span>
                    <span className="text-xs text-slate-600">•</span>
                    <span className="text-xs text-slate-400 font-medium">
                      Publicado por {req.requesterName || 'Solicitante'}
                    </span>
                    <span className="text-xs text-slate-600">•</span>
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      <span>{req.remote ? '100% Remoto' : req.location || 'Ecuador'}</span>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-white leading-snug">
                    {req.title}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 max-w-3xl">
                    {req.description}
                  </p>

                  <div className="flex items-center gap-4 text-[11px] text-slate-500 pt-1">
                    {req.deadline && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>Plazo: {req.deadline}</span>
                      </div>
                    )}
                    <span>{req.proposalsCount || 0} propuesta(s) recibida(s)</span>
                  </div>
                </div>

                {/* Right side: Budget & Action */}
                <div className="flex lg:flex-col items-center lg:items-end justify-between gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-[#27272A] shrink-0">
                  <div className="text-left lg:text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Presupuesto
                    </span>
                    <span className="text-lg font-black text-white">
                      ${req.budgetMin} - ${req.budgetMax}{' '}
                      <span className="text-xs font-normal text-slate-400">USD</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onOpenChat(req.requesterId, req.requesterName || 'Solicitante')}
                      className="p-2 text-slate-400 hover:text-white hover:bg-[#27272A] rounded-xl border border-[#27272A] transition-colors"
                      title="Preguntar al Solicitante"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onOpenSendProposal(req)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Postularme / Cotizar</span>
                    </button>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
