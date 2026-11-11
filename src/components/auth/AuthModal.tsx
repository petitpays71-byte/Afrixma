/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Lock, Mail, User, KeyRound, CheckCircle, ShieldAlert } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AuthModal: React.FC = () => {
  const { activeModal, modalPayload, closeModal, loginUser, registerUser, openModal, siteSettings } = useApp();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(
    modalPayload?.mode || 'login'
  );

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [submittedReset, setSubmittedReset] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (activeModal !== 'auth') return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Veuillez renseigner tous les champs.');
      return;
    }
    setError(null);
    loginUser(email);
    closeModal();
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Veuillez renseigner votre nom, email et mot de passe.');
      return;
    }
    setError(null);
    registerUser(name, email, referralCode);
    closeModal();
    // Prompt sandbox payment for the 1050 FCFA membership fee
    openModal('payment', {
      purpose: 'membership',
      amount: siteSettings.registrationFee,
      title: 'Adhésion Membre AFRIXA'
    });
  };

  const handleForgot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Veuillez entrer votre adresse e-mail.');
      return;
    }
    setError(null);
    setSubmittedReset(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="w-full max-w-md rounded-2xl bg-[#0D1B42] border border-blue-500/30 p-6 shadow-2xl text-slate-100 relative">
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Tabs */}
        <div className="flex border-b border-blue-500/20 mb-6">
          <button
            onClick={() => { setMode('login'); setError(null); }}
            className={`pb-3 text-sm font-bold flex-1 text-center transition cursor-pointer ${
              mode === 'login'
                ? 'border-b-2 border-cyan-400 text-cyan-300'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Connexion
          </button>
          <button
            onClick={() => { setMode('register'); setError(null); }}
            className={`pb-3 text-sm font-bold flex-1 text-center transition cursor-pointer ${
              mode === 'register'
                ? 'border-b-2 border-cyan-400 text-cyan-300'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Inscription ({siteSettings.registrationFee} FCFA)
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Adresse E-mail</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="nom@exemple.com"
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400 transition"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-semibold text-slate-300">Mot de passe</label>
                <button
                  type="button"
                  onClick={() => { setMode('forgot'); setError(null); }}
                  className="text-[11px] text-cyan-400 hover:underline cursor-pointer"
                >
                  Mot de passe oublié ?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400 transition"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-sm text-white shadow-lg shadow-blue-600/30 transition cursor-pointer mt-2"
            >
              Se connecter
            </button>

            <div className="pt-2 text-center">
              <span className="text-xs text-slate-400">Pas encore membre ? </span>
              <button
                type="button"
                onClick={() => setMode('register')}
                className="text-xs text-cyan-400 font-semibold hover:underline cursor-pointer"
              >
                Créer un compte
              </button>
            </div>
          </form>
        )}

        {/* Register Form */}
        {mode === 'register' && (
          <form onSubmit={handleRegister} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Nom complet</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Ex: Fatou Ndiaye"
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400 transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Adresse E-mail</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="fatou@exemple.com"
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400 transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Mot de passe</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Minimum 8 caractères"
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400 transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Code de parrainage (Optionnel)
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={referralCode}
                  onChange={e => setReferralCode(e.target.value.toUpperCase())}
                  placeholder="Ex: AFX-DIALLO-2026"
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-sm text-white uppercase focus:outline-none focus:border-cyan-400 transition"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Donne droit à 50 FCFA crédités au parrain dès validation.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-blue-950/60 border border-blue-500/20 text-xs text-blue-200">
              <p className="font-semibold text-cyan-300">Frais d'adhésion : {siteSettings.registrationFee} FCFA</p>
              <p className="text-[11px] text-slate-300 mt-0.5">
                Payable via Orange Money ou MTN Mobile Money en environnement sandbox sécurisé.
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 font-bold text-sm text-white shadow-lg shadow-blue-600/30 transition cursor-pointer"
            >
              Créer mon compte & Passer au règlement
            </button>
          </form>
        )}

        {/* Forgot Password */}
        {mode === 'forgot' && (
          <div>
            {!submittedReset ? (
              <form onSubmit={handleForgot} className="space-y-4">
                <p className="text-xs text-slate-300 leading-relaxed">
                  Entrez votre adresse email. Nous vous transmettrons un lien sécurisé de réinitialisation.
                </p>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Adresse E-mail</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="nom@exemple.com"
                    className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400 transition"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-sm text-white transition cursor-pointer"
                >
                  Envoyer les instructions
                </button>
              </form>
            ) : (
              <div className="text-center py-4 space-y-3">
                <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto" />
                <h4 className="text-sm font-bold text-white">E-mail de réinitialisation envoyé</h4>
                <p className="text-xs text-slate-300">
                  Un lien sécurisé à usage unique a été généré pour <strong>{email}</strong>.
                </p>
                <button
                  onClick={() => { setMode('login'); setSubmittedReset(false); }}
                  className="mt-3 px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition"
                >
                  Retour à la connexion
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
