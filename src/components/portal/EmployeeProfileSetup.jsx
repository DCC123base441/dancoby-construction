import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserCircle, Save, Loader2, Camera, CheckCircle2, Shield, User, Briefcase, Phone, AlertCircle, KeyRound, Mail, Calendar } from 'lucide-react';
import { toast } from "sonner";
import { useLanguage } from './LanguageContext';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  const [startDate, setStartDate] = useState(profile?.startDate || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [emergencyName, setEmergencyName] = useState(profile?.emergencyContactName || '');
  const [emergencyPhone, setEmergencyPhone] = useState(profile?.emergencyContactPhone || '');
  const [bio, setBio] = useState(profile?.bio || '');
  
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [saved, setSaved] = useState(false);

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
      userEmail: user.email, 
      firstName, 
      lastName, 
      email, 
      profilePicture, 
      position, 
      startDate, 
      phone,
      emergencyContactName: emergencyName, 
      emergencyContactPhone: emergencyPhone, 
      bio
    });
  };

  return (
    <div className="max-w-4xl mx-auto py-4 sm:py-8 px-0 sm:px-4">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">Profile Settings</h1>
        <p className="text-gray-500 mt-1 text-sm sm:text-base">Manage your personal information and account security.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Sidebar / User Card */}
        <div className="md:col-span-4 lg:col-span-3 space-y-6">
            <Card>
                <CardContent className="pt-6 flex flex-col items-center text-center">
                    <div className="relative group mb-4">
                        <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                            <AvatarImage src={profilePicture} objectFit="cover" />
                            <AvatarFallback className="bg-slate-100 text-slate-400">
                                <UserCircle className="w-16 h-16" />
                            </AvatarFallback>
                        </Avatar>
                        <label className="absolute bottom-0 right-0 p-2 rounded-full bg-slate-900 text-white cursor-pointer hover:bg-slate-800 transition-all shadow-md hover:scale-105 active:scale-95">
                            {uploadingPhoto ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
                            <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} disabled={uploadingPhoto} />
                        </label>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">{firstName} {lastName}</h2>
                    <p className="text-sm text-gray-500 mb-4">{position || 'No Position Set'}</p>
                    
                    <div className="w-full space-y-2 text-left text-sm mt-4 pt-4 border-t border-gray-100">
                        {phone && (
                            <div className="flex items-center gap-2 text-gray-600">
                                <Phone className="w-4 h-4" />
                                <span>{phone}</span>
                            </div>
                        )}
                        {startDate && (
                            <div className="flex items-center gap-2 text-gray-600">
                                <Calendar className="w-4 h-4" />
                                <span>Joined {new Date(startDate).toLocaleDateString()}</span>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>

        {/* Main Content Tabs */}
        <div className="md:col-span-8 lg:col-span-9">
            <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="work">Work Details</TabsTrigger>
                    <TabsTrigger value="security">Security</TabsTrigger>
                </TabsList>
                
                <TabsContent value="general">
                    <Card>
                        <CardHeader>
                            <CardTitle>Personal Information</CardTitle>
                            <CardDescription>Update your personal details and contact information.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>First Name</Label>
                                    <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Last Name</Label>
                                    <Input value={lastName} onChange={(e) => setLastName(e.target.value)} />
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <Label>Bio</Label>
                                <Textarea 
                                    value={bio} 
                                    onChange={(e) => setBio(e.target.value)} 
                                    placeholder="Tell us about yourself..."
                                    className="min-h-[100px] resize-none"
                                />
                            </div>

                            <Separator />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Contact Email</Label>
                                    <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Phone Number</Label>
                                    <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
                                </div>
                            </div>

                            <div className="p-4 bg-amber-50 rounded-lg border border-amber-100 space-y-4">
                                <h3 className="font-semibold text-amber-900 flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4" />
                                    Emergency Contact
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-amber-900/80">Contact Name</Label>
                                        <Input className="bg-white" value={emergencyName} onChange={(e) => setEmergencyName(e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-amber-900/80">Contact Phone</Label>
                                        <Input className="bg-white" value={emergencyPhone} onChange={(e) => setEmergencyPhone(e.target.value)} />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                
                <TabsContent value="work">
                    <Card>
                        <CardHeader>
                            <CardTitle>Employment Details</CardTitle>
                            <CardDescription>View and manage your role information.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label>Position / Title</Label>
                                <div className="relative">
                                    <Briefcase className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                                    <Input className="pl-9" value={position} onChange={(e) => setPosition(e.target.value)} />
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <Label>Start Date</Label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                                    <Input type="date" className="pl-9" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                
                <TabsContent value="security">
                    <Card>
                        <CardHeader>
                            <CardTitle>Account Security</CardTitle>
                            <CardDescription>Manage your login credentials.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label>Login Email</Label>
                                <div className="flex items-center gap-2">
                                    <Input value={user.email} disabled className="bg-slate-50 text-slate-500" />
                                    <Shield className="w-4 h-4 text-green-500" />
                                </div>
                                <p className="text-xs text-slate-500">This email is managed by your organization administrator.</p>
                            </div>

                            <Separator />

                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-slate-100 rounded-full">
                                        <KeyRound className="w-5 h-5 text-slate-600" />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="font-medium text-gray-900">Password Reset</h4>
                                        <p className="text-sm text-gray-500">
                                            Receive an email with instructions to reset your password.
                                        </p>
                                    </div>
                                </div>
                                <Button 
                                    variant="outline" 
                                    onClick={() => passwordResetMutation.mutate()}
                                    disabled={passwordResetMutation.isPending}
                                    className="w-full sm:w-auto"
                                >
                                    {passwordResetMutation.isPending ? 'Sending Email...' : 'Send Reset Instructions'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
      </div>

      {/* Save button at bottom */}
      <div className="sticky bottom-0 bg-white/90 backdrop-blur-sm border-t border-gray-200 p-4 -mx-0 sm:-mx-4 mt-8 rounded-b-xl">
        <Button 
          onClick={handleSubmit} 
          disabled={saveMutation.isPending || saved}
          className={`${saved ? 'bg-green-600 hover:bg-green-700' : ''} min-w-[120px] transition-all w-full sm:w-auto`}
        >
          {saveMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : saved ? <CheckCircle2 className="w-4 h-4 mr-2" /> : <Save className="w-4 h-4 mr-2" />}
          {saveMutation.isPending ? 'Saving...' : saved ? 'Saved' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
}