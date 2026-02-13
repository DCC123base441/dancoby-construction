import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, CalendarOff, Loader2, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from "sonner";
import { format, parseISO, differenceInBusinessDays } from 'date-fns';
import { useLanguage } from './LanguageContext';

const STATUS_STYLES = {
  pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  approved: 'bg-green-50 text-green-700 border-green-200',
  denied: 'bg-red-50 text-red-700 border-red-200',
};

const STATUS_ICONS = {
  pending: Clock,
  approved: CheckCircle2,
  denied: XCircle,
};

const REASON_LABELS_EN = {
  vacation: 'Vacation',
  personal: 'Personal',
  sick: 'Sick',
  family: 'Family',
  other: 'Other',
};
const REASON_LABELS_ES = {
  vacation: 'Vacaciones',
  personal: 'Personal',
  sick: 'Enfermedad',
  family: 'Familia',
  other: 'Otro',
};

export default function TimeOffSection({ user }) {
  const { t, lang } = useLanguage();
  const REASON_LABELS = lang === 'es' ? REASON_LABELS_ES : REASON_LABELS_EN;
  const [showForm, setShowForm] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('vacation');
  const [notes, setNotes] = useState('');
  const queryClient = useQueryClient();

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ['timeOffRequests', user?.email],
    queryFn: () => base44.entities.TimeOffRequest.filter({ userEmail: user.email }, '-created_date'),
    enabled: !!user,
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.TimeOffRequest.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['timeOffRequests']);
      setStartDate('');
      setEndDate('');
      setReason('vacation');
      setNotes('');
      setShowForm(false);
      toast.success(t('timeOffSubmitted') || 'Time off request submitted');
    },
  });

  const handleSubmit = () => {
    if (!startDate || !endDate) return;
    createMutation.mutate({
      userEmail: user.email,
      userName: user.full_name,
      startDate,
      endDate,
      reason,
      notes,
    });
  };

  const formatDateRange = (start, end) => {
    const s = parseISO(start);
    const e = parseISO(end);
    if (start === end) return format(s, 'MMM d, yyyy');
    if (s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear()) {
      return `${format(s, 'MMM d')}–${format(e, 'd, yyyy')}`;
    }
    return `${format(s, 'MMM d')} – ${format(e, 'MMM d, yyyy')}`;
  };

  const getDayCount = (start, end) => {
    const days = differenceInBusinessDays(parseISO(end), parseISO(start)) + 1;
    return days;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-purple-50">
            <CalendarOff className="w-5 h-5 text-purple-600" />
          </div>
          <h3 className="font-bold text-gray-900">{t('requestTimeOff')}</h3>
        </div>
        <Button onClick={() => setShowForm(!showForm)} size="sm" className="bg-gray-900 hover:bg-gray-800">
          <Plus className="w-4 h-4 mr-1" /> {t('newRequest')}
        </Button>
      </div>

      {showForm && (
        <Card className="border-purple-200 bg-purple-50/30">
          <CardContent className="p-4 sm:p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>{t('startDate')}</Label>
                <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>{t('endDate')}</Label>
                <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} min={startDate} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>{t('reason')}</Label>
              <Select value={reason} onValueChange={setReason}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="vacation">{t('vacation')}</SelectItem>
                  <SelectItem value="personal">{t('personal')}</SelectItem>
                  <SelectItem value="sick">{t('sick')}</SelectItem>
                  <SelectItem value="family">{t('family')}</SelectItem>
                  <SelectItem value="other">{t('other')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>{t('notes')}</Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t('additionalDetails')}
                className="h-20"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSubmit} disabled={!startDate || !endDate || createMutation.isPending} className="bg-gray-900 hover:bg-gray-800">
                {createMutation.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                {t('submitRequest')}
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>{t('cancel')}</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>
      ) : requests.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <CalendarOff className="w-10 h-10 mx-auto mb-3 text-gray-300" />
          <p className="text-sm">{t('noTimeOffRequests')}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map((req) => {
            const StatusIcon = STATUS_ICONS[req.status];
            return (
              <Card key={req.id} className="border-gray-100">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <StatusIcon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                        req.status === 'approved' ? 'text-green-500' :
                        req.status === 'denied' ? 'text-red-500' : 'text-yellow-500'
                      }`} />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {formatDateRange(req.startDate, req.endDate)}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {getDayCount(req.startDate, req.endDate)} {getDayCount(req.startDate, req.endDate) !== 1 ? t('businessDays') : t('businessDay')} • {REASON_LABELS[req.reason] || req.reason}
                        </p>
                        {req.notes && <p className="text-xs text-gray-400 mt-1">{req.notes}</p>}
                        {req.adminNotes && (
                          <p className="text-xs text-blue-600 mt-1 italic">{t('manager')}: {req.adminNotes}</p>
                        )}
                      </div>
                    </div>
                    <Badge className={`text-[10px] capitalize flex-shrink-0 ${STATUS_STYLES[req.status]}`}>
                      {req.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}