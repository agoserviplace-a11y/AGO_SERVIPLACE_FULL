import React from 'react';
import {
  Laptop,
  Palette,
  Wrench,
  Briefcase,
  GraduationCap,
  Activity,
  ArrowRight
} from 'lucide-react';
import { Category } from '../../types';

interface CategoriesSectionProps {
  categories: Category[];
  onSelectCategory: (categoryId: string) => void;
}

const iconMap: Record<string, React.ReactNode> = {
  Laptop: <Laptop className="w-5 h-5 text-blue-600" />,
  Palette: <Palette className="w-5 h-5 text-purple-600" />,
  Wrench: <Wrench className="w-5 h-5 text-amber-600" />,
  Briefcase: <Briefcase className="w-5 h-5 text-emerald-600" />,
  GraduationCap: <GraduationCap className="w-5 h-5 text-indigo-600" />,
  Activity: <Activity className="w-5 h-5 text-rose-600" />
};

export const CategoriesSection: React.FC<CategoriesSectionProps> = ({
  categories,
  onSelectCategory
}) => {
  return (
    <section className="py-16 bg-[#0A0A0B] border-b border-[#27272A]/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-500 mb-1 block">
              Exploración por Industria
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Categorías de Servicios en Ecuador
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Conecta con profesionales técnicos y creativos disponibles en modalidad presencial y remota.
            </p>
          </div>

          <button
            onClick={() => onSelectCategory('all')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
          >
            <span>Ver todos los servicios</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              className="p-5 rounded-2xl border border-[#27272A] bg-[#0D0D0E] hover:bg-[#161618] hover:border-blue-500/60 hover:shadow-xl transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#161618] border border-[#27272A] flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                  {iconMap[category.icon] || <Laptop className="w-5 h-5 text-blue-500" />}
                </div>
                <span className="text-[11px] font-semibold text-slate-500 group-hover:text-blue-400 transition-colors">
                  Explorar →
                </span>
              </div>

              <h3 className="text-base font-bold text-white mb-1.5 group-hover:text-blue-400 transition-colors">
                {category.name}
              </h3>
              <p className="text-xs text-slate-400 line-clamp-2 mb-3.5 leading-relaxed">
                {category.description}
              </p>

              {/* Subcategories preview */}
              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[#27272A]/80">
                {category.subcategories.slice(0, 3).map((sub) => (
                  <span
                    key={sub.id}
                    className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-[#161618] border border-[#27272A] text-slate-300"
                  >
                    {sub.name}
                  </span>
                ))}
                {category.subcategories.length > 3 && (
                  <span className="text-[10px] font-medium px-1.5 py-0.5 text-slate-500">
                    +{category.subcategories.length - 3} más
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
