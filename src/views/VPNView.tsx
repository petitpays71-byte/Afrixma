/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Radio,
  Server,
  Zap,
  Download,
  Upload,
  Copy,
  Check,
  Shield,
  Activity,
  Plus,
  Trash2,
  QrCode,
  Clipboard,
  FileCode,
  Info,
  CheckCircle,
  AlertTriangle,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { VPNProtocol, VPNConfigProfile } from '../types';

export const VPNView: React.FC = () => {
  const {
    vpnServers,
    vpnProfiles,
    addVPNProfile,
    deleteVPNProfile,
    vpnSubscription,
    pingServer,
    currentUser,
    openModal
  } = useApp();

  const [activeTab, setActiveTab] = useState<'servers' | 'profiles' | 'subscription'>('servers');
  const [showImportModal, setShowImportModal] = useState(false);
  const [importMode, setImportMode] = useState<'url' | 'clipboard' | 'file' | 'manual'>('url');
  const [inputUrlOrText, setInputUrlOrText] = useState('');
  const [manualProtocol, setManualProtocol] = useState<VPNProtocol>('VLESS');
  const [manualName, setManualName] = useState('');
  const [manualHost, setManualHost] = useState('');
  const [manualPort, setManualPort] = useState(443);
  const [copiedProfileId, setCopiedProfileId] = useState<string | null>(null);
  const [testingPingId, setTestingPingId] = useState<string | null>(null);

  const protocols: VPNProtocol[] = [
    'VLESS', 'VMess', 'Shadowsocks', 'Trojan', 'SSH', 'SOCKS', 'Hysteria2', 'WireGuard'
  ];

  const handlePing = async (id: string) => {
    setTestingPingId(id);
    await pingServer(id);
    setTimeout(() => setTestingPingId(null), 400);
  };

  const handleCopyConfig = (profile: VPNConfigProfile) => {
    navigator.clipboard.writeText(profile.rawConfig);
    setCopiedProfileId(profile.id);
    setTimeout(() => setCopiedProfileId(null), 2000);
  };

  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (importMode === 'url' || importMode === 'clipboard' || importMode === 'file') {
      const text = inputUrlOrText.trim();
      if (!text) return;

      let detectedProtocol: VPNProtocol = 'VLESS';
      if (text.startsWith('vmess://')) detectedProtocol = 'VMess';
      else if (text.startsWith('ss://')) detectedProtocol = 'Shadowsocks';
      else if (text.startsWith('trojan://')) detectedProtocol = 'Trojan';
      else if (text.includes('[Interface]')) detectedProtocol = 'WireGuard';
      else if (text.startsWith('hy2://')) detectedProtocol = 'Hysteria2';

      addVPNProfile({
        name: `Import-${detectedProtocol}-${Date.now().toString().slice(-4)}`,
        protocol: detectedProtocol,
        serverAddress: 'custom.afrixa-node.net',
        port: 443,
        uuidOrKey: 'custom-imported-credentials',
        networkType: 'ws',
        tls: true,
        rawConfig: text
      });
    } else {
      // Manual creation
      const raw = manualProtocol === 'WireGuard'
        ? `[Interface]\nPrivateKey = ...\nAddress = 10.0.0.2/24\n[Peer]\nEndpoint = ${manualHost}:${manualPort}\nAllowedIPs = 0.0.0.0/0`
        : `${manualProtocol.toLowerCase()}://${manualHost}:${manualPort}#${manualName}`;

      addVPNProfile({
        name: manualName || `Profil-${manualProtocol}`,
        protocol: manualProtocol,
        serverAddress: manualHost || 'node.afrixa.org',
        port: manualPort,
        uuidOrKey: 'manual-uuid-key',
        networkType: 'tcp',
        tls: true,
        rawConfig: raw
      });
    }

    setShowImportModal(false);
    setInputUrlOrText('');
    setManualName('');
    setManualHost('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#071E3D] via-[#0A2E5C] to-[#061830] border border-cyan-500/30 p-8 md:p-12 shadow-2xl relative overflow-hidden">
        <div className="max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 text-xs font-bold uppercase tracking-wider">
            <Radio className="w-3.5 h-3.5" />
            <span>AFRIXA VPN • Gestionnaire de Configurations Réseau</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
            Sécurité, Chiffrement & Maîtrise de vos Nœuds VPN
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Importez, testez et organisez vos configurations VLESS, VMess, Shadowsocks, Trojan et WireGuard. Conçu pour une interconnexion fluide avec les clients réseau Android et Desktop.
          </p>
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setShowImportModal(true)}
              className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition cursor-pointer shadow-lg shadow-cyan-500/30"
            >
              <Plus className="w-4 h-4" />
              <span>Importer une configuration</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mandatory Technical Disclaimer Box */}
      <div className="bg-blue-950/60 border border-cyan-500/40 p-5 rounded-2xl flex items-start gap-3.5 text-blue-200">
        <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1 leading-relaxed">
          <span className="font-bold uppercase tracking-wider block text-cyan-300">
            Architecture Technique & Transparence d'Intégration
          </span>
          <p>
            AFRIXA fournit ce gestionnaire complet de profils et de serveurs avec mesure de latence en direct. Pour des raisons de sécurité imposées par les systèmes d'exploitation mobiles (sandbox Chromium / WebKit), un site web ou une PWA ne peut pas établir directement de tunnel VPN système sur Android sans l'intermédiaire d'un moteur VPN natif (ex: V2Ray core, WireGuard kernel ou Xray daemon). Les configurations générées ici sont 100% compatibles et prêtes à être exportées vers les clients natifs compagnons ou injectées dans l'APK compagnon officiel AFRIXA.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-blue-500/20 pb-3">
        <button
          onClick={() => setActiveTab('servers')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'servers'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Server className="w-4 h-4" />
          <span>Serveurs & Nœuds Réseau ({vpnServers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('profiles')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'profiles'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Radio className="w-4 h-4" />
          <span>Mes Configurations ({vpnProfiles.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('subscription')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'subscription'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Statut Abonnement & Trafic</span>
        </button>
      </div>

      {/* TAB 1: SERVERS LIST */}
      {activeTab === 'servers' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vpnServers.map(srv => (
              <div
                key={srv.id}
                className="bg-[#0D1B42]/70 rounded-2xl border border-blue-500/20 hover:border-cyan-400/40 p-5 space-y-4 transition"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{srv.flag}</span>
                    <div>
                      <h4 className="text-sm font-bold text-white">{srv.name}</h4>
                      <p className="text-[11px] text-slate-400">{srv.city}, {srv.country}</p>
                    </div>
                  </div>
                  <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    En Ligne
                  </span>
                </div>

                <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Latence mesurée :</span>
                    <span className="font-mono font-bold text-cyan-300 flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      {srv.latencyMs} ms
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Charge serveur :</span>
                    <span className="font-mono text-slate-300">{srv.capacityPercent}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        srv.capacityPercent > 70 ? 'bg-amber-500' : 'bg-cyan-400'
                      }`}
                      style={{ width: `${srv.capacityPercent}%` }}
                    ></div>
                  </div>
                </div>

                {/* Protocols supported */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {srv.supportedProtocols.map(proto => (
                    <span
                      key={proto}
                      className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-950 border border-blue-500/30 text-blue-300"
                    >
                      {proto}
                    </span>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-800 flex gap-2">
                  <button
                    onClick={() => handlePing(srv.id)}
                    disabled={testingPingId === srv.id}
                    className="flex-1 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Activity className={`w-3.5 h-3.5 text-cyan-400 ${testingPingId === srv.id ? 'animate-spin' : ''}`} />
                    <span>{testingPingId === srv.id ? 'Test ping...' : 'Tester le ping'}</span>
                  </button>

                  <button
                    onClick={() => {
                      addVPNProfile({
                        name: `Config-${srv.city}-VLESS`,
                        protocol: 'VLESS',
                        serverAddress: srv.ip,
                        port: 443,
                        uuidOrKey: 'e7b1c410-8b43-4f9e-9d8a-6b2a0c4f8291',
                        networkType: 'ws',
                        tls: true,
                        rawConfig: `vless://e7b1c410-8b43-4f9e-9d8a-6b2a0c4f8291@${srv.ip}:443?type=ws&security=tls#AFRIXA-${srv.city}`
                      });
                      setActiveTab('profiles');
                    }}
                    className="py-1.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white transition cursor-pointer"
                  >
                    Connecter
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: PROFILES & CONFIGURATIONS */}
      {activeTab === 'profiles' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-white">Profils enregistrés sur ce terminal</h3>
            <button
              onClick={() => setShowImportModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white flex items-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nouveau profil</span>
            </button>
          </div>

          <div className="space-y-3">
            {vpnProfiles.map(p => (
              <div
                key={p.id}
                className="bg-[#0D1B42]/70 rounded-2xl border border-blue-500/20 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      {p.protocol}
                    </span>
                    <h4 className="text-sm font-bold text-white truncate">{p.name}</h4>
                  </div>
                  <p className="text-xs text-slate-400 font-mono">
                    Hôte : {p.serverAddress}:{p.port} • Créé le : {p.createdAt}
                  </p>
                  <p className="text-[11px] text-slate-500 font-mono truncate max-w-xl">
                    {p.rawConfig}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleCopyConfig(p)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center gap-1.5 transition cursor-pointer"
                    title="Copier la configuration pour v2rayNG / Clash / WireGuard"
                  >
                    {copiedProfileId === p.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copié !</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Copier URL / Config</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => deleteVPNProfile(p.id)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 transition"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: SUBSCRIPTION STATUS */}
      {activeTab === 'subscription' && (
        <div className="bg-[#0D1B42]/70 rounded-3xl border border-blue-500/30 p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-blue-500/20">
            <div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider">
                Forfait Actif
              </span>
              <h3 className="text-2xl font-black text-white mt-2">{vpnSubscription.planName}</h3>
              <p className="text-xs text-slate-400">Valable jusqu'au {vpnSubscription.expirationDate}</p>
            </div>
            <button
              onClick={() => openModal('payment', {
                purpose: 'vpn',
                amount: 3000,
                title: 'Renouvellement Forfait VPN Illimité (1 An)'
              })}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-xs text-white shadow-lg shadow-blue-600/30 transition cursor-pointer"
            >
              Renouveler mon abonnement
            </button>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-300">
              <span>Consommation de données :</span>
              <span className="font-bold text-cyan-300">
                {vpnSubscription.trafficUsedGB} GB / {vpnSubscription.trafficLimitGB} GB
              </span>
            </div>
            <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden border border-slate-700">
              <div
                className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full rounded-full"
                style={{ width: `${(vpnSubscription.trafficUsedGB / vpnSubscription.trafficLimitGB) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* Import Modal (URL, QR, Clipboard, Manual) */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="w-full max-w-lg rounded-3xl bg-[#0D1B42] border border-cyan-500/40 p-6 shadow-2xl text-slate-100 space-y-4 relative">
            <button
              onClick={() => setShowImportModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Radio className="w-5 h-5 text-cyan-400" />
              <span>Importer un profil VPN</span>
            </h3>

            {/* Import tabs */}
            <div className="grid grid-cols-4 gap-1 p-1 bg-slate-900 rounded-xl border border-slate-800 text-[11px] font-semibold">
              <button
                type="button"
                onClick={() => setImportMode('url')}
                className={`py-1.5 rounded-lg transition ${importMode === 'url' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
              >
                URL / Lien
              </button>
              <button
                type="button"
                onClick={() => setImportMode('clipboard')}
                className={`py-1.5 rounded-lg transition ${importMode === 'clipboard' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
              >
                Presse-papiers
              </button>
              <button
                type="button"
                onClick={() => setImportMode('file')}
                className={`py-1.5 rounded-lg transition ${importMode === 'file' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
              >
                Fichier (.conf)
              </button>
              <button
                type="button"
                onClick={() => setImportMode('manual')}
                className={`py-1.5 rounded-lg transition ${importMode === 'manual' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
              >
                Manuel
              </button>
            </div>

            <form onSubmit={handleImportSubmit} className="space-y-4">
              {importMode !== 'manual' ? (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {importMode === 'url' && 'Collez le lien de configuration (vless://, vmess://, ss://, hy2://)'}
                    {importMode === 'clipboard' && 'Contenu brut copié dans le presse-papiers'}
                    {importMode === 'file' && 'Collez le texte du fichier .conf / .json'}
                  </label>
                  <textarea
                    rows={4}
                    value={inputUrlOrText}
                    onChange={e => setInputUrlOrText(e.target.value)}
                    placeholder="vless://e7b1c410-8b43-4f9e-9d8a-6b2a0c4f8291@dakar.afrixa.org:443?type=ws..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-400"
                    required
                  />
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Protocole</label>
                    <select
                      value={manualProtocol}
                      onChange={e => setManualProtocol(e.target.value as any)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    >
                      {protocols.map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Nom du profil</label>
                    <input
                      type="text"
                      value={manualName}
                      onChange={e => setManualName(e.target.value)}
                      placeholder="Ex: Mon-Serveur-Privé"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Serveur / IP</label>
                      <input
                        type="text"
                        value={manualHost}
                        onChange={e => setManualHost(e.target.value)}
                        placeholder="197.149.200.45"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Port</label>
                      <input
                        type="number"
                        value={manualPort}
                        onChange={e => setManualPort(Number(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition cursor-pointer shadow-lg shadow-cyan-500/20"
              >
                Enregistrer la configuration
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
