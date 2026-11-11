/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Layers,
  BookOpen,
  Download,
  Eye,
  CheckCircle,
  FileText,
  Star,
  X,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DigitalBook } from '../types';

export const BooksView: React.FC = () => {
  const { books, purchasedBookIds, purchaseBook, openModal } = useApp();

  const [activeBook, setActiveBook] = useState<DigitalBook | null>(null);
  const [readingBook, setReadingBook] = useState<DigitalBook | null>(null);
  const [fontSize, setFontSize] = useState<number>(14);

  const handleAcquire = (book: DigitalBook) => {
    if (book.price === 0) {
      purchaseBook(book.id);
      setActiveBook(null);
      setReadingBook(book);
    } else {
      openModal('payment', {
        purpose: 'book',
        targetId: book.id,
        title: `Livre : ${book.title}`,
        amount: book.price
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#170E3A] via-[#2A1659] to-[#120B2F] border border-purple-500/30 p-8 md:p-12 shadow-2xl relative overflow-hidden">
        <div className="max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/40 text-xs font-bold uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5" />
            <span>AFRIXA Books • Bibliothèque Numérique</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
            Les savoirs et réflexions stratégiques des auteurs africains
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Consultez des essais percutants sur la souveraineté technologique, des manuels d'ingénierie et des guides pratiques rédigés pour propulser l'Afrique.
          </p>
        </div>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map(book => {
          const isPurchased = purchasedBookIds.includes(book.id);
          return (
            <div
              key={book.id}
              className="bg-[#0D1B42]/70 rounded-2xl border border-blue-500/20 hover:border-purple-400/50 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10"
            >
              <div>
                <div className="relative h-60 w-full overflow-hidden bg-slate-950 flex items-center justify-center p-4">
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="h-full max-h-52 object-contain rounded-lg shadow-2xl shadow-black/80 transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute top-3 right-3">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-wider backdrop-blur-md ${
                      book.price === 0
                        ? 'bg-emerald-500/90 text-white'
                        : 'bg-purple-600/90 text-white'
                    }`}>
                      {book.price === 0 ? 'Gratuit' : `${book.price.toLocaleString()} FCFA`}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="text-purple-300 font-bold uppercase tracking-wider text-[10px]">
                      {book.category}
                    </span>
                    <span>{book.pageCount} pages • {book.fileSize}</span>
                  </div>

                  <h3 className="text-base font-bold text-white line-clamp-2">
                    {book.title}
                  </h3>

                  <p className="text-xs text-slate-400">Par {book.author}</p>

                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {book.description}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 flex gap-2">
                {isPurchased ? (
                  <button
                    onClick={() => setReadingBook(book)}
                    className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-md shadow-purple-600/30"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Lire dans ma bibliothèque</span>
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => setActiveBook(book)}
                      className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Aperçu</span>
                    </button>
                    <button
                      onClick={() => handleAcquire(book)}
                      className="flex-1 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-md shadow-purple-600/30"
                    >
                      <span>{book.price === 0 ? 'Obtenir' : 'Acheter'}</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Preview Snippet Modal */}
      {activeBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="w-full max-w-lg rounded-3xl bg-[#0D1B42] border border-purple-500/40 p-6 shadow-2xl text-slate-100 space-y-4 relative">
            <button
              onClick={() => setActiveBook(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex gap-4 items-center">
              <img
                src={activeBook.coverImage}
                alt={activeBook.title}
                className="w-16 h-24 object-cover rounded-lg shadow-md"
              />
              <div>
                <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">Extrait Gratuit</span>
                <h3 className="text-sm font-bold text-white">{activeBook.title}</h3>
                <p className="text-xs text-slate-400">Par {activeBook.author}</p>
              </div>
            </div>

            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 text-xs sm:text-sm text-slate-300 italic leading-relaxed max-h-56 overflow-y-auto">
              « {activeBook.previewSnippet} »
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => handleAcquire(activeBook)}
                className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 font-bold text-xs text-white transition cursor-pointer shadow-lg shadow-purple-600/30"
              >
                Débloquer l'ouvrage complet ({activeBook.price === 0 ? 'Gratuit' : `${activeBook.price.toLocaleString()} FCFA`})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full Book Reader Modal (Purchased or Free) */}
      {readingBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
          <div className="w-full max-w-3xl h-[85vh] rounded-3xl bg-[#090F24] border border-purple-500/40 shadow-2xl text-slate-100 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-purple-500/20 bg-[#0D1B42]">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-purple-400" />
                <h3 className="text-sm font-bold text-white truncate max-w-md">{readingBook.title}</h3>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 bg-slate-800 px-2 py-1 rounded-lg">
                  <button onClick={() => setFontSize(Math.max(12, fontSize - 2))} className="p-1 hover:text-cyan-400">
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[11px] font-mono px-1">{fontSize}px</span>
                  <button onClick={() => setFontSize(Math.min(22, fontSize + 2))} className="p-1 hover:text-cyan-400">
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                </div>
                <button
                  onClick={() => alert("Téléchargement du fichier PDF chiffré réussi !")}
                  className="p-1.5 rounded-lg bg-purple-600/30 text-purple-300 hover:bg-purple-600/50"
                  title="Télécharger PDF"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button onClick={() => setReadingBook(null)} className="text-slate-400 hover:text-white p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 max-w-2xl mx-auto space-y-6 leading-relaxed" style={{ fontSize: `${fontSize}px` }}>
              <div className="text-center pb-6 border-b border-slate-800">
                <h1 className="text-2xl font-black text-white">{readingBook.title}</h1>
                <p className="text-slate-400 text-sm mt-1">{readingBook.author}</p>
                <div className="mt-2 inline-block px-3 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-xs border border-purple-500/30">
                  Édition Intégrale AFRIXA Books
                </div>
              </div>

              <h2 className="text-lg font-bold text-purple-300">Chapitre 1 : Les Fondations de l'Indépendance Technologique</h2>
              <p className="text-slate-300">
                {readingBook.previewSnippet}
              </p>
              <p className="text-slate-300">
                Le développement d'infrastructures locales, du code ouvert et de l'interopérabilité des systèmes financiers en Afrique subsaharienne est plus qu'un impératif économique : c'est un gage de résilience géopolitique. À travers les initiatives communautaires et les plateformes unifiées, les jeunes ingénieurs et penseurs repensent les modèles traditionnels de transfert de technologie.
              </p>
              <p className="text-slate-300">
                En misant sur des protocoles ouverts, des données hébergées sur le sol continental et des mécanismes d'incitation décentralisés, une nouvelle ère industrielle se dessine sous nos yeux.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
