/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Globe,
  ShieldAlert,
  Hash,
  HelpCircle,
  BookOpen,
  CheckCircle2,
  Cpu,
  RefreshCw,
  Award
} from 'lucide-react';

export const CryptoView: React.FC = () => {
  // Interactive Blockchain Block Simulator
  const [blockIndex, setBlockIndex] = useState(1);
  const [blockData, setBlockData] = useState('Contrat d’exportation Café Abidjan -> Dakar');
  const [nonce, setNonce] = useState(4821);
  const [mining, setMining] = useState(false);

  // Simple deterministic visual pseudo-hash based on content + nonce
  const calculateHash = (data: string, n: number) => {
    let hash = 0;
    const str = `${data}-${n}-afrixa-chain`;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    const hex = Math.abs(hash).toString(16).padStart(8, '0');
    return `0000a4f${hex}e89c1024bd7810`;
  };

  const currentHash = calculateHash(blockData, nonce);

  const handleMineBlock = () => {
    setMining(true);
    setTimeout(() => {
      setNonce(prev => prev + Math.floor(100 + Math.random() * 900));
      setMining(false);
    }, 600);
  };

  // Interactive Quiz state
  const quizQuestions = [
    {
      q: "Qu’est-ce qu’une blockchain au sens fondamental ?",
      options: [
        "Une base de données distribuée et immuable partagée entre pairs",
        "Un compte bancaire secret sur Internet",
        "Un logiciel de trading automatique qui garantit des gains",
        "Une marque déposée de processeur"
      ],
      correct: 0,
      explanation: "Une blockchain est un registre numérique partagé, synchronisé et chiffré, sans intermédiaire unique centralisé."
    },
    {
      q: "Quel est l’usage réel des Smart Contracts en Afrique ?",
      options: [
        "Promettre des rendements financiers irréalistes",
        "Automatiser les paiements d'assurance récolte et la traçabilité agricole",
        "Remplacer les banques sans aucune réglementation",
        "Créer des faux profils sur les réseaux"
      ],
      correct: 1,
      explanation: "Les contrats intelligents permettent d'exécuter automatiquement des accords transparents (ex: indemnisation paramétrique météo)."
    }
  ];

  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const handleSelectQuiz = (qIdx: number, oIdx: number) => {
    if (quizSubmitted) return;
    setQuizAnswers(prev => ({ ...prev, [qIdx]: oIdx }));
  };

  const score = Object.entries(quizAnswers).filter(
    ([qIdx, aIdx]) => quizQuestions[Number(qIdx)].correct === aIdx
  ).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#2B1B04] via-[#452805] to-[#1E1202] border border-amber-500/30 p-8 md:p-12 shadow-2xl relative overflow-hidden">
        <div className="max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 text-xs font-bold uppercase tracking-wider">
            <Globe className="w-3.5 h-3.5" />
            <span>AFRIXA Crypto • Hub Éducatif & Blockchain</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
            Comprenez la technologie décentralisée sans spéculation
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Démystifiez les registres distribués, la cryptographie asymétrique, les protocoles Web3 et les applications d'inclusion financière réelle en Afrique.
          </p>
        </div>
      </div>

      {/* Mandatory Disclaimer Box */}
      <div className="bg-amber-950/40 border border-amber-500/40 p-5 rounded-2xl flex items-start gap-3.5 text-amber-200">
        <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1 leading-relaxed">
          <span className="font-bold uppercase tracking-wider block text-amber-300">
            Avertissement Légal & Déontologique Strict
          </span>
          <p>
            AFRIXA Crypto est un portail exclusivement pédagogique et académique. AFRIXA ne propose aucun service d'investissement spéculatif, aucun placement à rendement garanti, ni aucun faux portefeuille financier fictif. Nous formons les ingénieurs et citoyens à la compréhension scientifique des technologies Web3.
          </p>
        </div>
      </div>

      {/* Interactive Blockchain Block Simulator */}
      <div className="bg-[#0D1B42]/80 rounded-3xl border border-blue-500/30 p-6 md:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Cpu className="w-6 h-6 text-cyan-400" />
            <div>
              <h3 className="text-base font-bold text-white">Simulateur Visuel de Bloc Cryptographique</h3>
              <p className="text-xs text-slate-400">Modifiez le contenu et observez le recalcul instantané du hash du bloc</p>
            </div>
          </div>
          <button
            onClick={handleMineBlock}
            disabled={mining}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition cursor-pointer self-start sm:self-auto shadow-md shadow-cyan-500/20"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${mining ? 'animate-spin' : ''}`} />
            <span>Miner / Recalculer le Nonce</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Index du Bloc</label>
              <input
                type="number"
                value={blockIndex}
                onChange={e => setBlockIndex(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-cyan-300"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Données du Bloc (Transactions)</label>
              <textarea
                value={blockData}
                onChange={e => setBlockData(e.target.value)}
                rows={3}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Nonce (Preuve de travail)</label>
              <input
                type="number"
                value={nonce}
                onChange={e => setNonce(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-amber-300"
              />
            </div>
          </div>

          <div className="bg-slate-950/90 rounded-2xl border border-slate-800 p-5 flex flex-col justify-between font-mono text-xs space-y-3">
            <div>
              <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">
                Hash Précédent (Chaînage)
              </div>
              <div className="text-slate-400 truncate bg-slate-900/60 p-2 rounded border border-slate-800 text-[11px]">
                00008f1b98402ec941201d8ab7612ef
              </div>
            </div>

            <div>
              <div className="text-[10px] text-cyan-400 uppercase font-bold tracking-wider mb-1 flex items-center gap-1">
                <Hash className="w-3.5 h-3.5" />
                <span>Hash Calculé (SHA-256 Dérivé)</span>
              </div>
              <div className="text-emerald-400 truncate bg-slate-900/90 p-2 rounded border border-emerald-500/30 text-[11px] font-bold">
                {currentHash}
              </div>
            </div>

            <div className="text-[11px] text-slate-400 font-sans leading-relaxed pt-2 border-t border-slate-800">
              Chaque bloc garantit l’intégrité mathématique de l'historique : toute modification d'un octet altère immédiatement le hash.
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Quiz */}
      <div className="bg-[#0D1B42]/80 rounded-3xl border border-amber-500/30 p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <HelpCircle className="w-6 h-6 text-amber-400" />
            <div>
              <h3 className="text-base font-bold text-white">Quiz de Validation des Connaissances Web3</h3>
              <p className="text-xs text-slate-400">Testez votre compréhension sans aucun risque financier</p>
            </div>
          </div>
          {quizSubmitted && (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-400/40">
              Score : {score} / {quizQuestions.length}
            </span>
          )}
        </div>

        <div className="space-y-4">
          {quizQuestions.map((q, qIdx) => (
            <div key={qIdx} className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-3">
              <h4 className="text-xs sm:text-sm font-bold text-white">
                {qIdx + 1}. {q.q}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {q.options.map((opt, oIdx) => {
                  const isSelected = quizAnswers[qIdx] === oIdx;
                  let btnStyle = 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-850';
                  if (quizSubmitted) {
                    if (oIdx === q.correct) btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-300 font-bold';
                    else if (isSelected) btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-300';
                  } else if (isSelected) {
                    btnStyle = 'bg-blue-600/30 border-cyan-400 text-cyan-300 font-bold';
                  }

                  return (
                    <button
                      key={oIdx}
                      onClick={() => handleSelectQuiz(qIdx, oIdx)}
                      className={`text-left p-3 rounded-xl border text-xs transition cursor-pointer ${btnStyle}`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
              {quizSubmitted && (
                <p className="text-[11px] text-cyan-300 italic pt-1">
                  Explication : {q.explanation}
                </p>
              )}
            </div>
          ))}
        </div>

        <div>
          {!quizSubmitted ? (
            <button
              onClick={() => setQuizSubmitted(true)}
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition cursor-pointer shadow-md shadow-amber-500/20"
            >
              Valider mes réponses
            </button>
          ) : (
            <button
              onClick={() => { setQuizSubmitted(false); setQuizAnswers({}); }}
              className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition cursor-pointer"
            >
              Recommencer le quiz
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
