import React, { useState } from 'react';
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

export default function FeedbackSection({ user }) {
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('other');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const queryClient = useQueryClient();

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
      toast.success('Feedback submitted — thank you!');
    },
  });

  const handleSubmit = () => {
    if (!content.trim()) return;
    submitMutation.mutate({
      userEmail: user.email,
      content,
      category,
      isAnonymous,
    });
  };

  const categoryLabels = {
    safety: 'Safety', culture: 'Culture', tools: 'Tools & Equipment',
    management: 'Management', other: 'Other'
  };

  return (
    <div className="space-y-6">
      <Card className="border-gray-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-full bg-purple-50">
              <MessageCircle className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="font-bold text-gray-900">Share Feedback</h3>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="safety">Safety</SelectItem>
                  <SelectItem value="culture">Culture</SelectItem>
                  <SelectItem value="tools">Tools & Equipment</SelectItem>
                  <SelectItem value="management">Management</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Your Feedback</Label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share your thoughts on the working environment..."
                className="h-28"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Switch checked={isAnonymous} onCheckedChange={setIsAnonymous} />
                <Label className="text-sm text-gray-500">Submit anonymously</Label>
              </div>
              <Button onClick={handleSubmit} disabled={submitMutation.isPending || !content.trim()} className="bg-gray-900 hover:bg-gray-800">
                {submitMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
                Submit
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Past Feedback */}
      {myFeedback.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-500">Your Past Feedback</p>
          {myFeedback.map(fb => (
            <Card key={fb.id} className="border-gray-100">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-[10px] capitalize">{categoryLabels[fb.category] || fb.category}</Badge>
                  {fb.isAnonymous && <Badge variant="outline" className="text-[10px]">Anonymous</Badge>}
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