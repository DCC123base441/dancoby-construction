import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, SmilePlus } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import moment from 'moment';

const MOODS = [
  { id: 'great', emoji: '😄', label: 'Great', labelEs: 'Excelente', color: 'bg-green-100 text-green-700 border-green-200' },
  { id: 'good', emoji: '🙂', label: 'Good', labelEs: 'Bien', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  { id: 'okay', emoji: '😐', label: 'Okay', labelEs: 'Regular', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  { id: 'not_great', emoji: '😕', label: 'Not Great', labelEs: 'No muy bien', color: 'bg-orange-100 text-orange-700 border-orange-200' },
  { id: 'bad', emoji: '😟', label: 'Bad', labelEs: 'Mal', color: 'bg-red-100 text-red-700 border-red-200' },
];

export default function CheckInSection({ user }) {
  const { t, lang } = useLanguage();
  const queryClient = useQueryClient();
  const today = moment().format('YYYY-MM-DD');
  const [selectedMood, setSelectedMood] = useState(null);
  const [note, setNote] = useState('');

  const { data: todayCheckIn, isLoading: todayLoading } = useQuery({
    queryKey: ['dailyCheckIn', user?.email, today],
    queryFn: async () => {
      const results = await base44.entities.DailyCheckIn.filter({ userEmail: user.email, date: today });
      return results[0] || null;
    },
    enabled: !!user?.email,
  });

  const { data: history = [], isLoading: historyLoading } = useQuery({
    queryKey: ['checkInHistory', user?.email],
    queryFn: () => base44.entities.DailyCheckIn.filter({ userEmail: user.email }, '-date', 30),
    enabled: !!user?.email,
  });

  const submitMutation = useMutation({
    mutationFn: (data) => base44.entities.DailyCheckIn.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dailyCheckIn'] });
      queryClient.invalidateQueries({ queryKey: ['checkInHistory'] });
      setSelectedMood(null);
      setNote('');
    },
  });

  const handleSubmit = () => {
    if (!selectedMood) return;
    submitMutation.mutate({
      userEmail: user.email,
      mood: selectedMood,
      note: note.trim() || undefined,
      date: today,
    });
  };

  const getMood = (id) => MOODS.find(m => m.id === id);

  if (todayLoading || historyLoading) {
    return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-amber-500" /></div>;
  }

  return (
    <div className="space-y-6">
      {/* Today's check-in */}
      {todayCheckIn ? (
        <div className="text-center py-4">
          <div className="text-4xl mb-2">{getMood(todayCheckIn.mood)?.emoji}</div>
          <p className="font-medium text-gray-800">{t('checkInTodayDone')}</p>
          <p className="text-sm text-gray-500 mt-1">
            {lang === 'es' ? `Te sientes: ${getMood(todayCheckIn.mood)?.labelEs}` : `Feeling: ${getMood(todayCheckIn.mood)?.label}`}
          </p>
          {todayCheckIn.note && (
            <p className="text-sm text-gray-600 mt-2 italic">"{todayCheckIn.note}"</p>
          )}
        </div>
      ) : (
        <div>
          <div className="text-center mb-4">
            <SmilePlus className="w-8 h-8 text-amber-500 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900">{t('checkInTitle')}</h3>
            <p className="text-sm text-gray-500">{t('checkInSubtitle')}</p>
          </div>
          <div className="flex justify-center gap-3 mb-4">
            {MOODS.map((mood) => (
              <button
                key={mood.id}
                onClick={() => setSelectedMood(mood.id)}
                className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center text-2xl transition-all hover:scale-105 ${
                  selectedMood === mood.id ? 'ring-2 ring-offset-2 ring-amber-500 scale-110 border-amber-400' : 'border-gray-200'
                }`}
              >
                {mood.emoji}
              </button>
            ))}
          </div>
          {selectedMood && (
            <>
              <Textarea
                placeholder={t('checkInNotePlaceholder')}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="h-20 resize-none mb-3"
              />
              <Button
                onClick={handleSubmit}
                disabled={submitMutation.isPending}
                className="w-full bg-amber-600 hover:bg-amber-700"
              >
                {submitMutation.isPending ? t('saving') : t('checkInSubmit')}
              </Button>
            </>
          )}
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">{t('checkInHistory')}</h4>
          <div className="space-y-2">
            {history.map((entry) => {
              const mood = getMood(entry.mood);
              return (
                <div key={entry.id} className={`flex items-center gap-3 p-3 rounded-xl border ${mood?.color || 'bg-gray-50 border-gray-200'}`}>
                  <span className="text-xl">{mood?.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{lang === 'es' ? mood?.labelEs : mood?.label}</span>
                      <span className="text-xs text-gray-500">{moment(entry.date).format('MMM D')}</span>
                    </div>
                    {entry.note && <p className="text-xs text-gray-600 mt-0.5 truncate">{entry.note}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}