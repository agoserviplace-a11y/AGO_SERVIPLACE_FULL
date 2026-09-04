import React, { useState } from 'react';
import {
  X,
  Star,
  MapPin,
  Clock,
  CheckCircle,
  ShieldCheck,
  MessageSquare,
  Send,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { Service } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { dbService } from '../../lib/dbService';

interface ServiceDetailModalProps {
  service: Service | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenChat: (specialistId: string, specialistName: string) => void;
  onServiceHired?: (service: Service) => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  service,
  isOpen,
  onClose,
  onOpenChat,
  onServiceHired
}) => {
  const { currentUser, userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'details' | 'hire'>('details');
  const [requestDetails, setRequestDetails] = useState('');
  const [deadline, setDeadline] = useState('En 7 días');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  if (!isOpen || !service) return null;

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setIsSubmitting(true);
    try {
      // 1. Create a service request linked to this service
      const reqId = await dbService.createServiceRequest({
        requesterId: currentUser.uid,
        requesterName: userProfile?.displayName || 'Solicitante',
        title: `Contratación: ${service.title}`,
        description: requestDetails || `Contratación del servicio "${service.title}" según términos publicados.`,
        categoryId: service.categoryId,
        subcategoryId: service.subcategoryId,
        categoryName: service.categoryName,
        budgetMin: service.basePrice || service.priceFrom,
        budgetMax: service.basePrice || service.priceFrom,
        location: service.location || 'Quito / Remoto',
        remote: service.locationType === 'remote',
        deadline: deadline,
        status: 'published'
      });

      // 2. Automatically generate proposal from the specialist
      const propId = await dbService.createProposal({
        requestId: reqId,
        specialistId: service.specialistId,
        specialistName: service.specialistName,
        price: service.basePrice || service.priceFrom,
        estimatedDelivery: service.deliveryDays ? `${service.deliveryDays} días` : service.estimatedDuration || '7 días',
        deliveryDays: service.deliveryDays || 7,
        message: 'Acepto la solicitud con las condiciones y alcance publicados en mi servicio.'
      });

      setSubmitSuccess(true);
      if (onServiceHired) {
        onServiceHired(service);
      }
      setTimeout(() => {
        onClose();
        setActiveTab('details');
        setSubmitSuccess(false);
      }, 1200);
    } catch (err) {
      console.error('Error hiring service:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#0D0D0E] rounded-3xl shadow-2xl border border-[#27272A] text-slate-200 w-full max-w-3xl my-8 overflow-hidden animate-in fade-in zoom-in-95 max-h-[92vh] flex flex-col">

        {/* Header */}
        <div className="p-5 border-b border-[#27272A] flex items-center justify-between shrink-0 bg-[#161618]/50">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
              {service.categoryName || 'Servicio Profesional'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#161618] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">

          {/* Hero image */}
          {service.images && service.images.length > 0 && (
            <div className="relative h-64 sm:h-72 rounded-2xl overflow-hidden bg-[#161618] border border-[#27272A]">
              <img
                src={service.images[0]}
                alt={service.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-3 left-3 bg-[#0D0D0E]/80 backdrop-blur-md border border-white/10 text-white text-xs font-semibold px-3 py-1 rounded-lg">
                {service.locationType === 'remote' ? '100% Remoto' : service.location || 'Presencial'}
              </div>
            </div>
          )}

          {/* Service Title and Specialist info */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#27272A]">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
                {service.title}
              </h2>

              <div className="flex items-center gap-3 mt-3 text-xs text-slate-400">
                <span className="font-semibold text-slate-200">{service.specialistName}</span>
                <span className="text-slate-600">•</span>
                <div className="flex items-center gap-1 text-amber-400 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{service.specialistRating || 5.0}</span>
                </div>
                <span className="text-slate-600">•</span>
                <div className="flex items-center gap-1 text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Entrega: {service.deliveryDays ? `${service.deliveryDays} días` : service.estimatedDuration}</span>
                </div>
              </div>
            </div>

            {/* Price badge */}
            <div className="text-right sm:min-w-[150px] p-3.5 bg-[#161618] rounded-2xl border border-[#27272A]">
              <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                {service.pricingType === 'from' ? 'Precio Desde' : 'Tarifa Fija'}
              </span>
              <span className="text-2xl font-black text-white">
                ${service.basePrice || service.priceFrom}{' '}
                <span className="text-xs font-normal text-slate-400">USD</span>
              </span>
            </div>
          </div>

          {activeTab === 'details' ? (
            <div className="space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Descripción del Servicio
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                  {service.description}
                </p>
              </div>

              {/* Requirements */}
              {service.requirements && (
                <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-xs">
                  <h4 className="font-bold text-blue-300 mb-1">Requisitos para el inicio:</h4>
                  <p className="text-blue-200/80 leading-relaxed">{service.requirements}</p>
                </div>
              )}

              {/* Tags */}
              {service.tags && service.tags.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Etiquetas
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {service.tags.map((t, idx) => (
                      <span key={idx} className="text-xs px-2.5 py-1 rounded-lg bg-[#161618] border border-[#27272A] text-slate-300 font-medium">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-4 border-t border-[#27272A] flex flex-col sm:flex-row items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    onOpenChat(service.specialistId, service.specialistName);
                    onClose();
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 bg-[#161618] hover:bg-[#27272A] text-slate-200 border border-[#27272A] text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  Hacer una Pregunta
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (!currentUser) {
                      alert('Por favor inicia sesión o crea tu cuenta para contratar este servicio.');
                      return;
                    }
                    setActiveTab('hire');
                  }}
                  className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  Solicitar Contratación (${service.basePrice || service.priceFrom} USD)
                </button>
              </div>
            </div>
          ) : (
            /* Hiring Confirmation Screen */
            <form onSubmit={handleCreateOrder} className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#161618] border border-[#27272A]">
                <h4 className="text-xs font-bold text-white mb-1">Confirmar Requerimiento de Servicio</h4>
                <p className="text-xs text-slate-400">
                  Se generará una orden directa con el Especialista <strong className="text-slate-200">{service.specialistName}</strong> bajo la garantía de AGO Marketplace.
                </p>
              </div>

              {submitSuccess && (
                <div className="p-3 bg-emerald-500/10 text-emerald-400 text-xs font-semibold rounded-xl border border-emerald-500/30">
                  ¡Solicitud y orden creadas exitosamente! Redirigiendo a tu panel...
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Indicaciones específicas para el Especialista (opcional)
                </label>
                <textarea
                  rows={3}
                  value={requestDetails}
                  onChange={(e) => setRequestDetails(e.target.value)}
                  placeholder="Explica cualquier detalle específico sobre tus tiempos o requerimientos..."
                  className="w-full text-xs p-3 rounded-xl border border-[#27272A] bg-[#161618] text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Fecha o plazo deseado
                </label>
                <input
                  type="text"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  placeholder="Ej: Lo necesito en 7 días"
                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-[#27272A] bg-[#161618] text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  Protección AGO: El monto acordado se custodia en el ciclo de trabajo y solo se concluye cuando confirmes la satisfacción de la entrega.
                </span>
              </div>

              <div className="pt-3 border-t border-[#27272A] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('details')}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white hover:bg-[#161618] rounded-xl transition-colors"
                >
                  Volver a detalles
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-xs disabled:opacity-50 transition-colors"
                >
                  {isSubmitting ? 'Procesando...' : 'Confirmar y Contratar'}
                </button>
              </div>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
