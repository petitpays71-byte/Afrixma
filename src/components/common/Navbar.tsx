/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Bell,
  ShoppingCart,
  Menu,
  X,
  User,
  Shield,
  BookOpen,
  ShoppingBag,
  Layers,
  Cpu,
  Globe,
  Radio,
  Newspaper,
  CheckCircle,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Logo } from './Logo';
import { PWAInstallButton } from './PWAInstallButton';
import { GlobalSearch } from './GlobalSearch';
import { LANGUAGES } from '../../i18n/translations';
import { Role } from '../../types';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    switchRole,
    language,
    setLanguage,
    t,
    cart,
    notifications,
    activeView,
    setActiveView,
    openModal,
    logoutUser
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const unreadNotifsCount = notifications.filter(n => !n.read).length;
  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const currentLangMeta = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];

  const rolesList: { role: Role; label: string; color: string }[] = [
    { role: 'visitor', label: 'Visiteur', color: 'bg-slate-700 text-slate-200' },
    { role: 'member', label: 'Membre', color: 'bg-blue-600/30 text-blue-300 border-blue-500/40' },
    { role: 'seller', label: 'Vendeur', color: 'bg-emerald-600/30 text-emerald-300 border-emerald-500/40' },
    { role: 'instructor', label: 'Formateur', color: 'bg-purple-600/30 text-purple-300 border-purple-500/40' },
    { role: 'moderator', label: 'Modérateur', color: 'bg-amber-600/30 text-amber-300 border-amber-500/40' },
    { role: 'admin', label: 'Administrateur', color: 'bg-rose-600/30 text-rose-300 border-rose-500/40' },
  ];

  const navLinks = [
    { id: 'academy', label: t('nav_academy'), icon: BookOpen },
    { id: 'marketplace', label: t('nav_marketplace'), icon: ShoppingBag },
    { id: 'books', label: t('nav_books'), icon: Layers },
    { id: 'apps', label: t('nav_apps'), icon: Cpu },
    { id: 'crypto', label: t('nav_crypto'), icon: Globe },
    { id: 'vpn', label: t('nav_vpn'), icon: Radio },
    { id: 'community', label: t('nav_community'), icon: Sparkles },
    { id: 'news', label: t('nav_news'), icon: Newspaper },
  ];

  const handleNavClick = (viewId: string) => {
    setActiveView(viewId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-blue-500/20 bg-[#080E21]/90 backdrop-blur-md">
      {/* Top micro-bar: QA Tests banner, Role Quick-Switcher & Active Status */}
      <div className="bg-[#0B1536]/80 border-b border-blue-500/10 px-4 py-1 text-xs flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-cyan-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            AFRIXA v1.0 Production Ready
          </span>
          <span className="hidden sm:inline text-slate-400">|</span>
          <button
            onClick={() => openModal('qa_tests')}
            className="flex items-center gap-1.5 text-amber-300 hover:text-amber-200 transition underline underline-offset-2 cursor-pointer font-medium"
          >
            <CheckCircle className="w-3.5 h-3.5 text-amber-400" />
            Lancer les Tests de Validation (23 Critères)
          </button>
        </div>

        {/* Interactive Role Switcher for instant evaluation of roles */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-[11px] hidden md:inline">Rôle actif :</span>
          <div className="relative">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-950/70 border border-blue-400/40 text-blue-200 hover:bg-blue-900/60 transition cursor-pointer"
            >
              <Shield className="w-3 h-3 text-cyan-400" />
              <span className="capitalize">{currentUser?.role || 'visiteur'}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {roleMenuOpen && (
              <div className="absolute right-0 mt-1 w-48 rounded-xl bg-[#0D1B42] border border-blue-500/30 p-1.5 shadow-2xl z-50">
                <div className="px-2 py-1 text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                  Changer de rôle pour tester
                </div>
                {rolesList.map(item => (
                  <button
                    key={item.role}
                    onClick={() => {
                      switchRole(item.role);
                      setRoleMenuOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition cursor-pointer ${
                      currentUser?.role === item.role
                        ? 'bg-blue-600 text-white font-bold'
                        : 'text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    <span>{item.label}</span>
                    {currentUser?.role === item.role && <CheckCircle className="w-3.5 h-3.5 text-cyan-300" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="cursor-pointer" onClick={() => handleNavClick('home')}>
            <Logo size="md" showSlogan={false} />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {navLinks.map(link => {
              const Icon = link.icon;
              const isActive = activeView === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs xl:text-sm font-medium transition cursor-pointer ${
                    isActive
                      ? 'bg-blue-600/20 text-cyan-300 border border-cyan-400/30 font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Action Tools */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Global Search Bar (Academy, Marketplace, News) */}
            <GlobalSearch />

            {/* PWA Install Button */}
            <div className="hidden sm:block">
              <PWAInstallButton compact={true} />
            </div>

            {/* Language Switcher (8 Languages) */}
            <div className="relative">
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900/60 border border-slate-700/60 text-xs font-semibold text-slate-200 hover:border-blue-400/50 transition cursor-pointer"
                title="Changer de langue"
              >
                <span>{currentLangMeta.flag}</span>
                <span className="hidden md:inline uppercase">{currentLangMeta.code}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {langMenuOpen && (
                <div className="absolute right-0 mt-2 w-44 rounded-xl bg-[#0D1B42] border border-blue-500/30 p-1.5 shadow-2xl z-50">
                  <div className="px-2 py-1 text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                    8 Langues Disponibles
                  </div>
                  {LANGUAGES.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setLangMenuOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition cursor-pointer ${
                        language === lang.code
                          ? 'bg-blue-600 text-white font-bold'
                          : 'text-slate-200 hover:bg-slate-800'
                      }`}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.nativeLabel}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Notifications Button */}
            <button
              onClick={() => openModal('notifications')}
              className="relative p-2 rounded-xl bg-slate-900/60 border border-slate-700/60 text-slate-300 hover:text-white hover:border-blue-500/40 transition cursor-pointer"
              title="Centre de notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {unreadNotifsCount}
                </span>
              )}
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={() => openModal('cart')}
              className="relative p-2 rounded-xl bg-slate-900/60 border border-slate-700/60 text-slate-300 hover:text-white hover:border-blue-500/40 transition cursor-pointer"
              title="Panier d'achats"
            >
              <ShoppingCart className="w-4 h-4" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-500 text-slate-950 text-[10px] font-black rounded-full flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </button>

            {/* User Dropdown / Auth Button */}
            {currentUser && currentUser.role !== 'visitor' ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-slate-900/80 border border-blue-500/30 hover:border-blue-400 transition cursor-pointer"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-6 h-6 rounded-lg object-cover border border-cyan-400/50"
                  />
                  <span className="text-xs font-semibold text-slate-200 hidden sm:inline max-w-[100px] truncate">
                    {currentUser.name}
                  </span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#0D1B42] border border-blue-500/30 p-2 shadow-2xl z-50">
                    <div className="p-2 border-b border-blue-500/20 mb-1">
                      <p className="text-xs font-bold text-white truncate">{currentUser.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{currentUser.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-500/20 text-cyan-300 border border-blue-500/30">
                        {currentUser.role.toUpperCase()}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        handleNavClick('dashboard');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 flex items-center gap-2 cursor-pointer"
                    >
                      <User className="w-4 h-4 text-cyan-400" />
                      Tableau de Bord Membre
                    </button>

                    {currentUser.role === 'admin' && (
                      <button
                        onClick={() => {
                          handleNavClick('admin');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-rose-300 hover:bg-rose-950/40 flex items-center gap-2 cursor-pointer"
                      >
                        <Shield className="w-4 h-4 text-rose-400" />
                        Espace Administrateur
                      </button>
                    )}

                    <button
                      onClick={() => {
                        logoutUser();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-rose-300 hover:bg-slate-800 mt-1 cursor-pointer"
                    >
                      Se déconnecter
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => openModal('auth', { mode: 'login' })}
                className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white shadow-md shadow-blue-600/30 transition cursor-pointer"
              >
                Connexion
              </button>
            )}

            {/* Mobile menu hamburger toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-900/60 border border-slate-700/60 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-blue-500/20 bg-[#080E21] px-4 pt-3 pb-6 space-y-3">
          <div className="space-y-2">
            <GlobalSearch />
            <PWAInstallButton compact={false} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map(link => {
              const Icon = link.icon;
              const isActive = activeView === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-left ${
                    isActive
                      ? 'bg-blue-600/20 text-cyan-300 border border-cyan-400/30'
                      : 'text-slate-300 bg-slate-900/40 hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4 text-cyan-400" />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-blue-500/10 flex flex-col gap-2">
            <button
              onClick={() => handleNavClick('dashboard')}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-200"
            >
              <User className="w-4 h-4 text-cyan-400" />
              Mon Espace Membre
            </button>
            <button
              onClick={() => handleNavClick('admin')}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-rose-950/40 border border-rose-500/30 text-xs font-semibold text-rose-300"
            >
              <Shield className="w-4 h-4 text-rose-400" />
              Espace Administrateur
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
