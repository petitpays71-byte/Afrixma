/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  ArrowRight,
  BookOpen,
  ShoppingBag,
  Layers,
  Cpu,
  Globe,
  Radio,
  Sparkles,
  Newspaper,
  CheckCircle,
  Award,
  Zap,
  TrendingUp,
  Download
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PWAInstallButton } from '../components/common/PWAInstallButton';

export const HomeView: React.FC = () => {
  const { setActiveView, openModal, siteSettings, t, courses, products, vpnServers } = useApp();

  const services = [
    {
      id: 'academy',
      title: 'AFRIXA Academy',
      tag: 'Formation Numérique',
      desc: t('mod_academy_desc'),
      icon: BookOpen,
      color: 'from-blue-600 to-cyan-600',
      badge: 'Certifiant',
    },
    {
      id: 'marketplace',
      title: 'AFRIXA Marketplace',
      tag: 'Commerce & Boutiques',
      desc: t('mod_marketplace_desc'),
      icon: ShoppingBag,
      color: 'from-emerald-600 to-teal-600',
      badge: 'Vendeurs Vérifiés',
    },
    {
      id: 'books',
      title: 'AFRIXA Books',
      tag: 'Bibliothèque Numérique',
      desc: t('mod_books_desc'),
      icon: Layers,
      color: 'from-purple-600 to-indigo-600',
      badge: 'Ebooks Panafricains',
    },
    {
      id: 'apps',
      title: 'AFRIXA Apps',
      tag: 'Logiciels & Outils',
      desc: t('mod_apps_desc'),
      icon: Cpu,
      color: 'from-pink-600 to-rose-600',
      badge: 'Licences Officielles',
    },
    {
      id: 'crypto',
      title: 'AFRIXA Crypto',
      tag: 'Culture Blockchain',
      desc: t('mod_crypto_desc'),
      icon: Globe,
      color: 'from-amber-600 to-orange-600',
      badge: '100% Éducatif',
    },
    {
      id: 'vpn',
      title: 'AFRIXA VPN',
      tag: 'Sécurité & Réseaux',
      desc: t('mod_vpn_desc'),
      icon: Radio,
      color: 'from-cyan-600 to-blue-700',
      badge: '8 Protocoles (VLESS)',
    },
    {
      id: 'community',
      title: 'AFRIXA Community',
      tag: 'Réseau & Échanges',
      desc: t('mod_community_desc'),
      icon: Sparkles,
      color: 'from-violet-600 to-purple-800',
      badge: 'Membres Actifs',
    },
    {
      id: 'news',
      title: 'AFRIXA News',
      tag: 'Actualités & Veille',
      desc: t('mod_news_desc'),
      icon: Newspaper,
      color: 'from-blue-700 to-slate-800',
      badge: 'Analyses & Tech',
    },
  ];

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative pt-12 md:pt-20 overflow-hidden">
        {/* Futuristic glowing backdrop */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-b from-blue-600/25 via-cyan-500/10 to-transparent blur-3xl pointer-events-none -z-10 rounded-full"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          {/* African Innovation Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-950/80 border border-cyan-400/40 text-xs font-semibold text-cyan-300 shadow-lg shadow-cyan-500/10">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            <span>AFRIXA • {siteSettings.slogan}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.1]">
            L'innovation africaine, <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
              sans aucune limite.
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {t('hero_subtitle')}
          </p>

          {/* Pricing Highlight Pill */}
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-[#0E1A3D] border border-blue-500/30 text-xs sm:text-sm text-blue-200 shadow-xl">
            <Award className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              Adhésion complète : <strong>{siteSettings.registrationFee} FCFA</strong> • Parrainage :{' '}
              <strong>{siteSettings.referralRewardAmount} FCFA</strong> / filleul • Retrait dès{' '}
              <strong>{siteSettings.minimumWithdrawalAmount} FCFA</strong>
            </span>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => openModal('auth', { mode: 'register' })}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 font-bold text-sm sm:text-base text-white shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 transition hover:scale-[1.02] cursor-pointer"
            >
              <span>{t('hero_cta_join')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveView('academy')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 font-semibold text-sm sm:text-base text-slate-200 border border-slate-700/80 flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <span>{t('hero_cta_explore')}</span>
            </button>

            <div className="w-full sm:w-auto">
              <PWAInstallButton compact={false} />
            </div>
          </div>

          {/* Real-time Platform KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-10 max-w-4xl mx-auto">
            <div className="bg-[#0B1536]/80 p-4 rounded-2xl border border-blue-500/20 backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl font-black text-cyan-400">14 250+</div>
              <div className="text-xs text-slate-400 mt-1">Membres Actifs</div>
            </div>
            <div className="bg-[#0B1536]/80 p-4 rounded-2xl border border-blue-500/20 backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl font-black text-white">8 Langues</div>
              <div className="text-xs text-slate-400 mt-1">Dont Arabe RTL & Swahili</div>
            </div>
            <div className="bg-[#0B1536]/80 p-4 rounded-2xl border border-blue-500/20 backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl font-black text-emerald-400">{vpnServers.length} Serveurs</div>
              <div className="text-xs text-slate-400 mt-1">Nœuds VPN VLESS Déployés</div>
            </div>
            <div className="bg-[#0B1536]/80 p-4 rounded-2xl border border-blue-500/20 backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl font-black text-amber-400">100% PWA</div>
              <div className="text-xs text-slate-400 mt-1">Installable Mobile & PC</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid (The 8 Ecosystem Modules) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <div className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
            Un Seul Écosystème Intégré
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Découvrez les 8 Piliers d'AFRIXA
          </h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Chaque module a été spécifiquement pensé pour répondre aux besoins réels des créateurs et entrepreneurs africains.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map(srv => {
            const Icon = srv.icon;
            return (
              <div
                key={srv.id}
                onClick={() => setActiveView(srv.id)}
                className="group relative rounded-2xl bg-[#0D1B42]/70 border border-blue-500/20 hover:border-cyan-400/50 p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10 cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${srv.color} flex items-center justify-center text-white shadow-md`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-950 text-cyan-300 border border-blue-500/30">
                      {srv.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition">
                    {srv.title}
                  </h3>
                  <p className="text-[11px] font-semibold text-blue-400 uppercase tracking-wider mb-2">
                    {srv.tag}
                  </p>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {srv.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-cyan-400 group-hover:text-cyan-300">
                  <span>Accéder au module</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Academy Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#0D1B42] via-[#10245E] to-[#0A1638] rounded-3xl border border-blue-500/30 p-8 sm:p-12 relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-4 max-w-xl">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-cyan-300 border border-blue-500/30 uppercase tracking-wider">
                AFRIXA Academy
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
                Formez-vous aux métiers du futur avec des experts du continent
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Des programmes pratiques en Intelligence Artificielle, Cloud, Cybersécurité et AgriTech. Certificats de réussite reconnus et accompagnement vers l'emploi.
              </p>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setActiveView('academy')}
                  className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-cyan-500/30 transition cursor-pointer"
                >
                  Voir les formations
                </button>
              </div>
            </div>

            {/* Courses mini-list */}
            <div className="space-y-3 w-full md:w-80">
              {courses.slice(0, 2).map(crs => (
                <div
                  key={crs.id}
                  onClick={() => setActiveView('academy')}
                  className="bg-slate-900/80 p-3.5 rounded-2xl border border-blue-500/20 hover:border-cyan-400/40 transition cursor-pointer flex gap-3 items-center"
                >
                  <img
                    src={crs.thumbnail}
                    alt={crs.title}
                    className="w-16 h-14 rounded-xl object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-white truncate">{crs.title}</h4>
                    <p className="text-[11px] text-slate-400">{crs.instructor}</p>
                    <span className="text-[10px] font-bold text-cyan-400">
                      {crs.isFree ? 'Gratuit' : `${crs.price.toLocaleString()} FCFA`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Referral & Rewards Program Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[#0B1536] border border-amber-500/30 p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
          <div className="space-y-3 max-w-xl">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
              <Award className="w-4 h-4" />
              <span>Système de Parrainage & Récompenses</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              Gagnez {siteSettings.referralRewardAmount} FCFA par membre parrainé
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Invitez vos amis et partenaires avec votre lien unique. Dès validation de leur inscription ({siteSettings.registrationFee} FCFA), votre portefeuille est instantanément crédité. Retrait direct vers Orange Money ou MTN Mobile Money dès {siteSettings.minimumWithdrawalAmount} FCFA.
            </p>
          </div>

          <div className="flex flex-col gap-3 shrink-0 w-full sm:w-auto">
            <button
              onClick={() => setActiveView('dashboard')}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition cursor-pointer text-center"
            >
              Accéder à mon lien de parrainage
            </button>
            <div className="text-center text-[11px] text-slate-400">
              Protection anti-fraude & vérification serveur active
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
