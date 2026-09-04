import React, { useState } from 'react';
import { X, Star, Check, AlertCircle } from 'lucide-react';
import { Job } from '../../types';
import { dbService } from '../../lib/dbService';
import { useAuth } from '../../context/AuthContext';

interface ReviewModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
  onReviewSubmitted: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  job,
  isOpen,
  onClose,
  onReviewSubmitted
}) => {
  const { currentUser, userProfile } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen || !job) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setErrorMsg(null);
    setLoading(true);

    try {
      if (!comment.trim()) {
        throw new Error('Por favor escribe un comentario sobre el trabajo realizado.');
      }

      await dbService.createReview({
        jobId: job.id,
        reviewerId: currentUser.uid,
        reviewerName: userProfile?.displayName || 'Solicitante',
        reviewedUserId: job.specialistId,
        rating: Number(rating),
        comment
      });

      onReviewSubmitted();
      onClose();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Error al enviar la calificación.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-[#0D0D0E] rounded-3xl shadow-2xl border border-[#27272A] text-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95">

        <div className="p-6 pb-4 border-b border-[#27272A] flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white">Calificar al Especialista</h2>
            <p className="text-xs text-slate-400">{job.title}</p>
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

          {/* Star selector */}
          <div className="text-center py-2">
            <span className="text-xs font-semibold text-slate-400 block mb-2">
              ¿Cómo calificarías el servicio de <strong className="text-white">{job.specialistName}</strong>?
            </span>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 hover:scale-110 transition-transform focus:outline-none"
                >
                  <Star
                    className={`w-7 h-7 ${
                      star <= rating
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-600 fill-slate-800'
                    }`}
                  />
                </button>
              ))}
            </div>
            <span className="text-xs font-bold text-amber-400 mt-1 block">
              {rating === 5 ? 'Excelente (5 estrellas)' : rating === 4 ? 'Muy Bueno (4 estrellas)' : rating === 3 ? 'Bueno (3 estrellas)' : 'Regular / Por mejorar'}
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Tu opinión detallada sobre la entrega
            </label>
            <textarea
              rows={3}
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Puntualidad, calidad del trabajo, comunicación y profesionalismo..."
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
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-xs disabled:opacity-50 transition-colors"
            >
              {loading ? 'Guardando...' : 'Publicar Calificación'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
