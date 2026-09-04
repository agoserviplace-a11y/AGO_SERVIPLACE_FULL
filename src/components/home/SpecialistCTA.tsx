import React from 'react';
import { Briefcase, CheckCircle, ArrowRight, ShieldCheck, DollarSign, TrendingUp } from 'lucide-react';

interface SpecialistCTAProps {
  onOpenRegister: () => void;
}

export const SpecialistCTA: React.FC<SpecialistCTAProps> = ({ onOpenRegister }) => {
  return (
    <section className="py-16 bg-[#0A0A0B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-[#27272A] bg-[#0D0D0E] text-white p-8 sm:p-12 overflow-hidden relative shadow-2xl">

          {/* Background subtle effect */}
          <div className="absolute right-0 top-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center relative z-10">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
                <Briefcase className="w-3.5 h-3.5" />
                <span>Para Profesionales y Técnicos en Ecuador</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                Haz crecer tus ingresos ofreciendo tus servicios en AGO
              </h2>

              <p className="text-sm text-slate-400 leading-relaxed max-w-lg">
                Conéctate con solicitantes que buscan activamente contratar servicios en tu especialidad y ciudad. Olvídate de perseguir pagos o regalar presupuestos sin respuesta.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Sin costo de inscripción</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Pagos en USD garantizados</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Perfil público profesional</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Trazabilidad de cada trabajo</span>
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <button
                  onClick={onOpenRegister}
                  className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
                >
                  <span>Registrarme como Especialista</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Visual highlight box */}
            <div className="bg-[#161618] border border-[#27272A] rounded-2xl p-6 space-y-4 shadow-xl">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-400" />
                <span>¿Por qué elegir AGO Marketplace?</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-xl bg-[#0D0D0E] border border-[#27272A]">
                  <p className="font-semibold text-white mb-1">Control Total de tus Tarifas</p>
                  <p className="text-slate-400 leading-relaxed">Tú defines si ofreces paquetes a precio fijo o envías cotizaciones personalizadas por cada solicitud recibida.</p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#0D0D0E] border border-[#27272A]">
                  <p className="font-semibold text-white mb-1">Billetera y Ledger Transparente</p>
                  <p className="text-slate-400 leading-relaxed">Revisa tus ingresos brutos, comisión transparente de AGO y saldos acumulados de forma clara en cada proyecto completado.</p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#0D0D0E] border border-[#27272A]">
                  <p className="font-semibold text-white mb-1">Construye tu Reputación en Ecuador</p>
                  <p className="text-slate-400 leading-relaxed">Recibe evaluaciones y reseñas auténticas únicamente de clientes que hayan contratado y concluido trabajos contigo.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
