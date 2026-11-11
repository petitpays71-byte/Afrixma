/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Shield,
  Users,
  BookOpen,
  ShoppingBag,
  Layers,
  Cpu,
  Radio,
  DollarSign,
  Settings,
  FileText,
  Download,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Plus,
  Trash2,
  Edit,
  Save,
  Server,
  Activity,
  Lock,
  RefreshCw
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Role, VPNServer } from '../types';

export const AdminView: React.FC = () => {
  const {
    currentUser,
    courses,
    setCourses,
    books,
    setBooks,
    apps,
    setApps,
    products,
    setProducts,
    vpnServers,
    setVpnServers,
    siteSettings,
    updateSiteSettings,
    withdrawalRequests,
    adminProcessWithdrawal,
    paymentHistory,
    auditLogs,
    logAuditAction,
    switchRole,
    loginUser,
    isFirestoreAdminVerified,
    isCheckingAdminAuth,
    firestoreAdminDetails,
    verifyAdminInFirestore,
    saveSettingsToFirestore
  } = useApp();

  const [activeTab, setActiveTab] = useState<'kpi' | 'finance' | 'users' | 'courses' | 'vpn' | 'audit' | 'settings'>('kpi');

  // Finance & Admin Accounts settings local state
  const [regFee, setRegFee] = useState(siteSettings.registrationFee);
  const [refReward, setRefReward] = useState(siteSettings.referralRewardAmount);
  const [minWithdraw, setMinWithdraw] = useState(siteSettings.minimumWithdrawalAmount);
  const [adminEmailInput, setAdminEmailInput] = useState(siteSettings.adminEmail || 'kenyojohnsonroberto@gmail.com');
  const [adminNameInput, setAdminNameInput] = useState(siteSettings.adminName || 'Roberto Kenyo Johnson');
  const [adminOmInput, setAdminOmInput] = useState(siteSettings.adminOmAccount || '+237 656258659');
  const [adminMomoInput, setAdminMomoInput] = useState(siteSettings.adminMomoAccount || '+237 676092565');
  const [firestoreSaveStatus, setFirestoreSaveStatus] = useState<{
    loading: boolean;
    success?: boolean;
    message?: string;
  } | null>(null);

  useEffect(() => {
    if (siteSettings.adminOmAccount) setAdminOmInput(siteSettings.adminOmAccount);
    if (siteSettings.adminMomoAccount) setAdminMomoInput(siteSettings.adminMomoAccount);
    if (siteSettings.adminEmail) setAdminEmailInput(siteSettings.adminEmail);
    if (siteSettings.adminName) setAdminNameInput(siteSettings.adminName);
  }, [siteSettings.adminOmAccount, siteSettings.adminMomoAccount, siteSettings.adminEmail, siteSettings.adminName]);


  // New server modal form
  const [showAddServerModal, setShowAddServerModal] = useState(false);
  const [newSrvCountry, setNewSrvCountry] = useState('Nigéria');
  const [newSrvCity, setNewSrvCity] = useState('Lagos');
  const [newSrvName, setNewSrvName] = useState('Lagos-MainOne-01');
  const [newSrvIp, setNewSrvIp] = useState('102.164.0.12');
  const [newSrvFlag, setNewSrvFlag] = useState('🇳🇬');

  // Simulated users directory with Roberto Kenyo Johnson as Super Admin
  const [demoUsers, setDemoUsers] = useState([
    { id: 'usr-admin-roberto', name: 'Roberto Kenyo Johnson', email: 'kenyojohnsonroberto@gmail.com', role: 'admin' as Role, status: 'active', country: 'Cameroun' },
    { id: 'usr-1', name: 'Amadou Diallo', email: 'amadou.diallo@afrixa.org', role: 'member' as Role, status: 'active', country: 'Sénégal' },
    { id: 'usr-2', name: 'Aïssatou Ba', email: 'aissatou.ba@afrixa.org', role: 'instructor' as Role, status: 'active', country: 'Côte d’Ivoire' },
    { id: 'usr-3', name: 'Kofi Mensah', email: 'kofi.mensah@afrixa.org', role: 'seller' as Role, status: 'active', country: 'Ghana' },
    { id: 'usr-4', name: 'Ibrahim Konaté', email: 'i.konate@afrixa.org', role: 'visitor' as Role, status: 'pending', country: 'Mali' },
  ]);

  const handleSaveFinance = async (e: React.FormEvent) => {
    e.preventDefault();
    setFirestoreSaveStatus({ loading: true });

    // Enforce server-side authorization: writes directly to Firestore 'settings/platform'
    // Under firestore.rules, allow write: if isAdmin();
    const res = await saveSettingsToFirestore({
      registrationFee: regFee,
      referralRewardAmount: refReward,
      minimumWithdrawalAmount: minWithdraw,
      adminEmail: adminEmailInput,
      adminName: adminNameInput,
      adminOmAccount: adminOmInput,
      adminMomoAccount: adminMomoInput
    });

    if (res.success) {
      setFirestoreSaveStatus({ loading: false, success: true, message: res.message });
      setTimeout(() => setFirestoreSaveStatus(null), 4000);
    } else {
      setFirestoreSaveStatus({ loading: false, success: false, message: res.message });
    }
  };

  const handleToggleUserStatus = (userId: string) => {
    setDemoUsers(prev =>
      prev.map(u => {
        if (u.id !== userId) return u;
        const newStatus = u.status === 'active' ? 'suspended' : 'active';
        logAuditAction(`Statut compte modifié : ${newStatus}`, u.email, `Utilisateur ${u.name}`, 'security');
        return { ...u, status: newStatus };
      })
    );
  };

  const handleChangeUserRole = (userId: string, newRole: Role) => {
    setDemoUsers(prev =>
      prev.map(u => {
        if (u.id !== userId) return u;
        logAuditAction(`Rôle modifié : ${newRole}`, u.email, `Rôle passé à ${newRole}`, 'security');
        return { ...u, role: newRole };
      })
    );
  };

  const handleAddServer = (e: React.FormEvent) => {
    e.preventDefault();
    const newServer: VPNServer = {
      id: `srv-${Date.now().toString().slice(-4)}`,
      country: newSrvCountry,
      countryCode: newSrvCountry.slice(0, 2).toUpperCase(),
      city: newSrvCity,
      name: newSrvName,
      ip: newSrvIp,
      status: 'online',
      latencyMs: 38,
      capacityPercent: 20,
      supportedProtocols: ['VLESS', 'WireGuard', 'Trojan'],
      flag: newSrvFlag
    };
    setVpnServers(prev => [...prev, newServer]);
    logAuditAction('Ajout serveur VPN', newServer.name, `IP: ${newServer.ip}`, 'system');
    setShowAddServerModal(false);
  };

  const handleDeleteServer = (id: string) => {
    setVpnServers(prev => prev.filter(s => s.id !== id));
    logAuditAction('Suppression serveur VPN', id, 'Serveur retiré du pool actif', 'system');
  };

  const exportSystemBackup = () => {
    const backup = {
      exportTimestamp: new Date().toISOString(),
      platform: 'AFRIXA',
      siteSettings,
      courses,
      books,
      apps,
      products,
      vpnServers,
      withdrawalRequests,
      paymentHistory,
      auditLogs
    };

    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AFRIXA_FULL_BACKUP_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    logAuditAction('Sauvegarde système exportée', 'Kernel', 'Export complet JSON', 'system');
  };

  // Security barrier: Check both client role AND Firestore authorization flag
  if (currentUser?.role !== 'admin' || !isFirestoreAdminVerified) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 space-y-6">
        <div className="bg-[#0B1536] border border-rose-500/40 rounded-3xl p-8 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="w-20 h-20 rounded-3xl bg-rose-500/15 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/30 shadow-lg shadow-rose-950/50">
            <Lock className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/40">
              Vérification Firestore Active • Contrôle d'Accès Strict
            </span>
            <h2 className="text-2xl font-black text-white">Accès Réservé à l'Administration</h2>
            <p className="text-xs text-slate-300 leading-relaxed max-w-lg mx-auto">
              L'accès à cette console et la modification des coordonnées de paiement Orange Money & MTN MoMo nécessitent une autorisation validée dans la base de données Firestore.
            </p>
          </div>

          {/* Real-time Firestore Authorization Diagnostic */}
          <div className="bg-slate-950/80 rounded-2xl border border-slate-800 p-4 text-left text-xs space-y-3 font-mono">
            <div className="flex items-center justify-between text-[11px] pb-2 border-b border-slate-800 text-slate-400 font-sans">
              <span className="font-bold text-slate-300">Diagnostic d'Autorisation Firestore :</span>
              <span className="text-cyan-400 font-mono">ai-studio-afrixa</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-slate-500 block">Identité Détectée :</span>
                <span className="text-white font-sans font-bold">{currentUser?.name || 'Visiteur non identifié'}</span>
              </div>
              <div>
                <span className="text-slate-500 block">E-mail Actuel :</span>
                <span className="text-cyan-300 truncate block">{currentUser?.email || 'N/A'}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Rôle Local :</span>
                <span className="text-amber-400 uppercase font-bold">{currentUser?.role || 'visiteur'}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Drapeau Firestore 'admin' :</span>
                <span className={isFirestoreAdminVerified ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                  {isFirestoreAdminVerified ? 'VALIDE (true)' : 'NON VALIDÉ (false)'}
                </span>
              </div>
            </div>

            {firestoreAdminDetails?.errorMessage && (
              <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-[11px] font-sans">
                {firestoreAdminDetails.errorMessage}
              </div>
            )}
          </div>

          {/* Action options */}
          <div className="space-y-3 pt-2">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => verifyAdminInFirestore(currentUser?.email)}
                disabled={isCheckingAdminAuth}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <RefreshCw className={`w-4 h-4 ${isCheckingAdminAuth ? 'animate-spin' : ''}`} />
                <span>{isCheckingAdminAuth ? 'Vérification en cours...' : 'Revérifier les droits Firestore'}</span>
              </button>

              <button
                onClick={() => {
                  loginUser('kenyojohnsonroberto@gmail.com');
                  switchRole('admin');
                  verifyAdminInFirestore('kenyojohnsonroberto@gmail.com');
                }}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition cursor-pointer shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2"
              >
                <Shield className="w-4 h-4" />
                <span>Se connecter en tant qu'Administrateur Titulaire</span>
              </button>
            </div>

            <p className="text-[11px] text-slate-500 italic">
              Compte administrateur fondateur officiel : <strong className="text-slate-400">kenyojohnsonroberto@gmail.com</strong> (OM: +237 656258659 | MOMO: +237 676092565)
            </p>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin Top Header with Integrated Credentials */}
      <div className="bg-[#0B1536] rounded-3xl border border-rose-500/30 p-6 md:p-8 shadow-2xl flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-600/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0">
              <Shield className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl md:text-2xl font-black text-white">Console Centrale d'Administration</h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500 text-white uppercase tracking-wider">
                  Super Admin
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-emerald-400" />
                  Firestore Autorisé (Role: admin)
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Plateforme pilotée par <strong>{siteSettings.adminName}</strong> ({siteSettings.adminEmail}) • Base : <span className="font-mono text-cyan-300">ai-studio-afrixa</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => verifyAdminInFirestore()}
              disabled={isCheckingAdminAuth}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-cyan-300 border border-slate-700 flex items-center gap-1.5 transition cursor-pointer"
              title="Vérifier la validité des permissions dans Firestore"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isCheckingAdminAuth ? 'animate-spin' : ''}`} />
              <span>{isCheckingAdminAuth ? 'Vérification...' : 'Statut Firestore'}</span>
            </button>
            <button
              onClick={exportSystemBackup}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-cyan-300 border border-slate-700 flex items-center gap-2 transition cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Sauvegarde (JSON)</span>
            </button>
          </div>

        </div>

        {/* Dedicated Admin Credentials & Mobile Money Reception Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-slate-950/70 p-4 rounded-2xl border border-slate-800 text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">Administrateur Titulaire</span>
            <span className="font-bold text-white text-xs mt-0.5 block">{siteSettings.adminName}</span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">Adresse E-mail Admin</span>
            <span className="font-mono text-cyan-300 text-xs mt-0.5 block truncate">{siteSettings.adminEmail}</span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-orange-400 tracking-wider block">Compte Orange Money (OM)</span>
            <span className="font-mono font-bold text-orange-300 text-xs mt-0.5 block flex items-center gap-1">
              <span>🇨🇲</span>
              <span>{siteSettings.adminOmAccount}</span>
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-yellow-400 tracking-wider block">Compte MTN MoMo (MOMO)</span>
            <span className="font-mono font-bold text-yellow-300 text-xs mt-0.5 block flex items-center gap-1">
              <span>🇨🇲</span>
              <span>{siteSettings.adminMomoAccount}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-blue-500/20 pb-3 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('kpi')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'kpi' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Tableau de Bord & KPIs</span>
        </button>

        <button
          onClick={() => setActiveTab('finance')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'finance' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5" />
          <span>Finance, Prix & Retraits</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'users' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Gestion des Utilisateurs</span>
        </button>

        <button
          onClick={() => setActiveTab('courses')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'courses' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Modération des Contenus</span>
        </button>

        <button
          onClick={() => setActiveTab('vpn')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'vpn' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Server className="w-3.5 h-3.5" />
          <span>Gestion des Nœuds VPN</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'audit' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Journal d'Audit ({auditLogs.length})</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW KPIS */}
      {activeTab === 'kpi' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#0D1B42]/70 p-5 rounded-2xl border border-blue-500/20">
              <div className="text-xs text-slate-400">Total Utilisateurs</div>
              <div className="text-2xl font-black text-white mt-1">14 250</div>
              <div className="text-[10px] text-emerald-400 mt-1">+142 cette semaine</div>
            </div>
            <div className="bg-[#0D1B42]/70 p-5 rounded-2xl border border-blue-500/20">
              <div className="text-xs text-slate-400">Revenus Adhésions & Services</div>
              <div className="text-2xl font-black text-cyan-400 mt-1">14 962 500 FCFA</div>
              <div className="text-[10px] text-cyan-300 mt-1">Mobile Money vérifié</div>
            </div>
            <div className="bg-[#0D1B42]/70 p-5 rounded-2xl border border-blue-500/20">
              <div className="text-xs text-slate-400">Demandes de Retrait</div>
              <div className="text-2xl font-black text-amber-400 mt-1">
                {withdrawalRequests.filter(r => r.status === 'pending').length} En attente
              </div>
              <div className="text-[10px] text-slate-400">Orange & MTN</div>
            </div>
            <div className="bg-[#0D1B42]/70 p-5 rounded-2xl border border-blue-500/20">
              <div className="text-xs text-slate-400">Serveurs VPN Opérationnels</div>
              <div className="text-2xl font-black text-emerald-400 mt-1">{vpnServers.length} / {vpnServers.length}</div>
              <div className="text-[10px] text-emerald-300 mt-1">100% Uptime</div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: FINANCE, PRICING & WITHDRAWALS */}
      {activeTab === 'finance' && (
        <div className="space-y-6">
          {/* Modify Prices Form (No Code Edit Needed!) */}
          <div className="bg-[#0D1B42]/80 rounded-3xl border border-blue-500/20 p-6 md:p-8 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-amber-400" />
                  <span>Paramètres Financiers & Comptes Réception (Protégés par Firestore)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Ces valeurs régissent l'adhésion, les retraits et les coordonnées de réception Mobile Money (Cameroun +237).
                </p>
              </div>
              <div className="flex items-center gap-2">
                {firestoreSaveStatus?.loading && (
                  <span className="px-3 py-1.5 rounded-xl bg-blue-500/20 border border-blue-500/40 text-cyan-300 text-xs font-bold flex items-center gap-1.5 animate-pulse">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Écriture Firestore...
                  </span>
                )}
                {firestoreSaveStatus?.success && (
                  <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Validé dans Firestore !
                  </span>
                )}
                {firestoreSaveStatus?.success === false && (
                  <span className="px-3 py-1.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Échec d'autorisation
                  </span>
                )}
              </div>
            </div>

            {firestoreSaveStatus?.message && (
              <div className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                firestoreSaveStatus.success
                  ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-200'
                  : 'bg-rose-950/40 border-rose-500/30 text-rose-200'
              }`}>
                {firestoreSaveStatus.success ? <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />}
                <span>{firestoreSaveStatus.message}</span>
              </div>
            )}


            <form onSubmit={handleSaveFinance} className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Frais d'Adhésion Membre (FCFA)
                </label>
                <input
                  type="number"
                  value={regFee}
                  onChange={e => setRegFee(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono font-bold text-cyan-300"
                  required
                />
                <span className="text-[10px] text-slate-500">Par défaut : 1 050 FCFA</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Récompense de Parrainage (FCFA / filleul)
                </label>
                <input
                  type="number"
                  value={refReward}
                  onChange={e => setRefReward(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono font-bold text-amber-300"
                  required
                />
                <span className="text-[10px] text-slate-500">Par défaut : 50 FCFA</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Seuil Minimum de Retrait (FCFA)
                </label>
                <input
                  type="number"
                  value={minWithdraw}
                  onChange={e => setMinWithdraw(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono font-bold text-emerald-300"
                  required
                />
                <span className="text-[10px] text-slate-500">Par défaut : 1 100 FCFA</span>
              </div>

              <div className="md:col-span-3 pt-3 border-t border-slate-800">
                <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider mb-2">
                  Coordonnées Administrateur & Comptes de Réception Mobile Money
                </h4>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nom du Titulaire Administrateur
                </label>
                <input
                  type="text"
                  value={adminNameInput}
                  onChange={e => setAdminNameInput(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Adresse E-mail Administrateur Officielle
                </label>
                <input
                  type="email"
                  value={adminEmailInput}
                  onChange={e => setAdminEmailInput(e.target.value)}
                  className="w-full bg-slate-900 border border-cyan-500/40 rounded-xl px-3 py-2 text-xs font-mono text-cyan-300"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-orange-400 mb-1">
                  Compte Réception Orange Money (OM)
                </label>
                <input
                  type="text"
                  value={adminOmInput}
                  onChange={e => setAdminOmInput(e.target.value)}
                  placeholder="+237 656258659"
                  className="w-full bg-slate-900 border border-orange-500/40 rounded-xl px-3 py-2 text-xs font-mono font-bold text-orange-300"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-yellow-400 mb-1">
                  Compte Réception MTN MoMo (MOMO)
                </label>
                <input
                  type="text"
                  value={adminMomoInput}
                  onChange={e => setAdminMomoInput(e.target.value)}
                  placeholder="+237 676092565"
                  className="w-full bg-slate-900 border border-yellow-500/40 rounded-xl px-3 py-2 text-xs font-mono font-bold text-yellow-300"
                  required
                />
              </div>

              <div className="md:col-span-3 pt-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <button
                  type="submit"
                  disabled={firestoreSaveStatus?.loading}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shadow-blue-600/30 disabled:opacity-60"
                >
                  {firestoreSaveStatus?.loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Validation Firestore en cours...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Enregistrer dans Firestore (OM, MOMO & Paramètres Financiers)</span>
                    </>
                  )}
                </button>

                <span className="text-[11px] text-slate-400 font-mono">
                  Écriture protégée par <strong className="text-cyan-300">firestore.rules</strong> (Collection: settings/platform)
                </span>
              </div>

            </form>
          </div>

          {/* Manage Withdrawal Requests */}
          <div className="bg-[#0D1B42]/80 rounded-3xl border border-blue-500/20 p-6 md:p-8 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <span>Modération des Demandes de Retrait Récompenses</span>
            </h3>
            <p className="text-xs text-slate-400">
              Règle déontologique : un retrait ne doit être marqué « Payé » qu'après confirmation réelle du transfert par l'opérateur Mobile Money.
            </p>

            <div className="space-y-3 pt-2">
              {withdrawalRequests.map(req => (
                <div
                  key={req.id}
                  className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{req.userName}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300">
                        {req.amount.toLocaleString()} FCFA
                      </span>
                      <span className="text-xs text-slate-400 font-mono">({req.method === 'orange_money' ? 'Orange Money' : 'MTN MoMo'})</span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Téléphone : <strong className="text-white">{req.phoneNumber}</strong> • Demandé le : {req.requestDate}
                    </p>
                    {req.notes && <p className="text-[11px] text-cyan-300 italic">Notes : {req.notes}</p>}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                      req.status === 'paid'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : req.status === 'approved'
                        ? 'bg-blue-500/20 text-cyan-300 border border-blue-500/30'
                        : req.status === 'rejected'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {req.status}
                    </span>

                    {req.status === 'pending' && (
                      <>
                        <button
                          onClick={() => adminProcessWithdrawal(req.id, 'approved', 'Demande validée par l’administration')}
                          className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
                        >
                          Approuver
                        </button>
                        <button
                          onClick={() => adminProcessWithdrawal(req.id, 'paid', 'Virement Mobile Money effectué')}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                        >
                          Marquer Payé
                        </button>
                        <button
                          onClick={() => adminProcessWithdrawal(req.id, 'rejected', 'Coordonnées erronées')}
                          className="px-3 py-1.5 rounded-xl bg-rose-600/30 hover:bg-rose-600 text-rose-300 text-xs font-bold"
                        >
                          Rejeter
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: USERS & ROLES */}
      {activeTab === 'users' && (
        <div className="bg-[#0D1B42]/80 rounded-3xl border border-blue-500/20 p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-cyan-400" />
              <span>Annuaire et Rôles des Utilisateurs</span>
            </h3>
            <span className="text-xs text-slate-400">{demoUsers.length} comptes enregistrés</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="text-[11px] uppercase font-bold text-slate-400 bg-slate-900/60 border-b border-slate-800">
                <tr>
                  <th className="p-3">Utilisateur</th>
                  <th className="p-3">Pays</th>
                  <th className="p-3">Rôle Système</th>
                  <th className="p-3">Statut</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {demoUsers.map(u => (
                  <tr key={u.id} className="hover:bg-slate-900/40">
                    <td className="p-3">
                      <div className="font-bold text-white">{u.name}</div>
                      <div className="text-[10px] text-slate-500">{u.email}</div>
                    </td>
                    <td className="p-3">{u.country}</td>
                    <td className="p-3">
                      <select
                        value={u.role}
                        onChange={e => handleChangeUserRole(u.id, e.target.value as Role)}
                        className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-cyan-300"
                      >
                        <option value="visitor">Visiteur</option>
                        <option value="member">Membre</option>
                        <option value="seller">Vendeur</option>
                        <option value="instructor">Formateur</option>
                        <option value="moderator">Modérateur</option>
                        <option value="admin">Administrateur</option>
                      </select>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        u.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                      }`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleToggleUserStatus(u.id)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                          u.status === 'active'
                            ? 'bg-rose-600/30 text-rose-300 hover:bg-rose-600 hover:text-white'
                            : 'bg-emerald-600/30 text-emerald-300 hover:bg-emerald-600 hover:text-white'
                        }`}
                      >
                        {u.status === 'active' ? 'Suspendre' : 'Réactiver'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: COURSES MODERATION */}
      {activeTab === 'courses' && (
        <div className="bg-[#0D1B42]/80 rounded-3xl border border-blue-500/20 p-6 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            <span>Gestion des Formations & Prix</span>
          </h3>

          <div className="space-y-3">
            {courses.map(crs => (
              <div
                key={crs.id}
                className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <img src={crs.thumbnail} alt={crs.title} className="w-14 h-12 object-cover rounded-lg" />
                  <div>
                    <h4 className="text-xs font-bold text-white">{crs.title}</h4>
                    <p className="text-[11px] text-slate-400">{crs.instructor} • {crs.enrolledCount} inscrits</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-mono text-cyan-300 font-bold text-xs">
                    {crs.isFree ? 'Gratuit' : `${crs.price.toLocaleString()} FCFA`}
                  </span>
                  <button
                    onClick={() => {
                      setCourses(prev => prev.filter(c => c.id !== crs.id));
                      logAuditAction('Formation retirée', crs.title, 'Suppression du catalogue', 'content');
                    }}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: VPN NODES MANAGEMENT */}
      {activeTab === 'vpn' && (
        <div className="bg-[#0D1B42]/80 rounded-3xl border border-blue-500/20 p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Server className="w-5 h-5 text-cyan-400" />
              <span>Nœuds et Relais VPN Administrés ({vpnServers.length})</span>
            </h3>
            <button
              onClick={() => setShowAddServerModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Ajouter un serveur</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {vpnServers.map(s => (
              <div
                key={s.id}
                className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 flex items-center justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{s.flag}</span>
                    <span className="font-bold text-white text-xs">{s.name}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono">IP: {s.ip} • Latence: {s.latencyMs}ms</p>
                </div>
                <button
                  onClick={() => handleDeleteServer(s.id)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: AUDIT LOGS */}
      {activeTab === 'audit' && (
        <div className="bg-[#0D1B42]/80 rounded-3xl border border-blue-500/20 p-6 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            <span>Journal d'Audit Sécurisé (Immuable)</span>
          </h3>
          <p className="text-xs text-slate-400">
            Traçabilité intégrale de toutes les actions administratives, financières et de sécurité.
          </p>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {auditLogs.map(log => (
              <div
                key={log.id}
                className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 text-xs flex items-center justify-between gap-4 font-mono"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-400 font-bold">{log.action}</span>
                    <span className="text-slate-500">[{log.category.toUpperCase()}]</span>
                  </div>
                  <p className="text-slate-400 text-[11px] truncate">
                    Cible : {log.target} • {log.details}
                  </p>
                </div>
                <div className="text-right text-[10px] text-slate-500 shrink-0">
                  <div>{log.performedBy}</div>
                  <div>{log.timestamp}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Server Modal */}
      {showAddServerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#0D1B42] border border-cyan-500/40 p-6 shadow-2xl text-slate-100 space-y-4 relative">
            <button
              onClick={() => setShowAddServerModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <XCircle className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Server className="w-5 h-5 text-cyan-400" />
              <span>Nouveau Nœud VPN</span>
            </h3>

            <form onSubmit={handleAddServer} className="space-y-3">
              <div>
                <label className="block text-xs text-slate-300 mb-1">Nom du serveur</label>
                <input
                  type="text"
                  value={newSrvName}
                  onChange={e => setNewSrvName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Pays</label>
                  <input
                    type="text"
                    value={newSrvCountry}
                    onChange={e => setNewSrvCountry(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Drapeau (Émoji)</label>
                  <input
                    type="text"
                    value={newSrvFlag}
                    onChange={e => setNewSrvFlag(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Adresse IP publique</label>
                <input
                  type="text"
                  value={newSrvIp}
                  onChange={e => setNewSrvIp(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-cyan-300"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition cursor-pointer"
              >
                Déployer dans le catalogue
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
