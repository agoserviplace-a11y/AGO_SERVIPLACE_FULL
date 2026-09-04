import React, { useState } from 'react';
import { X, Plus, MapPin, DollarSign, Calendar, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { dbService } from '../../lib/dbService';
import { ECUADOR_PROVINCES, INITIAL_CATEGORIES } from '../../lib/constants';

interface NewRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export const NewRequestModal: React.FC<NewRequestModalProps> = ({ isOpen, onClose, onCreated }) => {
  const { currentUser, userProfile } = useAuth();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('tecnologia');
  const [subcategoryId, setSubcategoryId] = useState('');
  const [budgetMin, setBudgetMin] = useState(50);
  const [budgetMax, setBudgetMax] = useState(200);
  const [province, setProvince] = useState(userProfile?.province || 'Pichincha');
  const [city, setCity] = useState(userProfile?.city || 'Quito');
  const [remote, setRemote] = useState(true);
  const [deadline, setDeadline] = useState('En los próximos 7 días');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentCategory = INITIAL_CATEGORIES.find(c => c.id === categoryId);
  const currentCities = ECUADOR_PROVINCES.find(p => p.name === province)?.cities || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setErrorMsg(null);
    setLoading(true);

    try {
      if (!title.trim() || !description.trim()) {
        throw new Error('Por favor completa el título y la descripción del requerimiento.');
      }

      await dbService.createServiceRequest({
        requesterId: currentUser.uid,
        requesterName: userProfile?.displayName || 'Solicitante',
        title,
        description,
        categoryId,
        subcategoryId: subcategoryId || (currentCategory?.subcategories[0]?.id || ''),
        categoryName: currentCategory?.name || 'Servicios Generales',
        budgetMin: Number(budgetMin),
        budgetMax: Number(budgetMax),
        location: remote ? 'Remoto / Nivel Nacional' : `${city}, ${province}`,
        remote,
        deadline,
        status: 'published'
      });

      onCreated();
      onClose();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Error al publicar la solicitud.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#0D0D0E] rounded-3xl shadow-2xl border border-[#27272A] text-slate-200 w-full max-w-xl my-8 overflow-hidden animate-in fade-in zoom-in-95">

        <div className="p-6 pb-4 border-b border-[#27272A] flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white">Publicar una Solicitud de Trabajo</h2>
            <p className="text-xs text-slate-400">Recibe cotizaciones y propuestas de Especialistas verificados</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#161618] transition-colors"
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

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Título de lo que necesitas
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Instalación de luminarias LED en sala y cocina"
              className="w-full text-xs px-3 py-2.5 rounded-xl border border-[#27272A] bg-[#161618] text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Categoría</label>
              <select
                value={categoryId}
                onChange={(e) => {
                  setCategoryId(e.target.value);
                  const found = INITIAL_CATEGORIES.find(c => c.id === e.target.value);
                  if (found && found.subcategories.length > 0) {
                    setSubcategoryId(found.subcategories[0].id);
                  }
                }}
                className="w-full text-xs px-3 py-2.5 rounded-xl border border-[#27272A] focus:outline-none focus:border-blue-500 bg-[#161618] text-white"
              >
                {INITIAL_CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id} className="bg-[#161618] text-white">{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Subcategoría</label>
              <select
                value={subcategoryId}
                onChange={(e) => setSubcategoryId(e.target.value)}
                className="w-full text-xs px-3 py-2.5 rounded-xl border border-[#27272A] focus:outline-none focus:border-blue-500 bg-[#161618] text-white"
              >
                {currentCategory?.subcategories.map((sub) => (
                  <option key={sub.id} value={sub.id} className="bg-[#161618] text-white">{sub.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Descripción detallada de la necesidad
            </label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe con claridad los alcances, medidas, problemas o requisitos específicos..."
              className="w-full text-xs p-3 rounded-xl border border-[#27272A] bg-[#161618] text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Budget Range */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Presupuesto Mínimo ($ USD)
              </label>
              <input
                type="number"
                min={5}
                value={budgetMin}
                onChange={(e) => setBudgetMin(Number(e.target.value))}
                className="w-full text-xs px-3 py-2.5 rounded-xl border border-[#27272A] bg-[#161618] text-white focus:outline-none focus:border-blue-500 font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Presupuesto Máximo ($ USD)
              </label>
              <input
                type="number"
                min={budgetMin}
                value={budgetMax}
                onChange={(e) => setBudgetMax(Number(e.target.value))}
                className="w-full text-xs px-3 py-2.5 rounded-xl border border-[#27272A] bg-[#161618] text-white focus:outline-none focus:border-blue-500 font-semibold"
              />
            </div>
          </div>

          {/* Location & Remote */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remoteReqCheckbox"
                checked={remote}
                onChange={(e) => setRemote(e.target.checked)}
                className="rounded text-blue-500 focus:ring-0 bg-[#161618] border-[#27272A]"
              />
              <label htmlFor="remoteReqCheckbox" className="text-xs text-slate-300 font-medium cursor-pointer">
                Este trabajo se puede realizar en modalidad 100% remota / online
              </label>
            </div>

            {!remote && (
              <div className="grid grid-cols-2 gap-3 pt-1">
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
                    className="w-full text-xs px-3 py-2 rounded-xl border border-[#27272A] bg-[#161618] text-white"
                  >
                    {ECUADOR_PROVINCES.map((p) => (
                      <option key={p.name} value={p.name} className="bg-[#161618] text-white">{p.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Ciudad</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-[#27272A] bg-[#161618] text-white"
                  >
                    {currentCities.map((c) => (
                      <option key={c} value={c} className="bg-[#161618] text-white">{c}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Plazo o fecha estimada
            </label>
            <input
              type="text"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              placeholder="Ej: Para el viernes 20 de Octubre"
              className="w-full text-xs px-3 py-2.5 rounded-xl border border-[#27272A] bg-[#161618] text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="pt-4 border-t border-[#27272A] flex items-center justify-end gap-3">
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
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-xs disabled:opacity-50 transition-colors"
            >
              {loading ? 'Publicando...' : 'Publicar Solicitud'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
