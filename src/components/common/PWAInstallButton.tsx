/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Download, Smartphone, X, Check } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

export const PWAInstallButton: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [showGeneralGuide, setShowGeneralGuide] = useState(false);

  // If already in standalone mode, show a small badge
  if (isInstalled) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
        <Check className="w-3.5 h-3.5" />
        Application Installée
      </span>
    );
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      await install();
    } else if (isIOS) {
      setShowIOSGuide(true);
    } else {
      setShowGeneralGuide(true);
    }
  };

  return (
    <>
      <button
        onClick={handleInstallClick}
        aria-label="Installer l'application AFRIXA"
        className={`group relative flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 px-3.5 py-2 text-xs md:text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] border border-blue-400/30 cursor-pointer`}
      >
        <Smartphone className="w-4 h-4 text-cyan-300 group-hover:rotate-12 transition-transform" />
        {!compact && <span>Installer l'App (PWA)</span>}
        {compact && <span>Installer</span>}
      </button>

      {/* iOS Safari Guide Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl bg-[#0D1B42] border border-blue-500/40 p-6 shadow-2xl text-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-cyan-400" />
                Installer sur iPhone / iPad
              </h3>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-sm text-slate-300">
              <div className="flex items-start gap-3 bg-slate-900/60 p-3 rounded-xl border border-blue-500/20">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0">1</span>
                <span>Ouvrez le menu <strong>Partager</strong> dans Safari (icône flèche vers le haut).</span>
              </div>
              <div className="flex items-start gap-3 bg-slate-900/60 p-3 rounded-xl border border-blue-500/20">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0">2</span>
                <span>Faites défiler et appuyez sur <strong>« Sur l’écran d’accueil »</strong>.</span>
              </div>
              <div className="flex items-start gap-3 bg-slate-900/60 p-3 rounded-xl border border-blue-500/20">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0">3</span>
                <span>Appuyez sur <strong>Ajouter</strong> en haut à droite.</span>
              </div>
            </div>
            <button
              onClick={() => setShowIOSGuide(false)}
              className="mt-5 w-full rounded-xl bg-blue-600 hover:bg-blue-500 py-2.5 text-sm font-semibold text-white transition cursor-pointer"
            >
              Compris
            </button>
          </div>
        </div>
      )}

      {/* General / Android / Desktop Guide Modal when prompt not automatically popped */}
      {showGeneralGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#0D1B42] border border-blue-500/40 p-6 shadow-2xl text-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Download className="w-5 h-5 text-cyan-400" />
                Installer l'application AFRIXA
              </h3>
              <button
                onClick={() => setShowGeneralGuide(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-slate-300 mb-4 leading-relaxed">
              AFRIXA est une Progressive Web App (PWA) installable sur Android, Google Chrome, Windows, Mac et tablettes sans passer par les stores traditionnels.
            </p>
            <div className="space-y-2 text-xs text-slate-300 bg-slate-900/60 p-4 rounded-xl border border-blue-500/20">
              <p>• <strong>Sur Google Chrome (Android / PC) :</strong> Cliquez sur l'icône d'installation dans la barre d'adresse ou dans le menu (⋮) &gt; « Installer l'application ».</p>
              <p>• <strong>Accès Hors-Ligne :</strong> Vos formations, livres et configurations restent consultables sans connexion Internet.</p>
              <p>• <strong>Performance & Notifications :</strong> Temps de chargement instantané et alertes en temps réel.</p>
            </div>
            <button
              onClick={() => setShowGeneralGuide(false)}
              className="mt-5 w-full rounded-xl bg-blue-600 hover:bg-blue-500 py-2.5 text-sm font-semibold text-white transition cursor-pointer"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </>
  );
};
