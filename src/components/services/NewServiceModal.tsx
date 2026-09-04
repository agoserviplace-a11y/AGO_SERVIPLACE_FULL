import React, { useState } from 'react';
import { X, Plus, DollarSign, Clock, MapPin, Tag, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { dbService } from '../../lib/dbService';
import { INITIAL_CATEGORIES } from '../../lib/constants';

interface NewServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export const NewServiceModal: React.FC<NewServiceModalProps> = ({ isOpen, onClose, onCreated }) => {
  const { currentUser, specialistProfile, userProfile } = useAuth();

  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('tecnologia');
  const [subcategoryId, setSubcategoryId] = useState('web');
  const [description, setDescription] = useState('');
  const [pricingType, setPricingType] = useState<'fixed' | 'from'>('from');
  const [basePrice, setBasePrice] = useState(150);
  const [deliveryDays, setDeliveryDays] = useState(5);
  const [locationType, setLocationType] = useState<'remote' | 'onsite' | 'hybrid'>('remote');
  const [location, setLocation] = useState(specialistProfile?.location || 'Quito / Todo el Ecuador');
  const [requirements, setRequirements] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentCategory = INITIAL_CATEGORIES.find(c => c.id === categoryId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setErrorMsg(null);
    setLoading(true);

    try {
      if (!title.trim() || !description.trim()) {
        throw new Error('Por favor completa el título y la descripción del servicio.');
      }

      const tags = tagsInput
        .split(',')
        .map(t => t.trim())
        .filter(Boolean);

      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

      await dbService.createService({
        specialistId: currentUser.uid,
        specialistName: specialistProfile?.professionalName || userProfile?.displayName || 'Especialista',
        specialistRating: specialistProfile?.ratingAverage || 5.0,
        specialistJobs: specialistProfile?.completedJobs || 0,
        title,
        slug,
        description,
        categoryId,
        subcategoryId,
        categoryName: currentCategory?.name || 'Servicios Generales',
        images: [imageUrl],
        pricingType,
        basePrice: Number(basePrice),
        priceFrom: Number(basePrice),
        estimatedDuration: `${deliveryDays} días`,
        deliveryDays: Number(deliveryDays),
        locationType,
        location,
        requirements,
        tags,
        status: 'active'
      });

      onCreated();
      onClose();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Error al publicar el servicio.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#0D0D0E] rounded-3xl shadow-2xl border border-[#27272A] text-slate-200 w-full max-w-xl my-8 overflow-hidden animate-in fade-in zoom-in-95">

        <div className="p-6 pb-4 border-b border-[#27272A] flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white">Publicar un Nuevo Servicio</h2>
            <p className="text-xs text-slate-400">Ofrece un catálogo claro y transparente a los clientes en Ecuador</p>
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
              Título del Servicio
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Mantenimiento e Instalación de Aire Acondicionado Split"
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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Tipo de Tarifa</label>
              <select
                value={pricingType}
                onChange={(e) => setPricingType(e.target.value as any)}
                className="w-full text-xs px-3 py-2.5 rounded-xl border border-[#27272A] focus:outline-none focus:border-blue-500 bg-[#161618] text-white"
              >
                <option value="from" className="bg-[#161618] text-white">Precio Desde</option>
                <option value="fixed" className="bg-[#161618] text-white">Precio Fijo</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Tarifa Base ($ USD)
              </label>
              <input
                type="number"
                min={5}
                required
                value={basePrice}
                onChange={(e) => setBasePrice(Number(e.target.value))}
                className="w-full text-xs px-3 py-2.5 rounded-xl border border-[#27272A] bg-[#161618] text-white focus:outline-none focus:border-blue-500 font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Días de Entrega
              </label>
              <input
                type="number"
                min={1}
                required
                value={deliveryDays}
                onChange={(e) => setDeliveryDays(Number(e.target.value))}
                className="w-full text-xs px-3 py-2.5 rounded-xl border border-[#27272A] bg-[#161618] text-white focus:outline-none focus:border-blue-500 font-semibold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Modalidad</label>
              <select
                value={locationType}
                onChange={(e) => setLocationType(e.target.value as any)}
                className="w-full text-xs px-3 py-2.5 rounded-xl border border-[#27272A] focus:outline-none focus:border-blue-500 bg-[#161618] text-white"
              >
                <option value="remote" className="bg-[#161618] text-white">100% Remoto</option>
                <option value="onsite" className="bg-[#161618] text-white">Presencial / En sitio</option>
                <option value="hybrid" className="bg-[#161618] text-white">Híbrido</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Área o Ciudad</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Ej: Guayaquil y Samborondón"
                className="w-full text-xs px-3 py-2.5 rounded-xl border border-[#27272A] bg-[#161618] text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Descripción del Servicio y Alcance
            </label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe detalladamente qué incluye este paquete, entregables y metodología..."
              className="w-full text-xs p-3 rounded-xl border border-[#27272A] bg-[#161618] text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Requisitos que debe proporcionar el cliente (opcional)
            </label>
            <input
              type="text"
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              placeholder="Ej: Acceso a tablero eléctrico, materiales o logos de marca"
              className="w-full text-xs px-3 py-2.5 rounded-xl border border-[#27272A] bg-[#161618] text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Etiquetas (separadas por coma)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="Ej: Climatización, Split, Mantenimiento, Urgencias"
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
              {loading ? 'Publicando...' : 'Publicar Servicio'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
