import React from 'react';
import {
  Compass,
  FileQuestion,
  Receipt,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  Star,
  ArrowRight
} from 'lucide-react';

interface HowItWorksProps {
  onOpenNewRequest: () => void;
  onNavigate: (view: 'home' | 'services' | 'requests' | 'dashboard' | 'specialists') => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onOpenNewRequest, onNavigate }) => {
  const steps = [
    {
      num: '01',
      title: 'Descubrir o Solicitar',
      desc: 'Explora servicios publicados por Especialistas verificados o publica tu necesidad indicando presupuesto y ubicación.',
      icon: <Compass className="w-5 h-5 text-blue-600" />
    },
    {
      num: '02',
      title: 'Cotizar y Comparar',
      desc: 'Recibe propuestas formales con precio en USD y tiempo de entrega. Compara perfiles y valoraciones reales.',
      icon: <Receipt className="w-5 h-5 text-purple-600" />
    },
    {
      num: '03',
      title: 'Acuerdo & Mensajería',
      desc: 'Comunícate de forma segura mediante la mensajería interna de AGO sin exponer tus datos personales ni depender de chats externos.',
      icon: <MessageSquare className="w-5 h-5 text-indigo-600" />
    },
    {
      num: '04',
      title: 'Contratar y Ejecutar',
      desc: 'Al aceptar la propuesta se genera un contrato de trabajo con trazabilidad paso a paso: asignación, avance y entrega.',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-600" />
    },
    {
      num: '05',
      title: 'Entrega y Calificación',
      desc: 'Revisas el trabajo finalizado, se liberan los fondos acordados y ambas partes dejan una calificación para construir reputación.',
      icon: <Star className="w-5 h-5 text-amber-500" />
    }
  ];

  return (
    <section className="py-16 bg-[#0A0A0B] border-b border-[#27272A]/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-500 mb-1 block">
            Ciclo Integral Seguro
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            ¿Cómo Funciona AGO Marketplace?
          </h2>
          <p className="text-sm text-slate-400 mt-2 leading-relaxed">
            Todo el proceso de contratación ocurre dentro de la plataforma, protegiendo tanto al Solicitante como al Especialista.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-12">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="bg-[#0D0D0E] rounded-2xl border border-[#27272A] p-5 flex flex-col justify-between hover:border-blue-500/50 hover:bg-[#161618] transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#161618] border border-[#27272A] flex items-center justify-center">
                    {step.icon}
                  </div>
                  <span className="text-xs font-black text-slate-600">
                    {step.num}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Callout box */}
        <div className="bg-[#0D0D0E] text-white rounded-2xl border border-[#27272A] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-lg font-bold text-white">¿Tienes un proyecto o arreglo pendiente?</h3>
            <p className="text-xs text-slate-400">
              Publica tu solicitud en menos de 2 minutos y recibe cotizaciones de Especialistas en tu ciudad.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenNewRequest}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors whitespace-nowrap"
            >
              Publicar una Solicitud
            </button>
            <button
              onClick={() => onNavigate('services')}
              className="px-5 py-2.5 bg-[#161618] hover:bg-[#202024] text-slate-200 text-xs font-semibold rounded-xl border border-[#27272A] transition-colors whitespace-nowrap"
            >
              Ver Servicios
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
