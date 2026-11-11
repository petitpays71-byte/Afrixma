/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, ShoppingCart, Trash2, ArrowRight, Package } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CartDrawer: React.FC = () => {
  const { activeModal, closeModal, cart, updateCartQty, removeFromCart, createOrder, openModal } = useApp();

  const [deliveryType, setDeliveryType] = useState<'digital_instant' | 'physical_shipping'>('digital_instant');
  const [shippingAddress, setShippingAddress] = useState('Dakar Plateau, Sénégal');

  if (activeModal !== 'cart') return null;

  const totalAmount = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    closeModal();
    openModal('payment', {
      purpose: 'product',
      amount: totalAmount,
      title: `Commande AFRIXA Marketplace (${cart.length} articles)`
    });
    // Create the order
    createOrder(deliveryType, deliveryType === 'physical_shipping' ? shippingAddress : undefined);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md h-full bg-[#0D1B42] border-l border-blue-500/30 p-6 flex flex-col shadow-2xl text-slate-100 animate-in slide-in-from-right duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-blue-500/20">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-base text-white">Mon Panier d'Achats</h3>
          </div>
          <button
            onClick={closeModal}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-3">
            <Package className="w-12 h-12 text-slate-600" />
            <p className="text-sm">Votre panier est actuellement vide.</p>
            <button
              onClick={closeModal}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white transition cursor-pointer"
            >
              Explorer la boutique
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto space-y-3 py-4 pr-1">
              {cart.map(item => (
                <div
                  key={item.product.id}
                  className="bg-slate-900/60 p-3 rounded-xl border border-blue-500/20 flex gap-3 items-center"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.title}
                    className="w-14 h-14 rounded-lg object-cover shrink-0 border border-slate-700"
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs font-bold text-white truncate">{item.product.title}</h5>
                    <p className="text-[11px] text-slate-400">{item.product.storeName}</p>
                    <div className="text-xs font-black text-cyan-400 mt-1">
                      {item.product.price.toLocaleString()} FCFA
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-slate-500 hover:text-rose-400 transition p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <div className="flex items-center gap-1.5 bg-slate-800 px-2 py-0.5 rounded-lg border border-slate-700 text-xs">
                      <button
                        onClick={() => updateCartQty(item.product.id, item.quantity - 1)}
                        className="text-slate-400 hover:text-white px-1"
                      >
                        -
                      </button>
                      <span className="font-bold text-white">{item.quantity}</span>
                      <button
                        onClick={() => updateCartQty(item.product.id, item.quantity + 1)}
                        className="text-slate-400 hover:text-white px-1"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Delivery options */}
            <div className="border-t border-blue-500/20 pt-4 space-y-3">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setDeliveryType('digital_instant')}
                  className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-semibold border transition ${
                    deliveryType === 'digital_instant'
                      ? 'bg-blue-600/30 border-cyan-400 text-cyan-300'
                      : 'border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Livraison Numérique
                </button>
                <button
                  type="button"
                  onClick={() => setDeliveryType('physical_shipping')}
                  className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-semibold border transition ${
                    deliveryType === 'physical_shipping'
                      ? 'bg-blue-600/30 border-cyan-400 text-cyan-300'
                      : 'border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Livraison Physique
                </button>
              </div>

              {deliveryType === 'physical_shipping' && (
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Adresse de livraison</label>
                  <input
                    type="text"
                    value={shippingAddress}
                    onChange={e => setShippingAddress(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                </div>
              )}

              <div className="flex justify-between items-baseline pt-2">
                <span className="text-xs text-slate-300">Total à payer :</span>
                <span className="text-lg font-black text-cyan-400">{totalAmount.toLocaleString()} FCFA</span>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 font-bold text-sm text-white shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <span>Commander via Mobile Money</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
