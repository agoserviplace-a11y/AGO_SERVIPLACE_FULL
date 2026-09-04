export type AccountType = 'requester' | 'specialist' | 'both' | 'admin';
export type ActiveMode = 'requester' | 'specialist' | 'admin';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  phone?: string;
  country: string;
  province?: string;
  city?: string;
  bio?: string;
  accountType: AccountType;
  activeMode: ActiveMode;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'suspended' | 'pending';
}

export interface SpecialistProfile {
  userId: string;
  professionalName: string;
  headline: string;
  description: string;
  categories: string[];
  skills: string[];
  experienceYears: number;
  location: string;
  province?: string;
  city?: string;
  serviceArea: string;
  remoteAvailable: boolean;
  hourlyRate?: number;
  responseTime: string;
  completedJobs: number;
  ratingAverage: number;
  ratingCount: number;
  verificationStatus: 'unverified' | 'pending' | 'verified';
  profileStatus: 'draft' | 'active' | 'paused';
  portfolio?: Array<{ title: string; imageUrl: string; description?: string }>;
  createdAt: string;
  updatedAt: string;
}

export interface Subcategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  subcategories: Subcategory[];
  order: number;
  active: boolean;
}

export type PricingType = 'fixed' | 'from' | 'quote';
export type LocationType = 'remote' | 'onsite' | 'hybrid';

export interface Service {
  id: string;
  specialistId: string;
  specialistName?: string;
  specialistPhoto?: string;
  specialistRating?: number;
  specialistJobs?: number;
  title: string;
  slug: string;
  description: string;
  categoryId: string;
  subcategoryId?: string;
  categoryName?: string;
  images: string[];
  pricingType: PricingType;
  basePrice?: number;
  priceFrom?: number;
  estimatedDuration?: string;
  deliveryDays?: number;
  locationType: LocationType;
  location?: string;
  requirements?: string;
  tags: string[];
  status: 'active' | 'paused' | 'draft';
  views: number;
  favorites: number;
  createdAt: string;
  updatedAt: string;
}

export type ServiceRequestStatus =
  | 'draft'
  | 'published'
  | 'receivingOffers'
  | 'inNegotiation'
  | 'contracted'
  | 'completed'
  | 'cancelled'
  | 'expired';

export interface ServiceRequest {
  id: string;
  requesterId: string;
  requesterName?: string;
  requesterPhoto?: string;
  title: string;
  description: string;
  categoryId: string;
  subcategoryId?: string;
  categoryName?: string;
  budgetMin?: number;
  budgetMax?: number;
  location: string;
  remote: boolean;
  deadline?: string;
  proposalsCount: number;
  status: ServiceRequestStatus;
  createdAt: string;
  updatedAt: string;
}

export type ProposalStatus =
  | 'pending'
  | 'viewed'
  | 'shortlisted'
  | 'accepted'
  | 'rejected'
  | 'withdrawn'
  | 'expired';

export interface Proposal {
  id: string;
  requestId: string;
  requestTitle?: string;
  specialistId: string;
  specialistName?: string;
  specialistPhoto?: string;
  specialistRating?: number;
  specialistJobs?: number;
  price: number;
  deliveryDays: number;
  estimatedDelivery?: string;
  message: string;
  status: ProposalStatus;
  createdAt: string;
  updatedAt: string;
}

export type JobStatus =
  | 'pendingPayment'
  | 'funded'
  | 'inProgress'
  | 'submitted'
  | 'revision'
  | 'completed'
  | 'disputed'
  | 'cancelled'
  | 'refunded';

export interface Job {
  id: string;
  requestId?: string;
  proposalId?: string;
  serviceId?: string;
  requesterId: string;
  requesterName?: string;
  specialistId: string;
  specialistName?: string;
  title: string;
  agreedPrice: number;
  platformFee: number;
  specialistAmount: number;
  status: JobStatus;
  startDate?: string;
  estimatedCompletionDate?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
  deliveryNotes?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName?: string;
  text: string;
  isRead: boolean;
  createdAt: string;
}

export interface Conversation {
  id: string;
  participantIds: string[];
  participants?: {
    [uid: string]: {
      displayName: string;
      photoURL?: string;
    };
  };
  requestId?: string;
  jobId?: string;
  serviceId?: string;
  contextTitle?: string;
  lastMessage?: string;
  lastSenderId?: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  jobId: string;
  reviewerId: string;
  reviewerName: string;
  reviewerPhoto?: string;
  reviewedUserId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Wallet {
  userId: string;
  balance: number;
  pendingBalance: number;
  availableBalance: number;
  currency: string;
  updatedAt: string;
}

export interface WalletTransaction {
  id: string;
  walletId: string;
  userId: string;
  amount: number;
  type: 'credit' | 'debit' | 'commission' | 'refund' | 'withdrawal' | 'payment' | 'hold' | 'release';
  status: 'completed' | 'pending' | 'failed';
  description: string;
  jobId?: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'newMessage' | 'newProposal' | 'proposalAccepted' | 'proposalRejected' | 'paymentReceived' | 'jobStarted' | 'jobSubmitted' | 'jobCompleted' | 'reviewReceived' | 'system';
  link?: string;
  read: boolean;
  createdAt: string;
}

export interface PlatformSettings {
  commissionPercentage: number;
  minimumCommission: number;
  currency: string;
}
