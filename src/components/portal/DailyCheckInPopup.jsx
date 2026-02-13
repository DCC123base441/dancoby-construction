import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from './LanguageContext';
import moment from 'moment';

const MOODS = [
  { id: 'great', emoji: '😄', colorClass: 'bg-green-100 border-green-300 hover:bg-green-200' },
  { id: 'good', emoji: '🙂', colorClass: 'bg-emerald-100 border-emerald-300 hover:bg-emerald-200' },
  { id: 'okay', emoji: '😐', colorClass: 'bg-yellow-100 border-yellow-300 hover:bg-yellow-200' },
  { id: 'not_great', emoji: '😕', colorClass: 'bg-orange-100 border-orange-300 hover:bg-orange-200' },
  { id: 'bad', emoji: '😟', colorClass: 'bg-red-100 border-red-300 hover:bg-red-200' },
];

export default function DailyCheckInPopup({ user }) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [selectedMood, setSelectedMood] = useState(null);
  const [note, setNote] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const queryClient = useQueryClient();
  const today = moment().format('YYYY-MM-DD');

  const { data: todayCheckIn, isLoading } = useQuery({
    queryKey: ['dailyCheckIn', user?.email, today],
    queryFn: async () => {
      const results = await base44.entities.DailyCheckIn.filter({ userEmail: user.email, date: today });
      return results[0] || null;
    },
    enabled: !!user?.email,
  });

  useEffect(() => {
    if (!isLoading && !todayCheckIn && user?.email && !user?._adminPreview) {
      const dismissed = sessionStorage.getItem(`checkin_dismissed_${today}`);
      if (!dismissed) {
        const timer = setTimeout(() => setOpen(true), 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [isLoading, todayCheckIn, user, today]);

  const submitMutation = useMutation({
    mutationFn: (data) => base44.entities.DailyCheckIn.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dailyCheckIn'] });
      queryClient.invalidateQueries({ queryKey: ['checkInHistory'] });
      setSubmitted(true);
      setTimeout(() => setOpen(false), 1500);
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

  const handleClose = () => {
    setOpen(false);
    sessionStorage.setItem(`checkin_dismissed_${today}`, 'true');
  };

  if (isLoading || todayCheckIn) return null;

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); }}>
      <DialogContent className="sm:max-w-md">
        {submitted ? (
          <div className="text-center py-6">
            <div className="text-5xl mb-3">{MOODS.find(m => m.id === selectedMood)?.emoji}</div>
            <h3 className="text-lg font-semibold text-gray-900">{t('checkInThanks')}</h3>
            <p className="text-sm text-gray-500 mt-1">{t('checkInThanksDesc')}</p>
          </div>
        ) : (
          <div className="py-2">
            <h3 className="text-lg font-semibold text-gray-900 text-center">{t('checkInTitle')}</h3>
            <p className="text-sm text-gray-500 text-center mt-1 mb-5">{t('checkInSubtitle')}</p>

            <div className="flex justify-center gap-3 mb-5">
              {MOODS.map((mood) => (
                <button
                  key={mood.id}
                  onClick={() => setSelectedMood(mood.id)}
                  className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center text-2xl transition-all ${mood.colorClass} ${
                    selectedMood === mood.id ? 'ring-2 ring-offset-2 ring-amber-500 scale-110' : ''
                  }`}
                >
                  {mood.emoji}
                </button>
              ))}
            </div>

            {selectedMood && (
              <div className="mb-4">
                <Textarea
                  placeholder={t('checkInNotePlaceholder')}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="h-20 resize-none"
                />
              </div>
            )}

            <div className="flex gap-3">
              <Button variant="outline" onClick={handleClose} className="flex-1">
                {t('checkInSkip')}
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!selectedMood || submitMutation.isPending}
                className="flex-1 bg-amber-600 hover:bg-amber-700"
              >
                {submitMutation.isPending ? t('saving') : t('checkInSubmit')}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}