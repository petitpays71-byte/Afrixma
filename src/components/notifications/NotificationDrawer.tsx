/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, CheckCheck, Bell, Award, BookOpen, ShoppingBag, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const NotificationDrawer: React.FC = () => {
  const { activeModal, closeModal, notifications, markNotificationRead, markAllNotificationsRead } = useApp();

  if (activeModal !== 'notifications') return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'reward':
      case 'referral':
        return <Award className="w-4 h-4 text-amber-400" />;
      case 'course_unlocked':
        return <BookOpen className="w-4 h-4 text-cyan-400" />;
      case 'order':
        return <ShoppingBag className="w-4 h-4 text-purple-400" />;
      default:
        return <ShieldCheck className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md h-full bg-[#0D1B42] border-l border-blue-500/30 p-6 flex flex-col shadow-2xl text-slate-100 animate-in slide-in-from-right duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-blue-500/20">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-base text-white">Centre de Notifications</h3>
          </div>
          <button
            onClick={closeModal}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center justify-between py-3">
          <span className="text-xs text-slate-400">
            {notifications.length} notification{notifications.length > 1 ? 's' : ''}
          </span>
          <button
            onClick={markAllNotificationsRead}
            className="text-xs text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer font-medium"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            Tout marquer comme lu
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
          {notifications.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              Aucune notification pour le moment.
            </div>
          ) : (
            notifications.map(n => (
              <div
                key={n.id}
                onClick={() => markNotificationRead(n.id)}
                className={`p-3.5 rounded-xl border transition cursor-pointer flex gap-3 ${
                  n.read
                    ? 'bg-slate-900/40 border-slate-800 text-slate-300'
                    : 'bg-blue-950/60 border-blue-500/30 text-white shadow-md shadow-blue-950/30'
                }`}
              >
                <div className="mt-0.5 shrink-0">{getIcon(n.type)}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h5 className="text-xs font-bold">{n.title}</h5>
                    <span className="text-[10px] text-slate-400 shrink-0">{n.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{n.message}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
