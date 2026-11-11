/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  BookOpen,
  Play,
  CheckCircle,
  FileText,
  Award,
  Clock,
  Star,
  User,
  PlusCircle,
  X,
  Lock,
  ChevronRight,
  Download
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Course, CourseLesson } from '../types';

export const AcademyView: React.FC = () => {
  const {
    courses,
    enrolledCourseIds,
    enrollInCourse,
    completeLesson,
    openModal,
    currentUser,
    setCourses
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);
  const [activeLesson, setActiveLesson] = useState<CourseLesson | null>(null);
  const [showCertificate, setShowCertificate] = useState(false);
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);

  // New course form state for instructors/admins
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<Course['category']>('ai');
  const [newPrice, setNewPrice] = useState(0);
  const [newDesc, setNewDesc] = useState('');

  const categories = [
    { id: 'all', label: 'Toutes les formations' },
    { id: 'ai', label: 'Intelligence Artificielle' },
    { id: 'tech', label: 'Développement Web & Mobile' },
    { id: 'agritech', label: 'AgriTech & IoT' },
    { id: 'crypto', label: 'Blockchain & Web3' },
    { id: 'business', label: 'Entrepreneuriat' },
  ];

  const filteredCourses = selectedCategory === 'all'
    ? courses
    : courses.filter(c => c.category === selectedCategory);

  const handleEnroll = (course: Course) => {
    if (course.isFree || course.price === 0) {
      enrollInCourse(course.id);
      setActiveCourse(course);
      setActiveLesson(course.modules[0]?.lessons[0] || null);
    } else {
      openModal('payment', {
        purpose: 'course',
        targetId: course.id,
        title: `Formation : ${course.title}`,
        amount: course.price
      });
    }
  };

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    const newCourse: Course = {
      id: `course-${Date.now()}`,
      title: newTitle,
      category: newCategory,
      instructor: currentUser?.name || 'Formateur AFRIXA',
      instructorAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80',
      description: newDesc,
      price: newPrice,
      isFree: newPrice === 0,
      duration: '12 heures',
      rating: 5.0,
      enrolledCount: 1,
      level: 'Débutant',
      published: true,
      modules: [
        {
          id: 'm1',
          title: 'Module 1 : Introduction & Fondamentaux',
          lessons: [
            { id: 'l1', title: 'Leçon 1 : Vue d’ensemble et méthodologie', duration: '20 min', content: 'Découvrez les bases du programme et préparez votre environnement.' }
          ]
        }
      ]
    };
    setCourses(prev => [newCourse, ...prev]);
    setShowAddCourseModal(false);
    setNewTitle('');
    setNewDesc('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Academy Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#0B1536] via-[#10235C] to-[#0D1B42] border border-blue-500/30 p-8 md:p-12 overflow-hidden shadow-2xl">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 text-xs font-bold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" />
            <span>AFRIXA Academy • Pôle Éducation Numérique</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
            Des compétences numériques adaptées aux réalités de l'Afrique
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Apprenez l’IA, la programmation, l’IoT et l’économie numérique avec des cours vidéo, des supports PDF, des projets pratiques et obtenez votre certificat de réussite.
          </p>
          <div className="flex gap-3 pt-2">
            {(currentUser?.role === 'instructor' || currentUser?.role === 'admin') && (
              <button
                onClick={() => setShowAddCourseModal(true)}
                className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition cursor-pointer shadow-lg"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Publier une formation (Espace Formateur)</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer border ${
              selectedCategory === cat.id
                ? 'bg-blue-600 text-white border-cyan-400 shadow-md shadow-blue-600/30 font-bold'
                : 'bg-slate-900/60 text-slate-300 border-slate-800 hover:bg-slate-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map(course => {
          const isEnrolled = enrolledCourseIds.includes(course.id);
          return (
            <div
              key={course.id}
              className="bg-[#0D1B42]/70 rounded-2xl border border-blue-500/20 hover:border-cyan-400/40 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10"
            >
              <div>
                {/* Course Image */}
                <div className="relative h-48 w-full overflow-hidden">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-slate-950/80 text-cyan-300 border border-cyan-400/30 backdrop-blur-md">
                      {course.level}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-wider backdrop-blur-md ${
                      course.isFree
                        ? 'bg-emerald-500/90 text-white'
                        : 'bg-blue-600/90 text-white'
                    }`}>
                      {course.isFree ? 'Gratuit' : `${course.price.toLocaleString()} FCFA`}
                    </span>
                  </div>
                </div>

                {/* Course Details */}
                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="flex items-center gap-1 text-amber-400 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      {course.rating}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {course.duration}
                    </span>
                    <span>•</span>
                    <span>{course.enrolledCount} apprenants</span>
                  </div>

                  <h3 className="text-base font-bold text-white line-clamp-2 hover:text-cyan-300 transition">
                    {course.title}
                  </h3>

                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {course.description}
                  </p>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                    <img
                      src={course.instructorAvatar}
                      alt={course.instructor}
                      className="w-6 h-6 rounded-full object-cover border border-cyan-400/50"
                    />
                    <span className="text-xs text-slate-300 truncate">{course.instructor}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-5 pt-0">
                {isEnrolled ? (
                  <button
                    onClick={() => {
                      setActiveCourse(course);
                      setActiveLesson(course.modules[0]?.lessons[0] || null);
                    }}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-md shadow-emerald-600/30"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>Poursuivre la formation (Inscrit)</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleEnroll(course)}
                    className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-md shadow-blue-600/30"
                  >
                    <span>{course.isFree ? 'S’inscrire gratuitement' : `Acheter (${course.price.toLocaleString()} FCFA)`}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Course Interactive Player & Lesson Viewer Modal */}
      {activeCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="w-full max-w-5xl h-[88vh] rounded-3xl bg-[#090F24] border border-blue-500/40 shadow-2xl text-slate-100 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-blue-500/20 bg-[#0D1B42]/90 shrink-0">
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-cyan-400" />
                <div>
                  <h3 className="text-sm font-bold text-white truncate max-w-lg">{activeCourse.title}</h3>
                  <p className="text-[11px] text-slate-400">Instructeur : {activeCourse.instructor}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowCertificate(true)}
                  className="px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer hover:bg-amber-500/30"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Obtenir le Certificat</span>
                </button>
                <button
                  onClick={() => { setActiveCourse(null); setActiveLesson(null); }}
                  className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content Split: Left Video & Lesson Details, Right Module Syllabus */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 overflow-hidden">
              {/* Main Content Area */}
              <div className="md:col-span-2 overflow-y-auto p-6 space-y-4">
                {/* Simulated Modern Video Player */}
                <div className="relative aspect-video rounded-2xl bg-black border border-blue-500/30 overflow-hidden flex items-center justify-center group shadow-2xl">
                  <img
                    src={activeCourse.thumbnail}
                    alt={activeCourse.title}
                    className="w-full h-full object-cover opacity-40 group-hover:opacity-30 transition"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                  
                  {/* Play Button Simulation */}
                  <div className="absolute w-16 h-16 rounded-full bg-cyan-500/90 text-slate-950 flex items-center justify-center shadow-xl shadow-cyan-500/40 cursor-pointer group-hover:scale-110 transition">
                    <Play className="w-8 h-8 fill-slate-950 ml-1" />
                  </div>

                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-white">
                    <span className="font-semibold">{activeLesson?.title || 'Leçon en cours'}</span>
                    <span className="font-mono bg-black/60 px-2 py-0.5 rounded text-[11px]">{activeLesson?.duration || '15 min'}</span>
                  </div>
                </div>

                {/* Lesson Text & Materials */}
                <div className="bg-slate-900/60 p-5 rounded-2xl border border-blue-500/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-base font-bold text-white">
                      {activeLesson?.title || 'Contenu de la leçon'}
                    </h4>
                    {activeLesson && (
                      <button
                        onClick={() => completeLesson(activeCourse.id, activeLesson.id)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 hover:bg-emerald-600/40 cursor-pointer"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Marquer comme terminée</span>
                      </button>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {activeLesson?.content || 'Sélectionnez une leçon dans le sommaire à droite pour visionner le cours et consulter le support PDF associé.'}
                  </p>

                  <div className="pt-3 border-t border-slate-800 flex items-center gap-3">
                    <div className="flex items-center gap-2 text-xs text-cyan-400 bg-blue-950/60 px-3 py-1.5 rounded-xl border border-blue-500/30">
                      <FileText className="w-4 h-4" />
                      <span>Document PDF du cours inclus (5.4 MB)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar Module & Lesson List */}
              <div className="bg-[#070D1E] border-l border-blue-500/20 p-4 overflow-y-auto space-y-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Sommaire & Modules
                </h4>
                {activeCourse.modules.map((mod, idx) => (
                  <div key={mod.id} className="space-y-2">
                    <div className="text-xs font-bold text-cyan-300 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-blue-900 text-cyan-300 text-[10px] flex items-center justify-center font-bold">
                        {idx + 1}
                      </span>
                      <span>{mod.title}</span>
                    </div>

                    <div className="space-y-1.5 pl-6">
                      {mod.lessons.map(lsn => (
                        <button
                          key={lsn.id}
                          onClick={() => setActiveLesson(lsn)}
                          className={`w-full text-left p-2.5 rounded-xl text-xs flex items-center justify-between transition cursor-pointer ${
                            activeLesson?.id === lsn.id
                              ? 'bg-blue-600/30 border border-cyan-400/50 text-white font-bold'
                              : 'text-slate-300 hover:bg-slate-900'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            {lsn.completed ? (
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            ) : (
                              <Play className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            )}
                            <span className="truncate">{lsn.title}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 shrink-0 ml-2">{lsn.duration}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Certificate Modal */}
      {showCertificate && activeCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="w-full max-w-xl rounded-3xl bg-[#0B1536] border-2 border-amber-400/60 p-8 shadow-2xl text-slate-100 text-center space-y-6 relative">
            <button
              onClick={() => setShowCertificate(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center mx-auto border border-amber-400/50">
              <Award className="w-10 h-10" />
            </div>

            <div>
              <div className="text-xs uppercase font-extrabold tracking-widest text-amber-400">
                CERTIFICAT DE RÉUSSITE OFFICIEL AFRIXA
              </div>
              <h2 className="text-2xl font-black text-white mt-1">
                {currentUser?.name || 'Amadou Diallo'}
              </h2>
              <p className="text-xs text-slate-300 mt-2">
                A validé avec succès l'ensemble des modules pratiques et évaluations de la formation :
              </p>
              <h3 className="text-base font-bold text-cyan-300 mt-1">
                {activeCourse.title}
              </h3>
            </div>

            <div className="flex justify-between items-center text-left text-[11px] text-slate-400 pt-4 border-t border-slate-700">
              <div>
                <div>Identifiant unique : AFX-CERT-2026-{activeCourse.id.slice(-4)}</div>
                <div>Délivré à Dakar, le {new Date().toLocaleDateString('fr-FR')}</div>
              </div>
              <div className="text-right">
                <div className="text-white font-bold">AFRIXA Academy</div>
                <div>Signature Numérique Conforme</div>
              </div>
            </div>

            <button
              onClick={() => {
                alert("Téléchargement du certificat PDF sécurisé initié !");
                setShowCertificate(false);
              }}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20"
            >
              <Download className="w-4 h-4" />
              <span>Télécharger le Certificat Haute Définition</span>
            </button>
          </div>
        </div>
      )}

      {/* Add Course Modal (Instructor Space) */}
      {showAddCourseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="w-full max-w-lg rounded-2xl bg-[#0D1B42] border border-blue-500/30 p-6 shadow-2xl text-slate-100 space-y-4 relative">
            <button
              onClick={() => setShowAddCourseModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-cyan-400" />
              <span>Publier une nouvelle formation</span>
            </h3>

            <form onSubmit={handleCreateCourse} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Titre de la formation</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="Ex: Programmation Mobile Flutter & Fintech"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Catégorie</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="ai">Intelligence Artificielle</option>
                    <option value="tech">Tech & Code</option>
                    <option value="agritech">AgriTech</option>
                    <option value="crypto">Crypto</option>
                    <option value="business">Business</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Prix (FCFA, 0 = gratuit)</label>
                  <input
                    type="number"
                    value={newPrice}
                    onChange={e => setNewPrice(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description pédagogique</label>
                <textarea
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  rows={3}
                  placeholder="Objectifs d'apprentissage, prérequis et livrables..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-xs text-white transition cursor-pointer"
              >
                Valider et mettre en ligne
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
