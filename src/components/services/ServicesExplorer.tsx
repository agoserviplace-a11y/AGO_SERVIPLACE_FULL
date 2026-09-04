import React, { useState } from 'react';
import {
  Search,
  Star,
  Clock,
  MapPin,
  SlidersHorizontal,
  Plus,
  Compass
} from 'lucide-react';
import { Service, Category } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface ServicesExplorerProps {
  services: Service[];
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
  onSelectService: (service: Service) => void;
  onOpenNewService: () => void;
}

export const ServicesExplorer: React.FC<ServicesExplorerProps> = ({
  services,
  categories,
  selectedCategory,
  onSelectCategory,
  onSelectService,
  onOpenNewService
}) => {
  const { activeMode } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [locationTypeFilter, setLocationTypeFilter] = useState<'all' | 'remote' | 'onsite'>('all');
  const [sortBy, setSortBy] = useState<'rating' | 'priceAsc' | 'priceDesc'>('rating');

  // Filtering
  const filteredServices = services
    .filter((s) => {
      const matchesSearch =
        s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.specialistName && s.specialistName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (s.tags && s.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase())));

      const matchesCat =
        selectedCategory === 'all' || !selectedCategory || s.categoryId === selectedCategory;

      const matchesLoc =
        locationTypeFilter === 'all' || s.locationType === locationTypeFilter || (locationTypeFilter === 'remote' && s.locationType === 'hybrid');

      return matchesSearch && matchesCat && matchesLoc;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') {
        return (b.specialistRating || 5) - (a.specialistRating || 5);
      }
      if (sortBy === 'priceAsc') {
        return (a.basePrice || a.priceFrom) - (b.basePrice || b.priceFrom);
      }
      if (sortBy === 'priceDesc') {
        return (b.basePrice || b.priceFrom) - (a.basePrice || a.priceFrom);
      }
      return 0;
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-bold text-blue-500 uppercase tracking-wider mb-1 block">
            Catálogo Profesional
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Explorar Servicios Disponibles
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Encuentra especialistas calificados listos para ejecutar tus proyectos con tarifas claras en USD.
          </p>
        </div>

        {activeMode === 'specialist' && (
          <button
            onClick={onOpenNewService}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            Publicar Mi Servicio
          </button>
        )}
      </div>

      {/* Filter and Search Toolbar */}
      <div className="bg-[#0D0D0E] p-3 rounded-2xl border border-[#27272A] shadow-xl mb-8 flex flex-col md:flex-row gap-3">
        {/* Search */}
        <div className="flex-1 flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#27272A] bg-[#161618]">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por servicio, tecnología, habilidad o especialista..."
            className="w-full text-xs text-white placeholder:text-slate-500 bg-transparent focus:outline-none"
          />
        </div>

        {/* Category */}
        <div className="md:w-56">
          <select
            value={selectedCategory}
            onChange={(e) => onSelectCategory(e.target.value)}
            className="w-full text-xs px-3 py-2.5 rounded-xl border border-[#27272A] bg-[#161618] text-slate-200 focus:outline-none cursor-pointer [&>option]:bg-[#161618] [&>option]:text-slate-200"
          >
            <option value="all">Todas las Categorías</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Location Type Filter */}
        <div className="md:w-48">
          <select
            value={locationTypeFilter}
            onChange={(e) => setLocationTypeFilter(e.target.value as any)}
            className="w-full text-xs px-3 py-2.5 rounded-xl border border-[#27272A] bg-[#161618] text-slate-200 focus:outline-none cursor-pointer [&>option]:bg-[#161618] [&>option]:text-slate-200"
          >
            <option value="all">Modalidad: Todas</option>
            <option value="remote">100% Remoto</option>
            <option value="onsite">Presencial / En sitio</option>
          </select>
        </div>

        {/* Sort */}
        <div className="md:w-48">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="w-full text-xs px-3 py-2.5 rounded-xl border border-[#27272A] bg-[#161618] text-slate-200 focus:outline-none cursor-pointer [&>option]:bg-[#161618] [&>option]:text-slate-200"
          >
            <option value="rating">Mejor Calificados</option>
            <option value="priceAsc">Precio: Menor a Mayor</option>
            <option value="priceDesc">Precio: Mayor a Menor</option>
          </select>
        </div>
      </div>

      {/* Grid of services */}
      {filteredServices.length === 0 ? (
        <div className="p-12 text-center bg-[#0D0D0E] rounded-3xl border border-[#27272A]">
          <Compass className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-200">No encontramos servicios que coincidan</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Intenta limpiando los filtros o utilizando términos más generales.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              onClick={() => onSelectService(service)}
              className="bg-[#0D0D0E] rounded-2xl border border-[#27272A] overflow-hidden flex flex-col justify-between hover:shadow-xl hover:border-blue-500/60 hover:bg-[#161618] transition-all cursor-pointer group"
            >
              {/* Image banner */}
              <div className="relative h-48 bg-[#161618] overflow-hidden">
                <img
                  src={
                    service.images && service.images.length > 0
                      ? service.images[0]
                      : 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80'
                  }
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-3 left-3 text-[10px] font-semibold px-2.5 py-1 rounded-md bg-[#0A0A0B]/85 backdrop-blur-md text-slate-200 border border-[#27272A]/80">
                  {service.locationType === 'remote' ? '100% Remoto' : service.location || 'Presencial'}
                </span>
              </div>

              {/* Content */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span className="font-semibold text-slate-300 truncate max-w-[150px]">
                      {service.specialistName}
                    </span>
                    <div className="flex items-center gap-1 text-amber-400 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{service.specialistRating || 5.0}</span>
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-white line-clamp-2 mb-2 group-hover:text-blue-400 transition-colors leading-snug">
                    {service.title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-2 mb-3 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                {/* Footer price and time */}
                <div className="pt-3 border-t border-[#27272A] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      {service.pricingType === 'from' ? 'Desde' : 'Precio'}
                    </span>
                    <span className="text-base font-extrabold text-white">
                      ${service.basePrice || service.priceFrom || 0}{' '}
                      <span className="text-xs font-normal text-slate-400">USD</span>
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 block">Entrega</span>
                    <span className="text-xs font-semibold text-slate-300">
                      {service.deliveryDays ? `${service.deliveryDays} días` : service.estimatedDuration || 'A coordinar'}
                    </span>
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
