import React, { useEffect, useState } from 'react';
import {
  X,
  Star,
  CheckCircle,
  MapPin,
  Clock,
  Briefcase,
  DollarSign,
  MessageSquare,
  Send,
  Award,
  ShieldCheck,
  Calendar
} from 'lucide-react';
import { SpecialistProfile, Review, Service } from '../../types';
import { dbService } from '../../lib/dbService';
import { useAuth } from '../../context/AuthContext';

interface SpecialistDetailModalProps {
  specialist: SpecialistProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenChatWithSpecialist: (specialistId: string, specialistName: string) => void;
  onOpenNewRequestForSpecialist: (specialist: SpecialistProfile) => void;
}

export const SpecialistDetailModal: React.FC<SpecialistDetailModalProps> = ({
  specialist,
  isOpen,
  onClose,
  onOpenChatWithSpecialist,
  onOpenNewRequestForSpecialist
}) => {
  const { currentUser } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (specialist && isOpen) {
      setLoading(true);
      Promise.all([
        dbService.getSpecialistReviews(specialist.userId),
        dbService.getSpecialistServices(specialist.userId)
      ]).then(([revs, srvs]) => {
        setReviews(revs || []);
        setServices(srvs || []);
        setLoading(false);
      }).catch(err => {
        console.error('Error loading specialist details:', err);
        setLoading(false);
      });
    }
  }, [specialist, isOpen]);

  if (!isOpen || !specialist) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#0D0D0E] rounded-3xl shadow-2xl border border-[#27272A] text-slate-200 w-full max-w-3xl my-8 overflow-hidden animate-in fade-in zoom-in-95 max-h-[90vh] flex flex-col">

        {/* Modal Top Bar */}
        <div className="p-6 pb-4 border-b border-[#27272A] flex items-center justify-between shrink-0 bg-[#161618]/50">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
              Perfil de Especialista Verificado
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#161618] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Scrollable */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">

          {/* Profile Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-[#27272A]">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center font-extrabold text-2xl shrink-0">
                {specialist.professionalName.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-extrabold text-white">
                    {specialist.professionalName}
                  </h2>
                  {specialist.verificationStatus === 'verified' && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-300 bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/30">
                      <CheckCircle className="w-3 h-3 text-blue-400" />
                      Verificado
                    </span>
                  )}
                </div>

                <p className="text-sm font-medium text-slate-300 mt-1">
                  {specialist.headline}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-2">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>{specialist.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>Responde: {specialist.responseTime}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5 text-slate-500" />
                    <span>{specialist.experienceYears} años de experiencia</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Price & CTA */}
            <div className="w-full sm:w-auto p-4 rounded-2xl bg-[#161618] border border-[#27272A] text-right sm:min-w-[180px]">
              <span className="text-[10px] uppercase font-semibold text-slate-400 block">Tarifa Referencial</span>
              <div className="text-xl font-black text-white mb-3">
                {specialist.hourlyRate ? `$${specialist.hourlyRate}/hr` : 'A convenir'}{' '}
                <span className="text-xs font-normal text-slate-400">USD</span>
              </div>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    onOpenChatWithSpecialist(specialist.userId, specialist.professionalName);
                    onClose();
                  }}
                  className="w-full py-2 px-3 bg-[#27272A] hover:bg-[#3F3F46] text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  Enviar Mensaje
                </button>
                <button
                  onClick={() => {
                    onOpenNewRequestForSpecialist(specialist);
                    onClose();
                  }}
                  className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  Cotizar Proyecto
                </button>
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-[#161618] border border-[#27272A] text-center">
            <div>
              <div className="flex items-center justify-center gap-1 text-white font-extrabold text-base">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{specialist.ratingAverage.toFixed(1)}</span>
              </div>
              <span className="text-[11px] text-slate-400">Calificación promedio</span>
            </div>
            <div className="border-x border-[#27272A]">
              <div className="text-white font-extrabold text-base">
                {specialist.completedJobs}
              </div>
              <span className="text-[11px] text-slate-400">Trabajos completados</span>
            </div>
            <div>
              <div className="text-white font-extrabold text-base">
                {specialist.remoteAvailable ? 'Sí' : 'No'}
              </div>
              <span className="text-[11px] text-slate-400">Atención remota</span>
            </div>
          </div>

          {/* Bio / Description */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Acerca del Especialista
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {specialist.description}
            </p>
          </div>

          {/* Skills tags */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
              Habilidades y Competencias
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {specialist.skills.map((s, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-lg bg-[#161618] border border-[#27272A] text-slate-300 text-xs font-semibold"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Services list by this specialist */}
          {services.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Servicios Publicados ({services.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {services.map((srv) => (
                  <div
                    key={srv.id}
                    className="p-3.5 rounded-xl border border-[#27272A] hover:border-[#3F3F46] bg-[#161618] transition-colors"
                  >
                    <h4 className="text-xs font-bold text-white mb-1">{srv.title}</h4>
                    <p className="text-[11px] text-slate-400 line-clamp-2 mb-2">{srv.description}</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-extrabold text-white">${srv.basePrice || srv.priceFrom} USD</span>
                      <span className="text-[10px] text-slate-500">{srv.estimatedDuration || '1-3 días'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reviews section */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Reseñas Verificadas de Clientes ({reviews.length})
            </h3>

            {loading ? (
              <p className="text-xs text-slate-500">Cargando valoraciones...</p>
            ) : reviews.length === 0 ? (
              <div className="p-4 rounded-xl bg-[#161618] border border-[#27272A] text-slate-400 text-xs text-center">
                Aún no hay reseñas registradas para este perfil.
              </div>
            ) : (
              <div className="space-y-3">
                {reviews.map((rev) => (
                  <div key={rev.id} className="p-3.5 rounded-xl border border-[#27272A] bg-[#161618]">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-slate-200">{rev.reviewerName}</span>
                      <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{rev.rating}</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{rev.comment}</p>
                    <span className="text-[10px] text-slate-500 mt-1 block">
                      {new Date(rev.createdAt).toLocaleDateString('es-EC')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
