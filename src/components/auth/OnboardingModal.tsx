import React, { useState } from 'react';
import { X, User, MapPin, Phone, Briefcase, Check, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ECUADOR_PROVINCES } from '../../lib/constants';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
  const { userProfile, specialistProfile, updateUserProfileData, updateSpecialistProfileData } = useAuth();

  const [displayName, setDisplayName] = useState(userProfile?.displayName || '');
  const [phone, setPhone] = useState(userProfile?.phone || '');
  const [province, setProvince] = useState(userProfile?.province || 'Pichincha');
  const [city, setCity] = useState(userProfile?.city || 'Quito');
  const [bio, setBio] = useState(userProfile?.bio || '');

  // Specialist fields
  const [headline, setHeadline] = useState(specialistProfile?.headline || '');
  const [description, setDescription] = useState(specialistProfile?.description || '');
  const [experienceYears, setExperienceYears] = useState(specialistProfile?.experienceYears || 2);
  const [hourlyRate, setHourlyRate] = useState(specialistProfile?.hourlyRate || 25);
  const [remoteAvailable, setRemoteAvailable] = useState(specialistProfile?.remoteAvailable ?? true);
  const [skillsInput, setSkillsInput] = useState(specialistProfile?.skills?.join(', ') || '');

  const [loading, setLoading] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const currentCities = ECUADOR_PROVINCES.find(p => p.name === province)?.cities || [];

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSavedSuccess(false);

    try {
      // 1. Update Base User Profile
      await updateUserProfileData({
        displayName,
        phone,
        province,
        city,
        bio
      });

      // 2. If specialist profile exists or in specialist mode, update specialist doc
      if (specialistProfile) {
        const skillsArray = skillsInput
          .split(',')
          .map(s => s.trim())
          .filter(Boolean);

        await updateSpecialistProfileData({
          professionalName: displayName,
          headline: headline || 'Especialista profesional en AGO',
          description: description || bio,
          experienceYears: Number(experienceYears),
          hourlyRate: Number(hourlyRate),
          location: `${city}, ${province}`,
          province,
          city,
          remoteAvailable,
          skills: skillsArray
        });
      }

      setSavedSuccess(true);
      setTimeout(() => {
        onClose();
      }, 800);
    } catch (err) {
      console.error('Error saving profile:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#0D0D0E] rounded-3xl shadow-2xl border border-[#27272A] text-slate-200 w-full max-w-xl my-8 overflow-hidden animate-in fade-in zoom-in-95">

        <div className="p-6 pb-4 border-b border-[#27272A] flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white">Configuración de Perfil</h2>
            <p className="text-xs text-slate-400">Completa tus datos de contacto y ubicación en Ecuador</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#161618] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-5">
          {savedSuccess && (
            <div className="p-3 bg-emerald-500/10 text-emerald-400 text-xs font-semibold rounded-xl flex items-center gap-2 border border-emerald-500/30">
              <Check className="w-4 h-4" />
              <span>Cambios guardados con éxito.</span>
            </div>
          )}

          {/* Section: General */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Datos Generales</h3>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Nombre o Razón Social</label>
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full text-xs px-3 py-2.5 rounded-xl border border-[#27272A] bg-[#161618] text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Teléfono Móvil (Ecuador)</label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="tel"
                    placeholder="099 123 4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-[#27272A] bg-[#161618] text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Provincia</label>
                <select
                  value={province}
                  onChange={(e) => {
                    setProvince(e.target.value);
                    const matched = ECUADOR_PROVINCES.find(p => p.name === e.target.value);
                    if (matched && matched.cities.length > 0) {
                      setCity(matched.cities[0]);
                    }
                  }}
                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-[#27272A] focus:outline-none focus:border-blue-500 bg-[#161618] text-white"
                >
                  {ECUADOR_PROVINCES.map((p) => (
                    <option key={p.name} value={p.name} className="bg-[#161618] text-white">{p.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Ciudad o Cantón</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-[#27272A] focus:outline-none focus:border-blue-500 bg-[#161618] text-white"
                >
                  {currentCities.map((c) => (
                    <option key={c} value={c} className="bg-[#161618] text-white">{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">País</label>
                <input
                  type="text"
                  disabled
                  value="Ecuador (USD)"
                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-[#27272A] bg-[#161618] text-slate-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Biografía Breve</label>
              <textarea
                rows={2}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Cuéntanos un poco sobre ti o tu empresa..."
                className="w-full text-xs p-3 rounded-xl border border-[#27272A] bg-[#161618] text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Section: Specialist specific */}
          {specialistProfile && (
            <div className="space-y-3 pt-3 border-t border-[#27272A]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400">
                Detalles Profesionales de Especialista
              </h3>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Titular Profesional</label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="Ej: Ingeniero Eléctrico Residencial o Diseñador UI/UX"
                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-[#27272A] bg-[#161618] text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Años de Experiencia</label>
                  <input
                    type="number"
                    min={0}
                    max={50}
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(Number(e.target.value))}
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-[#27272A] bg-[#161618] text-white focus:outline-none focus:border-blue-500 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Tarifa Referencial por Hora ($ USD)</label>
                  <input
                    type="number"
                    min={5}
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(Number(e.target.value))}
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-[#27272A] bg-[#161618] text-white focus:outline-none focus:border-blue-500 font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Habilidades Principales (separadas por coma)
                </label>
                <input
                  type="text"
                  value={skillsInput}
                  onChange={(e) => setSkillsInput(e.target.value)}
                  placeholder="Ej: Cableado, Breakers, Tableros, Iluminación LED"
                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-[#27272A] bg-[#161618] text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="remoteAvailableCheckbox"
                  checked={remoteAvailable}
                  onChange={(e) => setRemoteAvailable(e.target.checked)}
                  className="rounded text-blue-500 focus:ring-0 bg-[#161618] border-[#27272A]"
                />
                <label htmlFor="remoteAvailableCheckbox" className="text-xs text-slate-300 font-medium cursor-pointer">
                  Disponible para trabajos remotos a nivel nacional
                </label>
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-[#27272A] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-slate-400 hover:text-white hover:bg-[#161618] rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-xs disabled:opacity-50 transition-colors"
            >
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
