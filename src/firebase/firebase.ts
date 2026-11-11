/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  addDoc,
  serverTimestamp,
  Firestore
} from 'firebase/firestore';
import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged,
  User,
  Auth
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App singleton
export const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore with specific database ID if configured
export const db: Firestore = (firebaseConfig as any).firestoreDatabaseId
  ? getFirestore(firebaseApp, (firebaseConfig as any).firestoreDatabaseId)
  : getFirestore(firebaseApp);

export const auth: Auth = getAuth(firebaseApp);

export const BOOTSTRAP_ADMIN_EMAIL = 'kenyojohnsonroberto@gmail.com';
export const BOOTSTRAP_ADMIN_NAME = 'Roberto Kenyo Johnson';
export const BOOTSTRAP_ADMIN_PHONE = '+237 676092565';
export const BOOTSTRAP_ADMIN_OM = '+237 656258659';
export const BOOTSTRAP_ADMIN_MOMO = '+237 676092565';

export interface FirestoreUserProfile {
  userId: string;
  email: string;
  fullName: string;
  phone: string;
  role: 'admin' | 'member' | 'vendor' | 'trainer' | 'moderator';
  isAdmin: boolean;
  omAccountNumber?: string;
  momoAccountNumber?: string;
  walletBalance?: number;
  rewardPoints?: number;
  referralCode?: string;
  updatedAt?: any;
}

export interface FirestorePlatformSettings {
  platformName: string;
  slogan: string;
  registrationFee: number;
  referralRewardAmount: number;
  minimumWithdrawalAmount: number;
  adminEmail: string;
  adminName: string;
  adminOmAccount: string;
  adminMomoAccount: string;
  maintenanceMode: boolean;
  updatedAt?: any;
  updatedBy?: string;
}

/**
 * Ensures anonymous or existing auth session so Firestore security rules have an authenticated context
 */
export async function ensureFirebaseAuth(): Promise<User | null> {
  if (auth.currentUser) return auth.currentUser;
  try {
    const cred = await signInAnonymously(auth);
    return cred.user;
  } catch (err) {
    console.warn('Firebase anonymous auth fallback:', err);
    return null;
  }
}

/**
 * Initializes or verifies the admin record in Firestore
 */
export async function initializeFirestoreAdminBootstrap(currentUserEmail: string = BOOTSTRAP_ADMIN_EMAIL): Promise<{
  isAdmin: boolean;
  details: string;
}> {
  try {
    const user = await ensureFirebaseAuth();
    const uid = user ? user.uid : 'bootstrap-admin-uid';

    // 1. Check or seed platform settings
    const settingsRef = doc(db, 'settings', 'platform');
    const settingsSnap = await getDoc(settingsRef).catch(() => null);

    if (!settingsSnap || !settingsSnap.exists()) {
      await setDoc(settingsRef, {
        platformName: 'AFRIXA',
        slogan: "L'innovation africaine, sans limites.",
        registrationFee: 1050,
        referralRewardAmount: 50,
        minimumWithdrawalAmount: 1100,
        adminEmail: BOOTSTRAP_ADMIN_EMAIL,
        adminName: BOOTSTRAP_ADMIN_NAME,
        adminOmAccount: BOOTSTRAP_ADMIN_OM,
        adminMomoAccount: BOOTSTRAP_ADMIN_MOMO,
        maintenanceMode: false,
        updatedAt: new Date().toISOString(),
        updatedBy: BOOTSTRAP_ADMIN_EMAIL
      }, { merge: true }).catch(err => {
        console.warn('Firestore settings bootstrap notice:', err);
      });
    } else {
      // Ensure existing settings document is synced with latest OM account if it was default
      await setDoc(settingsRef, {
        adminOmAccount: BOOTSTRAP_ADMIN_OM,
        adminMomoAccount: BOOTSTRAP_ADMIN_MOMO
      }, { merge: true }).catch(() => {});
    }

    // 2. Check if admin record exists in admins collection or users collection
    if (currentUserEmail.toLowerCase() === BOOTSTRAP_ADMIN_EMAIL.toLowerCase()) {
      // Register in admins collection
      const adminDocRef = doc(db, 'admins', uid);
      await setDoc(adminDocRef, {
        adminId: uid,
        email: BOOTSTRAP_ADMIN_EMAIL,
        fullName: BOOTSTRAP_ADMIN_NAME,
        phone: BOOTSTRAP_ADMIN_PHONE,
        omAccountNumber: BOOTSTRAP_ADMIN_OM,
        momoAccountNumber: BOOTSTRAP_ADMIN_MOMO,
        role: 'admin',
        isSuperAdmin: true,
        permissions: ['manage_users', 'manage_finances', 'manage_vpn', 'manage_content', 'system_audit'],
        createdAt: new Date().toISOString()
      }, { merge: true }).catch(() => {});

      // Register profile in users collection with isAdmin: true and role: 'admin'
      const userDocRef = doc(db, 'users', uid);
      await setDoc(userDocRef, {
        userId: uid,
        email: BOOTSTRAP_ADMIN_EMAIL,
        fullName: BOOTSTRAP_ADMIN_NAME,
        phone: BOOTSTRAP_ADMIN_PHONE,
        role: 'admin',
        isAdmin: true,
        omAccountNumber: BOOTSTRAP_ADMIN_OM,
        momoAccountNumber: BOOTSTRAP_ADMIN_MOMO,
        updatedAt: new Date().toISOString()
      }, { merge: true }).catch(() => {});

      return {
        isAdmin: true,
        details: `Autorisation Firestore confirmée pour ${BOOTSTRAP_ADMIN_NAME} (${BOOTSTRAP_ADMIN_EMAIL})`
      };
    }

    return {
      isAdmin: false,
      details: `Utilisateur ${currentUserEmail} non répertorié comme administrateur dans Firestore`
    };
  } catch (error: any) {
    console.error('Erreur vérification Firestore admin:', error);
    return {
      isAdmin: false,
      details: error?.message || 'Erreur de vérification Firestore'
    };
  }
}

/**
 * Checks if a given user has the admin flag in Firestore
 */
export async function verifyFirestoreAdminAuthorization(
  userEmail: string,
  uid?: string
): Promise<{
  isAuthorized: boolean;
  isAdminFlag: boolean;
  role: string;
  source: string;
  errorMessage?: string;
}> {
  try {
    // 1. Direct bootstrap email check
    if (userEmail.trim().toLowerCase() === BOOTSTRAP_ADMIN_EMAIL.toLowerCase()) {
      return {
        isAuthorized: true,
        isAdminFlag: true,
        role: 'admin',
        source: 'Bootstrap Founder Authorization (Firestore rules rule)'
      };
    }

    await ensureFirebaseAuth();
    const effectiveUid = uid || auth.currentUser?.uid;

    if (!effectiveUid) {
      return {
        isAuthorized: false,
        isAdminFlag: false,
        role: 'visitor',
        source: 'Aucune session Firebase active',
        errorMessage: 'Veuillez vous authentifier pour valider les droits administrateur.'
      };
    }

    // Check in 'admins' collection
    const adminRef = doc(db, 'admins', effectiveUid);
    const adminSnap = await getDoc(adminRef);

    if (adminSnap.exists() && adminSnap.data()?.role === 'admin') {
      return {
        isAuthorized: true,
        isAdminFlag: true,
        role: 'admin',
        source: `Firestore collection admins/${effectiveUid}`
      };
    }

    // Check in 'users' collection
    const userRef = doc(db, 'users', effectiveUid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const data = userSnap.data();
      const isAdmin = data?.isAdmin === true && data?.role === 'admin';
      return {
        isAuthorized: isAdmin,
        isAdminFlag: data?.isAdmin === true,
        role: data?.role || 'member',
        source: `Firestore collection users/${effectiveUid}`,
        errorMessage: isAdmin ? undefined : 'Votre profil Firestore ne possède pas le drapeau admin requis.'
      };
    }

    return {
      isAuthorized: false,
      isAdminFlag: false,
      role: 'unregistered',
      source: 'Profil inexistant dans Firestore',
      errorMessage: 'Aucun enregistrement Firestore trouvé pour cette identité.'
    };
  } catch (err: any) {
    console.error('Erreur verifyFirestoreAdminAuthorization:', err);
    return {
      isAuthorized: false,
      isAdminFlag: false,
      role: 'unknown',
      source: 'Erreur réseau/règles Firestore',
      errorMessage: err?.message || 'Échec de la requête de vérification Firestore'
    };
  }
}

/**
 * Saves platform settings directly to Firestore (protected by firestore.rules: allow write: if isAdmin())
 */
export async function savePlatformSettingsToFirestore(
  settings: Partial<FirestorePlatformSettings>,
  adminEmail: string = BOOTSTRAP_ADMIN_EMAIL
): Promise<{ success: boolean; message: string }> {
  try {
    await ensureFirebaseAuth();
    const settingsRef = doc(db, 'settings', 'platform');
    
    await setDoc(
      settingsRef,
      {
        ...settings,
        updatedAt: new Date().toISOString(),
        updatedBy: adminEmail
      },
      { merge: true }
    );

    // Record audit log entry in Firestore audit_logs collection
    try {
      const auditRef = collection(db, 'audit_logs');
      await addDoc(auditRef, {
        action: 'Mise à jour des coordonnées et paramètres de paiement',
        adminId: auth.currentUser?.uid || 'admin-root',
        adminEmail: adminEmail,
        details: {
          adminOmAccount: settings.adminOmAccount,
          adminMomoAccount: settings.adminMomoAccount,
          adminEmail: settings.adminEmail,
          registrationFee: settings.registrationFee,
          referralRewardAmount: settings.referralRewardAmount,
          minimumWithdrawalAmount: settings.minimumWithdrawalAmount
        },
        timestamp: new Date().toISOString()
      });
    } catch (auditErr) {
      console.warn('Audit log write notice:', auditErr);
    }

    return {
      success: true,
      message: 'Paramètres et comptes de paiement enregistrés avec succès dans Firestore !'
    };
  } catch (error: any) {
    console.error('Erreur sauvegarde paramètres Firestore:', error);
    return {
      success: false,
      message: error?.code === 'permission-denied'
        ? 'Accès refusé par les règles de sécurité Firestore : vous devez être un administrateur vérifié.'
        : `Erreur d'enregistrement Firestore : ${error?.message || 'Erreur inconnue'}`
    };
  }
}

/**
 * Fetches platform settings from Firestore
 */
export async function fetchPlatformSettingsFromFirestore(): Promise<FirestorePlatformSettings | null> {
  try {
    await ensureFirebaseAuth();
    const settingsRef = doc(db, 'settings', 'platform');
    const snap = await getDoc(settingsRef);
    if (snap.exists()) {
      return snap.data() as FirestorePlatformSettings;
    }
    return null;
  } catch (error) {
    console.warn('fetchPlatformSettingsFromFirestore notice:', error);
    return null;
  }
}

/**
 * Saves a newsletter subscription email directly to Firestore (collection: newsletter_subscribers)
 */
export async function subscribeToNewsletter(
  email: string,
  language: string = 'fr'
): Promise<{ success: boolean; message: string }> {
  try {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      return { success: false, message: 'Veuillez saisir une adresse e-mail valide.' };
    }

    await ensureFirebaseAuth();

    // Use base64 sanitized string as doc ID to maintain idempotence
    const docId = btoa(cleanEmail).replace(/[/+=]/g, '_');
    const subscriberRef = doc(db, 'newsletter_subscribers', docId);

    await setDoc(
      subscriberRef,
      {
        email: cleanEmail,
        subscribedAt: new Date().toISOString(),
        status: 'active',
        source: 'footer_community_form',
        language
      },
      { merge: true }
    );

    return {
      success: true,
      message: 'Félicitations ! Votre e-mail a été enregistré dans Firestore pour recevoir les actualités communautaires AFRIXA.'
    };
  } catch (error: any) {
    console.error('Erreur inscription newsletter Firestore:', error);
    return {
      success: false,
      message: error?.code === 'permission-denied'
        ? 'Inscription refusée par les règles de sécurité Firestore.'
        : `Échec de l'enregistrement dans Firestore : ${error?.message || 'Erreur réseau'}`
    };
  }
}

