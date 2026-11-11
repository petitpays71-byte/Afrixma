/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Search,
  BookOpen,
  ShoppingBag,
  Newspaper,
  X,
  ArrowRight,
  Sparkles,
  Tag
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Course, MarketplaceProduct, NewsArticle } from '../../types';

type SearchCategoryFilter = 'all' | 'academy' | 'marketplace' | 'news';

interface SearchResultItem {
  id: string;
  type: 'academy' | 'marketplace' | 'news';
  title: string;
  subtitle: string;
  category: string;
  extraInfo?: string;
  image?: string;
  targetView: string;
  rawItem: Course | MarketplaceProduct | NewsArticle;
}

export const GlobalSearch: React.FC = () => {
  const { courses, products, news, setActiveView, t } = useApp();

  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<SearchCategoryFilter>('all');
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setIsMobileExpanded(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut '/' or 'Ctrl+K' to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === '/' && (e.target as HTMLElement).tagName !== 'INPUT' && (e.target as HTMLElement).tagName !== 'TEXTAREA') ||
        (e.key === 'k' && (e.metaKey || e.ctrlKey))
      ) {
        e.preventDefault();
        setIsOpen(true);
        inputRef.current?.focus();
      } else if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Aggregate and filter resources across Academy, Marketplace, and News
  const searchResults = useMemo<SearchResultItem[]>(() => {
    const cleanQuery = query.trim().toLowerCase();
    if (!cleanQuery) return [];

    const results: SearchResultItem[] = [];

    // 1. Search Academy Courses
    if (activeCategory === 'all' || activeCategory === 'academy') {
      courses.forEach(course => {
        const matchTitle = course.title.toLowerCase().includes(cleanQuery);
        const matchInstructor = course.instructor.toLowerCase().includes(cleanQuery);
        const matchDesc = course.description.toLowerCase().includes(cleanQuery);
        const matchCat = course.category.toLowerCase().includes(cleanQuery);

        if (matchTitle || matchInstructor || matchDesc || matchCat) {
          results.push({
            id: `course-${course.id}`,
            type: 'academy',
            title: course.title,
            subtitle: `Par ${course.instructor} • ${course.duration}`,
            category: course.category.toUpperCase(),
            extraInfo: course.isFree ? 'Gratuit' : `${course.price.toLocaleString()} FCFA`,
            image: course.thumbnail,
            targetView: 'academy',
            rawItem: course
          });
        }
      });
    }

    // 2. Search Marketplace Products
    if (activeCategory === 'all' || activeCategory === 'marketplace') {
      products.forEach(product => {
        const matchTitle = product.title.toLowerCase().includes(cleanQuery);
        const matchStore = product.storeName.toLowerCase().includes(cleanQuery);
        const matchDesc = product.description.toLowerCase().includes(cleanQuery);
        const matchCat = product.category.toLowerCase().includes(cleanQuery);

        if (matchTitle || matchStore || matchDesc || matchCat) {
          results.push({
            id: `prod-${product.id}`,
            type: 'marketplace',
            title: product.title,
            subtitle: `Boutique : ${product.storeName}`,
            category: product.category,
            extraInfo: `${product.price.toLocaleString()} FCFA`,
            image: product.image,
            targetView: 'marketplace',
            rawItem: product
          });
        }
      });
    }

    // 3. Search News Articles
    if (activeCategory === 'all' || activeCategory === 'news') {
      news.forEach(article => {
        const matchTitle = article.title.toLowerCase().includes(cleanQuery);
        const matchSummary = article.summary.toLowerCase().includes(cleanQuery);
        const matchAuthor = article.author.toLowerCase().includes(cleanQuery);
        const matchCat = article.category.toLowerCase().includes(cleanQuery);

        if (matchTitle || matchSummary || matchAuthor || matchCat) {
          results.push({
            id: `news-${article.id}`,
            type: 'news',
            title: article.title,
            subtitle: `${article.author} • ${article.readTime}`,
            category: article.category,
            extraInfo: article.date,
            image: article.imageUrl,
            targetView: 'news',
            rawItem: article
          });
        }
      });
    }

    return results;
  }, [query, activeCategory, courses, products, news]);

  const handleSelectItem = (item: SearchResultItem) => {
    setActiveView(item.targetView);
    setIsOpen(false);
    setIsMobileExpanded(false);
  };

  const getBadgeStyle = (type: SearchResultItem['type']) => {
    switch (type) {
      case 'academy':
        return {
          bg: 'bg-blue-500/20 text-cyan-300 border-blue-500/30',
          label: 'Académie',
          icon: BookOpen
        };
      case 'marketplace':
        return {
          bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
          label: 'Boutique',
          icon: ShoppingBag
        };
      case 'news':
        return {
          bg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
          label: 'Actualité',
          icon: Newspaper
        };
    }
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Mobile Search Trigger Icon (Small Screens) */}
      <button
        onClick={() => {
          setIsMobileExpanded(prev => !prev);
          setIsOpen(true);
          setTimeout(() => inputRef.current?.focus(), 100);
        }}
        className="sm:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition"
        title="Rechercher"
        aria-label="Ouvrir la recherche"
      >
        <Search className="w-4 h-4 text-cyan-400" />
      </button>

      {/* Search Input Bar (Desktop or Mobile Expanded) */}
      <div
        className={`${
          isMobileExpanded
            ? 'fixed inset-x-4 top-16 z-50 sm:relative sm:inset-auto sm:top-auto sm:z-auto'
            : 'hidden sm:block'
        } relative w-full sm:w-60 md:w-72 lg:w-80`}
      >
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-cyan-400 absolute left-3.5 pointer-events-none" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder="Rechercher (Académie, Market, News)..."
            className="w-full bg-slate-900/90 hover:bg-slate-900 border border-slate-700/80 focus:border-cyan-400 rounded-full pl-9 pr-14 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none transition shadow-inner font-sans"
          />

          {query ? (
            <button
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              className="absolute right-3 text-slate-400 hover:text-white p-0.5 rounded-full"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <kbd className="hidden md:inline-flex items-center gap-0.5 absolute right-2.5 px-1.5 py-0.5 text-[9px] font-mono text-slate-400 bg-slate-800/80 border border-slate-700 rounded">
              /
            </kbd>
          )}
        </div>
      </div>

      {/* Floating Filterable Results Dropdown */}
      {isOpen && (
        <div className="fixed sm:absolute left-4 right-4 sm:left-auto sm:right-0 top-28 sm:top-full mt-2 sm:w-[460px] md:w-[500px] max-h-[80vh] sm:max-h-[500px] flex flex-col rounded-2xl bg-[#0B1536]/95 backdrop-blur-xl border border-blue-500/30 shadow-2xl shadow-black/80 z-50 overflow-hidden text-slate-100">
          {/* Category Filter Tabs */}
          <div className="p-3 border-b border-blue-500/20 bg-[#080E21]/60 flex items-center justify-between gap-1 overflow-x-auto scrollbar-none">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveCategory('all')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition whitespace-nowrap cursor-pointer ${
                  activeCategory === 'all'
                    ? 'bg-cyan-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                Tous
              </button>
              <button
                onClick={() => setActiveCategory('academy')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 whitespace-nowrap cursor-pointer ${
                  activeCategory === 'academy'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <BookOpen className="w-3 h-3" />
                Académie
              </button>
              <button
                onClick={() => setActiveCategory('marketplace')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 whitespace-nowrap cursor-pointer ${
                  activeCategory === 'marketplace'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <ShoppingBag className="w-3 h-3" />
                Marketplace
              </button>
              <button
                onClick={() => setActiveCategory('news')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 whitespace-nowrap cursor-pointer ${
                  activeCategory === 'news'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Newspaper className="w-3 h-3" />
                Actualités
              </button>
            </div>

            <button
              onClick={() => {
                setIsOpen(false);
                setIsMobileExpanded(false);
              }}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 text-xs shrink-0"
              title="Fermer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Search Content Body */}
          <div className="overflow-y-auto divide-y divide-slate-800/60 p-2 space-y-1">
            {!query.trim() ? (
              <div className="py-8 px-4 text-center space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-cyan-400 flex items-center justify-center mx-auto">
                  <Search className="w-5 h-5" />
                </div>
                <div className="text-xs text-slate-300 font-medium">
                  Recherchez rapidement des ressources sur AFRIXA
                </div>
                <div className="flex flex-wrap items-center justify-center gap-1.5 text-[10px] text-slate-400">
                  <span className="text-slate-500">Suggestions :</span>
                  {['Intelligence Artificielle', 'Kit Solaire', 'Mobile Money', 'Full Stack', 'Routeur 4G'].map(tag => (
                    <button
                      key={tag}
                      onClick={() => {
                        setQuery(tag);
                        inputRef.current?.focus();
                      }}
                      className="px-2 py-0.5 rounded-full bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 transition cursor-pointer"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            ) : searchResults.length === 0 ? (
              <div className="py-8 px-4 text-center space-y-2">
                <p className="text-xs text-slate-300">
                  Aucun résultat trouvé pour « <strong className="text-white">{query}</strong> »
                </p>
                <p className="text-[11px] text-slate-500">
                  Vérifiez l'orthographe ou changez de catégorie de filtre.
                </p>
              </div>
            ) : (
              searchResults.map(item => {
                const badge = getBadgeStyle(item.type);
                const BadgeIcon = badge.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectItem(item)}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-blue-900/30 flex items-center gap-3 transition group cursor-pointer"
                  >
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-11 h-11 rounded-lg object-cover border border-slate-700 shrink-0"
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 text-cyan-400">
                        <BadgeIcon className="w-5 h-5" />
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border flex items-center gap-1 ${badge.bg}`}
                        >
                          <BadgeIcon className="w-2.5 h-2.5" />
                          <span>{badge.label}</span>
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono truncate">
                          {item.category}
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-white group-hover:text-cyan-300 transition truncate">
                        {item.title}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">
                        {item.subtitle}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      {item.extraInfo && (
                        <div className="text-xs font-bold font-mono text-cyan-400">
                          {item.extraInfo}
                        </div>
                      )}
                      <div className="text-[10px] text-slate-500 group-hover:text-cyan-400 flex items-center justify-end gap-1 mt-0.5">
                        <span>Voir</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Footer summary */}
          {searchResults.length > 0 && (
            <div className="p-2.5 bg-[#080E21]/80 border-t border-blue-500/20 text-[10px] text-slate-400 flex items-center justify-between px-3">
              <span>{searchResults.length} ressource(s) trouvée(s)</span>
              <span className="text-slate-500 font-mono">Appuyez sur Échap pour fermer</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
