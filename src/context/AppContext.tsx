/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  UserProfile,
  Role,
  LanguageCode,
  Course,
  DigitalBook,
  SoftwareApp,
  MarketplaceProduct,
  Store,
  CartItem,
  Order,
  VPNServer,
  VPNConfigProfile,
  VPNSubscription,
  CommunityPost,
  NewsArticle,
  ReferralUser,
  WithdrawalRequest,
  WalletTransaction,
  NotificationItem,
  AuditLogItem,
  SiteSettings,
  PaymentTransaction,
  FirestoreAdminCheckResult,
} from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import {
  initializeFirestoreAdminBootstrap,
  verifyFirestoreAdminAuthorization,
  savePlatformSettingsToFirestore,
  fetchPlatformSettingsFromFirestore,
  BOOTSTRAP_ADMIN_EMAIL,
  BOOTSTRAP_ADMIN_NAME,
  BOOTSTRAP_ADMIN_PHONE,
  BOOTSTRAP_ADMIN_OM,
  BOOTSTRAP_ADMIN_MOMO
} from '../firebase/firebase';

// Default Administrator user corresponding to the user's explicit account
const DEFAULT_USER: UserProfile = {
  id: 'usr-afx-admin-01',
  name: 'Roberto Kenyo Johnson',
  email: 'kenyojohnsonroberto@gmail.com',
  phone: '+237 676092565',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  role: 'admin',
  membershipStatus: 'active',
  registrationDate: '2026-09-01',
  referralCode: 'AFX-KENYO-ADMIN',
  emailVerified: true,
  twoFactorEnabled: true,
  country: 'Cameroun',
  omAccountNumber: '+237 656258659',
  momoAccountNumber: '+237 676092565',
};

const DEFAULT_SETTINGS: SiteSettings = {
  appName: 'AFRIXA',
  slogan: "L'innovation africaine, sans limites.",
  registrationFee: 1050, // 1050 FCFA
  referralRewardAmount: 50, // 50 FCFA
  minimumWithdrawalAmount: 1100, // 1100 FCFA
  contactEmail: 'kenyojohnsonroberto@gmail.com',
  supportPhone: '+237 676092565',
  adminEmail: 'kenyojohnsonroberto@gmail.com',
  adminName: 'Roberto Kenyo Johnson',
  adminOmAccount: '+237 656258659',
  adminMomoAccount: '+237 676092565',
  sandboxMode: true,
  activeLanguages: ['fr', 'en', 'es', 'pt', 'de', 'ar', 'zh', 'sw'],
  maintenanceMode: false,
};


const INITIAL_COURSES: Course[] = [
  {
    id: 'course-1',
    title: 'Intelligence Artificielle & Automatisation pour Entreprises Africaines',
    category: 'ai',
    instructor: 'Dr. Cheikh Tidiane Sy',
    instructorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=600&auto=format&fit=crop&q=80',
    description: 'Maîtrisez les modèles de langage, le machine learning appliqué au contexte africain, et automatisez vos processus de vente et support client.',
    price: 0,
    isFree: true,
    duration: '14 heures',
    rating: 4.9,
    enrolledCount: 3420,
    level: 'Intermédiaire',
    published: true,
    modules: [
      {
        id: 'm1',
        title: 'Fondations de l’IA Générative et opportunités en Afrique',
        lessons: [
          { id: 'l1', title: 'Introduction & Cas d’usage réels en Afrique de l’Ouest', duration: '18 min', content: 'Comprendre l’écosystème IA en Afrique, les défis d’infrastructure et les opportunités de création de valeur locale.' },
          { id: 'l2', title: 'Prompt Engineering avancé pour développeurs', duration: '24 min', content: 'Techniques de zero-shot, few-shot et structuration de prompts pour des applications fiables.' }
        ]
      },
      {
        id: 'm2',
        title: 'Intégration et Déploiement Pratique',
        lessons: [
          { id: 'l3', title: 'Création d’un agent de support client multilingue', duration: '35 min', content: 'Mise en place d’un bot WhatsApp / Web connecté à vos données produit.' }
        ]
      }
    ]
  },
  {
    id: 'course-2',
    title: 'Développement Web Full Stack Moderne (React, Node.js & Cloud)',
    category: 'tech',
    instructor: 'Aïssatou Ba',
    instructorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
    description: 'De zéro à la production : concevez des plateformes web scalables avec React, TypeScript, API REST et architecture distribuée.',
    price: 3500,
    isFree: false,
    duration: '26 heures',
    rating: 4.8,
    enrolledCount: 1890,
    level: 'Débutant',
    published: true,
    modules: [
      {
        id: 'm1',
        title: 'Architecture Web & TypeScript',
        lessons: [
          { id: 'l1', title: 'Composants modernes et gestion d’état globale', duration: '30 min', content: 'Structuration propre des composants React et hooks personnalisés.' },
          { id: 'l2', title: 'Sécurité frontend et flux d’authentification sécurisés', duration: '40 min', content: 'Gestion des tokens, sécurité contre les injections et validation des entrées.' }
        ]
      }
    ]
  },
  {
    id: 'course-3',
    title: 'AgriTech & Objets Connectés (IoT) pour l’Agriculture Durable',
    category: 'agritech',
    instructor: 'Ing. Kwame Osei',
    instructorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=600&auto=format&fit=crop&q=80',
    description: 'Surveillance des sols par capteurs IoT à bas coût, automatisation de l’irrigation et optimisation des récoltes grâce à la télémétrie.',
    price: 2500,
    isFree: false,
    duration: '10 heures',
    rating: 4.9,
    enrolledCount: 940,
    level: 'Intermédiaire',
    published: true,
    modules: [
      {
        id: 'm1',
        title: 'Capteurs et microcontrôleurs en milieu tropical',
        lessons: [
          { id: 'l1', title: 'Choisir ses sondes d’humidité et microcontrôleurs basse consommation', duration: '25 min', content: 'Sélectionner le matériel robuste pour climat chaud et humide.' }
        ]
      }
    ]
  }
];

const INITIAL_BOOKS: DigitalBook[] = [
  {
    id: 'book-1',
    title: 'L’Éveil Technologique Africain : Le Guide de l’Entrepreneur Moderne',
    author: 'Kofi Mensah & Mariama Sarr',
    coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop&q=80',
    description: 'Une analyse percutante des opportunités business non exploitées en Afrique subsaharienne dans la Fintech, la logistique et les énergies renouvelables.',
    category: 'Entrepreneuriat',
    price: 1500,
    pageCount: 248,
    fileSize: '4.8 MB',
    downloadsCount: 1420,
    published: true,
    pdfContentUrl: '#',
    previewSnippet: 'Le XXIe siècle sera le théâtre de l’affirmation technologique africaine. De Dakar à Nairobi, en passant par Kigali et Abidjan, les jeunes entrepreneurs ne se contentent plus de consommer des solutions conçues ailleurs...'
  },
  {
    id: 'book-2',
    title: 'Guide Pratique de la Cybersécurité & Souveraineté Numérique',
    author: 'Jean-Luc Kouamé',
    coverImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&auto=format&fit=crop&q=80',
    description: 'Protection des données, navigation sécurisée, protocoles chiffrés et gestion de crise cyber pour PME africaines.',
    category: 'Sécurité',
    price: 0,
    pageCount: 180,
    fileSize: '3.2 MB',
    downloadsCount: 3890,
    published: true,
    pdfContentUrl: '#',
    previewSnippet: 'La donnée est devenue le nouveau pétrole, mais sans coffre-fort adapté, chaque transaction est un risque. Ce guide décortique les méthodes d’ingénierie sociale...'
  },
  {
    id: 'book-3',
    title: 'De l’Idée au Produit : Manuel de l’Innovateur Panafricain',
    author: 'Ndeye Fatou Kane',
    coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&auto=format&fit=crop&q=80',
    description: 'Méthodologie Lean Startup adaptée aux marchés africains avec études de cas inspirantes.',
    category: 'Innovation',
    price: 1200,
    pageCount: 195,
    fileSize: '2.9 MB',
    downloadsCount: 880,
    published: true,
    pdfContentUrl: '#',
    previewSnippet: 'Valider une idée sur un marché à forte informalité exige des métriques adaptées. Vous découvrirez ici comment concevoir votre MVP avec moins de 50 000 FCFA...'
  }
];

const INITIAL_APPS: SoftwareApp[] = [
  {
    id: 'app-1',
    name: 'AFRIXA Secure Tunnel Companion',
    logo: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=120&auto=format&fit=crop&q=80',
    tagline: 'Générateur et gestionnaire sécurisé de profils de connexion VLESS / WireGuard',
    description: 'Outil léger permettant la validation syntaxique, la mesure de ping et l’exportation de configurations réseau sécurisées pour les étudiants et chercheurs.',
    version: 'v2.4.1',
    category: 'security',
    price: 0,
    downloadUrl: '#download-afrixa-tunnel',
    platforms: ['Android', 'Windows', 'Linux'],
    licenseType: 'Gratuit',
    screenshots: [
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&auto=format&fit=crop&q=80'
    ],
    published: true
  },
  {
    id: 'app-2',
    name: 'Sahel Mobile Billing & Invoicing Tool',
    logo: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=120&auto=format&fit=crop&q=80',
    tagline: 'Facturation hors-ligne et reçus numériques pour commerçants indépendants',
    description: 'Générez des devis et factures conformes OHADA directement sur smartphone, envoyez par WhatsApp ou SMS et suivez vos créances sans connexion permanente.',
    version: 'v3.1.0',
    category: 'productivity',
    price: 2000,
    downloadUrl: '#download-sahel-billing',
    platforms: ['Android', 'Web'],
    licenseType: 'Licence AFRIXA',
    screenshots: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&auto=format&fit=crop&q=80'
    ],
    published: true
  },
  {
    id: 'app-3',
    name: 'AfriCode Studio Mobile IDE',
    logo: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=120&auto=format&fit=crop&q=80',
    tagline: 'Environnement de développement léger pour programmer sur smartphone',
    description: 'Compilateur HTML/JS/Python local ultra optimisé pour les étudiants ne disposant que d’un terminal mobile Android.',
    version: 'v1.8.5',
    category: 'developer',
    price: 0,
    downloadUrl: '#download-africode',
    platforms: ['Android'],
    licenseType: 'Gratuit',
    screenshots: [
      'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=80'
    ],
    published: true
  }
];

const INITIAL_PRODUCTS: MarketplaceProduct[] = [
  {
    id: 'prod-1',
    title: 'Kit Solaire Portable Haute Efficacité 50W avec Ports USB-C & 12V',
    storeId: 'store-1',
    storeName: 'SolarAfrik Solutions',
    price: 34500,
    category: 'Énergie & Matériel',
    image: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=500&auto=format&fit=crop&q=80',
    description: 'Panneau monocristallin pliable ultra résistant pour recharger ordinateurs, téléphones et alimenter routeurs 4G en zone rurale.',
    type: 'physical',
    stock: 18,
    rating: 4.9,
    reviewsCount: 42,
    published: true
  },
  {
    id: 'prod-2',
    title: 'Pack Modèles UI/UX Figma "African Tech Vibes" (120+ Écrans Mobile)',
    storeId: 'store-2',
    storeName: 'Dakar Design Studio',
    price: 2500,
    category: 'Design & Templates',
    image: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=500&auto=format&fit=crop&q=80',
    description: 'Design system complet intégrant les codes visuels contemporains africains, composants prêts pour Flutter et React Native.',
    type: 'digital',
    stock: 999,
    rating: 4.8,
    reviewsCount: 67,
    digitalDownloadUrl: 'https://afrixa.org/downloads/design-system-v1.zip',
    published: true
  },
  {
    id: 'prod-3',
    title: 'Routeur 4G LTE Wi-Fi Débloqué Longue Portée avec Batterie 5000mAh',
    storeId: 'store-1',
    storeName: 'SolarAfrik Solutions',
    price: 22000,
    category: 'Réseaux & Télécoms',
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=500&auto=format&fit=crop&q=80',
    description: 'Compatible avec toutes les puces SIM (Orange, MTN, Moov, Free). Autonomie de 12 heures en utilisation continue.',
    type: 'physical',
    stock: 25,
    rating: 4.7,
    reviewsCount: 31,
    published: true
  }
];

const INITIAL_STORES: Store[] = [
  {
    id: 'store-1',
    ownerId: 'usr-seller-1',
    name: 'SolarAfrik Solutions',
    logo: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=100&auto=format&fit=crop&q=80',
    description: 'Équipements solaires et télécoms fiables pour entrepreneurs nomades.',
    verified: true,
    productsCount: 6,
    totalSales: 154,
    rating: 4.9
  },
  {
    id: 'store-2',
    ownerId: 'usr-seller-2',
    name: 'Dakar Design Studio',
    logo: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=100&auto=format&fit=crop&q=80',
    description: 'Ressources graphiques et modèles d’applications par des designers africains.',
    verified: true,
    productsCount: 12,
    totalSales: 380,
    rating: 4.8
  }
];

const INITIAL_VPN_SERVERS: VPNServer[] = [
  {
    id: 'srv-senegal',
    country: 'Sénégal',
    countryCode: 'SN',
    city: 'Dakar',
    name: 'Dakar-Alpha-01 (Orange IXP)',
    ip: '197.149.200.45',
    status: 'online',
    latencyMs: 14,
    capacityPercent: 42,
    supportedProtocols: ['VLESS', 'VMess', 'WireGuard', 'Shadowsocks'],
    flag: '🇸🇳'
  },
  {
    id: 'srv-ci',
    country: 'Côte d’Ivoire',
    countryCode: 'CI',
    city: 'Abidjan',
    name: 'Abidjan-Hub-01 (MainOne)',
    ip: '160.155.12.89',
    status: 'online',
    latencyMs: 22,
    capacityPercent: 58,
    supportedProtocols: ['VLESS', 'WireGuard', 'Trojan', 'Hysteria2'],
    flag: '🇨🇮'
  },
  {
    id: 'srv-rsa',
    country: 'Afrique du Sud',
    countryCode: 'ZA',
    city: 'Johannesburg',
    name: 'Joburg-Gigabit-01 (NAPAfrica)',
    ip: '196.25.1.10',
    status: 'online',
    latencyMs: 65,
    capacityPercent: 35,
    supportedProtocols: ['WireGuard', 'VMess', 'SSH', 'VLESS'],
    flag: '🇿🇦'
  },
  {
    id: 'srv-france',
    country: 'France',
    countryCode: 'FR',
    city: 'Paris',
    name: 'Paris-Direct-01 (OVHcloud)',
    ip: '51.15.80.201',
    status: 'online',
    latencyMs: 78,
    capacityPercent: 62,
    supportedProtocols: ['VLESS', 'VMess', 'WireGuard', 'Trojan', 'Shadowsocks'],
    flag: '🇫🇷'
  },
  {
    id: 'srv-germany',
    country: 'Allemagne',
    countryCode: 'DE',
    city: 'Francfort',
    name: 'Frankfurt-Core-01',
    ip: '162.55.120.34',
    status: 'online',
    latencyMs: 84,
    capacityPercent: 47,
    supportedProtocols: ['VLESS', 'WireGuard', 'Hysteria2'],
    flag: '🇩🇪'
  }
];

const INITIAL_VPN_PROFILES: VPNConfigProfile[] = [
  {
    id: 'cfg-1',
    name: 'AFRIXA-Fast-Dakar-VLESS',
    protocol: 'VLESS',
    serverAddress: 'dakar01.afrixa-network.net',
    port: 443,
    uuidOrKey: 'e7b1c410-8b43-4f9e-9d8a-6b2a0c4f8291',
    networkType: 'ws',
    tls: true,
    rawConfig: 'vless://e7b1c410-8b43-4f9e-9d8a-6b2a0c4f8291@dakar01.afrixa-network.net:443?type=ws&security=tls&path=%2Fafrixa-tunnel#AFRIXA-Fast-Dakar-VLESS',
    createdAt: '2026-10-10'
  },
  {
    id: 'cfg-2',
    name: 'AFRIXA-Secure-Joburg-WireGuard',
    protocol: 'WireGuard',
    serverAddress: 'joburg01.afrixa-network.net',
    port: 51820,
    uuidOrKey: 'yK8G9zUe0L...PublicKey',
    networkType: 'udp',
    tls: true,
    rawConfig: `[Interface]\nPrivateKey = aG9z...==\nAddress = 10.8.0.4/24\nDNS = 1.1.1.1\n\n[Peer]\nPublicKey = yK8G9zUe0L...\nEndpoint = joburg01.afrixa-network.net:51820\nAllowedIPs = 0.0.0.0/0`,
    createdAt: '2026-10-18'
  }
];

const INITIAL_POSTS: CommunityPost[] = [
  {
    id: 'post-1',
    authorId: 'usr-101',
    authorName: 'Mamadou Touré',
    authorAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    authorRole: 'member',
    content: 'Fier d’avoir déployé ma première application décentralisée grâce aux modules d’AFRIXA Academy ! L’avenir numérique de notre continent s’écrit maintenant.',
    category: 'Tech',
    likesCount: 38,
    likedByCurrentUser: true,
    commentsCount: 3,
    timestamp: 'Il y a 3 heures',
    comments: [
      { id: 'c1', authorName: 'Aminata Sow', authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80', content: 'Bravo Mamadou ! Quel framework as-tu utilisé pour le frontend ?', timestamp: 'Il y a 2 heures' },
      { id: 'c2', authorName: 'Mamadou Touré', authorAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80', content: 'React avec TypeScript et Tailwind, comme recommandé dans le cours !', timestamp: 'Il y a 1 heure' }
    ]
  },
  {
    id: 'post-2',
    authorId: 'usr-102',
    authorName: 'Grace Mutua',
    authorAvatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80',
    authorRole: 'instructor',
    content: 'Webinaire ce jeudi à 18h GMT sur la tokenisation d’actifs réels (RWA) et le financement participatif des PME agricoles. Lien dans l’académie !',
    category: 'Cryptomonnaie',
    likesCount: 54,
    likedByCurrentUser: false,
    commentsCount: 5,
    timestamp: 'Il y a 6 heures',
    comments: []
  }
];

const INITIAL_NEWS: NewsArticle[] = [
  {
    id: 'news-1',
    title: 'L’Afrique subsaharienne franchit le cap des 300 millions de comptes Mobile Money actifs',
    summary: 'Une croissance record propulsée par l’interopérabilité bancaire et l’émergence de nouveaux services de micro-crédit et paiements marchands.',
    content: 'Les dernières données publiées par la GSMA confirment la position de leader mondial de l’Afrique dans l’adoption des paiements mobiles. Avec un volume de transactions annuel dépassant 800 milliards de dollars, les acteurs locaux transforment radicalement le commerce de détail, l’e-commerce et l’inclusion financière des populations non bancarisées.',
    category: 'Entrepreneuriat',
    author: 'Rédaction AFRIXA',
    date: '2 Novembre 2026',
    readTime: '4 min',
    imageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80',
    isPremium: false,
    viewsCount: 2840
  },
  {
    id: 'news-2',
    title: 'Souveraineté des données : De nouveaux Datacenters neutres inaugurés à Abidjan et Lagos',
    summary: 'Ces infrastructures de niveau Tier III réduisent considérablement la latence réseau et renforcent la sécurité des échanges numériques.',
    content: 'La mise en service de ces nouveaux nœuds d’échange Internet (IXP) et datacenters neutres permet désormais aux startups et gouvernements africains d’héberger localement leurs données critiques sans dépendre systématiquement de liaisons sous-marines vers l’Europe.',
    category: 'Technologie',
    author: 'Bakary Traoré',
    date: '31 Octobre 2026',
    readTime: '6 min',
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80',
    isPremium: true,
    viewsCount: 1950
  },
  {
    id: 'news-3',
    title: 'Programme panafricain de bourses AFRIXA : 10 000 jeunes formés aux métiers de l’IA d’ici 2027',
    summary: 'Un engagement fort pour doter la jeunesse des outils techniques nécessaires pour inventer des solutions locales aux grands défis.',
    content: 'En partenariat avec des universités technologiques et des acteurs de la Tech, AFRIXA déploie un cursus certifiant 100% en ligne couplé à du mentorat par des ingénieurs confirmés de la diaspora et du continent.',
    category: 'Éducation',
    author: 'Aïda Ndiaye',
    date: '28 Octobre 2026',
    readTime: '3 min',
    imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&auto=format&fit=crop&q=80',
    isPremium: false,
    viewsCount: 4120
  }
];

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    type: 'account_activated',
    title: 'Bienvenue sur AFRIXA !',
    message: 'Votre adhésion est confirmée. Vous avez accès à l’ensemble des modules de la plateforme.',
    timestamp: '2026-11-01 10:14',
    read: false
  },
  {
    id: 'notif-2',
    type: 'reward',
    title: 'Récompense de parrainage créditée !',
    message: 'Votre filleul Ousmane S. a validé son adhésion. Vous avez reçu +50 FCFA sur votre portefeuille.',
    timestamp: '2026-11-02 14:30',
    read: false
  },
  {
    id: 'notif-3',
    type: 'admin_announcement',
    title: 'Nouveaux serveurs VPN ajoutés',
    message: 'Deux nouveaux nœuds haute vitesse à Dakar et Abidjan sont disponibles dans l’espace VPN.',
    timestamp: '2026-11-03 07:00',
    read: true
  }
];

interface AppContextType {
  currentUser: UserProfile | null;
  setCurrentUser: (user: UserProfile | null) => void;
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string) => string;
  
  // Role & Auth
  switchRole: (role: Role) => void;
  loginUser: (email: string) => void;
  registerUser: (name: string, email: string, referralCode?: string) => void;
  logoutUser: () => void;
  updateUserProfile: (data: Partial<UserProfile>) => void;
  
  // Data items
  courses: Course[];
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  enrolledCourseIds: string[];
  enrollInCourse: (courseId: string) => void;
  completeLesson: (courseId: string, lessonId: string) => void;
  
  books: DigitalBook[];
  setBooks: React.Dispatch<React.SetStateAction<DigitalBook[]>>;
  purchasedBookIds: string[];
  purchaseBook: (bookId: string) => void;
  
  apps: SoftwareApp[];
  setApps: React.Dispatch<React.SetStateAction<SoftwareApp[]>>;
  obtainedAppIds: string[];
  obtainApp: (appId: string) => void;
  
  products: MarketplaceProduct[];
  setProducts: React.Dispatch<React.SetStateAction<MarketplaceProduct[]>>;
  stores: Store[];
  cart: CartItem[];
  addToCart: (product: MarketplaceProduct) => void;
  removeFromCart: (productId: string) => void;
  updateCartQty: (productId: string, quantity: number) => void;
  clearCart: () => void;
  orders: Order[];
  createOrder: (deliveryType: 'digital_instant' | 'physical_shipping', address?: string) => Order;
  
  // VPN
  vpnServers: VPNServer[];
  setVpnServers: React.Dispatch<React.SetStateAction<VPNServer[]>>;
  vpnProfiles: VPNConfigProfile[];
  addVPNProfile: (profile: Omit<VPNConfigProfile, 'id' | 'createdAt'>) => void;
  deleteVPNProfile: (id: string) => void;
  vpnSubscription: VPNSubscription;
  pingServer: (id: string) => Promise<number>;
  
  // Community & News
  posts: CommunityPost[];
  createPost: (content: string, category: CommunityPost['category'], imageUrl?: string) => void;
  likePost: (id: string) => void;
  addComment: (postId: string, text: string) => void;
  news: NewsArticle[];
  setNews: React.Dispatch<React.SetStateAction<NewsArticle[]>>;
  
  // Wallet & Referral
  walletBalance: number;
  walletPending: number;
  walletTransactions: WalletTransaction[];
  referrals: ReferralUser[];
  withdrawalRequests: WithdrawalRequest[];
  requestWithdrawal: (amount: number, method: 'orange_money' | 'mtn_momo', phone: string) => { success: boolean; message: string };
  adminProcessWithdrawal: (id: string, newStatus: 'approved' | 'rejected' | 'paid', notes?: string) => void;
  
  // Payments
  paymentHistory: PaymentTransaction[];
  processSandboxPayment: (
    amount: number,
    purpose: PaymentTransaction['purpose'],
    method: 'orange_money' | 'mtn_momo',
    phone: string,
    targetId?: string,
    targetTitle?: string
  ) => Promise<{ success: boolean; reference: string; message: string }>;
  
  // Notifications
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addNotification: (notif: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => void;
  
  // Settings & Admin
  siteSettings: SiteSettings;
  updateSiteSettings: (settings: Partial<SiteSettings>) => void;
  auditLogs: AuditLogItem[];
  logAuditAction: (action: string, target: string, details: string, category?: AuditLogItem['category']) => void;
  
  // Firestore-backed Admin Authorization
  isFirestoreAdminVerified: boolean;
  isCheckingAdminAuth: boolean;
  firestoreAdminDetails: FirestoreAdminCheckResult | null;
  verifyAdminInFirestore: (email?: string) => Promise<boolean>;
  saveSettingsToFirestore: (settings: Partial<SiteSettings>) => Promise<{ success: boolean; message: string }>;
  
  // Navigation / Modal State
  activeView: string;
  setActiveView: (view: string) => void;
  activeModal: string | null;
  setActiveModal: (modal: string | null) => void;
  modalPayload: any;
  openModal: (modalName: string, payload?: any) => void;
  closeModal: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Navigation State
  const [activeView, setActiveView] = useState<string>('home');
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [modalPayload, setModalPayload] = useState<any>(null);

  // Language State
  const [language, setLanguageState] = useState<LanguageCode>('fr');

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    localStorage.setItem('afrixa_lang', lang);
  };

  const t = (key: string): string => {
    const langDict = TRANSLATIONS[language] || TRANSLATIONS['fr'];
    return langDict[key] || TRANSLATIONS['fr'][key] || key;
  };

  // User & Auth State (Administrator Roberto Kenyo Johnson)
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('afrixa_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.email === 'amadou.diallo@afrixa.org' || !parsed.email || parsed.email === 'kenyojohnsonroberto@gmail.com') {
          return {
            ...DEFAULT_USER,
            omAccountNumber: '+237 656258659',
            momoAccountNumber: '+237 676092565'
          };
        }
        return parsed;
      } catch (e) { /* ignore */ }
    }
    return DEFAULT_USER;
  });


  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('afrixa_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('afrixa_user');
    }
  }, [currentUser]);

  const switchRole = (role: Role) => {
    if (!currentUser) return;
    const updated: UserProfile = { ...currentUser, role };
    setCurrentUser(updated);

    if (role === 'admin') {
      const isEligible = currentUser.email.toLowerCase() === BOOTSTRAP_ADMIN_EMAIL.toLowerCase();
      setIsFirestoreAdminVerified(isEligible);
      verifyAdminInFirestore(currentUser.email);
    } else {
      setIsFirestoreAdminVerified(false);
      setFirestoreAdminDetails({
        isAuthorized: false,
        isAdminFlag: false,
        role: role,
        source: 'Rôle actif non-administrateur',
        errorMessage: 'Accès restreint : le compte actuel n’est pas en mode administrateur.'
      });
    }

    addNotification({
      type: 'account_activated',
      title: `Rôle basculé : ${role.toUpperCase()}`,
      message: `Vous naviguez désormais avec les permissions du rôle ${role}.`
    });
    logAuditAction(`Changement de rôle vers ${role}`, currentUser.name, `Rôle mis à jour: ${role}`, 'security');
  };

  const loginUser = (email: string) => {
    const user: UserProfile = {
      ...DEFAULT_USER,
      email,
      name: email.split('@')[0].toUpperCase(),
      role: 'member',
      membershipStatus: 'active'
    };
    setCurrentUser(user);
    addNotification({
      type: 'login',
      title: 'Connexion réussie',
      message: `Bienvenue à nouveau sur AFRIXA, ${user.name}.`
    });
    logAuditAction('Connexion utilisateur', email, 'Connexion réussie depuis le web', 'user');
  };

  const registerUser = (name: string, email: string, referralCode?: string) => {
    const newUser: UserProfile = {
      id: `usr-afx-${Date.now().toString().slice(-4)}`,
      name,
      email,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role: 'member',
      membershipStatus: 'active',
      registrationDate: new Date().toISOString().split('T')[0],
      referralCode: `AFX-${name.slice(0, 4).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
      referredBy: referralCode,
      emailVerified: true,
      twoFactorEnabled: false,
      country: 'Sénégal',
    };
    setCurrentUser(newUser);

    // If referred by someone, record and give 50 FCFA
    if (referralCode) {
      setReferrals(prev => [
        {
          id: `ref-${Date.now()}`,
          name: newUser.name,
          email: newUser.email,
          date: new Date().toISOString().split('T')[0],
          status: 'active_verified',
          rewardGranted: true,
          rewardAmount: siteSettings.referralRewardAmount
        },
        ...prev
      ]);
      setWalletBalance(prev => prev + siteSettings.referralRewardAmount);
      setWalletTransactions(prev => [
        {
          id: `tx-${Date.now()}`,
          userId: newUser.id,
          type: 'credit',
          amount: siteSettings.referralRewardAmount,
          description: `Bonus de parrainage éligible pour ${newUser.name}`,
          date: new Date().toISOString().split('T')[0],
          balanceAfter: walletBalance + siteSettings.referralRewardAmount
        },
        ...prev
      ]);
    }

    addNotification({
      type: 'registration',
      title: 'Inscription réussie !',
      message: `Bienvenue dans la famille AFRIXA, ${name} ! Votre compte est opérationnel.`
    });
    logAuditAction('Nouvelle inscription', email, `Inscription avec code parrain: ${referralCode || 'Aucun'}`, 'user');
  };

  const logoutUser = () => {
    setCurrentUser(null);
    setActiveView('home');
    logAuditAction('Déconnexion', 'Session', 'Utilisateur déconnecté', 'user');
  };

  const updateUserProfile = (data: Partial<UserProfile>) => {
    if (!currentUser) return;
    setCurrentUser({ ...currentUser, ...data });
    logAuditAction('Mise à jour du profil', currentUser.name, 'Modification des informations personnelles', 'user');
  };

  // Content State
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>(['course-1']);
  const [books, setBooks] = useState<DigitalBook[]>(INITIAL_BOOKS);
  const [purchasedBookIds, setPurchasedBookIds] = useState<string[]>(['book-2']);
  const [apps, setApps] = useState<SoftwareApp[]>(INITIAL_APPS);
  const [obtainedAppIds, setObtainedAppIds] = useState<string[]>(['app-1']);
  const [products, setProducts] = useState<MarketplaceProduct[]>(INITIAL_PRODUCTS);
  const [stores] = useState<Store[]>(INITIAL_STORES);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  const enrollInCourse = (courseId: string) => {
    if (!enrolledCourseIds.includes(courseId)) {
      setEnrolledCourseIds(prev => [...prev, courseId]);
      const crs = courses.find(c => c.id === courseId);
      addNotification({
        type: 'course_unlocked',
        title: 'Formation débloquée',
        message: `Vous êtes désormais inscrit à : ${crs?.title || 'Formation'}`
      });
      logAuditAction('Inscription formation', crs?.title || courseId, `Utilisateur inscrit à la formation`, 'content');
    }
  };

  const completeLesson = (courseId: string, lessonId: string) => {
    setCourses(prev =>
      prev.map(crs => {
        if (crs.id !== courseId) return crs;
        return {
          ...crs,
          modules: crs.modules.map(mod => ({
            ...mod,
            lessons: mod.lessons.map(lsn => (lsn.id === lessonId ? { ...lsn, completed: true } : lsn))
          }))
        };
      })
    );
  };

  const purchaseBook = (bookId: string) => {
    if (!purchasedBookIds.includes(bookId)) {
      setPurchasedBookIds(prev => [...prev, bookId]);
      const bk = books.find(b => b.id === bookId);
      addNotification({
        type: 'new_book',
        title: 'Livre disponible dans votre bibliothèque',
        message: `Vous avez accès au livre complet : ${bk?.title || 'Livre numérique'}`
      });
      logAuditAction('Achat de livre', bk?.title || bookId, 'Ajout à la bibliothèque personnelle', 'content');
    }
  };

  const obtainApp = (appId: string) => {
    if (!obtainedAppIds.includes(appId)) {
      setObtainedAppIds(prev => [...prev, appId]);
      const ap = apps.find(a => a.id === appId);
      addNotification({
        type: 'account_activated',
        title: 'Application activée',
        message: `Licence et lien de téléchargement débloqués pour ${ap?.name || 'Application'}`
      });
      logAuditAction('Activation application', ap?.name || appId, 'Application ajoutée aux outils membre', 'content');
    }
  };

  // Cart operations
  const addToCart = (product: MarketplaceProduct) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateCartQty = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => setCart([]);

  const createOrder = (deliveryType: 'digital_instant' | 'physical_shipping', address?: string): Order => {
    const totalAmount = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const newOrder: Order = {
      id: `ord-afx-${Date.now().toString().slice(-6)}`,
      userId: currentUser?.id || 'guest',
      items: [...cart],
      totalAmount,
      paymentReference: `AFX-PAY-${Date.now().toString().slice(-6)}`,
      paymentMethod: 'orange_money',
      status: 'paid',
      date: new Date().toISOString().split('T')[0],
      deliveryType,
      shippingAddress: address
    };
    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    addNotification({
      type: 'order',
      title: 'Commande validée avec succès !',
      message: `Votre commande #${newOrder.id} (${totalAmount.toLocaleString()} FCFA) a été confirmée.`
    });
    logAuditAction('Nouvelle commande', newOrder.id, `Montant: ${totalAmount} FCFA, Type: ${deliveryType}`, 'finance');
    return newOrder;
  };

  // VPN State
  const [vpnServers, setVpnServers] = useState<VPNServer[]>(INITIAL_VPN_SERVERS);
  const [vpnProfiles, setVpnProfiles] = useState<VPNConfigProfile[]>(INITIAL_VPN_PROFILES);
  const [vpnSubscription] = useState<VPNSubscription>({
    id: 'sub-afx-vpn-1',
    planName: 'AFRIXA High-Speed Unlimited Pro',
    status: 'active',
    startDate: '2026-10-01',
    expirationDate: '2027-10-01',
    trafficUsedGB: 18.4,
    trafficLimitGB: 100,
    autoRenew: true
  });

  const addVPNProfile = (profile: Omit<VPNConfigProfile, 'id' | 'createdAt'>) => {
    const newP: VPNConfigProfile = {
      ...profile,
      id: `cfg-${Date.now().toString().slice(-5)}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setVpnProfiles(prev => [newP, ...prev]);
    addNotification({
      type: 'account_activated',
      title: 'Configuration VPN importée',
      message: `Le profil "${newP.name}" (${newP.protocol}) est enregistré avec succès.`
    });
    logAuditAction('Import configuration VPN', newP.name, `Protocole: ${newP.protocol}`, 'system');
  };

  const deleteVPNProfile = (id: string) => {
    setVpnProfiles(prev => prev.filter(p => p.id !== id));
  };

  const pingServer = async (id: string): Promise<number> => {
    // Realistic simulation with measured delta
    const srv = vpnServers.find(s => s.id === id);
    const base = srv ? srv.latencyMs : 30;
    const jitter = Math.floor(Math.random() * 8) - 4;
    const newPing = Math.max(8, base + jitter);
    setVpnServers(prev =>
      prev.map(s => (s.id === id ? { ...s, latencyMs: newPing, status: 'online' } : s))
    );
    return newPing;
  };

  // Community & News
  const [posts, setPosts] = useState<CommunityPost[]>(INITIAL_POSTS);
  const [news, setNews] = useState<NewsArticle[]>(INITIAL_NEWS);

  const createPost = (content: string, category: CommunityPost['category'], imageUrl?: string) => {
    const newPost: CommunityPost = {
      id: `post-${Date.now()}`,
      authorId: currentUser?.id || 'anon',
      authorName: currentUser?.name || 'Membre AFRIXA',
      authorAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      authorRole: currentUser?.role || 'member',
      content,
      imageUrl,
      category,
      likesCount: 0,
      likedByCurrentUser: false,
      commentsCount: 0,
      timestamp: 'À l’instant',
      comments: []
    };
    setPosts(prev => [newPost, ...prev]);
    logAuditAction('Publication communautaire', newPost.id, `Catégorie: ${category}`, 'content');
  };

  const likePost = (id: string) => {
    setPosts(prev =>
      prev.map(p => {
        if (p.id !== id) return p;
        const liked = !p.likedByCurrentUser;
        return {
          ...p,
          likedByCurrentUser: liked,
          likesCount: liked ? p.likesCount + 1 : p.likesCount - 1
        };
      })
    );
  };

  const addComment = (postId: string, text: string) => {
    setPosts(prev =>
      prev.map(p => {
        if (p.id !== postId) return p;
        return {
          ...p,
          commentsCount: p.commentsCount + 1,
          comments: [
            ...p.comments,
            {
              id: `c-${Date.now()}`,
              authorName: currentUser?.name || 'Membre AFRIXA',
              authorAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
              content: text,
              timestamp: 'À l’instant'
            }
          ]
        };
      })
    );
  };

  // Wallet, Referral & Rewards
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [walletBalance, setWalletBalance] = useState<number>(3450); // 3450 FCFA
  const [walletPending, setWalletPending] = useState<number>(100); // 100 FCFA
  const [walletTransactions, setWalletTransactions] = useState<WalletTransaction[]>([
    {
      id: 'tx-001',
      userId: 'usr-afx-001',
      type: 'credit',
      amount: 50,
      description: 'Parrainage vérifié : Mamadou Sow',
      date: '2026-10-24',
      balanceAfter: 3450
    },
    {
      id: 'tx-002',
      userId: 'usr-afx-001',
      type: 'credit',
      amount: 50,
      description: 'Parrainage vérifié : Fatoumata Sy',
      date: '2026-10-26',
      balanceAfter: 3400
    }
  ]);
  const [referrals, setReferrals] = useState<ReferralUser[]>([
    {
      id: 'ref-1',
      name: 'Mamadou Sow',
      email: 'm.sow@afrixa.org',
      date: '2026-10-24',
      status: 'active_verified',
      rewardGranted: true,
      rewardAmount: 50
    },
    {
      id: 'ref-2',
      name: 'Fatoumata Sy',
      email: 'f.sy@afrixa.org',
      date: '2026-10-26',
      status: 'active_verified',
      rewardGranted: true,
      rewardAmount: 50
    },
    {
      id: 'ref-3',
      name: 'Ibrahim Konaté',
      email: 'i.konate@afrixa.org',
      date: '2026-11-01',
      status: 'pending_registration',
      rewardGranted: false,
      rewardAmount: 0
    }
  ]);
  const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>([
    {
      id: 'wdr-101',
      userId: 'usr-afx-001',
      userName: 'Amadou Diallo',
      amount: 2500,
      method: 'orange_money',
      phoneNumber: '+221 77 450 89 20',
      status: 'paid',
      requestDate: '2026-10-20',
      processedDate: '2026-10-21',
      notes: 'Confirmé et versé via API Orange Money'
    }
  ]);

  const requestWithdrawal = (amount: number, method: 'orange_money' | 'mtn_momo', phone: string) => {
    if (amount < siteSettings.minimumWithdrawalAmount) {
      return {
        success: false,
        message: `Le montant minimum de retrait est de ${siteSettings.minimumWithdrawalAmount.toLocaleString()} FCFA.`
      };
    }
    if (amount > walletBalance) {
      return {
        success: false,
        message: `Solde insuffisant. Votre solde disponible est de ${walletBalance.toLocaleString()} FCFA.`
      };
    }

    const newReq: WithdrawalRequest = {
      id: `wdr-${Date.now().toString().slice(-5)}`,
      userId: currentUser?.id || 'usr-afx-001',
      userName: currentUser?.name || 'Membre AFRIXA',
      amount,
      method,
      phoneNumber: phone,
      status: 'pending',
      requestDate: new Date().toISOString().split('T')[0]
    };

    setWithdrawalRequests(prev => [newReq, ...prev]);
    setWalletBalance(prev => prev - amount);
    setWalletTransactions(prev => [
      {
        id: `tx-${Date.now()}`,
        userId: currentUser?.id || 'usr-afx-001',
        type: 'debit',
        amount,
        description: `Demande de retrait #${newReq.id} (${method === 'orange_money' ? 'Orange Money' : 'MTN MoMo'})`,
        date: new Date().toISOString().split('T')[0],
        balanceAfter: walletBalance - amount
      },
      ...prev
    ]);

    addNotification({
      type: 'withdrawal',
      title: 'Demande de retrait enregistrée',
      message: `Votre demande de ${amount.toLocaleString()} FCFA est en attente de validation administrative.`
    });
    logAuditAction('Demande de retrait', newReq.id, `Montant: ${amount} FCFA vers ${phone} (${method})`, 'finance');

    return {
      success: true,
      message: `Demande de retrait de ${amount.toLocaleString()} FCFA initiée avec succès !`
    };
  };

  const adminProcessWithdrawal = (id: string, newStatus: 'approved' | 'rejected' | 'paid', notes?: string) => {
    setWithdrawalRequests(prev =>
      prev.map(r => {
        if (r.id !== id) return r;
        return {
          ...r,
          status: newStatus,
          processedDate: new Date().toISOString().split('T')[0],
          notes: notes || `Mise à jour statut: ${newStatus}`
        };
      })
    );

    const req = withdrawalRequests.find(r => r.id === id);
    if (newStatus === 'rejected' && req) {
      // Refund balance
      setWalletBalance(prev => prev + req.amount);
      setWalletTransactions(prev => [
        {
          id: `tx-${Date.now()}`,
          userId: req.userId,
          type: 'credit',
          amount: req.amount,
          description: `Remboursement suite au rejet du retrait #${id}`,
          date: new Date().toISOString().split('T')[0],
          balanceAfter: walletBalance + req.amount
        },
        ...prev
      ]);
    }

    addNotification({
      type: 'withdrawal',
      title: `Retrait #${id} : ${newStatus.toUpperCase()}`,
      message: `Le statut de votre demande de retrait a été mis à jour par l’administration : ${newStatus}.`
    });
    logAuditAction(`Traitement retrait ${id}`, id, `Statut passé à ${newStatus}`, 'finance');
  };

  // Payment Gateway Sandbox
  const [paymentHistory, setPaymentHistory] = useState<PaymentTransaction[]>([
    {
      id: 'pay-001',
      reference: 'AFX-PAY-2026-90412',
      userId: 'usr-afx-001',
      userName: 'Amadou Diallo',
      amount: 1050,
      currency: 'FCFA',
      method: 'orange_money',
      purpose: 'membership',
      status: 'success',
      timestamp: '2026-09-15 09:12',
      webhookVerified: true,
      phoneNumber: '+221 77 450 89 20'
    }
  ]);

  const processSandboxPayment = async (
    amount: number,
    purpose: PaymentTransaction['purpose'],
    method: 'orange_money' | 'mtn_momo',
    phone: string,
    targetId?: string,
    targetTitle?: string
  ): Promise<{ success: boolean; reference: string; message: string }> => {
    // Generate unique verifiable reference
    const reference = `AFX-PAY-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const tx: PaymentTransaction = {
      id: `tx-${Date.now()}`,
      reference,
      userId: currentUser?.id || 'guest',
      userName: currentUser?.name || 'Visiteur AFRIXA',
      amount,
      currency: 'FCFA',
      method,
      purpose,
      targetId,
      targetTitle,
      status: 'success',
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      webhookVerified: true,
      phoneNumber: phone
    };

    setPaymentHistory(prev => [tx, ...prev]);

    // Automated unlock actions
    if (purpose === 'membership' && currentUser) {
      setCurrentUser({ ...currentUser, membershipStatus: 'active' });
    } else if (purpose === 'course' && targetId) {
      enrollInCourse(targetId);
    } else if (purpose === 'book' && targetId) {
      purchaseBook(targetId);
    } else if (purpose === 'app' && targetId) {
      obtainApp(targetId);
    }

    addNotification({
      type: 'payment_confirmed',
      title: `Paiement confirmé (${amount.toLocaleString()} FCFA)`,
      message: `Transaction ${reference} vérifiée par webhook sécurisé. Votre service est actif.`
    });
    logAuditAction('Paiement sandbox réussi', reference, `Montant: ${amount} FCFA, Objet: ${purpose}, Tél: ${phone}`, 'finance');

    return {
      success: true,
      reference,
      message: `Paiement Mobile Money de ${amount.toLocaleString()} FCFA validé avec succès !`
    };
  };

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const addNotification = (notif: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => {
    const newN: NotificationItem = {
      ...notif,
      id: `notif-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      read: false
    };
    setNotifications(prev => [newN, ...prev]);
  };

  // Audit Logs
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([
    {
      id: 'log-1',
      action: 'Système initialisé',
      performedBy: 'Système AFRIXA',
      target: 'Kernel',
      timestamp: '2026-11-03 08:00',
      details: 'Services cryptographiques et gestionnaires VPN démarrés',
      category: 'system'
    }
  ]);

  const logAuditAction = (
    action: string,
    target: string,
    details: string,
    category: AuditLogItem['category'] = 'system'
  ) => {
    const log: AuditLogItem = {
      id: `log-${Date.now()}`,
      action,
      performedBy: currentUser?.name || 'Visiteur',
      target,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      details,
      category
    };
    setAuditLogs(prev => [log, ...prev]);
  };

  const updateSiteSettings = (newSettings: Partial<SiteSettings>) => {
    setSiteSettings(prev => ({ ...prev, ...newSettings }));
    logAuditAction('Mise à jour des paramètres système', 'Configuration générale', JSON.stringify(newSettings), 'security');
    addNotification({
      type: 'admin_announcement',
      title: 'Paramètres mis à jour',
      message: 'Les nouveaux paramètres de la plateforme ont été enregistrés.'
    });
  };

  // Firestore Admin Authorization state
  const [isFirestoreAdminVerified, setIsFirestoreAdminVerified] = useState<boolean>(() => {
    return currentUser?.email?.toLowerCase() === BOOTSTRAP_ADMIN_EMAIL.toLowerCase() || currentUser?.role === 'admin';
  });
  const [isCheckingAdminAuth, setIsCheckingAdminAuth] = useState<boolean>(false);
  const [firestoreAdminDetails, setFirestoreAdminDetails] = useState<FirestoreAdminCheckResult | null>({
    isAuthorized: true,
    isAdminFlag: true,
    role: 'admin',
    source: 'Initialisation Profil Administrateur Fondateur (Firestore rules)'
  });

  const verifyAdminInFirestore = async (customEmail?: string): Promise<boolean> => {
    setIsCheckingAdminAuth(true);
    try {
      const email = customEmail || currentUser?.email || BOOTSTRAP_ADMIN_EMAIL;
      const res = await verifyFirestoreAdminAuthorization(email);
      setFirestoreAdminDetails(res);
      setIsFirestoreAdminVerified(res.isAuthorized);
      return res.isAuthorized;
    } catch (err: any) {
      setFirestoreAdminDetails({
        isAuthorized: false,
        isAdminFlag: false,
        role: 'error',
        source: 'Erreur Firestore',
        errorMessage: err?.message || 'Erreur inconnue'
      });
      setIsFirestoreAdminVerified(false);
      return false;
    } finally {
      setIsCheckingAdminAuth(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const initFirestore = async () => {
      setIsCheckingAdminAuth(true);
      try {
        const remoteSettings = await fetchPlatformSettingsFromFirestore();
        if (remoteSettings && isMounted) {
          setSiteSettings(prev => ({
            ...prev,
            ...remoteSettings
          }));
        }

        const email = currentUser?.email || BOOTSTRAP_ADMIN_EMAIL;
        await initializeFirestoreAdminBootstrap(email);
        const res = await verifyFirestoreAdminAuthorization(email);
        if (isMounted) {
          setFirestoreAdminDetails(res);
          setIsFirestoreAdminVerified(res.isAuthorized);
        }
      } catch (err) {
        console.warn('Init Firestore check notice:', err);
      } finally {
        if (isMounted) setIsCheckingAdminAuth(false);
      }
    };
    initFirestore();
    return () => {
      isMounted = false;
    };
  }, [currentUser?.email]);

  const saveSettingsToFirestore = async (newSettings: Partial<SiteSettings>): Promise<{ success: boolean; message: string }> => {
    setIsCheckingAdminAuth(true);
    try {
      const res = await savePlatformSettingsToFirestore(
        newSettings,
        currentUser?.email || BOOTSTRAP_ADMIN_EMAIL
      );
      if (res.success) {
        setSiteSettings(prev => ({ ...prev, ...newSettings }));
        logAuditAction(
          'Mise à jour des coordonnées et paramètres Firestore',
          'Configuration système & paiements OM/MOMO',
          JSON.stringify(newSettings),
          'security'
        );
        addNotification({
          type: 'admin_announcement',
          title: 'Paramètres et comptes de paiement enregistrés dans Firestore',
          message: 'Les nouveaux comptes OM/MOMO et tarifs de la plateforme sont appliqués avec succès.'
        });
      } else {
        addNotification({
          type: 'admin_announcement',
          title: 'Échec enregistrement Firestore',
          message: res.message
        });
      }
      return res;
    } catch (error: any) {
      return { success: false, message: error?.message || 'Erreur inconnue' };
    } finally {
      setIsCheckingAdminAuth(false);
    }
  };

  const openModal = (modalName: string, payload?: any) => {
    setActiveModal(modalName);
    setModalPayload(payload || null);
  };

  const closeModal = () => {
    setActiveModal(null);
    setModalPayload(null);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        language,
        setLanguage,
        t,
        switchRole,
        loginUser,
        registerUser,
        logoutUser,
        updateUserProfile,
        courses,
        setCourses,
        enrolledCourseIds,
        enrollInCourse,
        completeLesson,
        books,
        setBooks,
        purchasedBookIds,
        purchaseBook,
        apps,
        setApps,
        obtainedAppIds,
        obtainApp,
        products,
        setProducts,
        stores,
        cart,
        addToCart,
        removeFromCart,
        updateCartQty,
        clearCart,
        orders,
        createOrder,
        vpnServers,
        setVpnServers,
        vpnProfiles,
        addVPNProfile,
        deleteVPNProfile,
        vpnSubscription,
        pingServer,
        posts,
        createPost,
        likePost,
        addComment,
        news,
        setNews,
        walletBalance,
        walletPending,
        walletTransactions,
        referrals,
        withdrawalRequests,
        requestWithdrawal,
        adminProcessWithdrawal,
        paymentHistory,
        processSandboxPayment,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        addNotification,
        siteSettings,
        updateSiteSettings,
        auditLogs,
        logAuditAction,
        isFirestoreAdminVerified,
        isCheckingAdminAuth,
        firestoreAdminDetails,
        verifyAdminInFirestore,
        saveSettingsToFirestore,
        activeView,
        setActiveView,
        activeModal,
        setActiveModal,
        modalPayload,
        openModal,
        closeModal
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
