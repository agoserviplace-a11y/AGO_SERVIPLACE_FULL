import React from 'react';
import { Star, Clock, MapPin, ArrowRight } from 'lucide-react';
import { Service } from '../../types';

interface PopularServicesProps {
  services: Service[];
  onSelectService: (service: Service) => void;
  onViewAll: () => void;
}

export const PopularServices: React.FC<PopularServicesProps> = ({
  services,
  onSelectService,
  onViewAll
}) => {
  return (
    <section className="py-16 bg-[#0A0A0B] border-b border-[#27272A]/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-500 mb-1 block">
              Catálogo de Servicios
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Servicios Más Contratados
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Contrata directamente servicios con alcance claro y precios transparentes en USD.
            </p>
          </div>

          <button
            onClick={onViewAll}
            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
          >
            <span>Explorar catálogo completo</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              onClick={() => onSelectService(service)}
              className="bg-[#0D0D0E] rounded-2xl border border-[#27272A] overflow-hidden flex flex-col justify-between hover:shadow-xl hover:border-blue-500/60 hover:bg-[#161618] transition-all cursor-pointer group"
            >
              {/* Image banner */}
              <div className="relative h-44 bg-[#161618] overflow-hidden">
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
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span className="font-medium text-slate-300 truncate max-w-[140px]">
                      {service.specialistName || 'Especialista AGO'}
                    </span>
                    <div className="flex items-center gap-1 text-amber-400 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{service.specialistRating || 5.0}</span>
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-white line-clamp-2 mb-2 group-hover:text-blue-400 transition-colors leading-snug">
                    {service.title}
                  </h3>

                  <div className="flex items-center gap-1 text-[11px] text-slate-400 mb-3">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span>Entrega: {service.deliveryDays ? `${service.deliveryDays} días` : service.estimatedDuration || 'A coordinar'}</span>
                  </div>
                </div>

                {/* Price and CTA */}
                <div className="pt-3 border-t border-[#27272A] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-semibold">
                      {service.pricingType === 'from' ? 'Desde' : 'Precio'}
                    </span>
                    <span className="text-base font-extrabold text-white">
                      ${service.basePrice || service.priceFrom || 0}{' '}
                      <span className="text-xs font-normal text-slate-400">USD</span>
                    </span>
                  </div>

                  <span className="text-xs font-semibold text-blue-400 group-hover:underline">
                    Ver servicio →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
