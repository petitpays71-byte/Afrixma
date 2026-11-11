/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  User,
  Shield,
  Award,
  Wallet,
  BookOpen,
  Layers,
  Cpu,
  ShoppingBag,
  Radio,
  Copy,
  Check,
  ArrowUpRight,
  Clock,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Smartphone,
  Lock,
  Mail,
  Key
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const DashboardView: React.FC = () => {
  const {
    currentUser,
    updateUserProfile,
    siteSettings,
    walletBalance,
    walletPending,
    walletTransactions,
    referrals,
    withdrawalRequests,
    requestWithdrawal,
    enrolledCourseIds,
    courses,
    purchasedBookIds,
    books,
    obtainedAppIds,
    apps,
    orders,
    vpnSubscription,
    setActiveView,
    openModal
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'rewards' | 'courses' | 'books' | 'apps' | 'orders' | 'security'>('overview');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Withdrawal form
  const [withdrawAmount, setWithdrawAmount] = useState<number>(siteSettings.minimumWithdrawalAmount);
  const [withdrawMethod, setWithdrawMethod] = useState<'orange_money' | 'mtn_momo'>('orange_money');
  const [withdrawPhone, setWithdrawPhone] = useState(currentUser?.phone || '+221 77 450 89 20');
  const [withdrawMsg, setWithdrawMsg] = useState<{ success: boolean; text: string } | null>(null);

  // Profile edit
  const [editName, setEditName] = useState(currentUser?.name || 'Roberto Kenyo Johnson');
  const [editEmail, setEditEmail] = useState(currentUser?.email || 'kenyojohnsonroberto@gmail.com');
  const [editPhone, setEditPhone] = useState(currentUser?.phone || '+225 07 45 89 20 11');
  const [editOm, setEditOm] = useState(currentUser?.omAccountNumber || siteSettings.adminOmAccount || '+225 07 45 89 20 11');
  const [editMomo, setEditMomo] = useState(currentUser?.momoAccountNumber || siteSettings.adminMomoAccount || '+225 05 88 12 34 56');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const inviteLink = `${window.location.origin}/?ref=${currentUser?.referralCode || 'AFX-DIALLO-2026'}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentUser?.referralCode || 'AFX-DIALLO-2026');
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setWithdrawMsg(null);
    const res = requestWithdrawal(withdrawAmount, withdrawMethod, withdrawPhone);
    setWithdrawMsg({ success: res.success, text: res.message });
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name: editName,
      email: editEmail,
      phone: editPhone,
      omAccountNumber: editOm,
      momoAccountNumber: editMomo
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const enrolledCourses = courses.filter(c => enrolledCourseIds.includes(c.id));
  const myBooks = books.filter(b => purchasedBookIds.includes(b.id));
  const myApps = apps.filter(a => obtainedAppIds.includes(a.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Profile Summary */}
      <div className="bg-[#0D1B42]/80 rounded-3xl border border-blue-500/30 p-6 md:p-8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
              alt="Avatar"
              className="w-16 h-16 md:w-20 md:h-20 rounded-2xl object-cover border-2 border-cyan-400 shadow-lg"
            />
            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[#0D1B42]" title="En ligne"></span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl md:text-2xl font-black text-white">{currentUser?.name || 'Amadou Diallo'}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 text-cyan-300 border border-blue-500/40 uppercase">
                {currentUser?.role || 'MEMBRE'}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                currentUser?.membershipStatus === 'active'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}>
                {currentUser?.membershipStatus === 'active' ? 'Adhésion Active' : 'En attente de règlement'}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">{currentUser?.email} • {currentUser?.country || 'Sénégal'}</p>
            <p className="text-[11px] text-slate-500">Membre depuis le {currentUser?.registrationDate || '2026-09-15'}</p>
          </div>
        </div>

        {/* Quick Wallet Glance */}
        <div className="bg-[#070E24] p-4 rounded-2xl border border-blue-500/20 flex items-center gap-4 shrink-0">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Solde Récompenses</div>
            <div className="text-xl font-black text-amber-300">{walletBalance.toLocaleString()} FCFA</div>
            <div className="text-[10px] text-slate-400">+{walletPending} FCFA en attente</div>
          </div>
          <button
            onClick={() => setActiveTab('rewards')}
            className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition cursor-pointer"
          >
            Retrait
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-blue-500/20 pb-3 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'overview' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Vue Générale</span>
        </button>

        <button
          onClick={() => setActiveTab('rewards')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'rewards' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Award className="w-3.5 h-3.5 text-amber-400" />
          <span>Parrainage & Récompenses</span>
        </button>

        <button
          onClick={() => setActiveTab('courses')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'courses' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
          <span>Mes Formations ({enrolledCourses.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('books')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'books' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-purple-400" />
          <span>Ma Bibliothèque ({myBooks.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('apps')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'apps' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Cpu className="w-3.5 h-3.5 text-pink-400" />
          <span>Mes Outils & Logiciels ({myApps.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'orders' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
          <span>Commandes ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'security' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Shield className="w-3.5 h-3.5 text-rose-400" />
          <span>Sécurité & Profil</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Referral Link & Code Box */}
          <div className="md:col-span-2 bg-[#0D1B42]/80 rounded-3xl border border-blue-500/20 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                <span>Mon Espace de Parrainage</span>
              </h3>
              <span className="text-xs text-amber-300 font-bold">
                +{siteSettings.referralRewardAmount} FCFA par filleul éligible
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Partagez votre lien personnel ou votre code d'invitation. Chaque filleul qui s'inscrit et règle ses frais d'adhésion ({siteSettings.registrationFee} FCFA) déclenche un crédit automatique sur votre portefeuille.
            </p>

            <div className="space-y-3 pt-1">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Votre Code Unique de Parrainage
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={currentUser?.referralCode || 'AFX-DIALLO-2026'}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono font-bold text-cyan-300 select-all"
                  />
                  <button
                    onClick={handleCopyCode}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                  >
                    {copiedCode ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedCode ? 'Copié' : 'Copier'}</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Votre Lien d'Invitation Web Direct
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={inviteLink}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-slate-300 select-all truncate"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                  >
                    {copiedLink ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedLink ? 'Copié' : 'Copier le lien'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick stats downline */}
            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-800">
              <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-center">
                <div className="text-lg font-black text-white">{referrals.length}</div>
                <div className="text-[10px] text-slate-400">Filleuls Inscrits</div>
              </div>
              <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-center">
                <div className="text-lg font-black text-emerald-400">
                  {referrals.filter(r => r.status === 'active_verified').length}
                </div>
                <div className="text-[10px] text-slate-400">Adhésions Validées</div>
              </div>
              <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-center">
                <div className="text-lg font-black text-amber-400">
                  {(referrals.filter(r => r.status === 'active_verified').length * siteSettings.referralRewardAmount).toLocaleString()} FCFA
                </div>
                <div className="text-[10px] text-slate-400">Total Récompenses</div>
              </div>
            </div>
          </div>

          {/* VPN Subscription Snapshot */}
          <div className="bg-[#0D1B42]/80 rounded-3xl border border-blue-500/20 p-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Radio className="w-4 h-4 text-cyan-400" />
                  <span>Abonnement VPN</span>
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Actif
                </span>
              </div>
              <p className="text-xs text-slate-300 font-semibold">{vpnSubscription.planName}</p>
              <div className="text-xs text-slate-400">Expire le : {vpnSubscription.expirationDate}</div>

              <div className="space-y-1 pt-2">
                <div className="flex justify-between text-[11px] text-slate-300">
                  <span>Trafic consommé :</span>
                  <span className="font-mono text-cyan-300">{vpnSubscription.trafficUsedGB} / {vpnSubscription.trafficLimitGB} GB</span>
                </div>
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-cyan-400 h-full"
                    style={{ width: `${(vpnSubscription.trafficUsedGB / vpnSubscription.trafficLimitGB) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveView('vpn')}
              className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>Gérer mes configurations VPN</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: REWARDS & WITHDRAWALS */}
      {activeTab === 'rewards' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Withdrawal form card */}
            <div className="md:col-span-1 bg-[#0D1B42]/80 rounded-3xl border border-amber-500/30 p-6 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Wallet className="w-5 h-5 text-amber-400" />
                <span>Demander un Retrait</span>
              </h3>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
                <div className="text-[11px] text-slate-400">Solde Retirable Immédiatement</div>
                <div className="text-2xl font-black text-amber-300">{walletBalance.toLocaleString()} FCFA</div>
                <div className="text-[10px] text-slate-400">
                  Seuil minimum : {siteSettings.minimumWithdrawalAmount.toLocaleString()} FCFA
                </div>
              </div>

              {withdrawMsg && (
                <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                  withdrawMsg.success
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                }`}>
                  {withdrawMsg.success ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                  <span>{withdrawMsg.text}</span>
                </div>
              )}

              <form onSubmit={handleWithdrawSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Montant à retirer (FCFA)
                  </label>
                  <input
                    type="number"
                    min={siteSettings.minimumWithdrawalAmount}
                    max={walletBalance}
                    value={withdrawAmount}
                    onChange={e => setWithdrawAmount(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Opérateur Mobile Money
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setWithdrawMethod('orange_money')}
                      className={`p-2 rounded-xl text-xs font-semibold border transition ${
                        withdrawMethod === 'orange_money'
                          ? 'border-orange-500 bg-orange-500/10 text-orange-300'
                          : 'border-slate-800 bg-slate-900 text-slate-400'
                      }`}
                    >
                      Orange Money
                    </button>
                    <button
                      type="button"
                      onClick={() => setWithdrawMethod('mtn_momo')}
                      className={`p-2 rounded-xl text-xs font-semibold border transition ${
                        withdrawMethod === 'mtn_momo'
                          ? 'border-yellow-400 bg-yellow-400/10 text-yellow-300'
                          : 'border-slate-800 bg-slate-900 text-slate-400'
                      }`}
                    >
                      MTN MoMo
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Numéro de Téléphone Récepteur
                  </label>
                  <input
                    type="tel"
                    value={withdrawPhone}
                    onChange={e => setWithdrawPhone(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={walletBalance < siteSettings.minimumWithdrawalAmount}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:opacity-50 text-slate-950 font-bold text-xs transition cursor-pointer shadow-lg shadow-amber-500/20"
                >
                  Envoyer la demande de retrait
                </button>
              </form>
            </div>

            {/* Withdrawal requests history & transactions */}
            <div className="md:col-span-2 space-y-4">
              <div className="bg-[#0D1B42]/80 rounded-3xl border border-blue-500/20 p-6 space-y-4">
                <h3 className="text-sm font-bold text-white">Suivi des Demandes de Retrait</h3>
                {withdrawalRequests.length === 0 ? (
                  <p className="text-xs text-slate-400">Aucune demande de retrait effectuée.</p>
                ) : (
                  <div className="space-y-2">
                    {withdrawalRequests.map(req => (
                      <div
                        key={req.id}
                        className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white">{req.amount.toLocaleString()} FCFA</span>
                            <span className="text-[10px] text-slate-400 capitalize">via {req.method === 'orange_money' ? 'Orange Money' : 'MTN MoMo'}</span>
                          </div>
                          <p className="text-[11px] text-slate-500">{req.phoneNumber} • Demandé le {req.requestDate}</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          req.status === 'paid'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : req.status === 'approved'
                            ? 'bg-blue-500/20 text-cyan-300 border border-blue-500/30'
                            : req.status === 'rejected'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}>
                          {req.status === 'paid' ? 'PAYÉ' : req.status === 'pending' ? 'EN ATTENTE' : req.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Transactions journal */}
              <div className="bg-[#0D1B42]/80 rounded-3xl border border-blue-500/20 p-6 space-y-4">
                <h3 className="text-sm font-bold text-white">Journal Sécurisé des Crédits & Débits</h3>
                <div className="space-y-2 max-h-56 overflow-y-auto">
                  {walletTransactions.map(tx => (
                    <div
                      key={tx.id}
                      className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="text-slate-200 font-semibold">{tx.description}</div>
                        <div className="text-[10px] text-slate-500">{tx.date}</div>
                      </div>
                      <span className={`font-mono font-bold ${
                        tx.type === 'credit' ? 'text-emerald-400' : 'text-rose-400'
                      }`}>
                        {tx.type === 'credit' ? '+' : '-'}{tx.amount.toLocaleString()} FCFA
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: MY COURSES */}
      {activeTab === 'courses' && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-white">Formations suivies ({enrolledCourses.length})</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {enrolledCourses.map(crs => (
              <div
                key={crs.id}
                className="bg-[#0D1B42]/70 rounded-2xl border border-blue-500/20 p-4 flex gap-4 items-center"
              >
                <img src={crs.thumbnail} alt={crs.title} className="w-20 h-16 object-cover rounded-xl shrink-0" />
                <div className="min-w-0 flex-1 space-y-1">
                  <h4 className="text-xs font-bold text-white truncate">{crs.title}</h4>
                  <p className="text-[11px] text-slate-400">{crs.instructor}</p>
                  <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-400 h-full w-2/3"></div>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>Progression : 67%</span>
                    <button
                      onClick={() => setActiveView('academy')}
                      className="text-cyan-400 font-bold hover:underline"
                    >
                      Continuer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: MY BOOKS */}
      {activeTab === 'books' && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-white">Livres & Guides Achetés ({myBooks.length})</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myBooks.map(bk => (
              <div
                key={bk.id}
                className="bg-[#0D1B42]/70 rounded-2xl border border-purple-500/20 p-4 flex gap-3 items-center"
              >
                <img src={bk.coverImage} alt={bk.title} className="w-14 h-20 object-cover rounded-lg shrink-0 shadow-md" />
                <div className="min-w-0 flex-1 space-y-1">
                  <h4 className="text-xs font-bold text-white truncate">{bk.title}</h4>
                  <p className="text-[11px] text-slate-400">{bk.author}</p>
                  <button
                    onClick={() => setActiveView('books')}
                    className="mt-2 px-3 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-[11px] font-bold text-white"
                  >
                    Ouvrir le lecteur
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: MY APPS */}
      {activeTab === 'apps' && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-white">Mes Logiciels & Licences ({myApps.length})</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myApps.map(ap => (
              <div
                key={ap.id}
                className="bg-[#0D1B42]/70 rounded-2xl border border-pink-500/20 p-4 flex gap-3 items-center"
              >
                <img src={ap.logo} alt={ap.name} className="w-14 h-14 rounded-2xl object-cover shrink-0 border border-slate-700" />
                <div className="min-w-0 flex-1 space-y-1">
                  <h4 className="text-xs font-bold text-white truncate">{ap.name}</h4>
                  <p className="text-[11px] text-pink-300 font-mono">Licence AFRIXA Active</p>
                  <button
                    onClick={() => setActiveView('apps')}
                    className="px-3 py-1 rounded-lg bg-pink-600 hover:bg-pink-500 text-[11px] font-bold text-white"
                  >
                    Voir clé & Télécharger
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: ORDERS */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-white">Historique de mes Commandes ({orders.length})</h3>
          {orders.length === 0 ? (
            <p className="text-xs text-slate-400">Aucune commande pour le moment.</p>
          ) : (
            <div className="space-y-3">
              {orders.map(ord => (
                <div key={ord.id} className="bg-[#0D1B42]/70 p-4 rounded-2xl border border-blue-500/20 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-white">Commande #{ord.id}</span>
                    <span className="text-cyan-400 font-bold">{ord.totalAmount.toLocaleString()} FCFA</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Date : {ord.date} • Réf : {ord.paymentReference} • Type : {ord.deliveryType === 'digital_instant' ? 'Téléchargement Numérique' : 'Expédition Physique'}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span className="capitalize">{ord.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 7: SECURITY & PROFILE */}
      {activeTab === 'security' && (
        <div className="max-w-xl bg-[#0D1B42]/80 rounded-3xl border border-blue-500/20 p-6 space-y-5">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-rose-400" />
            <span>Paramètres de Sécurité & Profil</span>
          </h3>

          {saveSuccess && (
            <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>Informations mises à jour avec succès.</span>
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Nom complet</label>
              <input
                type="text"
                value={editName}
                onChange={e => setEditName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Adresse E-mail du Compte</label>
              <input
                type="email"
                value={editEmail}
                onChange={e => setEditEmail(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Numéro de téléphone général</label>
              <input
                type="tel"
                value={editPhone}
                onChange={e => setEditPhone(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-semibold text-orange-400 mb-1">
                  Compte Orange Money (OM)
                </label>
                <input
                  type="text"
                  value={editOm}
                  onChange={e => setEditOm(e.target.value)}
                  placeholder="+225 07 00 00 00 00"
                  className="w-full bg-slate-900 border border-orange-500/40 rounded-xl px-3 py-2 text-xs text-orange-300 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-yellow-400 mb-1">
                  Compte MTN Mobile Money (MOMO)
                </label>
                <input
                  type="text"
                  value={editMomo}
                  onChange={e => setEditMomo(e.target.value)}
                  placeholder="+225 05 00 00 00 00"
                  className="w-full bg-slate-900 border border-yellow-500/40 rounded-xl px-3 py-2 text-xs text-yellow-300 font-mono"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition cursor-pointer"
              >
                Enregistrer les coordonnées et comptes
              </button>
            </div>
          </form>

          <div className="pt-4 border-t border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Vérification E-mail :</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" />
                Vérifié
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Sessions de connexion :</span>
              <span className="text-cyan-300 font-mono">1 Session active (Web/PWA)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
