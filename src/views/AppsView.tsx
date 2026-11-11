/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Cpu,
  Download,
  CheckCircle,
  ExternalLink,
  ShieldCheck,
  Smartphone,
  Monitor,
  Key,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SoftwareApp } from '../types';

export const AppsView: React.FC = () => {
  const { apps, obtainedAppIds, obtainApp, openModal } = useApp();

  const [activeApp, setActiveApp] = useState<SoftwareApp | null>(null);

  const handleGetApp = (app: SoftwareApp) => {
    if (app.price === 0) {
      obtainApp(app.id);
      setActiveApp(app);
    } else {
      openModal('payment', {
        purpose: 'app',
        targetId: app.id,
        title: `Logiciel : ${app.name}`,
        amount: app.price
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#1E0B30] via-[#35104E] to-[#160724] border border-pink-500/30 p-8 md:p-12 shadow-2xl relative overflow-hidden">
        <div className="max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 border border-pink-400/40 text-xs font-bold uppercase tracking-wider">
            <Cpu className="w-3.5 h-3.5" />
            <span>AFRIXA Apps • Boutique Logicielle Certifiée</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
            Des outils numériques performants, fiables et vérifiés
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Accédez à une suite d'applications mobiles, utilitaires système, outils réseau et logiciels de gestion conçus et optimisés pour le continent africain.
          </p>
        </div>
      </div>

      {/* Apps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {apps.map(app => {
          const isObtained = obtainedAppIds.includes(app.id);
          return (
            <div
              key={app.id}
              className="bg-[#0D1B42]/70 rounded-2xl border border-blue-500/20 hover:border-pink-400/40 p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-pink-500/10"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={app.logo}
                      alt={app.name}
                      className="w-14 h-14 rounded-2xl object-cover border border-slate-700 shadow-md"
                    />
                    <div>
                      <h3 className="text-base font-bold text-white hover:text-pink-300 transition">
                        {app.name}
                      </h3>
                      <span className="text-[10px] text-cyan-400 font-mono font-semibold">
                        {app.version}
                      </span>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                    app.price === 0
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-pink-500/20 text-pink-300 border border-pink-500/30'
                  }`}>
                    {app.price === 0 ? 'Gratuit' : `${app.price.toLocaleString()} FCFA`}
                  </span>
                </div>

                <p className="text-xs font-semibold text-slate-300">
                  {app.tagline}
                </p>

                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                  {app.description}
                </p>

                {/* Platforms */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {app.platforms.map(pl => (
                    <span
                      key={pl}
                      className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-700 text-[10px] font-medium text-slate-300 flex items-center gap-1"
                    >
                      {pl === 'Android' ? <Smartphone className="w-3 h-3 text-emerald-400" /> : <Monitor className="w-3 h-3 text-blue-400" />}
                      {pl}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-slate-800/80 mt-4 flex gap-2">
                <button
                  onClick={() => setActiveApp(app)}
                  className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  Détails & Licence
                </button>
                {isObtained ? (
                  <button
                    onClick={() => setActiveApp(app)}
                    className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-md shadow-emerald-600/30"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Obtenue</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleGetApp(app)}
                    className="flex-1 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-md shadow-pink-600/30"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{app.price === 0 ? 'Télécharger' : 'Acheter'}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* App Details & License Modal */}
      {activeApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="w-full max-w-lg rounded-3xl bg-[#0D1B42] border border-pink-500/40 p-6 shadow-2xl text-slate-100 space-y-4 relative">
            <button
              onClick={() => setActiveApp(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex gap-4 items-center">
              <img
                src={activeApp.logo}
                alt={activeApp.name}
                className="w-16 h-16 rounded-2xl object-cover border border-slate-700"
              />
              <div>
                <h3 className="text-base font-bold text-white">{activeApp.name}</h3>
                <p className="text-xs text-pink-300">{activeApp.tagline}</p>
                <span className="text-[10px] text-slate-400 font-mono">Version : {activeApp.version} • {activeApp.licenseType}</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
              {activeApp.description}
            </p>

            {/* Generated Official License Key */}
            <div className="bg-slate-900/90 p-3.5 rounded-xl border border-blue-500/30 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-400">
                <Key className="w-4 h-4" />
                <span>Clé de Licence AFRIXA Certifiée :</span>
              </div>
              <div className="font-mono text-xs bg-black/60 p-2 rounded text-emerald-400 select-all border border-slate-800">
                AFX-LIC-{activeApp.id.toUpperCase()}-2026-9874-XK21
              </div>
              <p className="text-[10px] text-slate-400">
                Cette licence nominative est rattachée à votre compte et autorise une utilisation sur 3 terminaux.
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  alert(`Lien officiel sécurisé généré : ${activeApp.downloadUrl}`);
                  setActiveApp(null);
                }}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 font-bold text-xs text-white flex items-center justify-center gap-2 shadow-lg shadow-pink-600/30 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Lancer le téléchargement sécurisé du binaire</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
