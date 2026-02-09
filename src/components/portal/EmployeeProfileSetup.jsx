import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UserCircle, Save, Loader2, Camera } from 'lucide-react';
import { toast } from "sonner";
import { useLanguage } from './LanguageContext';

export default function EmployeeProfileSetup({ user, profile, onSaved }) {
  const isEditing = !!profile;
  const { t } = useLanguage();
  const [firstName, setFirstName] = useState(profile?.firstName || user?.full_name?.split(' ')[0] || '');
  const [lastName, setLastName] = useState(profile?.lastName || user?.full_name?.split(' ').slice(1).join(' ') || '');
  const [email, setEmail] = useState(profile?.email || user?.email || '');
  const [profilePicture, setProfilePicture] = useState(profile?.profilePicture || '');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [position, setPosition] = useState(profile?.position || '');
  const [department, setDepartment] = useState(profile?.department || '');
  const [startDate, setStartDate] = useState(profile?.startDate || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [emergencyName, setEmergencyName] = useState(profile?.emergencyContactName || '');
  const [emergencyPhone, setEmergencyPhone] = useState(profile?.emergencyContactPhone || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [skills, setSkills] = useState((profile?.skills || []).join(', '));
  const queryClient = useQueryClient();

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5MB'); return; }
    setUploadingPhoto(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setProfilePicture(file_url);
    setUploadingPhoto(false);
  };

  const saveMutation = useMutation({
    mutationFn: (data) => {
      if (isEditing) return base44.entities.EmployeeProfile.update(profile.id, data);
      return base44.entities.EmployeeProfile.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employeeProfile'] });
      toast.success(isEditing ? (t('profileUpdated') || 'Profile updated! ✅') : (t('profileCreated') || 'Profile created! 🎉'));
      onSaved?.();
    },
    onError: (error) => {
      toast.error('Failed to save profile: ' + error.message);
    },
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
    <Card className="border-gray-200">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-full bg-amber-50">
            <UserCircle className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {isEditing ? t('editProfile') : t('setupProfile')}
            </h2>
            <p className="text-sm text-gray-500">
              {isEditing ? t('keepInfoUpdated') : t('completeToGetStarted')}
            </p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Profile Picture */}
          <div className="flex items-center gap-4">
            <div className="relative">
              {profilePicture ? (
                <img src={profilePicture} alt="Profile" className="w-20 h-20 rounded-full object-cover border-2 border-gray-200" />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center border-2 border-gray-200">
                  <UserCircle className="w-10 h-10 text-gray-400" />
                </div>
              )}
              <label className="absolute bottom-0 right-0 p-1.5 rounded-full bg-gray-900 text-white cursor-pointer hover:bg-gray-700 transition-colors">
                {uploadingPhoto ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Camera className="w-3.5 h-3.5" />}
                <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} disabled={uploadingPhoto} />
              </label>
            </div>
            <div className="text-sm text-gray-500">Upload a profile photo</div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>{t('firstName') || 'First Name'} *</Label>
              <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label>Last Name</Label>
              <Input value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>{t('position')} *</Label>
              <Input value={position} onChange={(e) => setPosition(e.target.value)} required />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>{t('department')}</Label>
              <Input value={department} onChange={(e) => setDepartment(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>{t('startDate')}</Label>
              <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>{t('phone')}</Label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>{t('emergencyName')}</Label>
              <Input value={emergencyName} onChange={(e) => setEmergencyName(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>{t('emergencyPhone')}</Label>
              <Input value={emergencyPhone} onChange={(e) => setEmergencyPhone(e.target.value)} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>{t('skills')}</Label>
            <Input value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="OSHA 30, Plumbing, Electrical" />
          </div>
          <div className="space-y-1.5">
            <Label>{t('shortBio')}</Label>
            <Textarea value={bio} onChange={(e) => setBio(e.target.value)} className="h-20" />
          </div>
          <div className="flex justify-end pt-2">
            <Button type="submit" disabled={saveMutation.isPending} className="bg-gray-900 hover:bg-gray-800">
              {saveMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
              {isEditing ? t('saveChanges') : t('createProfile')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}