import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { MessageCircle, Send, Loader2, Calendar } from 'lucide-react';
import { toast } from "sonner";
import { useLanguage } from './LanguageContext';

export default function FeedbackSection({ user }) {
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('other');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const queryClient = useQueryClient();
  const { t } = useLanguage();

  useEffect(() => {
    const unsubscribe = base44.entities.EmployeeFeedback.subscribe(() => {
      queryClient.invalidateQueries({ queryKey: ['myFeedback'] });
    });
    return unsubscribe;
  }, [queryClient]);

  const { data: myFeedback = [] } = useQuery({
    queryKey: ['myFeedback', user.email],
    queryFn: () => base44.entities.EmployeeFeedback.filter({ userEmail: user.email }, '-created_date'),
  });

  const submitMutation = useMutation({
    mutationFn: (data) => base44.entities.EmployeeFeedback.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['myFeedback']);
      setContent('');
      setCategory('other');
      setIsAnonymous(false);
      toast.success(t('feedbackSubmitted'));
    },
  });

  const handleSubmit = () => {
    if (!content.trim()) return;
    submitMutation.mutate({ userEmail: user.email, content, category, isAnonymous });
  };

  const categoryLabels = {
    safety: t('safety'), culture: t('culture'), tools: t('tools'),
    management: t('management'), other: t('other')
  };

  return (
    <div className="space-y-6">
      <Card className="border-gray-200">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-full bg-purple-50">
              <MessageCircle className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="font-bold text-gray-900">{t('shareFeedback')}</h3>
          </div>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>{t('category')}</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="safety">{t('safety')}</SelectItem>
                  <SelectItem value="culture">{t('culture')}</SelectItem>
                  <SelectItem value="tools">{t('tools')}</SelectItem>
                  <SelectItem value="management">{t('management')}</SelectItem>
                  <SelectItem value="other">{t('other')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>{t('yourFeedback')}</Label>
              <Textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder={t('feedbackPlaceholder')} className="h-28" />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-500">{t('feedbackPrivate')}</p>
              <Button onClick={handleSubmit} disabled={submitMutation.isPending || !content.trim()} className="bg-gray-900 hover:bg-gray-800">
                {submitMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
                {t('submit')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {myFeedback.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-500">{t('pastFeedback')}</p>
          {myFeedback.map(fb => (
            <Card key={fb.id} className="border-gray-100">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-[10px] capitalize">{categoryLabels[fb.category] || fb.category}</Badge>
                  {fb.isAnonymous && <Badge variant="outline" className="text-[10px]">{t('anonymous')}</Badge>}
                  <span className="text-xs text-gray-400 ml-auto flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(fb.created_date).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-gray-700">{fb.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}