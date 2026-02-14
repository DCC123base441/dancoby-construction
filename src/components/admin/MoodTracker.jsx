import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Loader2, Trash2 } from 'lucide-react';
import moment from 'moment';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useQueryClient } from '@tanstack/react-query';

const MOODS = {
  great: { emoji: '😄', label: 'Great', color: 'bg-green-100 text-green-700' },
  good: { emoji: '🙂', label: 'Good', color: 'bg-emerald-100 text-emerald-700' },
  okay: { emoji: '😐', label: 'Okay', color: 'bg-yellow-100 text-yellow-700' },
  not_great: { emoji: '😕', label: 'Not Great', color: 'bg-orange-100 text-orange-700' },
  bad: { emoji: '😟', label: 'Bad', color: 'bg-red-100 text-red-700' },
};

export default function MoodTracker() {
  const [range, setRange] = React.useState('7');
  const [isResetting, setIsResetting] = React.useState(false);
  const [showResetDialog, setShowResetDialog] = React.useState(false);
  const queryClient = useQueryClient();

  const handleResetMood = async () => {
    setIsResetting(true);
    try {
      await base44.functions.invoke('resetAnalytics', { target: 'checkins' });
      queryClient.invalidateQueries({ queryKey: ['adminCheckIns'] });
    } catch (error) {
      console.error("Failed to reset mood data", error);
    } finally {
      setIsResetting(false);
    }
  };

  const { data: checkIns = [], isLoading } = useQuery({
    queryKey: ['adminCheckIns'],
    queryFn: () => base44.entities.DailyCheckIn.list('-date', 500),
  });

  const { data: profiles = [] } = useQuery({
    queryKey: ['employeeProfilesAll'],
    queryFn: () => base44.entities.EmployeeProfile.list(),
  });

  const profileMap = useMemo(() => {
    const map = {};
    profiles.forEach(p => {
      const email = p.userEmail;
      // Prefer profiles that have firstName/lastName over ones that don't
      if (!map[email] || (p.firstName || p.lastName)) {
        map[email] = p;
      }
    });
    return map;
  }, [profiles]);

  const cutoff = moment().subtract(Number(range), 'days').startOf('day');
  const filtered = checkIns.filter(c => moment(c.date).isSameOrAfter(cutoff));

  // Mood distribution
  const moodCounts = useMemo(() => {
    const counts = { great: 0, good: 0, okay: 0, not_great: 0, bad: 0 };
    filtered.forEach(c => { if (counts[c.mood] !== undefined) counts[c.mood]++; });
    return counts;
  }, [filtered]);

  const total = filtered.length;

  // Today's check-ins
  const today = moment().format('YYYY-MM-DD');
  const todayCheckIns = checkIns.filter(c => c.date === today);

  // Average mood score (great=5, good=4, okay=3, not_great=2, bad=1)
  const moodScores = { great: 5, good: 4, okay: 3, not_great: 2, bad: 1 };
  const avgScore = total > 0
    ? (filtered.reduce((sum, c) => sum + (moodScores[c.mood] || 3), 0) / total).toFixed(1)
    : '—';

  const toTitleCase = (str) => {
    if (!str) return '';
    return str
      .toLowerCase()
      .split(/[\s._-]+/)
      .filter(Boolean)
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  };

  const getName = (email) => {
    const p = profileMap[email];
    if (p?.firstName || p?.lastName) {
      const full = [p.firstName, p.lastName].filter(Boolean).join(' ');
      return toTitleCase(full);
    }
    const local = email?.split('@')[0] || 'Unknown';
    return toTitleCase(local);
  };

  const getInitials = (email) => {
    const p = profileMap[email];
    let initials = '';
    if (p?.firstName && p?.lastName) {
      initials = `${p.firstName.charAt(0)}${p.lastName.charAt(0)}`;
    } else if (p?.firstName) {
      initials = p.firstName.substring(0, 2);
    } else if (p?.lastName) {
      initials = p.lastName.substring(0, 2);
    } else {
      const namePart = email?.split('@')[0] || '';
      initials = namePart.substring(0, 2);
    }
    return initials.toUpperCase();
  };

  return (
    <Card className="border-slate-200/60 shadow-sm overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 bg-gradient-to-r from-slate-50 to-white">
        <div>
          <CardTitle className="text-base">Employee Mood Tracker</CardTitle>
          <CardDescription className="text-xs">Daily check-in overview</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50">
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Reset Mood Data?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete all employee mood check-in history. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <Button 
                  onClick={async () => {
                    await handleResetMood();
                    setShowResetDialog(false);
                  }} 
                  className="bg-red-600 hover:bg-red-700 text-white"
                  disabled={isResetting}
                >
                  {isResetting ? "Resetting..." : "Yes, Delete All"}
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Select value={range} onValueChange={setRange}>
            <SelectTrigger className="w-[130px] h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 Days</SelectItem>
              <SelectItem value="14">Last 14 Days</SelectItem>
              <SelectItem value="30">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
          </div>
        ) : total === 0 ? (
          <div className="text-center py-8 text-sm text-slate-400">
            No check-ins yet
          </div>
        ) : (
          <div className="space-y-5">
            {/* Summary row */}
            <div className="flex items-center gap-4 flex-wrap">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900">{avgScore}</div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider">Avg Mood</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900">{total}</div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider">Check-Ins</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900">{todayCheckIns.length}</div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider">Today</div>
              </div>
            </div>

            {/* Mood distribution bar */}
            <div>
              <div className="flex rounded-full overflow-hidden h-4 mb-2">
                {Object.entries(MOODS).map(([key, mood]) => {
                  const pct = total > 0 ? (moodCounts[key] / total) * 100 : 0;
                  if (pct === 0) return null;
                  const colors = {
                    great: 'bg-green-400', good: 'bg-emerald-400', okay: 'bg-yellow-400',
                    not_great: 'bg-orange-400', bad: 'bg-red-400'
                  };
                  return (
                    <div key={key} className={`${colors[key]} transition-all`} style={{ width: `${pct}%` }} title={`${mood.label}: ${moodCounts[key]}`} />
                  );
                })}
              </div>
              <div className="flex flex-wrap gap-3 text-xs">
                {Object.entries(MOODS).map(([key, mood]) => (
                  moodCounts[key] > 0 && (
                    <span key={key} className="flex items-center gap-1">
                      <span>{mood.emoji}</span>
                      <span className="text-slate-500">{mood.label}</span>
                      <span className="font-medium text-slate-700">{moodCounts[key]}</span>
                    </span>
                  )
                ))}
              </div>
            </div>

            {/* Today's check-ins list */}
            {todayCheckIns.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Today's Check-Ins</p>
                <div className="space-y-2">
                  {todayCheckIns.map((c) => {
                    const mood = MOODS[c.mood];
                    return (
                      <div key={c.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50">
                        <Avatar className="h-7 w-7 border border-slate-100">
                          <AvatarFallback className="text-[9px] font-semibold bg-slate-200 text-slate-600">
                            {getInitials(c.userEmail)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-800 truncate">{getName(c.userEmail)}</p>
                          {c.note && <p className="text-xs text-slate-400 truncate">{c.note}</p>}
                        </div>
                        <Badge className={`text-xs ${mood?.color || ''}`}>
                          {mood?.emoji} {mood?.label}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}