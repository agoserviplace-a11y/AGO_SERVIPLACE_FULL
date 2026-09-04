import React from 'react';
import { Star, CheckCircle, MapPin, Clock, ArrowRight, ShieldCheck } from 'lucide-react';
import { SpecialistProfile } from '../../types';

interface FeaturedSpecialistsProps {
  specialists: SpecialistProfile[];
  onSelectSpecialist: (specialist: SpecialistProfile) => void;
  onViewAll: () => void;
}

export const FeaturedSpecialists: React.FC<FeaturedSpecialistsProps> = ({
  specialists,
  onSelectSpecialist,
  onViewAll
}) => {
  return (
    <section className="py-16 bg-[#0A0A0B] border-b border-[#27272A]/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-500 mb-1 block">
              Talento Destacado
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Especialistas Verificados en AGO
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Profesionales con identidad verificada, altas calificaciones y garantía de cumplimiento.
            </p>
          </div>

          <button
            onClick={onViewAll}
            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-400 hover:text-blue-300"
          >
            <span>Ver más Especialistas</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {specialists.map((specialist) => (
            <div
              key={specialist.userId}
              className="bg-[#0D0D0E] rounded-2xl border border-[#27272A] p-5 flex flex-col justify-between hover:shadow-xl hover:border-blue-500/60 hover:bg-[#161618] transition-all"
            >
              <div>
                {/* Header: Avatar, Name & Verification */}
                <div className="flex items-start gap-3 mb-3.5">
                  <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-base shrink-0 shadow-xs">
                    {specialist.professionalName.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-sm font-bold text-white truncate">
                        {specialist.professionalName}
                      </h3>
                      {specialist.verificationStatus === 'verified' && (
                        <CheckCircle className="w-3.5 h-3.5 text-blue-400 shrink-0" title="Especialista Verificado" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      <span className="truncate">{specialist.location}</span>
                    </p>
                  </div>
                </div>

                {/* Headline */}
                <p className="text-xs text-slate-300 font-medium mb-3.5 line-clamp-2 leading-relaxed">
                  {specialist.headline}
                </p>

                {/* Rating & Stats */}
                <div className="flex items-center justify-between text-xs py-2.5 px-3 bg-[#161618] rounded-xl mb-4 border border-[#27272A]">
                  <div className="flex items-center gap-1 text-white font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{specialist.ratingAverage.toFixed(1)}</span>
                    <span className="text-[11px] text-slate-500 font-normal">
                      ({specialist.ratingCount})
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    <span className="font-semibold text-slate-200">{specialist.completedJobs}</span> trabajos
                  </div>
                </div>

                {/* Skills tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {specialist.skills.slice(0, 3).map((skill, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-[#161618] border border-[#27272A] text-slate-300 font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-3 border-t border-[#27272A] flex items-center justify-between">
                <div className="text-[11px] text-slate-400">
                  {specialist.hourlyRate ? (
                    <span>Desde <strong className="text-white font-bold">${specialist.hourlyRate}</strong>/hr</span>
                  ) : (
                    <span>Cotización previa</span>
                  )}
                </div>
                <button
                  onClick={() => onSelectSpecialist(specialist)}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors"
                >
                  Ver Perfil
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
