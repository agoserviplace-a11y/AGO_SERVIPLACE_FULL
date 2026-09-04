import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  FileText,
  DollarSign,
  Star,
  CheckCircle,
  Clock,
  MessageSquare,
  Plus,
  Send,
  AlertCircle,
  Layers,
  ArrowUpRight,
  TrendingUp,
  SlidersHorizontal,
  ChevronRight,
  Award
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { dbService } from '../../lib/dbService';
import { ServiceRequest, Proposal, Job, Service, Wallet } from '../../types';
import { ReviewModal } from '../reviews/ReviewModal';

interface UserDashboardProps {
  onOpenNewRequest: () => void;
  onOpenNewService: () => void;
  onOpenChat: (userId: string, userName: string) => void;
  onNavigate: (view: 'home' | 'services' | 'requests' | 'dashboard' | 'specialists') => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  onOpenNewRequest,
  onOpenNewService,
  onOpenChat,
  onNavigate
}) => {
  const { currentUser, userProfile, specialistProfile, activeMode, switchActiveMode } = useAuth();

  // Solicitante State
  const [userRequests, setUserRequests] = useState<ServiceRequest[]>([]);
  const [selectedRequestProposals, setSelectedRequestProposals] = useState<Proposal[]>([]);
  const [inspectingRequestId, setInspectingRequestId] = useState<string | null>(null);

  // Specialist State
  const [specialistServices, setSpecialistServices] = useState<Service[]>([]);
  const [specialistProposals, setSpecialistProposals] = useState<Proposal[]>([]);
  const [wallet, setWallet] = useState<Wallet | null>(null);

  // Jobs
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  // Deliver modal notes
  const [deliveryNotesInput, setDeliveryNotesInput] = useState('');
  const [activeJobForDelivery, setActiveJobForDelivery] = useState<Job | null>(null);

  // Review modal state
  const [jobToReview, setJobToReview] = useState<Job | null>(null);

  // Active Tab
  const [currentTab, setCurrentTab] = useState<'overview' | 'jobs' | 'requests' | 'services' | 'wallet'>('overview');

  const loadData = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      if (activeMode === 'requester') {
        const [reqs, myJobs] = await Promise.all([
          dbService.getUserRequests(currentUser.uid),
          dbService.getUserJobs(currentUser.uid, 'requester')
        ]);
        setUserRequests(reqs || []);
        setJobs(myJobs || []);
      } else {
        const [srvs, props, specJobs, myWallet] = await Promise.all([
          dbService.getSpecialistServices(currentUser.uid),
          dbService.getSpecialistProposals(currentUser.uid),
          dbService.getUserJobs(currentUser.uid, 'specialist'),
          dbService.getOrCreateWallet(currentUser.uid)
        ]);
        setSpecialistServices(srvs || []);
        setSpecialistProposals(props || []);
        setJobs(specJobs || []);
        setWallet(myWallet || null);
      }
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentUser, activeMode]);

  // Load proposals when inspecting a request
  const handleInspectRequest = async (req: ServiceRequest) => {
    if (inspectingRequestId === req.id) {
      setInspectingRequestId(null);
      setSelectedRequestProposals([]);
    } else {
      setInspectingRequestId(req.id);
      const props = await dbService.getProposalsForRequest(req.id);
      setSelectedRequestProposals(props || []);
    }
  };

  // Solicitante: Accept a proposal -> create Job
  const handleAcceptProposal = async (proposal: Proposal, request: ServiceRequest) => {
    try {
      await dbService.acceptProposal(proposal, request);
      alert('¡Propuesta aceptada con éxito! Se ha creado el contrato de trabajo con trazabilidad segura.');
      setInspectingRequestId(null);
      await loadData();
    } catch (err) {
      console.error('Error accepting proposal:', err);
    }
  };

  // Specialist: Advance job status (e.g. in_progress, delivered)
  const handleJobStatusChange = async (jobId: string, nextStatus: Job['status'], notes?: string) => {
    try {
      await dbService.updateJobStatus(jobId, nextStatus, notes);
      setActiveJobForDelivery(null);
      setDeliveryNotesInput('');
      await loadData();
    } catch (err) {
      console.error('Error updating job status:', err);
    }
  };

  // Requester: Complete job and approve delivery
  const handleApproveJobDelivery = async (job: Job) => {
    try {
      await dbService.updateJobStatus(job.id, 'completed');
      setJobToReview(job);
      await loadData();
    } catch (err) {
      console.error('Error approving job:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Top Banner: Mode & Stats */}
      <div className="bg-[#0D0D0E] rounded-3xl border border-[#27272A] p-6 sm:p-8 shadow-xl mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold text-white">
              Hola, {userProfile?.displayName || 'Usuario AGO'}
            </h1>
            <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold ${
              activeMode === 'requester' ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30' : 'bg-purple-500/15 text-purple-400 border border-purple-500/30'
            }`}>
              {activeMode === 'requester' ? 'Modo Solicitante' : 'Modo Especialista'}
            </span>
          </div>
          <p className="text-xs text-slate-400">
            {activeMode === 'requester'
              ? 'Administra tus requerimientos, compara cotizaciones recibidas y supervisa trabajos en curso.'
              : 'Gestiona tus servicios ofrecidos, postúlate a requerimientos y administra tus ganancias en USD.'}
          </p>
        </div>

        {/* Action button + switch mode */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => switchActiveMode(activeMode === 'requester' ? 'specialist' : 'requester')}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-[#27272A] text-slate-300 hover:bg-[#161618] hover:text-white transition-colors"
          >
            Cambiar a Modo {activeMode === 'requester' ? 'Especialista' : 'Solicitante'}
          </button>

          {activeMode === 'requester' ? (
            <button
              onClick={onOpenNewRequest}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Publicar Solicitud
            </button>
          ) : (
            <button
              onClick={onOpenNewService}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Publicar Servicio
            </button>
          )}
        </div>
      </div>

      {/* Dashboard Sub-navigation */}
      <div className="flex items-center gap-2 border-b border-[#27272A] pb-2 mb-8 overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => setCurrentTab('overview')}
          className={`px-3.5 py-2 rounded-xl transition-colors whitespace-nowrap ${
            currentTab === 'overview'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-400 hover:text-white hover:bg-[#161618]'
          }`}
        >
          Resumen General
        </button>

        <button
          onClick={() => setCurrentTab('jobs')}
          className={`px-3.5 py-2 rounded-xl transition-colors whitespace-nowrap ${
            currentTab === 'jobs'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-400 hover:text-white hover:bg-[#161618]'
          }`}
        >
          Trabajos Activos ({jobs.filter(j => j.status !== 'completed').length})
        </button>

        {activeMode === 'requester' ? (
          <button
            onClick={() => setCurrentTab('requests')}
            className={`px-3.5 py-2 rounded-xl transition-colors whitespace-nowrap ${
              currentTab === 'requests'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-[#161618]'
            }`}
          >
            Mis Solicitudes ({userRequests.length})
          </button>
        ) : (
          <>
            <button
              onClick={() => setCurrentTab('services')}
              className={`px-3.5 py-2 rounded-xl transition-colors whitespace-nowrap ${
                currentTab === 'services'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-[#161618]'
              }`}
            >
              Mis Servicios ({specialistServices.length})
            </button>
            <button
              onClick={() => setCurrentTab('wallet')}
              className={`px-3.5 py-2 rounded-xl transition-colors whitespace-nowrap ${
                currentTab === 'wallet'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-[#161618]'
              }`}
            >
              Billetera y Cobros
            </button>
          </>
        )}
      </div>

      {/* TAB CONTENT */}

      {/* 1. Overview Tab */}
      {currentTab === 'overview' && (
        <div className="space-y-8">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#0D0D0E] p-5 rounded-2xl border border-[#27272A] shadow-md">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Trabajos en Curso
              </span>
              <div className="text-2xl font-black text-white">
                {jobs.filter(j => j.status !== 'completed').length}
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">Con contrato activo</span>
            </div>

            <div className="bg-[#0D0D0E] p-5 rounded-2xl border border-[#27272A] shadow-md">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Trabajos Concluidos
              </span>
              <div className="text-2xl font-black text-white">
                {jobs.filter(j => j.status === 'completed').length}
              </div>
              <span className="text-[10px] text-emerald-400 mt-1 block">100% finalizados</span>
            </div>

            {activeMode === 'requester' ? (
              <div className="bg-[#0D0D0E] p-5 rounded-2xl border border-[#27272A] shadow-md">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Solicitudes Publicadas
                </span>
                <div className="text-2xl font-black text-white">
                  {userRequests.length}
                </div>
                <span className="text-[10px] text-blue-400 mt-1 block">Buscando ofertas</span>
              </div>
            ) : (
              <div className="bg-[#0D0D0E] p-5 rounded-2xl border border-[#27272A] shadow-md">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Saldo Disponible ($ USD)
                </span>
                <div className="text-2xl font-black text-white">
                  ${wallet?.availableBalance || 0}
                </div>
                <span className="text-[10px] text-emerald-400 mt-1 block">Listo para retiro local</span>
              </div>
            )}

            <div className="bg-[#0D0D0E] p-5 rounded-2xl border border-[#27272A] shadow-md">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Garantía y Seguridad
              </span>
              <div className="text-sm font-bold text-white flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Activa</span>
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">Fondos custodiados en ciclo AGO</span>
            </div>
          </div>

          {/* Active Jobs in progress snapshot */}
          <div className="bg-[#0D0D0E] rounded-3xl border border-[#27272A] p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white">Trabajos Activos Recientes</h3>
              <button
                onClick={() => setCurrentTab('jobs')}
                className="text-xs font-semibold text-blue-400 hover:text-blue-300"
              >
                Ver todos
              </button>
            </div>

            {jobs.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">
                No tienes contratos de trabajo activos en este momento.
              </p>
            ) : (
              <div className="space-y-3">
                {jobs.slice(0, 3).map((job) => (
                  <div
                    key={job.id}
                    className="p-4 rounded-2xl border border-[#27272A] bg-[#161618] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-500/15 text-blue-400 border border-blue-500/30">
                          {job.status === 'funded' ? 'Contratado / Por Iniciar' : job.status === 'in_progress' ? 'En Progreso' : job.status === 'delivered' ? 'Entregado para Revisión' : 'Completado'}
                        </span>
                        <span className="text-xs font-bold text-white">{job.title}</span>
                      </div>
                      <p className="text-xs text-slate-400">
                        {activeMode === 'requester' ? `Especialista: ${job.specialistName}` : `Cliente: ${job.requesterName}`}
                        {' • '}
                        Monto: ${job.agreedPrice} USD
                      </p>
                    </div>

                    <button
                      onClick={() => setCurrentTab('jobs')}
                      className="px-3 py-1.5 bg-[#0D0D0E] border border-[#27272A] hover:bg-[#202024] text-slate-200 rounded-xl text-xs font-semibold self-start sm:self-auto transition-colors"
                    >
                      Gestionar →
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. Jobs Tab (Contract & lifecycle execution) */}
      {currentTab === 'jobs' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-lg font-bold text-white">Gestión de Trabajos (Jobs)</h2>
              <p className="text-xs text-slate-400">
                Supervisa el estado del contrato, avances y entregas en tiempo real.
              </p>
            </div>
          </div>

          {jobs.length === 0 ? (
            <div className="p-12 text-center bg-[#0D0D0E] rounded-3xl border border-[#27272A]">
              <Layers className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              <p className="text-xs text-slate-400">Aún no hay contratos de trabajo generados.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => {
                const isSpecialist = activeMode === 'specialist';
                return (
                  <div
                    key={job.id}
                    className="bg-[#0D0D0E] rounded-2xl border border-[#27272A] p-6 shadow-xl space-y-4"
                  >
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#27272A]">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            job.status === 'completed'
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              : job.status === 'delivered'
                              ? 'bg-purple-500/15 text-purple-400 border border-purple-500/30'
                              : 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                          }`}>
                            {job.status.toUpperCase()}
                          </span>
                          <span className="text-xs text-slate-500">ID: {job.id.slice(0, 8)}</span>
                        </div>
                        <h3 className="text-base font-bold text-white">{job.title}</h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {isSpecialist ? `Cliente: ${job.requesterName}` : `Especialista: ${job.specialistName}`}
                          {' • '}
                          Fecha compromiso: {job.estimatedCompletionDate || 'Sin fecha fija'}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                          Monto Acordado
                        </span>
                        <span className="text-xl font-black text-white">
                          ${job.agreedPrice} <span className="text-xs font-normal text-slate-400">USD</span>
                        </span>
                      </div>
                    </div>

                    {/* Delivery Notes preview if exists */}
                    {job.deliveryNotes && (
                      <div className="p-3.5 rounded-xl bg-[#161618] border border-[#27272A] text-xs">
                        <span className="font-bold text-slate-200 block mb-1">Notas de Entrega del Especialista:</span>
                        <p className="text-slate-400">{job.deliveryNotes}</p>
                      </div>
                    )}

                    {/* Progress actions according to role */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                      <button
                        onClick={() => onOpenChat(
                          isSpecialist ? job.requesterId : job.specialistId,
                          isSpecialist ? job.requesterName : job.specialistName
                        )}
                        className="px-3 py-1.5 rounded-xl border border-[#27272A] bg-[#161618] hover:bg-[#202024] text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        Chat del Proyecto
                      </button>

                      {/* Specialist Controls */}
                      {isSpecialist && (
                        <div className="flex items-center gap-2">
                          {job.status === 'funded' && (
                            <button
                              onClick={() => handleJobStatusChange(job.id, 'inProgress')}
                              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl transition-colors shadow-xs"
                            >
                              Marcar Inicio de Trabajo
                            </button>
                          )}

                          {job.status === 'inProgress' && (
                            <button
                              onClick={() => setActiveJobForDelivery(job)}
                              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-xl transition-colors shadow-xs"
                            >
                              Entregar Trabajo Finalizado
                            </button>
                          )}

                          {job.status === 'submitted' && (
                            <span className="text-xs font-semibold text-purple-400 bg-purple-500/15 border border-purple-500/30 px-3 py-1.5 rounded-xl">
                              Esperando confirmación del Solicitante...
                            </span>
                          )}

                          {job.status === 'completed' && (
                            <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-3 py-1.5 rounded-xl flex items-center gap-1">
                              <CheckCircle className="w-3.5 h-3.5" />
                              Trabajo Concluido y Cobrado
                            </span>
                          )}
                        </div>
                      )}

                      {/* Requester Controls */}
                      {!isSpecialist && (
                        <div className="flex items-center gap-2">
                          {job.status === 'submitted' && (
                            <button
                              onClick={() => handleApproveJobDelivery(job)}
                              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
                            >
                              Aprobar Entrega y Calificar
                            </button>
                          )}

                          {job.status === 'completed' && (
                            <button
                              onClick={() => setJobToReview(job)}
                              className="px-3 py-1.5 border border-amber-500/30 bg-amber-500/15 text-amber-300 text-xs font-semibold rounded-xl flex items-center gap-1 transition-colors hover:bg-amber-500/25"
                            >
                              <Star className="w-3.5 h-3.5 fill-amber-400" />
                              Dejar / Modificar Reseña
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Delivery Form Modal / Inline Box for Specialist */}
                    {activeJobForDelivery?.id === job.id && (
                      <div className="p-4 rounded-2xl bg-[#161618] border border-purple-500/30 mt-3 space-y-3">
                        <h4 className="text-xs font-bold text-purple-400">Entregar Proyecto al Solicitante</h4>
                        <textarea
                          rows={3}
                          value={deliveryNotesInput}
                          onChange={(e) => setDeliveryNotesInput(e.target.value)}
                          placeholder="Escribe un resumen de los entregables o instrucciones para el cliente..."
                          className="w-full text-xs p-3 rounded-xl border border-[#27272A] bg-[#0D0D0E] text-white placeholder:text-slate-500 focus:outline-none"
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setActiveJobForDelivery(null)}
                            className="px-3 py-1.5 text-xs text-slate-400 hover:text-white rounded-lg"
                          >
                            Cancelar
                          </button>
                          <button
                            onClick={() => handleJobStatusChange(job.id, 'submitted', deliveryNotesInput)}
                            className="px-4 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-lg transition-colors"
                          >
                            Confirmar Entrega
                          </button>
                        </div>
                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 3. Requester Tab: My Requests & Received Proposals */}
      {currentTab === 'requests' && activeMode === 'requester' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Mis Solicitudes Publicadas</h2>
              <p className="text-xs text-slate-400">
                Revisa postulaciones recibidas y cotizaciones para contratar al mejor candidato.
              </p>
            </div>
            <button
              onClick={onOpenNewRequest}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              Nueva Solicitud
            </button>
          </div>

          {userRequests.length === 0 ? (
            <div className="p-12 text-center bg-[#0D0D0E] rounded-3xl border border-[#27272A]">
              <FileText className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              <p className="text-xs text-slate-400 mb-3">No tienes solicitudes publicadas todavía.</p>
              <button
                onClick={onOpenNewRequest}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl transition-colors"
              >
                Publicar Ahora
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {userRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-[#0D0D0E] rounded-2xl border border-[#27272A] p-5 space-y-3 shadow-md"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-500/15 text-blue-400 border border-blue-500/30 mr-2">
                        {req.status === 'published' ? 'Publicado' : req.status === 'receivingOffers' ? 'Recibiendo Ofertas' : 'Contratado'}
                      </span>
                      <span className="text-sm font-bold text-white">{req.title}</span>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-1">{req.description}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-bold text-white">${req.budgetMin} - ${req.budgetMax} USD</span>
                      <button
                        onClick={() => handleInspectRequest(req)}
                        className="block mt-1 text-xs font-semibold text-blue-400 hover:text-blue-300"
                      >
                        {inspectingRequestId === req.id ? 'Ocultar Ofertas ▲' : `Ver Ofertas (${req.proposalsCount || 0}) ▼`}
                      </button>
                    </div>
                  </div>

                  {/* Inspected Proposals List */}
                  {inspectingRequestId === req.id && (
                    <div className="pt-4 border-t border-[#27272A] space-y-3 animate-in fade-in">
                      <h4 className="text-xs font-bold text-slate-200">Cotizaciones Recibidas:</h4>
                      {selectedRequestProposals.length === 0 ? (
                        <p className="text-xs text-slate-500 py-3">Aún no se han enviado cotizaciones para esta solicitud.</p>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {selectedRequestProposals.map((prop) => (
                            <div
                              key={prop.id}
                              className="p-4 rounded-xl border border-[#27272A] bg-[#161618] flex flex-col justify-between space-y-3"
                            >
                              <div>
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-xs font-bold text-white">{prop.specialistName}</span>
                                  <span className="text-sm font-extrabold text-blue-400">${prop.price} USD</span>
                                </div>
                                <p className="text-xs text-slate-300 leading-relaxed mb-2">{prop.message}</p>
                                <span className="text-[11px] text-slate-400">
                                  Entrega estimada: <strong className="text-slate-200">{prop.estimatedDelivery || `${prop.deliveryDays} días`}</strong>
                                </span>
                              </div>

                              <div className="flex items-center justify-between pt-2 border-t border-[#27272A]">
                                <button
                                  onClick={() => onOpenChat(prop.specialistId, prop.specialistName)}
                                  className="text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1 transition-colors"
                                >
                                  <MessageSquare className="w-3.5 h-3.5" />
                                  Chatear
                                </button>
                                {prop.status !== 'accepted' && (
                                  <button
                                    onClick={() => handleAcceptProposal(prop, req)}
                                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl transition-colors"
                                  >
                                    Aceptar y Contratar
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 4. Specialist Tab: My Services */}
      {currentTab === 'services' && activeMode === 'specialist' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Mis Servicios Ofrecidos</h2>
              <p className="text-xs text-slate-400">
                Tu catálogo activo visible para clientes en todo el Ecuador.
              </p>
            </div>
            <button
              onClick={onOpenNewService}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              Nuevo Servicio
            </button>
          </div>

          {specialistServices.length === 0 ? (
            <div className="p-12 text-center bg-[#0D0D0E] rounded-3xl border border-[#27272A]">
              <Briefcase className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              <p className="text-xs text-slate-400 mb-3">Aún no has publicado ningún servicio en tu catálogo.</p>
              <button
                onClick={onOpenNewService}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl transition-colors"
              >
                Publicar Servicio
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {specialistServices.map((srv) => (
                <div key={srv.id} className="bg-[#0D0D0E] rounded-2xl border border-[#27272A] p-4 flex flex-col justify-between shadow-md">
                  <div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-blue-500/15 text-blue-400 border border-blue-500/30">
                      {srv.categoryName}
                    </span>
                    <h3 className="text-sm font-bold text-white mt-2 line-clamp-2">{srv.title}</h3>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-1">{srv.description}</p>
                  </div>
                  <div className="pt-3 border-t border-[#27272A] flex items-center justify-between mt-3">
                    <span className="font-extrabold text-white">${srv.basePrice || srv.priceFrom} USD</span>
                    <span className="text-xs text-emerald-400 font-semibold">Activo</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 5. Specialist Tab: Wallet & Earnings */}
      {currentTab === 'wallet' && activeMode === 'specialist' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white">Billetera y Finanzas AGO</h2>
            <p className="text-xs text-slate-400">
              Control transparente de ingresos brutos, comisión de la plataforma y saldo neto en USD.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-6 rounded-2xl bg-[#0D0D0E] border border-[#27272A] shadow-md">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Saldo Disponible
              </span>
              <div className="text-3xl font-black text-white">
                ${wallet?.availableBalance.toFixed(2) || '0.00'}{' '}
                <span className="text-xs font-normal text-slate-400">USD</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">Fondos liberados listos para transferir a cuenta bancaria nacional.</p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0D0D0E] border border-[#27272A] shadow-md">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Saldo en Custodia
              </span>
              <div className="text-3xl font-black text-blue-400">
                ${wallet?.pendingBalance.toFixed(2) || '0.00'}{' '}
                <span className="text-xs font-normal text-slate-400">USD</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">Monto de trabajos en progreso protegidos por AGO.</p>
            </div>

            <div className="p-6 rounded-2xl bg-[#161618] border border-[#27272A] text-white shadow-md">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Retiro a Banco Ecuador
              </span>
              <p className="text-xs text-slate-300 mb-4">Transferencias interbancarias directas a Pichincha, Guayaquil, Pacífico, Produbanco.</p>
              <button
                onClick={() => alert('Para solicitar retiro bancario en Ecuador, contacta al soporte de pagos con tu número de cuenta registrado.')}
                className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl transition-colors shadow-xs"
              >
                Solicitar Transferencia
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal Trigger */}
      {jobToReview && (
        <ReviewModal
          job={jobToReview}
          isOpen={Boolean(jobToReview)}
          onClose={() => setJobToReview(null)}
          onReviewSubmitted={() => {
            loadData();
          }}
        />
      )}

    </div>
  );
};
