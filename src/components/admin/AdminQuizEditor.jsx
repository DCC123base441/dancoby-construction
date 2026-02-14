import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Save, Loader2, Check, X } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminQuizEditor({ resource }) {
  const queryClient = useQueryClient();
  const [questions, setQuestions] = useState(resource.quizQuestions || []);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    setQuestions(resource.quizQuestions || []);
    setDirty(false);
  }, [resource.id]);

  const saveMutation = useMutation({
    mutationFn: () => base44.entities.TrainingResource.update(resource.id, { quizQuestions: questions }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminTrainingResources'] });
      setDirty(false);
      toast.success('Quiz saved');
    },
  });

  const addQuestion = () => {
    setQuestions([...questions, { question: '', question_es: '', options: ['', ''], options_es: ['', ''], correctIndex: 0 }]);
    setDirty(true);
  };

  const removeQuestion = (qi) => {
    setQuestions(questions.filter((_, i) => i !== qi));
    setDirty(true);
  };

  const updateQuestion = (qi, field, value) => {
    const updated = [...questions];
    updated[qi] = { ...updated[qi], [field]: value };
    setQuestions(updated);
    setDirty(true);
  };

  const updateOption = (qi, oi, value, isEs = false) => {
    const updated = [...questions];
    const field = isEs ? 'options_es' : 'options';
    const opts = [...(updated[qi][field] || [])];
    opts[oi] = value;
    updated[qi] = { ...updated[qi], [field]: opts };
    setQuestions(updated);
    setDirty(true);
  };

  const addOption = (qi) => {
    const updated = [...questions];
    updated[qi] = {
      ...updated[qi],
      options: [...(updated[qi].options || []), ''],
      options_es: [...(updated[qi].options_es || []), ''],
    };
    setQuestions(updated);
    setDirty(true);
  };

  const removeOption = (qi, oi) => {
    const updated = [...questions];
    const opts = updated[qi].options.filter((_, i) => i !== oi);
    const optsEs = (updated[qi].options_es || []).filter((_, i) => i !== oi);
    let correctIdx = updated[qi].correctIndex;
    if (oi === correctIdx) correctIdx = 0;
    else if (oi < correctIdx) correctIdx--;
    updated[qi] = { ...updated[qi], options: opts, options_es: optsEs, correctIndex: correctIdx };
    setQuestions(updated);
    setDirty(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-slate-700">Quiz Questions ({questions.length})</h4>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={addQuestion}>
            <Plus className="w-3.5 h-3.5 mr-1" /> Add Question
          </Button>
          {dirty && (
            <Button size="sm" onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
              {saveMutation.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> : <Save className="w-3.5 h-3.5 mr-1" />}
              Save Quiz
            </Button>
          )}
        </div>
      </div>

      {questions.length === 0 && (
        <p className="text-xs text-slate-400 text-center py-4">No quiz questions yet. Click "Add Question" to create one.</p>
      )}

      {questions.map((q, qi) => (
        <div key={qi} className="border border-slate-200 rounded-lg p-4 space-y-3 bg-slate-50/50">
          <div className="flex items-start justify-between gap-2">
            <span className="text-xs font-bold text-slate-500 mt-1">Q{qi + 1}</span>
            <Button size="icon" variant="ghost" className="h-6 w-6 text-red-400 hover:text-red-600" onClick={() => removeQuestion(qi)}>
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <Label className="text-[10px] text-slate-400">Question (EN)</Label>
              <Input value={q.question} onChange={e => updateQuestion(qi, 'question', e.target.value)} placeholder="What is the correct way to..." className="text-sm" />
            </div>
            <div>
              <Label className="text-[10px] text-slate-400">Question (ES)</Label>
              <Input value={q.question_es || ''} onChange={e => updateQuestion(qi, 'question_es', e.target.value)} placeholder="¿Cuál es la forma correcta de..." className="text-sm" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-[10px] text-slate-400">Options (click ✓ to mark correct answer)</Label>
            {(q.options || []).map((opt, oi) => (
              <div key={oi} className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => updateQuestion(qi, 'correctIndex', oi)}
                  className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-colors ${
                    q.correctIndex === oi ? 'border-green-500 bg-green-500 text-white' : 'border-slate-300 text-slate-300 hover:border-green-400'
                  }`}
                >
                  <Check className="w-3 h-3" />
                </button>
                <Input value={opt} onChange={e => updateOption(qi, oi, e.target.value)} placeholder={`Option ${oi + 1} (EN)`} className="text-sm flex-1" />
                <Input value={(q.options_es || [])[oi] || ''} onChange={e => updateOption(qi, oi, e.target.value, true)} placeholder={`Opción ${oi + 1} (ES)`} className="text-sm flex-1" />
                {(q.options || []).length > 2 && (
                  <Button size="icon" variant="ghost" className="h-6 w-6 text-slate-400 hover:text-red-500 flex-shrink-0" onClick={() => removeOption(qi, oi)}>
                    <X className="w-3 h-3" />
                  </Button>
                )}
              </div>
            ))}
            {(q.options || []).length < 6 && (
              <Button size="sm" variant="ghost" className="text-xs text-slate-400" onClick={() => addOption(qi)}>
                <Plus className="w-3 h-3 mr-1" /> Add Option
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}