import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Loader2, GraduationCap, ChevronRight, CheckCircle2, Circle, PlayCircle, FileText, Link2, HelpCircle, Trophy, Star } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLanguage } from './LanguageContext';
import TrainingCourseDetail from './TrainingCourseDetail';

const CATEGORY_CONFIG = {
  safety: { color: 'bg-red-100 text-red-700', label: 'Safety', labelEs: 'Seguridad' },
  skills: { color: 'bg-blue-100 text-blue-700', label: 'Skills', labelEs: 'Habilidades' },
  leadership: { color: 'bg-purple-100 text-purple-700', label: 'Leadership', labelEs: 'Liderazgo' },
  compliance: { color: 'bg-orange-100 text-orange-700', label: 'Compliance', labelEs: 'Cumplimiento' },
  tools: { color: 'bg-cyan-100 text-cyan-700', label: 'Tools', labelEs: 'Herramientas' },
  other: { color: 'bg-gray-100 text-gray-700', label: 'Other', labelEs: 'Otro' },
};

const DIFFICULTY_CONFIG = {
  beginner: { color: 'bg-green-100 text-green-700', label: 'Beginner', labelEs: 'Principiante' },
  intermediate: { color: 'bg-yellow-100 text-yellow-700', label: 'Intermediate', labelEs: 'Intermedio' },
  advanced: { color: 'bg-red-100 text-red-700', label: 'Advanced', labelEs: 'Avanzado' },
};

export default function TrainingSection({ user }) {
  const { t, lang } = useLanguage();
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');

  const { data: courses = [], isLoading: coursesLoading } = useQuery({
    queryKey: ['trainingCourses'],
    queryFn: () => base44.entities.TrainingCourse.filter({ isActive: true }, 'order', 100),
  });

  const { data: allResources = [] } = useQuery({
    queryKey: ['trainingResources'],
    queryFn: () => base44.entities.TrainingResource.list('order', 500),
  });

  const { data: myProgress = [] } = useQuery({
    queryKey: ['trainingProgress', user?.email],
    queryFn: () => base44.entities.TrainingProgress.filter({ userEmail: user.email }),
    enabled: !!user?.email,
  });

  if (coursesLoading) {
    return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-amber-500" /></div>;
  }

  if (selectedCourseId) {
    const course = courses.find(c => c.id === selectedCourseId);
    if (!course) { setSelectedCourseId(null); return null; }
    const resources = allResources.filter(r => r.courseId === selectedCourseId).sort((a, b) => (a.order || 0) - (b.order || 0));
    return (
      <TrainingCourseDetail
        course={course}
        resources={resources}
        progress={myProgress}
        user={user}
        onBack={() => setSelectedCourseId(null)}
      />
    );
  }

  // Calculate stats
  const totalCourses = courses.length;
  const completedCourses = courses.filter(course => {
    const courseResources = allResources.filter(r => r.courseId === course.id);
    if (courseResources.length === 0) return false;
    return courseResources.every(r => myProgress.some(p => p.resourceId === r.id && p.status === 'completed'));
  }).length;

  const categories = ['all', ...new Set(courses.map(c => c.category).filter(Boolean))];
  const filtered = filterCategory === 'all' ? courses : courses.filter(c => c.category === filterCategory);

  return (
    <div className="space-y-5">
      {/* Header stats */}
      <div className="flex items-center gap-4">
        <div className="p-2.5 rounded-xl bg-amber-100">
          <GraduationCap className="w-6 h-6 text-amber-700" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-gray-900 text-lg">{t('trainingTitle')}</h3>
          <p className="text-sm text-gray-500">{t('trainingDesc')}</p>
        </div>
      </div>

      {/* Progress summary */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="border-gray-200">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-50">
              <Trophy className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{completedCourses}</p>
              <p className="text-xs text-gray-500">{t('trainingCompleted')}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-gray-200">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-50">
              <Star className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalCourses - completedCourses}</p>
              <p className="text-xs text-gray-500">{t('trainingRemaining')}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category filters */}
      {categories.length > 2 && (
        <div className="flex gap-2 flex-wrap">
          {categories.map(cat => {
            const cfg = CATEGORY_CONFIG[cat];
            const label = cat === 'all'
              ? (t('allFilter'))
              : (lang === 'es' ? cfg?.labelEs : cfg?.label) || cat;
            return (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  filterCategory === cat
                    ? 'bg-amber-100 text-amber-800 ring-1 ring-amber-300'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      )}

      {/* Course list */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <GraduationCap className="w-10 h-10 mx-auto mb-3 text-gray-300" />
          <p className="text-sm">{t('noTrainingCourses')}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(course => {
            const courseResources = allResources.filter(r => r.courseId === course.id);
            const completedCount = courseResources.filter(r =>
              myProgress.some(p => p.resourceId === r.id && p.status === 'completed')
            ).length;
            const totalCount = courseResources.length;
            const isComplete = totalCount > 0 && completedCount === totalCount;
            const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
            const catCfg = CATEGORY_CONFIG[course.category] || CATEGORY_CONFIG.other;
            const diffCfg = DIFFICULTY_CONFIG[course.difficulty] || DIFFICULTY_CONFIG.beginner;

            return (
              <button
                key={course.id}
                onClick={() => setSelectedCourseId(course.id)}
                className="w-full text-left bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-amber-200 transition-all group"
              >
                <div className="flex items-start gap-3">
                  {course.imageUrl ? (
                    <img src={course.imageUrl} alt="" className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center flex-shrink-0">
                      <GraduationCap className="w-7 h-7 text-amber-600" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {course.isRequired && (
                        <Badge className="bg-red-100 text-red-700 text-[10px] px-1.5 py-0">{t('trainingRequired')}</Badge>
                      )}
                      <Badge className={`${catCfg.color} text-[10px] px-1.5 py-0`}>
                        {lang === 'es' ? catCfg.labelEs : catCfg.label}
                      </Badge>
                      <Badge className={`${diffCfg.color} text-[10px] px-1.5 py-0`}>
                        {lang === 'es' ? diffCfg.labelEs : diffCfg.label}
                      </Badge>
                    </div>
                    <h4 className="font-semibold text-gray-900 text-sm truncate">
                      {lang === 'es' && course.title_es ? course.title_es : course.title}
                    </h4>
                    {(course.description || course.description_es) && (
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                        {lang === 'es' && course.description_es ? course.description_es : course.description}
                      </p>
                    )}
                    {/* Progress bar */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${isComplete ? 'bg-green-500' : 'bg-amber-500'}`}
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-gray-400 font-medium flex-shrink-0">
                        {completedCount}/{totalCount}
                      </span>
                      {isComplete && <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />}
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-amber-500 transition-colors flex-shrink-0 mt-4" />
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}