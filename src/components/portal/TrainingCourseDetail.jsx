import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2, Circle, PlayCircle, FileText, Link2, HelpCircle, GraduationCap, Clock } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { toast } from 'sonner';
import moment from 'moment';
import ResourceQuiz from './ResourceQuiz';

const TYPE_ICONS = {
  video: PlayCircle,
  document: FileText,
  link: Link2,
  quiz: HelpCircle,
};

const TYPE_COLORS = {
  video: 'bg-red-50 text-red-600',
  document: 'bg-blue-50 text-blue-600',
  link: 'bg-indigo-50 text-indigo-600',
  quiz: 'bg-purple-50 text-purple-600',
};

export default function TrainingCourseDetail({ course, resources, progress, user, onBack }) {
  const { t, lang } = useLanguage();
  const queryClient = useQueryClient();
  const [openQuizId, setOpenQuizId] = React.useState(null);

  const toggleMutation = useMutation({
    mutationFn: async ({ resource, currentProgress }) => {
      if (currentProgress && currentProgress.status === 'completed') {
        // Mark as not started
        return base44.entities.TrainingProgress.update(currentProgress.id, {
          status: 'not_started',
          completedDate: null,
        });
      } else if (currentProgress) {
        // Mark as completed
        return base44.entities.TrainingProgress.update(currentProgress.id, {
          status: 'completed',
          completedDate: moment().format('YYYY-MM-DD'),
        });
      } else {
        // Create new progress as completed
        return base44.entities.TrainingProgress.create({
          userEmail: user.email,
          courseId: course.id,
          resourceId: resource.id,
          status: 'completed',
          completedDate: moment().format('YYYY-MM-DD'),
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainingProgress', user?.email] });
    },
  });

  const completedCount = resources.filter(r =>
    progress.some(p => p.resourceId === r.id && p.status === 'completed')
  ).length;
  const totalCount = resources.length;
  const isAllComplete = totalCount > 0 && completedCount === totalCount;
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-5">
      {/* Back button + header */}
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        {t('trainingBackToCourses')}
      </button>

      {/* Course header */}
      <div className="flex items-start gap-4">
        {course.imageUrl ? (
          <img src={course.imageUrl} alt="" className="w-20 h-20 rounded-xl object-cover flex-shrink-0" />
        ) : (
          <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center flex-shrink-0">
            <GraduationCap className="w-9 h-9 text-amber-600" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 text-lg leading-snug">
            {lang === 'es' && course.title_es ? course.title_es : course.title}
          </h3>
          {(course.description || course.description_es) && (
            <p className="text-sm text-gray-500 mt-1">
              {lang === 'es' && course.description_es ? course.description_es : course.description}
            </p>
          )}
          {course.isRequired && (
            <Badge className="bg-red-100 text-red-700 text-xs mt-2">{t('trainingRequired')}</Badge>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="bg-gray-50 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">{t('trainingProgress')}</span>
          <span className="text-sm font-bold text-gray-900">{progressPct}%</span>
        </div>
        <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${isAllComplete ? 'bg-green-500' : 'bg-amber-500'}`}
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-1.5">{completedCount} / {totalCount} {t('trainingItemsCompleted')}</p>
        {isAllComplete && (
          <div className="mt-3 flex items-center gap-2 text-green-600">
            <CheckCircle2 className="w-5 h-5" />
            <span className="text-sm font-semibold">{t('trainingCourseComplete')}</span>
          </div>
        )}
      </div>

      {/* Resources list */}
      <div className="space-y-2">
        {resources.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">{t('trainingNoResources')}</p>
        ) : (
          resources.map((resource, index) => {
            const prog = progress.find(p => p.resourceId === resource.id);
            const isCompleted = prog?.status === 'completed';
            const Icon = TYPE_ICONS[resource.type] || FileText;
            const typeColor = TYPE_COLORS[resource.type] || TYPE_COLORS.document;

            return (
              <React.Fragment key={resource.id}>
                <div
                  className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all ${
                    isCompleted ? 'bg-green-50/50 border-green-200' : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {/* Step number / check */}
                  <button
                    onClick={() => {
                      if (resource.quizQuestions?.length > 0 && !isCompleted) return;
                      toggleMutation.mutate({ resource, currentProgress: prog });
                    }}
                    disabled={toggleMutation.isPending}
                    className="flex-shrink-0"
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-6 h-6 text-green-500 hover:text-green-400 transition-colors" />
                    ) : (
                      <Circle className={`w-6 h-6 transition-colors ${resource.quizQuestions?.length > 0 ? 'text-gray-200' : 'text-gray-300 hover:text-amber-500'}`} />
                    )}
                  </button>

                  {/* Type icon */}
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${typeColor}`}>
                    <Icon className="w-4.5 h-4.5" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${isCompleted ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                      {lang === 'es' && resource.title_es ? resource.title_es : resource.title}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-gray-400 capitalize">{resource.type}</span>
                      {resource.duration && (
                        <span className="text-[10px] text-gray-400 flex items-center gap-0.5">
                          <Clock className="w-2.5 h-2.5" /> {resource.duration}
                        </span>
                      )}
                      {resource.quizQuestions?.length > 0 && (
                        <span className="text-[10px] text-purple-400">{resource.quizQuestions.length}Q quiz</span>
                      )}
                    </div>
                  </div>

                  {/* Open link */}
                  {resource.url && (
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-amber-600 transition-colors flex-shrink-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  )}

                  {/* Quiz button */}
                  {resource.quizQuestions?.length > 0 && !isCompleted && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs flex-shrink-0"
                      onClick={(e) => { e.stopPropagation(); setOpenQuizId(openQuizId === resource.id ? null : resource.id); }}
                    >
                      <HelpCircle className="w-3.5 h-3.5 mr-1" />
                      Quiz
                    </Button>
                  )}
                </div>

                {/* Inline quiz */}
                {openQuizId === resource.id && resource.quizQuestions?.length > 0 && (
                  <div className="ml-9">
                    <ResourceQuiz
                      questions={resource.quizQuestions}
                      onPass={() => {
                        toggleMutation.mutate({ resource, currentProgress: prog });
                        setOpenQuizId(null);
                      }}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })
        )}
      </div>
    </div>
  );
}