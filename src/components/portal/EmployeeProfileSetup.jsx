import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UserCircle, Save, Loader2, Camera, CheckCircle2, Shield, User, Briefcase, Phone, AlertCircle, KeyRound } from 'lucide-react';
import { toast } from "sonner";
import { useLanguage } from './LanguageContext';
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

export default function EmployeeProfileSetup({ user, profile, onSaved }) {
  const isEditing = !!profile;
  const { t } = useLanguage();
  const queryClient = useQueryClient();

  // Form State
  const [firstName, setFirstName] = useState(profile?.firstName || user?.full_name?.split(' ')[0] || '');
  const [lastName, setLastName] = useState(profile?.lastName || user?.full_name?.split(' ').slice(1).join(' ') || '');
  const [email, setEmail] = useState(profile?.email || user?.email || '');
  const [profilePicture, setProfilePicture] = useState(profile?.profilePicture || '');
  const [position, setPosition] = useState(profile?.position || '');
  const [department, setDepartment] = useState(profile?.department || '');
  const [startDate, setStartDate] = useState(profile?.startDate || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [emergencyName, setEmergencyName] = useState(profile?.emergencyContactName || '');
  const [emergencyPhone, setEmergencyPhone] = useState(profile?.emergencyContactPhone || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [skills, setSkills] = useState((profile?.skills || []).join(', '));
  
  // UI State
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [saved, setSaved] = useState(false);
  const [completion, setCompletion] = useState(0);

  // Calculate completion percentage
  useEffect(() => {
    const fields = [
      firstName, lastName, email, profilePicture, position, department, 
      startDate, phone, emergencyName, emergencyPhone, bio, skills
    ];
    const filled = fields.filter(f => f && f.length > 0).length;
    const total = fields.length;
    setCompletion(Math.round((filled / total) * 100));
  }, [firstName, lastName, email, profilePicture, position, department, startDate, phone, emergencyName, emergencyPhone, bio, skills]);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5MB'); return; }
    setUploadingPhoto(true);
    try {
        const { file_url } = await base44.integrations.Core.UploadFile({ file });
        setProfilePicture(file_url);
        toast.success('Photo uploaded');
    } catch (e) {
        toast.error('Failed to upload photo');
    } finally {
        setUploadingPhoto(false);
    }
  };

  const saveMutation = useMutation({
    mutationFn: (data) => {
      if (isEditing) return base44.entities.EmployeeProfile.update(profile.id, data);
      return base44.entities.EmployeeProfile.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employeeProfile'] });
      toast.success(isEditing ? (t('profileUpdated') || 'Profile updated! ✅') : (t('profileCreated') || 'Profile created! 🎉'));
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      onSaved?.();
    },
    onError: (error) => {
      toast.error('Failed to save profile: ' + error.message);
    },
  });

  const passwordResetMutation = useMutation({
    mutationFn: () => base44.functions.invoke('triggerPasswordReset'),
    onSuccess: (res) => {
        toast.success(res.data.message || 'Password reset email sent');
    },
    onError: () => {
        toast.error('Failed to send reset email');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    saveMutation.mutate({
      userEmail: user.email, firstName, lastName, email, profilePicture, position, department, startDate, phone,
      emergencyContactName: emergencyName, emergencyContactPhone: emergencyPhone, bio,
      skills: skills.split(',').map(s => s.trim()).filter(Boolean),
    });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header & Progress */}
      <Card className="border-none shadow-md bg-gradient-to-r from-slate-900 to-slate-800 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <CardContent className="p-8 relative z-10">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="relative group">
                {profilePicture ? (
                  <img src={profilePicture} alt="Profile" className="w-24 h-24 rounded-full object-cover border-4 border-white/20 shadow-xl" />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center border-4 border-white/20">
                    <UserCircle className="w-12 h-12 text-white/50" />
                  </div>
                )}
                <label className="absolute bottom-0 right-0 p-2 rounded-full bg-amber-500 text-white cursor-pointer hover:bg-amber-600 transition-all shadow-lg hover:scale-105 active:scale-95">
                  {uploadingPhoto ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
                  <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} disabled={uploadingPhoto} />
                </label>
              </div>
              <div>
                <h1 className="text-2xl font-bold">{firstName || 'Your'} {lastName || 'Name'}</h1>
                <p className="text-slate-300 flex items-center gap-2 mt-1">
                  <Briefcase className="w-4 h-4" />
                  {position || 'Position Not Set'}
                </p>
              </div>
            </div>
            
            <div className="w-full md:w-64 space-y-2 bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10">
              <div className="flex justify-between text-sm font-medium">
                <span>Profile Completion</span>
                <span className={completion === 100 ? 'text-green-400' : 'text-amber-400'}>{completion}%</span>
              </div>
              <Progress value={completion} className="h-2 bg-black/20" indicatorClassName={completion === 100 ? 'bg-green-400' : 'bg-amber-400'} />
              <p className="text-xs text-slate-400">Complete all fields to unlock badges.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2 text-slate-800">
                <User className="w-5 h-5 text-amber-600" />
                <CardTitle className="text-lg">Personal Information</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label>{t('firstName') || 'First Name'} *</Label>
                <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} required className="bg-slate-50 border-slate-200 focus:bg-white transition-colors" />
              </div>
              <div className="space-y-2">
                <Label>Last Name</Label>
                <Input value={lastName} onChange={(e) => setLastName(e.target.value)} className="bg-slate-50 border-slate-200 focus:bg-white transition-colors" />
              </div>
              <div className="col-span-full space-y-2">
                <Label>{t('shortBio')}</Label>
                <Textarea 
                    value={bio} 
                    onChange={(e) => setBio(e.target.value)} 
                    className="h-24 bg-slate-50 border-slate-200 focus:bg-white transition-colors resize-none" 
                    placeholder="Tell us a bit about yourself..."
                />
              </div>
              <div className="col-span-full space-y-2">
                <Label>{t('skills')}</Label>
                <Input value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="e.g. OSHA 30, Carpentry, Project Management" className="bg-slate-50 border-slate-200 focus:bg-white transition-colors" />
                <p className="text-xs text-slate-500">Separate skills with commas.</p>
              </div>
            </CardContent>
          </Card>

          {/* Work Information */}
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2 text-slate-800">
                <Briefcase className="w-5 h-5 text-blue-600" />
                <CardTitle className="text-lg">Work Details</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label>{t('position')} *</Label>
                <Input value={position} onChange={(e) => setPosition(e.target.value)} required className="bg-slate-50 border-slate-200 focus:bg-white transition-colors" />
              </div>
              <div className="space-y-2">
                <Label>{t('department')}</Label>
                <Input value={department} onChange={(e) => setDepartment(e.target.value)} className="bg-slate-50 border-slate-200 focus:bg-white transition-colors" />
              </div>
              <div className="space-y-2">
                <Label>{t('startDate')}</Label>
                <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="bg-slate-50 border-slate-200 focus:bg-white transition-colors" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Contact & Security */}
        <div className="space-y-6">
          {/* Account Security */}
          <Card className="shadow-sm border-slate-200 border-l-4 border-l-amber-500">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2 text-slate-800">
                <Shield className="w-5 h-5 text-amber-600" />
                <CardTitle className="text-lg">Account & Security</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Username / Login Email</Label>
                <div className="flex items-center gap-2 p-2.5 bg-slate-100 rounded-lg border border-slate-200 text-slate-600 font-mono text-sm">
                  <User className="w-4 h-4 text-slate-400" />
                  {user.email}
                </div>
              </div>
              <Separator />
              <div className="space-y-3">
                 <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Password</Label>
                 <div className="p-3 bg-amber-50 rounded-lg border border-amber-100">
                    <div className="flex items-center gap-2 mb-2 text-amber-800 font-medium text-sm">
                        <KeyRound className="w-4 h-4" />
                        Manage Password
                    </div>
                    <Button 
                        type="button" 
                        variant="outline" 
                        size="sm" 
                        className="w-full bg-white border-amber-200 text-amber-700 hover:bg-amber-50 hover:text-amber-800"
                        onClick={() => passwordResetMutation.mutate()}
                        disabled={passwordResetMutation.isPending}
                    >
                        {passwordResetMutation.isPending ? 'Sending...' : 'Reset Password'}
                    </Button>
                    <p className="text-[10px] text-amber-600/80 mt-2 leading-tight">
                        We'll send a secure password reset link to your email address.
                    </p>
                 </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2 text-slate-800">
                <Phone className="w-5 h-5 text-green-600" />
                <CardTitle className="text-lg">Contact Info</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>{t('phone')}</Label>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} className="bg-slate-50 border-slate-200 focus:bg-white transition-colors" />
              </div>
              <div className="space-y-2">
                <Label>Contact Email</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-slate-50 border-slate-200 focus:bg-white transition-colors" />
              </div>
            </CardContent>
          </Card>

          {/* Emergency Contact */}
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2 text-slate-800">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <CardTitle className="text-lg">Emergency Contact</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>{t('emergencyName')}</Label>
                <Input value={emergencyName} onChange={(e) => setEmergencyName(e.target.value)} className="bg-slate-50 border-slate-200 focus:bg-white transition-colors" />
              </div>
              <div className="space-y-2">
                <Label>{t('emergencyPhone')}</Label>
                <Input value={emergencyPhone} onChange={(e) => setEmergencyPhone(e.target.value)} className="bg-slate-50 border-slate-200 focus:bg-white transition-colors" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Bar */}
        <div className="lg:col-span-3 sticky bottom-6 z-40">
            <div className="bg-slate-900/90 backdrop-blur-md p-4 rounded-xl flex items-center justify-between shadow-2xl border border-slate-700">
                <div className="text-slate-200 text-sm hidden sm:block">
                    {saved ? 'All changes saved' : 'Remember to save your changes'}
                </div>
                <Button type="submit" disabled={saveMutation.isPending || saved} size="lg" className={`${saved ? 'bg-green-500 hover:bg-green-600' : 'bg-amber-500 hover:bg-amber-600'} text-white shadow-lg min-w-[140px] transition-all duration-300`}>
                  {saveMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : saved ? <CheckCircle2 className="w-5 h-5 mr-2" /> : <Save className="w-5 h-5 mr-2" />}
                  {saveMutation.isPending ? 'Saving...' : saved ? 'Saved Successfully' : (isEditing ? t('saveChanges') : t('createProfile'))}
                </Button>
            </div>
        </div>
      </form>
    </div>
  );
}