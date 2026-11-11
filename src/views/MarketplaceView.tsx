/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ShoppingBag,
  Star,
  CheckCircle,
  PlusCircle,
  Package,
  Layers,
  Search,
  ShoppingCart,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MarketplaceProduct } from '../types';

export const MarketplaceView: React.FC = () => {
  const { products, setProducts, addToCart, openModal, currentUser, stores } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'digital' | 'physical'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddProductModal, setShowAddProductModal] = useState(false);

  // New product form
  const [newTitle, setNewTitle] = useState('');
  const [newPrice, setNewPrice] = useState(5000);
  const [newType, setNewType] = useState<'digital' | 'physical'>('digital');
  const [newDesc, setNewDesc] = useState('');

  const filteredProducts = products.filter(p => {
    const matchType = activeTab === 'all' || p.type === activeTab;
    const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchType && matchSearch;
  });

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const newProd: MarketplaceProduct = {
      id: `prod-${Date.now()}`,
      title: newTitle,
      storeId: 'store-user',
      storeName: `${currentUser?.name || 'Vendeur'} Boutique`,
      price: newPrice,
      category: newType === 'digital' ? 'Ressources Numériques' : 'Matériel & Équipement',
      image: newType === 'digital'
        ? 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=500&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=500&auto=format&fit=crop&q=80',
      description: newDesc,
      type: newType,
      stock: 50,
      rating: 5.0,
      reviewsCount: 1,
      published: true
    };
    setProducts(prev => [newProd, ...prev]);
    setShowAddProductModal(false);
    setNewTitle('');
    setNewDesc('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#08183A] via-[#0E285F] to-[#0A1B43] border border-blue-500/30 p-8 md:p-12 shadow-2xl relative overflow-hidden">
        <div className="max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-xs font-bold uppercase tracking-wider">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>AFRIXA Marketplace • Commerce Panafricain</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
            Achetez et vendez des produits technologiques et digitaux
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Trouvez des composants matériels, routeurs solaires, kits électroniques et téléchargez instantanément des templates et logiciels créés par la communauté.
          </p>
          <div className="flex gap-3 pt-2">
            {(currentUser?.role === 'seller' || currentUser?.role === 'admin' || currentUser?.role === 'member') && (
              <button
                onClick={() => setShowAddProductModal(true)}
                className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition cursor-pointer shadow-lg"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Créer ou enrichir ma boutique</span>
              </button>
            )}
            <button
              onClick={() => openModal('cart')}
              className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-200 font-semibold text-xs flex items-center gap-2 transition cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4 text-cyan-400" />
              <span>Voir le panier</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Type tabs */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer border ${
              activeTab === 'all'
                ? 'bg-blue-600 text-white border-cyan-400'
                : 'bg-slate-900/60 text-slate-300 border-slate-800 hover:bg-slate-800'
            }`}
          >
            Tous les articles
          </button>
          <button
            onClick={() => setActiveTab('digital')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer border flex items-center gap-1.5 ${
              activeTab === 'digital'
                ? 'bg-blue-600 text-white border-cyan-400'
                : 'bg-slate-900/60 text-slate-300 border-slate-800 hover:bg-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>Produits Numériques (Instantané)</span>
          </button>
          <button
            onClick={() => setActiveTab('physical')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer border flex items-center gap-1.5 ${
              activeTab === 'physical'
                ? 'bg-blue-600 text-white border-cyan-400'
                : 'bg-slate-900/60 text-slate-300 border-slate-800 hover:bg-slate-800'
            }`}
          >
            <Package className="w-3.5 h-3.5 text-emerald-400" />
            <span>Matériel & Équipements</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Rechercher un produit..."
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
          />
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map(product => (
          <div
            key={product.id}
            className="bg-[#0D1B42]/70 rounded-2xl border border-blue-500/20 hover:border-cyan-400/40 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10"
          >
            <div>
              <div className="relative h-48 w-full overflow-hidden bg-slate-950">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute top-3 left-3">
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider backdrop-blur-md ${
                    product.type === 'digital'
                      ? 'bg-cyan-500/90 text-slate-950'
                      : 'bg-emerald-500/90 text-white'
                  }`}>
                    {product.type === 'digital' ? 'Livraison Numérique' : 'Matériel Physique'}
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-950/80 text-slate-300 border border-slate-700">
                    Stock : {product.stock}
                  </span>
                </div>
              </div>

              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-cyan-400 font-semibold">{product.storeName}</span>
                  <span className="flex items-center gap-1 text-amber-400 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    {product.rating} ({product.reviewsCount})
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white line-clamp-2">
                  {product.title}
                </h3>

                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {product.description}
                </p>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-base font-black text-cyan-400">
                    {product.price.toLocaleString()} FCFA
                  </span>
                  <span className="text-[10px] text-slate-400">TTC • Mobile Money</span>
                </div>
              </div>
            </div>

            <div className="p-5 pt-0 flex gap-2">
              <button
                onClick={() => addToCart(product)}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-md shadow-blue-600/30"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Ajouter au panier</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Product Modal */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="w-full max-w-lg rounded-2xl bg-[#0D1B42] border border-blue-500/30 p-6 shadow-2xl text-slate-100 space-y-4 relative">
            <button
              onClick={() => setShowAddProductModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-emerald-400" />
              <span>Mettre en vente un produit dans ma boutique</span>
            </h3>

            <form onSubmit={handleAddProduct} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nom du produit</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="Ex: Routeur Solaire 4G ou Template Figma"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Type de produit</label>
                  <select
                    value={newType}
                    onChange={e => setNewType(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="digital">Numérique (Téléchargeable)</option>
                    <option value="physical">Matériel Physique</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Prix unitaire (FCFA)</label>
                  <input
                    type="number"
                    value={newPrice}
                    onChange={e => setNewPrice(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description détaillée</label>
                <textarea
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  rows={3}
                  placeholder="Caractéristiques techniques, garantie et conditions..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-xs text-white transition cursor-pointer"
              >
                Publier sur AFRIXA Marketplace
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
