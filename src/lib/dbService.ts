import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  limit,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import {
  UserProfile,
  SpecialistProfile,
  Category,
  Service,
  ServiceRequest,
  Proposal,
  Job,
  Conversation,
  Message,
  Review,
  Wallet,
  WalletTransaction
} from '../types';
import { INITIAL_CATEGORIES, PLATFORM_SETTINGS } from './constants';

export const dbService = {
  // Category operations
  async getCategories(): Promise<Category[]> {
    try {
      const colRef = collection(db, 'categories');
      const snap = await getDocs(colRef);
      if (snap.empty) {
        // Auto-seed initial categories into Firestore
        for (const cat of INITIAL_CATEGORIES) {
          await setDoc(doc(db, 'categories', cat.id), cat);
        }
        return INITIAL_CATEGORIES;
      }
      const list = snap.docs.map(d => d.data() as Category);
      return list.sort((a, b) => a.order - b.order);
    } catch (error) {
      console.warn('Falling back to default categories:', error);
      return INITIAL_CATEGORIES;
    }
  },

  // User Profile
  async getUserProfile(uid: string): Promise<UserProfile | null> {
    try {
      const docRef = doc(db, 'users', uid);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return snap.data() as UserProfile;
      }
      return null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `users/${uid}`);
    }
  },

  async saveUserProfile(profile: UserProfile): Promise<void> {
    try {
      const docRef = doc(db, 'users', profile.uid);
      await setDoc(docRef, {
        ...profile,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${profile.uid}`);
    }
  },

  // Specialist Profile
  async getSpecialistProfile(userId: string): Promise<SpecialistProfile | null> {
    try {
      const docRef = doc(db, 'specialistProfiles', userId);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return snap.data() as SpecialistProfile;
      }
      return null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `specialistProfiles/${userId}`);
    }
  },

  async saveSpecialistProfile(profile: SpecialistProfile): Promise<void> {
    try {
      const docRef = doc(db, 'specialistProfiles', profile.userId);
      await setDoc(docRef, {
        ...profile,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `specialistProfiles/${profile.userId}`);
    }
  },

  // Services
  async getServices(categoryId?: string): Promise<Service[]> {
    try {
      const colRef = collection(db, 'services');
      let q = query(colRef, limit(50));
      if (categoryId && categoryId !== 'all') {
        q = query(colRef, where('categoryId', '==', categoryId), limit(50));
      }
      const snap = await getDocs(q);
      const services = snap.docs.map(d => ({ ...d.data(), id: d.id } as Service));
      return services;
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, 'services');
    }
  },

  async getSpecialistServices(specialistId: string): Promise<Service[]> {
    try {
      const colRef = collection(db, 'services');
      const q = query(colRef, where('specialistId', '==', specialistId));
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ ...d.data(), id: d.id } as Service));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, 'services');
    }
  },

  async createService(serviceData: Omit<Service, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'favorites'>): Promise<string> {
    try {
      const colRef = collection(db, 'services');
      const now = new Date().toISOString();
      const newDoc = await addDoc(colRef, {
        ...serviceData,
        views: 0,
        favorites: 0,
        createdAt: now,
        updatedAt: now
      });
      return newDoc.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'services');
    }
  },

  // Service Requests (Solicitudes)
  async getRequests(categoryId?: string): Promise<ServiceRequest[]> {
    try {
      const colRef = collection(db, 'serviceRequests');
      let q = query(colRef, limit(50));
      if (categoryId && categoryId !== 'all') {
        q = query(colRef, where('categoryId', '==', categoryId), limit(50));
      }
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ ...d.data(), id: d.id } as ServiceRequest));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, 'serviceRequests');
    }
  },

  async getUserRequests(requesterId: string): Promise<ServiceRequest[]> {
    try {
      const colRef = collection(db, 'serviceRequests');
      const q = query(colRef, where('requesterId', '==', requesterId));
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ ...d.data(), id: d.id } as ServiceRequest));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, 'serviceRequests');
    }
  },

  async createServiceRequest(requestData: Omit<ServiceRequest, 'id' | 'createdAt' | 'updatedAt' | 'proposalsCount'>): Promise<string> {
    try {
      const colRef = collection(db, 'serviceRequests');
      const now = new Date().toISOString();
      const newDoc = await addDoc(colRef, {
        ...requestData,
        proposalsCount: 0,
        status: 'published',
        createdAt: now,
        updatedAt: now
      });
      return newDoc.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'serviceRequests');
    }
  },

  // Proposals
  async getProposalsForRequest(requestId: string): Promise<Proposal[]> {
    try {
      const colRef = collection(db, 'proposals');
      const q = query(colRef, where('requestId', '==', requestId));
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ ...d.data(), id: d.id } as Proposal));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, 'proposals');
    }
  },

  async getSpecialistProposals(specialistId: string): Promise<Proposal[]> {
    try {
      const colRef = collection(db, 'proposals');
      const q = query(colRef, where('specialistId', '==', specialistId));
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ ...d.data(), id: d.id } as Proposal));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, 'proposals');
    }
  },

  async createProposal(proposalData: Omit<Proposal, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Promise<string> {
    try {
      const colRef = collection(db, 'proposals');
      const now = new Date().toISOString();
      const newDoc = await addDoc(colRef, {
        ...proposalData,
        status: 'pending',
        createdAt: now,
        updatedAt: now
      });

      // Increment proposal count on request
      const reqRef = doc(db, 'serviceRequests', proposalData.requestId);
      const reqSnap = await getDoc(reqRef);
      if (reqSnap.exists()) {
        const count = (reqSnap.data().proposalsCount || 0) + 1;
        await updateDoc(reqRef, {
          proposalsCount: count,
          status: 'receivingOffers',
          updatedAt: now
        });
      }

      return newDoc.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'proposals');
    }
  },

  async acceptProposal(proposal: Proposal, request: ServiceRequest): Promise<string> {
    try {
      const now = new Date().toISOString();
      // 1. Mark proposal as accepted
      await updateDoc(doc(db, 'proposals', proposal.id), {
        status: 'accepted',
        updatedAt: now
      });

      // 2. Mark request as contracted
      await updateDoc(doc(db, 'serviceRequests', proposal.requestId), {
        status: 'contracted',
        updatedAt: now
      });

      // 3. Compute AGO platform fees
      const grossPrice = proposal.price;
      const commissionPercent = PLATFORM_SETTINGS.commissionPercentage / 100;
      const calculatedFee = Math.max(PLATFORM_SETTINGS.minimumCommission, grossPrice * commissionPercent);
      const specialistAmount = grossPrice - calculatedFee;

      // 4. Create Job
      const jobCol = collection(db, 'jobs');
      const newJob = await addDoc(jobCol, {
        requestId: proposal.requestId,
        proposalId: proposal.id,
        requesterId: request.requesterId,
        requesterName: request.requesterName || 'Solicitante',
        specialistId: proposal.specialistId,
        specialistName: proposal.specialistName || 'Especialista',
        title: request.title,
        agreedPrice: grossPrice,
        platformFee: calculatedFee,
        specialistAmount: specialistAmount,
        status: 'funded',
        startDate: now,
        estimatedCompletionDate: proposal.estimatedDelivery || `${proposal.deliveryDays} días`,
        createdAt: now,
        updatedAt: now
      });

      // 5. Create initial conversation
      await this.getOrCreateConversation(
        request.requesterId,
        proposal.specialistId,
        request.title,
        newJob.id
      );

      return newJob.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `jobs`);
    }
  },

  // Jobs
  async getUserJobs(userId: string, role: 'requester' | 'specialist'): Promise<Job[]> {
    try {
      const colRef = collection(db, 'jobs');
      const field = role === 'requester' ? 'requesterId' : 'specialistId';
      const q = query(colRef, where(field, '==', userId));
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ ...d.data(), id: d.id } as Job));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, 'jobs');
    }
  },

  async updateJobStatus(jobId: string, status: Job['status'], deliveryNotes?: string): Promise<void> {
    try {
      const jobRef = doc(db, 'jobs', jobId);
      const updates: Record<string, any> = {
        status,
        updatedAt: new Date().toISOString()
      };
      if (status === 'completed') {
        updates.completedAt = new Date().toISOString();
      }
      if (deliveryNotes) {
        updates.deliveryNotes = deliveryNotes;
      }
      await updateDoc(jobRef, updates);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `jobs/${jobId}`);
    }
  },

  // Reviews
  async createReview(review: Omit<Review, 'id' | 'createdAt'>): Promise<string> {
    try {
      const colRef = collection(db, 'reviews');
      const now = new Date().toISOString();
      const newDoc = await addDoc(colRef, {
        ...review,
        createdAt: now
      });

      // Update specialist rating summary
      const specRef = doc(db, 'specialistProfiles', review.reviewedUserId);
      const specSnap = await getDoc(specRef);
      if (specSnap.exists()) {
        const data = specSnap.data() as SpecialistProfile;
        const currentCount = data.ratingCount || 0;
        const currentAvg = data.ratingAverage || 5.0;
        const newCount = currentCount + 1;
        const newAvg = Number(((currentAvg * currentCount + review.rating) / newCount).toFixed(1));
        await updateDoc(specRef, {
          ratingCount: newCount,
          ratingAverage: newAvg,
          completedJobs: (data.completedJobs || 0) + 1,
          updatedAt: now
        });
      }

      return newDoc.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'reviews');
    }
  },

  async getSpecialistReviews(specialistId: string): Promise<Review[]> {
    try {
      const colRef = collection(db, 'reviews');
      const q = query(colRef, where('reviewedUserId', '==', specialistId), limit(20));
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ ...d.data(), id: d.id } as Review));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, 'reviews');
    }
  },

  // Chat / Conversations
  async getOrCreateConversation(
    userId1: string,
    userId2: string,
    title?: string,
    jobId?: string
  ): Promise<string> {
    try {
      const colRef = collection(db, 'conversations');
      const q = query(colRef, where('participantIds', 'array-contains', userId1));
      const snap = await getDocs(q);

      const existing = snap.docs.find(d => {
        const data = d.data() as Conversation;
        return data.participantIds.includes(userId2);
      });

      if (existing) {
        return existing.id;
      }

      const now = new Date().toISOString();
      const newConv = await addDoc(colRef, {
        participantIds: [userId1, userId2],
        contextTitle: title || 'Conversación en AGO',
        jobId: jobId || null,
        lastMessage: 'Conversación iniciada.',
        lastSenderId: userId1,
        updatedAt: now
      });

      return newConv.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'conversations');
    }
  },

  async getUserConversations(userId: string): Promise<Conversation[]> {
    try {
      const colRef = collection(db, 'conversations');
      const q = query(colRef, where('participantIds', 'array-contains', userId));
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ ...d.data(), id: d.id } as Conversation));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, 'conversations');
    }
  },

  async sendMessage(conversationId: string, senderId: string, senderName: string, text: string): Promise<string> {
    try {
      const colRef = collection(db, `conversations/${conversationId}/messages`);
      const now = new Date().toISOString();
      const msgDoc = await addDoc(colRef, {
        conversationId,
        senderId,
        senderName,
        text,
        isRead: false,
        createdAt: now
      });

      // Update parent conversation summary
      await updateDoc(doc(db, 'conversations', conversationId), {
        lastMessage: text,
        lastSenderId: senderId,
        updatedAt: now
      });

      return msgDoc.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `conversations/${conversationId}/messages`);
    }
  },

  // Wallet
  async getOrCreateWallet(userId: string): Promise<Wallet> {
    try {
      const docRef = doc(db, 'wallets', userId);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return snap.data() as Wallet;
      }
      const initialWallet: Wallet = {
        userId,
        balance: 0,
        pendingBalance: 0,
        availableBalance: 0,
        currency: 'USD',
        updatedAt: new Date().toISOString()
      };
      await setDoc(docRef, initialWallet);
      return initialWallet;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `wallets/${userId}`);
    }
  },

  async getWalletTransactions(userId: string): Promise<WalletTransaction[]> {
    try {
      const colRef = collection(db, 'walletTransactions');
      const q = query(colRef, where('userId', '==', userId), limit(30));
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ ...d.data(), id: d.id } as WalletTransaction));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, 'walletTransactions');
    }
  }
};
