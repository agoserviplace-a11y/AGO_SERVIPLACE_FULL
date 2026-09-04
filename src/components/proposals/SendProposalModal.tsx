import React, { useState } from 'react';
import { X, Send, DollarSign, Clock, ShieldCheck, AlertCircle, Check } from 'lucide-react';
import { ServiceRequest } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { dbService } from '../../lib/dbService';
import { PLATFORM_SETTINGS } from '../../lib/constants';

interface SendProposalModalProps {
  request: ServiceRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onProposalSent: () => void;
}

export const SendProposalModal: React.FC<SendProposalModalProps> = ({
  request,
  isOpen,
  onClose,
  onProposalSent
}) => {
  const { currentUser, specialistProfile, userProfile } = useAuth();

  const [price, setPrice] = useState<number>(request?.budgetMin || 50);
  const [deliveryDays, setDeliveryDays] = useState<number>(3);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen || !request) return null;

  // Calculate platform fee and net earnings preview
  const commissionPercentage = PLATFORM_SETTINGS.commissionPercentage / 100;
  const platformFee = Math.max(PLATFORM_SETTINGS.minimumCommission, price * commissionPercentage);
  const netEarnings = Math.max(0, price - platformFee);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setErrorMsg(null);
    setLoading(true);

    try {
      if (!message.trim()) {
        throw new Error('Por favor escribe un mensaje explicativo para el cliente.');
      }

      await dbService.createProposal({
        requestId: request.id,
        specialistId: currentUser.uid,
        specialistName: specialistProfile?.professionalName || userProfile?.displayName || 'Especialista',
        price: Number(price),
        estimatedDelivery: `${deliveryDays} días`,
        deliveryDays: Number(deliveryDays),
        message
      });

      setSuccess(true);
      onProposalSent();
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 1000);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Error al enviar la propuesta.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#0D0D0E] rounded-3xl shadow-2xl border border-[#27272A] text-slate-200 w-full max-w-lg my-8 overflow-hidden animate-in fade-in zoom-in-95">

        <div className="p-6 pb-4 border-b border-[#27272A] flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white">Enviar Propuesta de Trabajo</h2>
            <p className="text-xs text-slate-400 truncate max-w-sm">{request.title}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#161618]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400 text-xs flex items-center gap-2 border border-rose-500/30">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {success && (
            <div className="p-3 bg-emerald-500/10 text-emerald-400 text-xs font-semibold rounded-xl flex items-center gap-2 border border-emerald-500/30">
              <Check className="w-4 h-4" />
              <span>¡Propuesta enviada con éxito al Solicitante!</span>
            </div>
          )}

          {/* Request summary badge */}
          <div className="p-3.5 rounded-2xl bg-[#161618] border border-[#27272A] text-xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
              Presupuesto referencial del Solicitante:
            </span>
            <div className="font-extrabold text-white">
              ${request.budgetMin} - ${request.budgetMax} USD
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Tu Precio Total ($ USD)
              </label>
              <div className="relative">
                <DollarSign className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                <input
                  type="number"
                  min={5}
                  required
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full text-xs pl-8 pr-3 py-2.5 rounded-xl border border-[#27272A] bg-[#161618] text-white focus:outline-none focus:border-blue-500 font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Tiempo de Entrega (Días)
              </label>
              <div className="relative">
                <Clock className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                <input
                  type="number"
                  min={1}
                  required
                  value={deliveryDays}
                  onChange={(e) => setDeliveryDays(Number(e.target.value))}
                  className="w-full text-xs pl-8 pr-3 py-2.5 rounded-xl border border-[#27272A] bg-[#161618] text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Net Earnings Transparency Box (Section 7 Platform Settings) */}
          <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-xs space-y-1">
            <div className="flex justify-between text-slate-300 text-[11px]">
              <span>Precio ofertado al cliente:</span>
              <span className="font-semibold text-white">${price.toFixed(2)} USD</span>
            </div>
            <div className="flex justify-between text-slate-400 text-[11px]">
              <span>Comisión de servicio AGO ({PLATFORM_SETTINGS.commissionPercentage}%):</span>
              <span className="font-semibold text-slate-400">-${platformFee.toFixed(2)} USD</span>
            </div>
            <div className="flex justify-between text-white font-bold pt-1 border-t border-blue-500/30">
              <span>Recibirás en tu saldo neto:</span>
              <span className="text-blue-400 text-sm font-extrabold">${netEarnings.toFixed(2)} USD</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Mensaje y Propuesta Técnica
            </label>
            <textarea
              rows={4}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Explica detalladamente qué incluye tu trabajo, cómo lo vas a ejecutar y tu disponibilidad inmediata..."
              className="w-full text-xs p-3 rounded-xl border border-[#27272A] bg-[#161618] text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="pt-3 border-t border-[#27272A] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white hover:bg-[#161618] rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-xs disabled:opacity-50 flex items-center gap-1.5 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              {loading ? 'Enviando...' : 'Enviar Propuesta'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
