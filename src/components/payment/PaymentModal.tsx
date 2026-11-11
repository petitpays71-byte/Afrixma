/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, ShieldCheck, Smartphone, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const PaymentModal: React.FC = () => {
  const { activeModal, modalPayload, closeModal, processSandboxPayment, siteSettings, currentUser } = useApp();

  const [method, setMethod] = useState<'orange_money' | 'mtn_momo'>('orange_money');
  const [phone, setPhone] = useState(currentUser?.phone || siteSettings.adminOmAccount || '+237 656258659');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; reference: string; message: string } | null>(null);
  const [hasProcessed, setHasProcessed] = useState(false);

  if (activeModal !== 'payment') return null;

  const amount = modalPayload?.amount || 1050;
  const purpose = modalPayload?.purpose || 'membership';
  const title = modalPayload?.title || 'Règlement de service AFRIXA';
  const targetId = modalPayload?.targetId;

  const handleSimulatePayment = async (shouldSucceed: boolean) => {
    if (hasProcessed && result?.success) {
      alert("Cette transaction a déjà été validée. Aucune double facturation autorisée.");
      return;
    }

    setLoading(true);
    setResult(null);

    // Simulate network delay and webhook verification
    await new Promise(r => setTimeout(r, 1200));

    if (!shouldSucceed) {
      setLoading(false);
      setResult({
        success: false,
        reference: `AFX-ERR-${Date.now().toString().slice(-6)}`,
        message: "Paiement refusé ou délai d'attente dépassé sur le terminal Mobile Money."
      });
      return;
    }

    const res = await processSandboxPayment(
      amount,
      purpose,
      method,
      phone,
      targetId,
      title
    );

    setLoading(false);
    setHasProcessed(true);
    setResult(res);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="w-full max-w-md rounded-2xl bg-[#0D1B42] border border-blue-500/40 p-6 shadow-2xl text-slate-100 relative">
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4 text-cyan-400">
          <ShieldCheck className="w-6 h-6" />
          <h3 className="text-base font-bold text-white">Passerelle de Paiement Mobile Money</h3>
        </div>

        {/* Sandbox Indicator & Admin Merchant Info */}
        <div className="mb-4 space-y-2">
          <div className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center justify-between">
            <span className="font-semibold">Environnement Sandbox Test</span>
            <span className="text-[10px] bg-amber-500/20 px-2 py-0.5 rounded uppercase font-mono">Testnet</span>
          </div>

          <div className="px-3 py-2 rounded-xl bg-slate-900/90 border border-blue-500/30 text-[11px] text-slate-300 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Bénéficiaire Administrateur :</span>
              <span className="font-bold text-white">{siteSettings.adminName}</span>
            </div>
            <div className="flex items-center justify-between font-mono text-[10px]">
              <span className="text-slate-400">E-mail Réception :</span>
              <span className="text-cyan-300">{siteSettings.adminEmail}</span>
            </div>
            <div className="flex items-center justify-between font-mono text-[10px]">
              <span className="text-slate-400">Compte Marchand Actif :</span>
              <span className="text-emerald-400 font-bold">
                {method === 'orange_money' ? siteSettings.adminOmAccount : siteSettings.adminMomoAccount} 🇨🇲
              </span>
            </div>
          </div>
        </div>

        {/* Item summary */}
        <div className="bg-slate-900/80 p-4 rounded-xl border border-blue-500/20 mb-4 space-y-1">
          <div className="text-xs text-slate-400 uppercase font-semibold">Prestation / Commande</div>
          <div className="text-sm font-bold text-white">{title}</div>
          <div className="flex justify-between items-baseline pt-2 border-t border-slate-800 mt-2">
            <span className="text-xs text-slate-300">Montant net :</span>
            <span className="text-lg font-black text-cyan-400">{amount.toLocaleString()} FCFA</span>
          </div>
        </div>

        {!result ? (
          <div className="space-y-4">
            {/* Operator Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Sélectionnez votre opérateur de paiement
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setMethod('orange_money')}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1 transition cursor-pointer ${
                    method === 'orange_money'
                      ? 'border-orange-500 bg-orange-500/10 text-orange-300 font-bold shadow-md shadow-orange-500/20'
                      : 'border-slate-700 bg-slate-900/50 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  <span className="w-3 h-3 rounded-full bg-orange-500 inline-block"></span>
                  <span className="text-xs">Orange Money</span>
                  <span className="text-[10px] text-slate-400 font-mono">{siteSettings.adminOmAccount}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMethod('mtn_momo')}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1 transition cursor-pointer ${
                    method === 'mtn_momo'
                      ? 'border-yellow-400 bg-yellow-400/10 text-yellow-300 font-bold shadow-md shadow-yellow-400/20'
                      : 'border-slate-700 bg-slate-900/50 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  <span className="w-3 h-3 rounded-full bg-yellow-400 inline-block"></span>
                  <span className="text-xs">MTN MoMo</span>
                  <span className="text-[10px] text-slate-400 font-mono">{siteSettings.adminMomoAccount}</span>
                </button>
              </div>
            </div>

            {/* Phone Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Numéro Mobile Money du payeur (débit)
              </label>
              <div className="relative">
                <Smartphone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+237 656258659"
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400 transition font-mono"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Le montant sera crédité sur le compte administrateur ({siteSettings.adminEmail}) après validation.
              </p>
            </div>

            {/* Test Simulation Buttons */}
            <div className="pt-2 space-y-2">
              <button
                disabled={loading}
                onClick={() => handleSimulatePayment(true)}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Validation du webhook en cours...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Simuler Paiement Réussi ({amount.toLocaleString()} FCFA)
                  </>
                )}
              </button>

              <button
                disabled={loading}
                onClick={() => handleSimulatePayment(false)}
                className="w-full py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                Simuler Échec Transaction
              </button>
            </div>
          </div>
        ) : (
          <div className="py-3 text-center space-y-3">
            {result.success ? (
              <>
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
                  <CheckCircle className="w-7 h-7" />
                </div>
                <h4 className="text-base font-bold text-white">Paiement Confirmé avec Succès !</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{result.message}</p>
                <div className="bg-slate-900/90 p-3 rounded-xl border border-blue-500/20 text-left font-mono text-xs space-y-1">
                  <div className="flex justify-between text-slate-400">
                    <span>Référence :</span>
                    <span className="text-cyan-300 font-bold">{result.reference}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Statut Webhook :</span>
                    <span className="text-emerald-400">VÉRIFIÉ & ARCHIVÉ</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Opérateur :</span>
                    <span className="capitalize">{method === 'orange_money' ? 'Orange Money' : 'MTN MoMo'}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Compte Récepteur Admin :</span>
                    <span className="text-white font-bold">{method === 'orange_money' ? siteSettings.adminOmAccount : siteSettings.adminMomoAccount}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Titulaire Référent :</span>
                    <span className="text-cyan-300 truncate">{siteSettings.adminEmail}</span>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="w-full mt-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-sm text-white transition cursor-pointer"
                >
                  Accéder à mon contenu débloqué
                </button>
              </>
            ) : (
              <>
                <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/40">
                  <AlertCircle className="w-7 h-7" />
                </div>
                <h4 className="text-base font-bold text-white">Transaction Échouée</h4>
                <p className="text-xs text-rose-300">{result.message}</p>
                <p className="text-[11px] text-slate-400">Réf : {result.reference}</p>
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => setResult(null)}
                    className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 font-semibold text-xs text-white transition cursor-pointer"
                  >
                    Réessayer
                  </button>
                  <button
                    onClick={closeModal}
                    className="flex-1 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-700 transition cursor-pointer"
                  >
                    Fermer
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
