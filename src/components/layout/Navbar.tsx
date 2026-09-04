import React, { useState } from 'react';
import {
  Search,
  ShieldCheck,
  User,
  Plus,
  MessageSquare,
  ChevronDown,
  LogOut,
  SlidersHorizontal,
  Briefcase,
  Layers,
  Menu,
  X,
  Compass,
  FileText
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface NavbarProps {
  onOpenAuth: (initialTab?: 'login' | 'register', defaultAccountType?: 'requester' | 'specialist' | 'both') => void;
  onOpenNewRequest: () => void;
  onOpenNewService: () => void;
  onOpenChat: () => void;
  onNavigate: (view: 'home' | 'services' | 'requests' | 'dashboard' | 'specialists') => void;
  currentView: string;
  onOpenProfile: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAuth,
  onOpenNewRequest,
  onOpenNewService,
  onOpenChat,
  onNavigate,
  currentView,
  onOpenProfile
}) => {
  const { currentUser, userProfile, activeMode, switchActiveMode, logout } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleModeToggle = async (mode: 'requester' | 'specialist') => {
    if (activeMode !== mode) {
      await switchActiveMode(mode);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0D0D0E]/95 backdrop-blur-md border-b border-[#27272A]/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* Logo & Brand */}
          <div className="flex items-center gap-8">
            <button
              id="brand-logo-btn"
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2 group text-left focus:outline-none"
            >
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black tracking-tight text-lg shadow-sm group-hover:bg-blue-500 transition-colors">
                AGO
              </div>
              <div className="flex flex-col">
                <span className="text-base font-extrabold text-white tracking-tight leading-none">
                  AGO <span className="text-blue-500 font-semibold text-xs tracking-normal">Marketplace</span>
                </span>
                <span className="text-[10px] text-slate-400 font-medium tracking-wide">Ecuador</span>
              </div>
            </button>

            {/* Primary Nav Links (Desktop) */}
            <nav className="hidden md:flex items-center gap-1">
              <button
                id="nav-explore-services-btn"
                onClick={() => onNavigate('services')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  currentView === 'services'
                    ? 'text-blue-400 bg-blue-500/10'
                    : 'text-slate-300 hover:text-white hover:bg-[#161618]'
                }`}
              >
                Explorar Servicios
              </button>
              <button
                id="nav-explore-requests-btn"
                onClick={() => onNavigate('requests')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  currentView === 'requests'
                    ? 'text-blue-400 bg-blue-500/10'
                    : 'text-slate-300 hover:text-white hover:bg-[#161618]'
                }`}
              >
                Solicitudes de Trabajo
              </button>
            </nav>
          </div>

          {/* Center/Right Actions */}
          <div className="flex items-center gap-3">

            {currentUser ? (
              <>
                {/* Switcher Mode: Solicitante / Especialista */}
                <div className="hidden sm:flex items-center bg-[#161618] p-0.5 rounded-xl border border-[#27272A]">
                  <button
                    id="switch-to-requester-btn"
                    onClick={() => handleModeToggle('requester')}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                      activeMode === 'requester'
                        ? 'bg-[#27272A] text-white shadow-xs'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Modo Solicitante
                  </button>
                  <button
                    id="switch-to-specialist-btn"
                    onClick={() => handleModeToggle('specialist')}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                      activeMode === 'specialist'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Modo Especialista
                  </button>
                </div>

                {/* Main Action Button according to activeMode */}
                {activeMode === 'requester' ? (
                  <button
                    id="new-request-top-btn"
                    onClick={onOpenNewRequest}
                    className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Publicar Solicitud
                  </button>
                ) : (
                  <button
                    id="new-service-top-btn"
                    onClick={onOpenNewService}
                    className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-white text-slate-900 text-xs font-semibold rounded-xl shadow-xs transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Publicar Servicio
                  </button>
                )}

                {/* Dashboard Shortcut */}
                <button
                  id="nav-dashboard-btn"
                  onClick={() => onNavigate('dashboard')}
                  className={`px-3 py-2 text-xs font-semibold rounded-xl border transition-colors ${
                    currentView === 'dashboard'
                      ? 'border-blue-500 text-blue-400 bg-blue-500/10'
                      : 'border-[#27272A] text-slate-300 hover:bg-[#161618] hover:text-white'
                  }`}
                >
                  Mi Panel
                </button>

                {/* Internal Chat Button */}
                <button
                  id="nav-chat-btn"
                  onClick={onOpenChat}
                  title="Mensajería interna de AGO"
                  className="p-2 text-slate-400 hover:text-white hover:bg-[#161618] rounded-xl relative transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                </button>

                {/* User Menu Dropdown */}
                <div className="relative">
                  <button
                    id="user-menu-avatar-btn"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-xl border border-[#27272A] hover:border-slate-600 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-blue-900/60 text-blue-300 flex items-center justify-center font-bold text-xs border border-blue-700/50">
                      {userProfile?.displayName?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span className="hidden lg:inline text-xs font-medium text-slate-200 max-w-[100px] truncate">
                      {userProfile?.displayName?.split(' ')[0] || 'Mi Cuenta'}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-[#161618] rounded-2xl shadow-xl border border-[#27272A] py-1.5 z-50 animate-in fade-in slide-in-from-top-1">
                      <div className="px-3.5 py-2 border-b border-[#27272A]">
                        <p className="text-xs font-bold text-white truncate">{userProfile?.displayName}</p>
                        <p className="text-[11px] text-slate-400 truncate">{userProfile?.email}</p>
                        <div className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-semibold text-blue-400 bg-blue-950/70 border border-blue-800/40 px-2 py-0.5 rounded-md">
                          {activeMode === 'requester' ? 'Modo Solicitante' : 'Modo Especialista'}
                        </div>
                      </div>

                      {/* Mobile Switcher */}
                      <div className="sm:hidden px-3 py-2 border-b border-[#27272A]">
                        <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1">Cambiar Modo</p>
                        <div className="grid grid-cols-2 gap-1">
                          <button
                            onClick={() => { handleModeToggle('requester'); setUserMenuOpen(false); }}
                            className={`px-2 py-1 text-[11px] font-medium rounded-lg ${
                              activeMode === 'requester' ? 'bg-blue-600 text-white' : 'bg-[#27272A] text-slate-300'
                            }`}
                          >
                            Solicitante
                          </button>
                          <button
                            onClick={() => { handleModeToggle('specialist'); setUserMenuOpen(false); }}
                            className={`px-2 py-1 text-[11px] font-medium rounded-lg ${
                              activeMode === 'specialist' ? 'bg-blue-600 text-white' : 'bg-[#27272A] text-slate-300'
                            }`}
                          >
                            Especialista
                          </button>
                        </div>
                      </div>

                      <button
                        id="menu-open-profile-btn"
                        onClick={() => { onOpenProfile(); setUserMenuOpen(false); }}
                        className="w-full text-left px-3.5 py-2 text-xs text-slate-200 hover:bg-[#202024] flex items-center gap-2"
                      >
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        Perfil y Ubicación
                      </button>

                      <button
                        id="menu-open-dashboard-btn"
                        onClick={() => { onNavigate('dashboard'); setUserMenuOpen(false); }}
                        className="w-full text-left px-3.5 py-2 text-xs text-slate-200 hover:bg-[#202024] flex items-center gap-2"
                      >
                        <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                        Panel de Control
                      </button>

                      <div className="border-t border-[#27272A] my-1"></div>

                      <button
                        id="menu-logout-btn"
                        onClick={async () => { setUserMenuOpen(false); await logout(); }}
                        className="w-full text-left px-3.5 py-2 text-xs text-rose-400 hover:bg-rose-950/40 flex items-center gap-2 font-medium"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Cerrar Sesión
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* Logged Out Controls */}
                <button
                  id="login-btn"
                  onClick={() => onOpenAuth('login')}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-[#161618] rounded-xl transition-colors"
                >
                  Ingresar
                </button>
                <button
                  id="register-btn"
                  onClick={() => onOpenAuth('register')}
                  className="px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-xs transition-colors"
                >
                  Registrarse
                </button>
              </>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              id="mobile-nav-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-[#161618]"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-[#27272A] space-y-2 bg-[#0D0D0E]">
            <button
              onClick={() => { onNavigate('services'); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 text-sm font-medium text-slate-300 hover:bg-[#161618] rounded-lg flex items-center gap-2"
            >
              <Compass className="w-4 h-4 text-blue-500" />
              Explorar Servicios
            </button>
            <button
              onClick={() => { onNavigate('requests'); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 text-sm font-medium text-slate-300 hover:bg-[#161618] rounded-lg flex items-center gap-2"
            >
              <FileText className="w-4 h-4 text-blue-500" />
              Solicitudes de Trabajo
            </button>
            {currentUser ? (
              <div className="pt-2 border-t border-[#27272A] space-y-2">
                <button
                  onClick={() => { onNavigate('dashboard'); setMobileMenuOpen(false); }}
                  className="w-full text-left px-3 py-2 text-sm font-medium text-blue-400 bg-blue-500/10 rounded-lg"
                >
                  Ir a Mi Panel
                </button>
                {activeMode === 'requester' ? (
                  <button
                    onClick={() => { onOpenNewRequest(); setMobileMenuOpen(false); }}
                    className="w-full text-left px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg"
                  >
                    + Publicar Solicitud
                  </button>
                ) : (
                  <button
                    onClick={() => { onOpenNewService(); setMobileMenuOpen(false); }}
                    className="w-full text-left px-3 py-2 text-sm font-medium text-slate-900 bg-slate-100 rounded-lg"
                  >
                    + Publicar Servicio
                  </button>
                )}
              </div>
            ) : (
              <div className="pt-2 border-t border-[#27272A] flex gap-2">
                <button
                  onClick={() => { onOpenAuth('login'); setMobileMenuOpen(false); }}
                  className="flex-1 py-2 text-center text-xs font-semibold bg-[#161618] border border-[#27272A] rounded-lg text-slate-200"
                >
                  Ingresar
                </button>
                <button
                  onClick={() => { onOpenAuth('register'); setMobileMenuOpen(false); }}
                  className="flex-1 py-2 text-center text-xs font-semibold bg-blue-600 rounded-lg text-white"
                >
                  Crear Cuenta
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </header>
  );
};
