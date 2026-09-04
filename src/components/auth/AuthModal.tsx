import React, { useState } from 'react';
import { X, Mail, Lock, User, Check, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { AccountType } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'login' | 'register';
  defaultAccountType?: AccountType;
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'login',
  defaultAccountType = 'both',
  onSuccess
}) => {
  const { loginWithEmail, registerWithEmail, loginWithGoogle, resetPassword } = useAuth();

  const [tab, setTab] = useState<'login' | 'register' | 'forgot'>(initialTab);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [accountType, setAccountType] = useState<AccountType>(defaultAccountType);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (tab === 'login') {
        await loginWithEmail(email, password);
        if (onSuccess) onSuccess();
        onClose();
      } else if (tab === 'register') {
        if (!displayName.trim()) {
          throw new Error('Por favor ingresa tu nombre completo.');
        }
        if (password.length < 6) {
          throw new Error('La contraseña debe tener al menos 6 caracteres.');
        }
        await registerWithEmail(email, password, displayName, accountType);
        if (onSuccess) onSuccess();
        onClose();
      } else if (tab === 'forgot') {
        await resetPassword(email);
        setSuccessMsg('Hemos enviado un enlace de recuperación a tu correo electrónico.');
      }
    } catch (err: any) {
      console.error(err);
      let message = 'Ocurrió un error. Por favor verifica tus datos.';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        message = 'Correo o contraseña incorrectos.';
      } else if (err.code === 'auth/email-already-in-use') {
        message = 'Este correo electrónico ya está registrado en AGO.';
      } else if (err.message) {
        message = err.message;
      }
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMsg(null);
    setLoading(true);
    try {
      await loginWithGoogle(accountType);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      console.error(err);
      setErrorMsg('No se pudo completar el acceso con Google. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-[#0D0D0E] rounded-3xl shadow-2xl border border-[#27272A] text-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95">

        {/* Modal Header */}
        <div className="p-6 pb-4 border-b border-[#27272A] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-sm">
              AGO
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {tab === 'login' ? 'Iniciar Sesión en AGO' : tab === 'register' ? 'Crear Cuenta en AGO' : 'Recuperar Contraseña'}
              </h2>
              <p className="text-xs text-slate-400">Marketplace de Servicios en Ecuador</p>
            </div>
          </div>

          <button
            id="auth-modal-close-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#161618] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">

          {/* Error / Success alerts */}
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-start gap-2">
              <Check className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Quick Google Action */}
          {tab !== 'forgot' && (
            <>
              <button
                id="google-auth-btn"
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-xl border border-[#27272A] bg-[#161618] hover:bg-[#202024] text-slate-200 font-semibold text-xs flex items-center justify-center gap-2.5 transition-colors mb-4 disabled:opacity-50"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24Z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.04 0 12s.45 3.82 1.25 5.42l4.03-3.15Z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98Z"
                  />
                </svg>
                <span>Continuar con Google</span>
              </button>

              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-[#27272A]" />
                <span className="text-[11px] text-slate-500 uppercase font-medium">o con correo</span>
                <div className="flex-1 h-px bg-[#27272A]" />
              </div>
            </>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Display name (only on register) */}
            {tab === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nombre Completo o Empresa
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    id="register-name-input"
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Ej: Sofía Paredes"
                    className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-[#27272A] bg-[#161618] text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>
            )}

            {/* Role Preference Selector (Section 11 requirement) */}
            {tab === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  ¿Qué quieres hacer en AGO?
                </label>
                <div className="space-y-2">
                  <label
                    className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all ${
                      accountType === 'requester'
                        ? 'border-blue-500 bg-blue-500/15 text-white'
                        : 'border-[#27272A] bg-[#161618]/60 hover:border-[#3F3F46] text-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="accountType"
                      checked={accountType === 'requester'}
                      onChange={() => setAccountType('requester')}
                      className="mt-0.5 text-blue-500 focus:ring-0"
                    />
                    <div>
                      <p className="text-xs font-bold text-white">Necesito contratar un servicio</p>
                      <p className="text-[11px] text-slate-400">Publica requerimientos y contrata Especialistas verificados.</p>
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all ${
                      accountType === 'specialist'
                        ? 'border-blue-500 bg-blue-500/15 text-white'
                        : 'border-[#27272A] bg-[#161618]/60 hover:border-[#3F3F46] text-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="accountType"
                      checked={accountType === 'specialist'}
                      onChange={() => setAccountType('specialist')}
                      className="mt-0.5 text-blue-500 focus:ring-0"
                    />
                    <div>
                      <p className="text-xs font-bold text-white">Quiero ofrecer mis servicios</p>
                      <p className="text-[11px] text-slate-400">Crea tu perfil profesional, publica servicios y envía cotizaciones.</p>
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all ${
                      accountType === 'both'
                        ? 'border-blue-500 bg-blue-500/15 text-white'
                        : 'border-[#27272A] bg-[#161618]/60 hover:border-[#3F3F46] text-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="accountType"
                      checked={accountType === 'both'}
                      onChange={() => setAccountType('both')}
                      className="mt-0.5 text-blue-500 focus:ring-0"
                    />
                    <div>
                      <p className="text-xs font-bold text-white">Ambos (Solicitante y Especialista)</p>
                      <p className="text-[11px] text-slate-400">Acceso a los dos modos desde una misma cuenta.</p>
                    </div>
                  </label>
                </div>
                <p className="text-[10px] text-slate-500 mt-1.5">
                  * Podrás alternar entre Modo Solicitante y Modo Especialista en cualquier momento con un solo clic.
                </p>
              </div>
            )}

            {/* Email input */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  id="auth-email-input"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ejemplo@correo.com"
                  className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-[#27272A] bg-[#161618] text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            {/* Password input (not on forgot) */}
            {tab !== 'forgot' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-300">
                    Contraseña
                  </label>
                  {tab === 'login' && (
                    <button
                      type="button"
                      onClick={() => setTab('forgot')}
                      className="text-[11px] text-blue-400 hover:text-blue-300 font-medium"
                    >
                      ¿Olvidaste tu clave?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    id="auth-password-input"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-[#27272A] bg-[#161618] text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              id="auth-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
            >
              {loading ? (
                <span>Procesando...</span>
              ) : tab === 'login' ? (
                <>
                  <span>Ingresar a AGO</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              ) : tab === 'register' ? (
                <>
                  <span>Registrar mi Cuenta</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              ) : (
                <span>Enviar Instrucciones de Recuperación</span>
              )}
            </button>
          </form>

          {/* Switch Tab Links */}
          <div className="mt-6 pt-4 border-t border-[#27272A] text-center text-xs text-slate-400">
            {tab === 'login' ? (
              <p>
                ¿Aún no tienes cuenta en AGO?{' '}
                <button
                  onClick={() => { setTab('register'); setErrorMsg(null); }}
                  className="font-bold text-blue-400 hover:text-blue-300 hover:underline"
                >
                  Regístrate aquí
                </button>
              </p>
            ) : (
              <p>
                ¿Ya tienes una cuenta?{' '}
                <button
                  onClick={() => { setTab('login'); setErrorMsg(null); }}
                  className="font-bold text-blue-400 hover:text-blue-300 hover:underline"
                >
                  Inicia sesión aquí
                </button>
              </p>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
