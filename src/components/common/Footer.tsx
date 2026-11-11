/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Shield, Sparkles, Heart, Mail, Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Logo } from './Logo';
import { PWAInstallButton } from './PWAInstallButton';
import { useApp } from '../../context/AppContext';
import { subscribeToNewsletter } from '../../firebase/firebase';

export const Footer: React.FC = () => {
  const { setActiveView, openModal, language } = useApp();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ success: boolean; message: string } | null>(null);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setStatus(null);

    // Write subscriber email directly to Firestore 'newsletter_subscribers' collection
    const result = await subscribeToNewsletter(email, language);
    setLoading(false);
    setStatus(result);

    if (result.success) {
      setEmail('');
    }
  };

  return (
    <footer className="border-t border-blue-500/20 bg-[#060A18] text-slate-400 text-xs mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Newsletter Subscription Banner (Firestore-Backed) */}
        <div className="mb-12 p-6 md:p-8 rounded-3xl bg-gradient-to-r from-[#0B1536] via-[#0D1E4D] to-[#0B1536] border border-blue-500/30 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-cyan-300 border border-blue-500/30">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                <span>Actualités & Mises à Jour Communautaires</span>
                <span className="text-slate-500">•</span>
                <span className="text-emerald-400 font-mono">Stockage Firestore</span>
              </div>
              <h3 className="text-xl md:text-2xl font-black text-white">
                Restez au cœur de la révolution technologique africaine
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Rejoignez des milliers de passionnés. Recevez chaque semaine les nouvelles formations, opportunités de bourses, cours crypto et innovations logicielles.
              </p>
            </div>

            {/* Newsletter Form */}
            <div className="w-full lg:w-auto lg:min-w-[400px]">
              {status?.success ? (
                <div className="p-4 rounded-2xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-200 text-xs flex items-center justify-between gap-3 shadow-lg">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                    <div>
                      <p className="font-bold text-white">Inscription confirmée !</p>
                      <p className="text-[11px] text-emerald-300/90">{status.message}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setStatus(null);
                      setEmail('');
                    }}
                    className="text-[10px] text-emerald-300 hover:text-white underline underline-offset-2 shrink-0 cursor-pointer"
                  >
                    Nouvel email
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-2">
                  <div className="flex flex-col sm:flex-row items-center gap-2">
                    <div className="relative w-full">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                      <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="Votre adresse email (ex: ibrahim@afrixa.org)"
                        required
                        disabled={loading}
                        className="w-full bg-slate-900/90 border border-slate-700/80 focus:border-cyan-400 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none transition font-sans"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-lg shadow-blue-600/30 whitespace-nowrap disabled:opacity-60"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Enregistrement...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>S'inscrire</span>
                        </>
                      )}
                    </button>
                  </div>

                  {status?.success === false && (
                    <div className="flex items-center gap-1.5 text-[11px] text-rose-400 pt-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{status.message}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[10px] text-slate-400 px-1">
                    <span>Aucun spam. Désinscription en 1 clic.</span>
                    <span className="font-mono text-cyan-400/80">Firestore: newsletter_subscribers</span>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Logo size="lg" showSlogan={true} />
            <p className="text-slate-300 text-sm leading-relaxed max-w-sm mt-3">
              AFRIXA réunit l'ensemble des technologies d'avenir pour catalyser l'essor des créateurs, étudiants, commerçants et bâtisseurs d'Afrique.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <PWAInstallButton compact={false} />
            </div>
            <div className="flex items-center gap-2 pt-2 text-[11px] text-slate-400">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Chiffrement TLS 1.3 • Paiements Sandbox Orange & MTN</span>
            </div>
          </div>

          {/* Modules Col 1 */}
          <div>
            <h4 className="text-white font-bold text-sm mb-3 uppercase tracking-wider">Écosystème</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => setActiveView('academy')} className="hover:text-cyan-400 transition cursor-pointer">
                  AFRIXA Academy
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('marketplace')} className="hover:text-cyan-400 transition cursor-pointer">
                  Marketplace & Boutiques
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('books')} className="hover:text-cyan-400 transition cursor-pointer">
                  Bibliothèque Numérique
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('apps')} className="hover:text-cyan-400 transition cursor-pointer">
                  Applications Certifiées
                </button>
              </li>
            </ul>
          </div>

          {/* Modules Col 2 */}
          <div>
            <h4 className="text-white font-bold text-sm mb-3 uppercase tracking-wider">Technologie</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => setActiveView('crypto')} className="hover:text-cyan-400 transition cursor-pointer">
                  Crypto & Blockchain
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('vpn')} className="hover:text-cyan-400 transition cursor-pointer">
                  Gestionnaire VPN (VLESS)
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('community')} className="hover:text-cyan-400 transition cursor-pointer">
                  Réseau Communautaire
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('news')} className="hover:text-cyan-400 transition cursor-pointer">
                  Actualités & Opportunités
                </button>
              </li>
            </ul>
          </div>

          {/* Member & Assurance */}
          <div>
            <h4 className="text-white font-bold text-sm mb-3 uppercase tracking-wider">Espace & Qualité</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => setActiveView('dashboard')} className="hover:text-cyan-400 transition cursor-pointer">
                  Tableau de bord Membre
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('admin')} className="hover:text-rose-400 transition cursor-pointer text-rose-300">
                  Administration Sécurisée
                </button>
              </li>
              <li>
                <button onClick={() => openModal('qa_tests')} className="hover:text-amber-300 transition cursor-pointer text-amber-400 font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Rapport de Tests (23 pts)
                </button>
              </li>
              <li>
                <button onClick={() => openModal('contact')} className="hover:text-cyan-400 transition cursor-pointer">
                  Assistance & Support
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800/80 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-slate-300">
          <p>© 2026 AFRIXA — Tous droits réservés. L'innovation africaine, sans limites.</p>
          <div className="flex items-center gap-1 text-slate-300">
            <span>Conçu avec</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 inline fill-rose-500" />
            <span>pour la souveraineté numérique du continent.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
