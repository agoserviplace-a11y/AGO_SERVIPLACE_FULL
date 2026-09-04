import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { UserProfile, SpecialistProfile, AccountType, ActiveMode } from '../types';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userProfile: UserProfile | null;
  specialistProfile: SpecialistProfile | null;
  loading: boolean;
  activeMode: ActiveMode;
  isAdmin: boolean;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (email: string, pass: string, name: string, accountType: AccountType) => Promise<void>;
  loginWithGoogle: (intentAccountType?: AccountType) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  switchActiveMode: (mode: 'requester' | 'specialist') => Promise<void>;
  updateUserProfileData: (data: Partial<UserProfile>) => Promise<void>;
  updateSpecialistProfileData: (data: Partial<SpecialistProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [specialistProfile, setSpecialistProfile] = useState<SpecialistProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Sync user & specialist profile from Firestore
  const syncProfile = async (firebaseUser: FirebaseUser) => {
    try {
      const userRef = doc(db, 'users', firebaseUser.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data() as UserProfile;
        setUserProfile(data);

        // Also fetch specialist profile if user has specialist capability
        if (data.accountType === 'specialist' || data.accountType === 'both') {
          const specRef = doc(db, 'specialistProfiles', firebaseUser.uid);
          const specSnap = await getDoc(specRef);
          if (specSnap.exists()) {
            setSpecialistProfile(specSnap.data() as SpecialistProfile);
          }
        }
      }
    } catch (err) {
      console.error('Error fetching user profile from Firestore:', err);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await syncProfile(user);
      } else {
        setUserProfile(null);
        setSpecialistProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithEmail = async (email: string, pass: string) => {
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    await syncProfile(cred.user);
  };

  const registerWithEmail = async (
    email: string,
    pass: string,
    displayName: string,
    accountType: AccountType
  ) => {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    await updateProfile(cred.user, { displayName });

    const now = new Date().toISOString();
    const activeMode: ActiveMode = accountType === 'specialist' ? 'specialist' : 'requester';

    const newProfile: UserProfile = {
      uid: cred.user.uid,
      email,
      displayName,
      country: 'Ecuador',
      accountType,
      activeMode,
      isVerified: false,
      createdAt: now,
      updatedAt: now,
      status: 'active'
    };

    // Save to Firestore
    await setDoc(doc(db, 'users', cred.user.uid), newProfile);
    setUserProfile(newProfile);

    // If specialist or both, create initial specialist profile
    if (accountType === 'specialist' || accountType === 'both') {
      const newSpec: SpecialistProfile = {
        userId: cred.user.uid,
        professionalName: displayName,
        headline: 'Especialista en AGO Marketplace',
        description: 'Servicios profesionales y garantizados en Ecuador.',
        categories: [],
        skills: [],
        experienceYears: 1,
        location: 'Quito, Pichincha',
        serviceArea: 'Nacional / Presencial & Remoto',
        remoteAvailable: true,
        responseTime: 'Menos de 2 horas',
        completedJobs: 0,
        ratingAverage: 5.0,
        ratingCount: 0,
        verificationStatus: 'pending',
        profileStatus: 'active',
        createdAt: now,
        updatedAt: now
      };
      await setDoc(doc(db, 'specialistProfiles', cred.user.uid), newSpec);
      setSpecialistProfile(newSpec);
    }
  };

  const loginWithGoogle = async (intentAccountType: AccountType = 'both') => {
    const provider = new GoogleAuthProvider();
    const cred = await signInWithPopup(auth, provider);
    const userRef = doc(db, 'users', cred.user.uid);
    const userSnap = await getDoc(userRef);

    const now = new Date().toISOString();
    if (!userSnap.exists()) {
      const activeMode: ActiveMode = intentAccountType === 'specialist' ? 'specialist' : 'requester';
      const newProfile: UserProfile = {
        uid: cred.user.uid,
        email: cred.user.email || '',
        displayName: cred.user.displayName || 'Usuario AGO',
        photoURL: cred.user.photoURL || undefined,
        country: 'Ecuador',
        accountType: intentAccountType,
        activeMode,
        isVerified: true,
        createdAt: now,
        updatedAt: now,
        status: 'active'
      };
      await setDoc(userRef, newProfile);
      setUserProfile(newProfile);

      if (intentAccountType === 'specialist' || intentAccountType === 'both') {
        const newSpec: SpecialistProfile = {
          userId: cred.user.uid,
          professionalName: cred.user.displayName || 'Especialista',
          headline: 'Especialista en AGO Marketplace',
          description: 'Servicios profesionales con garantía en Ecuador.',
          categories: [],
          skills: [],
          experienceYears: 1,
          location: 'Ecuador',
          serviceArea: 'Presencial / Remoto',
          remoteAvailable: true,
          responseTime: 'Menos de 1 hora',
          completedJobs: 0,
          ratingAverage: 5.0,
          ratingCount: 0,
          verificationStatus: 'pending',
          profileStatus: 'active',
          createdAt: now,
          updatedAt: now
        };
        await setDoc(doc(db, 'specialistProfiles', cred.user.uid), newSpec);
        setSpecialistProfile(newSpec);
      }
    } else {
      setUserProfile(userSnap.data() as UserProfile);
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUserProfile(null);
    setSpecialistProfile(null);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const switchActiveMode = async (mode: 'requester' | 'specialist') => {
    if (!currentUser || !userProfile) return;

    // If switching to specialist mode and no specialist profile exists yet, create default
    if (mode === 'specialist' && !specialistProfile) {
      const now = new Date().toISOString();
      const newSpec: SpecialistProfile = {
        userId: currentUser.uid,
        professionalName: userProfile.displayName,
        headline: 'Especialista en AGO Marketplace',
        description: 'Servicios profesionales y técnicos en Ecuador.',
        categories: [],
        skills: [],
        experienceYears: 1,
        location: userProfile.city ? `${userProfile.city}, ${userProfile.province || 'Ecuador'}` : 'Ecuador',
        serviceArea: 'Presencial y Remoto',
        remoteAvailable: true,
        responseTime: 'Menos de 2 horas',
        completedJobs: 0,
        ratingAverage: 5.0,
        ratingCount: 0,
        verificationStatus: 'pending',
        profileStatus: 'active',
        createdAt: now,
        updatedAt: now
      };
      await setDoc(doc(db, 'specialistProfiles', currentUser.uid), newSpec);
      setSpecialistProfile(newSpec);

      // Also ensure user profile accountType reflects capability
      if (userProfile.accountType === 'requester') {
        await updateDoc(doc(db, 'users', currentUser.uid), { accountType: 'both' });
        userProfile.accountType = 'both';
      }
    }

    await updateDoc(doc(db, 'users', currentUser.uid), {
      activeMode: mode,
      updatedAt: new Date().toISOString()
    });

    setUserProfile({
      ...userProfile,
      activeMode: mode
    });
  };

  const updateUserProfileData = async (data: Partial<UserProfile>) => {
    if (!currentUser || !userProfile) return;
    const now = new Date().toISOString();
    await updateDoc(doc(db, 'users', currentUser.uid), {
      ...data,
      updatedAt: now
    });
    setUserProfile({
      ...userProfile,
      ...data,
      updatedAt: now
    });
  };

  const updateSpecialistProfileData = async (data: Partial<SpecialistProfile>) => {
    if (!currentUser) return;
    const now = new Date().toISOString();
    const docRef = doc(db, 'specialistProfiles', currentUser.uid);
    await setDoc(docRef, {
      ...specialistProfile,
      ...data,
      userId: currentUser.uid,
      updatedAt: now
    }, { merge: true });

    setSpecialistProfile(prev => prev ? ({ ...prev, ...data, updatedAt: now }) : null);
  };

  const isAdmin = currentUser?.email === 'agoserviplace@gmail.com' || userProfile?.accountType === 'admin';
  const activeMode = userProfile?.activeMode || 'requester';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        specialistProfile,
        loading,
        activeMode,
        isAdmin,
        loginWithEmail,
        registerWithEmail,
        loginWithGoogle,
        logout,
        resetPassword,
        switchActiveMode,
        updateUserProfileData,
        updateSpecialistProfileData
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
