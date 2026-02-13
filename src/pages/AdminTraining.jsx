import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import AdminLayout from '../components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  GraduationCap, Plus, Trash2, Save, Loader2, ChevronDown, ChevronUp,
  PlayCircle, FileText, Link2, HelpCircle, ArrowLeft, Users, CheckCircle2
} from 'lucide-react';
import { toast } from 'sonner';
import AdminTrainingCourseForm from '../components/admin/AdminTrainingCourseForm';
import AdminTrainingResourceList from '../components/admin/AdminTrainingResourceList';
import AdminTrainingProgress from '../components/admin/AdminTrainingProgress';

export default function AdminTraining() {
  const queryClient = useQueryClient();
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [showNewCourse, setShowNewCourse] = useState(false);
  const [activeView, setActiveView] = useState('courses'); // 'courses' | 'progress'

  const { data: courses = [], isLoading } = useQuery({
    queryKey: ['adminTrainingCourses'],
    queryFn: () => base44.entities.TrainingCourse.list('order', 100),
  });

  const deleteMutation = useMutation({
    mutationFn: async (courseId) => {
      // Delete all resources first
      const resources = await base44.entities.TrainingResource.filter({ courseId });
      for (const r of resources) {
        await base44.entities.TrainingResource.delete(r.id);
      }
      // Delete progress records
      const progress = await base44.entities.TrainingProgress.filter({ courseId });
      for (const p of progress) {
        await base44.entities.TrainingProgress.delete(p.id);
      }
      await base44.entities.TrainingCourse.delete(courseId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminTrainingCourses'] });
      toast.success('Course deleted');
      setSelectedCourseId(null);
    },
  });

  const selectedCourse = courses.find(c => c.id === selectedCourseId);

  return (
    <AdminLayout currentPage="AdminTraining">
      <div className="p-4 sm:p-6 max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <GraduationCap className="w-7 h-7 text-amber-600" />
              Training Module
            </h1>
            <p className="text-sm text-slate-500 mt-1">Create courses, add resources, and track employee progress</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={activeView === 'courses' ? 'default' : 'outline'}
              onClick={() => setActiveView('courses')}
              size="sm"
            >
              <GraduationCap className="w-4 h-4 mr-1" /> Courses
            </Button>
            <Button
              variant={activeView === 'progress' ? 'default' : 'outline'}
              onClick={() => setActiveView('progress')}
              size="sm"
            >
              <Users className="w-4 h-4 mr-1" /> Progress
            </Button>
          </div>
        </div>

        {activeView === 'progress' ? (
          <AdminTrainingProgress courses={courses} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Course list */}
            <div className="lg:col-span-1 space-y-3">
              <Button onClick={() => { setShowNewCourse(true); setSelectedCourseId(null); }} className="w-full bg-amber-600 hover:bg-amber-700">
                <Plus className="w-4 h-4 mr-2" /> New Course
              </Button>

              {isLoading ? (
                <div className="flex justify-center py-8"><Loader2 className="w-5 h-5 animate-spin text-slate-400" /></div>
              ) : courses.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-8">No courses yet. Create your first one!</p>
              ) : (
                courses.map(course => (
                  <button
                    key={course.id}
                    onClick={() => { setSelectedCourseId(course.id); setShowNewCourse(false); }}
                    className={`w-full text-left p-3 rounded-xl border transition-all ${
                      selectedCourseId === course.id
                        ? 'border-amber-300 bg-amber-50 shadow-sm'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-semibold text-slate-900 truncate flex-1">{course.title}</h4>
                      {!course.isActive && <Badge variant="outline" className="text-[10px]">Draft</Badge>}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="text-[10px] bg-slate-100 text-slate-600">{course.category}</Badge>
                      <Badge className="text-[10px] bg-slate-100 text-slate-600">{course.difficulty}</Badge>
                      {course.isRequired && <Badge className="text-[10px] bg-red-100 text-red-600">Required</Badge>}
                    </div>
                  </button>
                ))
              )}
            </div>

            {/* Detail panel */}
            <div className="lg:col-span-2">
              {showNewCourse ? (
                <AdminTrainingCourseForm
                  onSaved={(newCourse) => {
                    setShowNewCourse(false);
                    setSelectedCourseId(newCourse.id);
                  }}
                  onCancel={() => setShowNewCourse(false)}
                />
              ) : selectedCourse ? (
                <div className="space-y-6">
                  <AdminTrainingCourseForm
                    course={selectedCourse}
                    onSaved={() => {}}
                    onCancel={() => setSelectedCourseId(null)}
                    onDelete={() => deleteMutation.mutate(selectedCourse.id)}
                    isDeleting={deleteMutation.isPending}
                  />
                  <AdminTrainingResourceList courseId={selectedCourse.id} />
                </div>
              ) : (
                <div className="text-center py-20 text-slate-400">
                  <GraduationCap className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                  <p className="text-sm">Select a course or create a new one</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}