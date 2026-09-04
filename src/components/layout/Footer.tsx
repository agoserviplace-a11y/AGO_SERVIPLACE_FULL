import React from 'react';
import { ShieldCheck, MapPin, CheckCircle, Lock, HeartHandshake } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: 'home' | 'services' | 'requests' | 'dashboard' | 'specialists') => void;
  onOpenAuth: (initialTab?: 'login' | 'register', defaultAccountType?: 'requester' | 'specialist' | 'both') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenAuth }) => {
  return (
    <footer className="bg-[#0A0A0B] text-slate-400 border-t border-[#27272A] mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* Col 1: Brand & Promise */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black tracking-tight text-base">
                AGO
              </div>
              <span className="text-lg font-extrabold text-white tracking-tight">
                AGO <span className="text-blue-500 font-semibold text-xs">Marketplace</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Plataforma tecnológica integral de contratación de servicios profesionales y especializados. Conectamos talento verificado con solicitantes en todo el Ecuador bajo un ciclo seguro de trabajo.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-2">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Especialistas Verificados</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-blue-400" />
                <span>Trazabilidad Segura</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-amber-400" />
                <span>Ecuador (USD)</span>
              </div>
            </div>
          </div>

          {/* Col 2: Para Solicitantes */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Para Solicitantes</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('services')}
                  className="hover:text-white transition-colors text-slate-400 text-left"
                >
                  Buscar Especialistas
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenAuth('register', 'requester')}
                  className="hover:text-white transition-colors text-slate-400 text-left"
                >
                  Publicar una Solicitud
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-white transition-colors text-slate-400 text-left"
                >
                  Cómo Contratar Seguro
                </button>
              </li>
              <li>
                <span className="text-slate-500 text-xs">Garantía de cumplimiento</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Para Especialistas */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Para Especialistas</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => onOpenAuth('register', 'specialist')}
                  className="hover:text-white transition-colors text-slate-400 text-left"
                >
                  Ofrecer Mis Servicios
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('requests')}
                  className="hover:text-white transition-colors text-slate-400 text-left"
                >
                  Explorar Solicitudes
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-white transition-colors text-slate-400 text-left"
                >
                  Comisiones y Pagos
                </button>
              </li>
              <li>
                <span className="text-slate-500 text-xs">Reputación y Reseñas</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Cobertura Ecuador */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Cobertura Inicial</h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Servicios presenciales en las principales provincias y remotos a nivel nacional:
            </p>
            <div className="flex flex-wrap gap-1.5 text-[11px]">
              <span className="px-2 py-0.5 rounded-md bg-[#161618] border border-[#27272A] text-slate-300">Quito</span>
              <span className="px-2 py-0.5 rounded-md bg-[#161618] border border-[#27272A] text-slate-300">Guayaquil</span>
              <span className="px-2 py-0.5 rounded-md bg-[#161618] border border-[#27272A] text-slate-300">Cuenca</span>
              <span className="px-2 py-0.5 rounded-md bg-[#161618] border border-[#27272A] text-slate-300">Ambato</span>
              <span className="px-2 py-0.5 rounded-md bg-[#161618] border border-[#27272A] text-slate-300">Manta</span>
              <span className="px-2 py-0.5 rounded-md bg-[#161618] border border-[#27272A] text-slate-300">Machala</span>
              <span className="px-2 py-0.5 rounded-md bg-[#161618] border border-[#27272A] text-slate-300">100% Remoto</span>
            </div>
          </div>

        </div>

        <div className="border-t border-[#27272A] mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} AGO Marketplace. Todos los derechos reservados.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-300 cursor-pointer">Privacidad de Datos</span>
            <span className="hover:text-slate-300 cursor-pointer">Términos del Servicio</span>
            <span className="hover:text-slate-300 cursor-pointer">Seguridad Transaccional</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
