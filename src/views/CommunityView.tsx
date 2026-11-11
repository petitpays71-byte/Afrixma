/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Sparkles,
  Heart,
  MessageSquare,
  Share2,
  Send,
  PlusCircle,
  Flag,
  UserCheck,
  CheckCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CommunityPost } from '../types';

export const CommunityView: React.FC = () => {
  const { posts, createPost, likePost, addComment, currentUser } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [newContent, setNewContent] = useState('');
  const [newPostCategory, setNewPostCategory] = useState<CommunityPost['category']>('Tech');
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');

  const categories = ['all', 'Tech', 'Entrepreneuriat', 'Cryptomonnaie', 'Opportunités', 'Général'];

  const filteredPosts = selectedCategory === 'all'
    ? posts
    : posts.filter(p => p.category === selectedCategory);

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;
    createPost(newContent.trim(), newPostCategory);
    setNewContent('');
  };

  const handleSendComment = (postId: string) => {
    if (!commentText.trim()) return;
    addComment(postId, commentText.trim());
    setCommentText('');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#180A33] via-[#2F115C] to-[#14062E] border border-violet-500/30 p-8 shadow-2xl relative overflow-hidden">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 border border-violet-400/40 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AFRIXA Community • Réseau d'Innovation Solidaire</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white">
            Échangez, collaborez et partagez vos projets
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-xl leading-relaxed">
            Un espace d'émulation panafricain pour poser vos questions techniques, trouver des associés et partager vos opportunités.
          </p>
        </div>
      </div>

      {/* New Post Creator */}
      <div className="bg-[#0D1B42]/80 rounded-2xl border border-blue-500/20 p-5 space-y-4 shadow-xl">
        <div className="flex items-center gap-3">
          <img
            src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
            alt="User"
            className="w-10 h-10 rounded-full object-cover border border-cyan-400/50"
          />
          <div>
            <h4 className="text-xs font-bold text-white">{currentUser?.name || 'Membre AFRIXA'}</h4>
            <span className="text-[10px] text-cyan-300 uppercase font-semibold">
              Rôle : {currentUser?.role || 'member'}
            </span>
          </div>
        </div>

        <form onSubmit={handleCreatePost} className="space-y-3">
          <textarea
            value={newContent}
            onChange={e => setNewContent(e.target.value)}
            rows={3}
            placeholder="Partagez une idée, un défi technique ou une opportunité..."
            className="w-full bg-slate-900/90 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition"
            required
          />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Thème :</span>
              <select
                value={newPostCategory}
                onChange={e => setNewPostCategory(e.target.value as any)}
                className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200"
              >
                <option value="Tech">Tech & Code</option>
                <option value="Entrepreneuriat">Entrepreneuriat</option>
                <option value="Cryptomonnaie">Cryptomonnaie</option>
                <option value="Opportunités">Opportunités</option>
                <option value="Général">Général</option>
              </select>
            </div>

            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-600/30 transition cursor-pointer self-end sm:self-auto"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Publier</span>
            </button>
          </div>
        </form>
      </div>

      {/* Categories Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer border ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white border-cyan-400 shadow-md font-bold'
                : 'bg-slate-900/60 text-slate-300 border-slate-800 hover:bg-slate-800'
            }`}
          >
            {cat === 'all' ? 'Toutes les discussions' : cat}
          </button>
        ))}
      </div>

      {/* Posts Feed */}
      <div className="space-y-4">
        {filteredPosts.map(post => (
          <div
            key={post.id}
            className="bg-[#0D1B42]/70 rounded-2xl border border-blue-500/20 p-5 space-y-4 transition hover:border-cyan-400/30 shadow-lg"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={post.authorAvatar}
                  alt={post.authorName}
                  className="w-10 h-10 rounded-full object-cover border border-slate-700"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-white">{post.authorName}</h4>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-500/20 text-cyan-300 border border-blue-500/30">
                      {post.authorRole.toUpperCase()}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400">{post.timestamp}</span>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-900 border border-slate-700 text-slate-300">
                {post.category}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line">
              {post.content}
            </p>

            {/* Actions: Likes & Comments */}
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => likePost(post.id)}
                  className={`flex items-center gap-1.5 transition cursor-pointer ${
                    post.likedByCurrentUser ? 'text-rose-400 font-bold' : 'hover:text-white'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${post.likedByCurrentUser ? 'fill-rose-500 text-rose-500' : ''}`} />
                  <span>{post.likesCount}</span>
                </button>

                <button
                  onClick={() => setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)}
                  className="flex items-center gap-1.5 hover:text-white transition cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{post.commentsCount} commentaire{post.commentsCount > 1 ? 's' : ''}</span>
                </button>
              </div>

              <button
                onClick={() => alert("Publication signalée aux modérateurs avec succès.")}
                className="hover:text-rose-400 transition cursor-pointer"
                title="Signaler"
              >
                <Flag className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Comments Thread */}
            {activeCommentPostId === post.id && (
              <div className="pt-3 border-t border-slate-800 space-y-3">
                <div className="space-y-2">
                  {post.comments.map(c => (
                    <div key={c.id} className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 flex gap-2.5">
                      <img
                        src={c.authorAvatar}
                        alt={c.authorName}
                        className="w-6 h-6 rounded-full object-cover shrink-0 mt-0.5"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white">{c.authorName}</span>
                          <span className="text-[10px] text-slate-500">{c.timestamp}</span>
                        </div>
                        <p className="text-xs text-slate-300 mt-0.5">{c.content}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Comment Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={commentText}
                    onChange={e => setCommentText(e.target.value)}
                    placeholder="Écrire une réponse bienveillante..."
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                  <button
                    onClick={() => handleSendComment(post.id)}
                    className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white transition cursor-pointer"
                  >
                    Envoyer
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
