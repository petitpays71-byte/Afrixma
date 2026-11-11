/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Newspaper,
  Calendar,
  Clock,
  Eye,
  User,
  ArrowRight,
  Sparkles,
  X,
  Share2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { NewsArticle } from '../types';

export const NewsView: React.FC = () => {
  const { news, openModal, currentUser } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeArticle, setActiveArticle] = useState<NewsArticle | null>(null);

  const categories = [
    'all',
    'Technologie',
    'Intelligence Artificielle',
    'Entrepreneuriat',
    'Éducation',
    'Innovation Africaine',
    'Opportunités',
    'Business'
  ];

  const filteredNews = selectedCategory === 'all'
    ? news
    : news.filter(n => n.category === selectedCategory);

  const handleRead = (article: NewsArticle) => {
    if (article.isPremium && currentUser?.role === 'visitor') {
      openModal('auth', { mode: 'register' });
      return;
    }
    setActiveArticle(article);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#0C1A38] via-[#102C63] to-[#091530] border border-blue-500/30 p-8 md:p-12 shadow-2xl relative overflow-hidden">
        <div className="max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-cyan-300 border border-blue-400/40 text-xs font-bold uppercase tracking-wider">
            <Newspaper className="w-3.5 h-3.5" />
            <span>AFRIXA News • Journal de l'Innovation Africaine</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
            Analyses, décryptages technologiques & opportunités
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Suivez au quotidien l'actualité des levées de fonds, des datacenters, de l'IA générative et des bourses d'excellence à travers les 54 pays du continent.
          </p>
        </div>
      </div>

      {/* Categories Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer border ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white border-cyan-400 font-bold shadow-md'
                : 'bg-slate-900/60 text-slate-300 border-slate-800 hover:bg-slate-800'
            }`}
          >
            {cat === 'all' ? 'Toutes les actualités' : cat}
          </button>
        ))}
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNews.map(article => (
          <div
            key={article.id}
            className="bg-[#0D1B42]/70 rounded-2xl border border-blue-500/20 hover:border-cyan-400/40 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10"
          >
            <div>
              <div className="relative h-48 w-full overflow-hidden bg-slate-950">
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-slate-950/80 text-cyan-300 border border-cyan-400/30 backdrop-blur-md">
                    {article.category}
                  </span>
                </div>
                {article.isPremium && (
                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-amber-500 text-slate-950 flex items-center gap-1 shadow-md">
                      <Sparkles className="w-3 h-3" />
                      Premium
                    </span>
                  </div>
                )}
              </div>

              <div className="p-5 space-y-3">
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {article.date}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {article.readTime}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white line-clamp-2 hover:text-cyan-300 transition">
                  {article.title}
                </h3>

                <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                  {article.summary}
                </p>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span className="truncate">Rédigé par {article.author}</span>
                  <span className="flex items-center gap-1 shrink-0 font-mono text-[11px]">
                    <Eye className="w-3.5 h-3.5 text-slate-500" />
                    {article.viewsCount}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-5 pt-0">
              <button
                onClick={() => handleRead(article)}
                className="w-full py-2.5 rounded-xl bg-blue-600/30 hover:bg-blue-600 border border-blue-500/40 text-cyan-300 hover:text-white font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <span>Lire l'article complet</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Article Reader Modal */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="w-full max-w-3xl max-h-[90vh] rounded-3xl bg-[#090F24] border border-blue-500/40 shadow-2xl text-slate-100 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-blue-500/20 bg-[#0D1B42]/90">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                {activeArticle.category}
              </span>
              <button
                onClick={() => setActiveArticle(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
              <img
                src={activeArticle.imageUrl}
                alt={activeArticle.title}
                className="w-full h-64 object-cover rounded-2xl shadow-xl border border-slate-800"
              />

              <div className="space-y-3">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                  {activeArticle.title}
                </h1>
                <div className="flex items-center gap-4 text-xs text-slate-400 pb-4 border-b border-slate-800">
                  <span>Par <strong>{activeArticle.author}</strong></span>
                  <span>•</span>
                  <span>{activeArticle.date}</span>
                  <span>•</span>
                  <span>Temps de lecture : {activeArticle.readTime}</span>
                </div>
              </div>

              <div className="text-sm sm:text-base text-slate-200 leading-relaxed space-y-4 font-normal">
                <p className="font-semibold text-cyan-200 leading-relaxed bg-blue-950/40 p-4 rounded-xl border border-blue-500/20">
                  {activeArticle.summary}
                </p>
                <p>{activeArticle.content}</p>
                <p>
                  L’impact de cette transition se mesure dès aujourd'hui sur le terrain : réduction des coûts de connectivité, accélération du déploiement des services publics numériques et émergence de hubs d’incubation dynamiques de Dakar à Kigali.
                </p>
                <p>
                  Pour les entrepreneurs et étudiants membres d'AFRIXA, ces bouleversements ouvrent des perspectives inédites dans la création de valeur locale et l'emploi qualifié.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
