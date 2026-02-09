import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HandCoins, Send, Loader2, Calendar } from 'lucide-react';
import { toast } from "sonner";
import { useLanguage } from './LanguageContext';

export default function RaiseRequestSection({ user, profile }) {
  const [requestType, setRequestType] = useState('raise');
  const [requestedRate, setRequestedRate] = useState('');
  const [reason, setReason] = useState('');
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();
  const { t } = useLanguage();

  const { data: myRequests = [] } = useQuery({
    queryKey: ['raiseRequests', user.email],
    queryFn: () => base44.entities.RaiseRequest.filter({ userEmail: user.email }, '-created_date'),
  });

  const submitMutation = useMutation({
    mutationFn: (data) => base44.entities.RaiseRequest.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['raiseRequests']);
      setReason('');
      setRequestedRate('');
      setShowForm(false);
      toast.success(t('requestSubmitted'));
    },
  });

  const handleSubmit = () => {
    if (!reason.trim()) return;
    submitMutation.mutate({
      userEmail: user.email, requestType,
      currentRate: profile?.hourlySalary || 0,
      requestedRate: requestType === 'raise' ? parseFloat(requestedRate) || 0 : undefined,
      reason,
    });
  };

  const statusColors = {
    pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    approved: 'bg-green-50 text-green-700 border-green-200',
    denied: 'bg-red-50 text-red-700 border-red-200',
    scheduled: 'bg-blue-50 text-blue-700 border-blue-200',
  };

  return (
    <div className="space-y-4">
      <Card className="border-gray-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-amber-50">
                <HandCoins className="w-5 h-5 text-amber-600" />
              </div>
              <h3 className="font-bold text-gray-900">{t('requestRaiseReview')}</h3>
            </div>
            {!showForm && (
              <Button size="sm" onClick={() => setShowForm(true)} className="bg-gray-900 hover:bg-gray-800">
                {t('newRequest')}
              </Button>
            )}
          </div>

          {showForm && (
            <div className="space-y-4 border-t border-gray-100 pt-4">
              <div className="space-y-1.5">
                <Label>{t('requestType')}</Label>
                <Select value={requestType} onValueChange={setRequestType}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="raise">{t('requestRaise')}</SelectItem>
                    <SelectItem value="review">{t('requestReview')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {requestType === 'raise' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>{t('currentRate')}</Label>
                    <Input value={profile?.hourlySalary ? `$${profile.hourlySalary.toFixed(2)}` : 'N/A'} disabled />
                  </div>
                  <div className="space-y-1.5">
                    <Label>{t('requestedRate')}</Label>
                    <Input type="number" step="0.50" value={requestedRate} onChange={(e) => setRequestedRate(e.target.value)} placeholder="e.g. 35.00" />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <Label>{t('reason')}</Label>
                <Textarea
                  value={reason} onChange={(e) => setReason(e.target.value)}
                  placeholder={requestType === 'raise' ? t('raisePlaceholder') : t('reviewPlaceholder')}
                  className="h-24"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowForm(false)}>{t('cancel')}</Button>
                <Button onClick={handleSubmit} disabled={submitMutation.isPending || !reason.trim()} className="bg-gray-900 hover:bg-gray-800">
                  {submitMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
                  {t('submitRequest')}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {myRequests.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-500">{t('yourRequests')}</p>
          {myRequests.map(req => (
            <Card key={req.id} className="border-gray-100">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px] capitalize">{req.requestType}</Badge>
                    <Badge variant="outline" className={`text-[10px] capitalize ${statusColors[req.status]}`}>{req.status}</Badge>
                  </div>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(req.created_date).toLocaleDateString()}
                  </span>
                </div>
                {req.requestType === 'raise' && req.requestedRate && (
                  <p className="text-xs text-gray-500 mb-1">
                    ${req.requestedRate?.toFixed(2)}/hr (from ${req.currentRate?.toFixed(2)}/hr)
                  </p>
                )}
                <p className="text-sm text-gray-700">{req.reason}</p>
                {req.adminNotes && (
                  <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-600">
                    <strong>{t('response')}:</strong> {req.adminNotes}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}