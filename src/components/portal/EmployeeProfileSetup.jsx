import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UserCircle, Save, Loader2 } from 'lucide-react';
import { toast } from "sonner";

export default function EmployeeProfileSetup({ user, profile, onSaved }) {
  const isEditing = !!profile;
  const [position, setPosition] = useState(profile?.position || '');
  const [department, setDepartment] = useState(profile?.department || '');
  const [startDate, setStartDate] = useState(profile?.startDate || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [emergencyName, setEmergencyName] = useState(profile?.emergencyContactName || '');
  const [emergencyPhone, setEmergencyPhone] = useState(profile?.emergencyContactPhone || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [skills, setSkills] = useState((profile?.skills || []).join(', '));
  const queryClient = useQueryClient();

  const saveMutation = useMutation({
    mutationFn: (data) => {
      if (isEditing) {
        return base44.entities.EmployeeProfile.update(profile.id, data);
      }
      return base44.entities.EmployeeProfile.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['employeeProfile']);
      toast.success(isEditing ? 'Profile updated' : 'Profile created');
      onSaved?.();
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    saveMutation.mutate({
      userEmail: user.email,
      position,
      department,
      startDate,
      phone,
      emergencyContactName: emergencyName,
      emergencyContactPhone: emergencyPhone,
      bio,
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
              {isEditing ? 'Edit Your Profile' : 'Set Up Your Profile'}
            </h2>
            <p className="text-sm text-gray-500">
              {isEditing ? 'Keep your info up to date' : 'Complete your employee profile to get started'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Position / Job Title *</Label>
              <Input value={position} onChange={(e) => setPosition(e.target.value)} placeholder="e.g. Foreman, Carpenter" required />
            </div>
            <div className="space-y-1.5">
              <Label>Department</Label>
              <Input value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="e.g. Residential, Commercial" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Start Date</Label>
              <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Phone Number</Label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(555) 123-4567" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Emergency Contact Name</Label>
              <Input value={emergencyName} onChange={(e) => setEmergencyName(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Emergency Contact Phone</Label>
              <Input value={emergencyPhone} onChange={(e) => setEmergencyPhone(e.target.value)} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Skills & Certifications</Label>
            <Input value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="OSHA 30, Plumbing, Electrical (comma separated)" />
          </div>

          <div className="space-y-1.5">
            <Label>Short Bio</Label>
            <Textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell us a bit about yourself..." className="h-20" />
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" disabled={saveMutation.isPending} className="bg-gray-900 hover:bg-gray-800">
              {saveMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
              {isEditing ? 'Save Changes' : 'Create Profile'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}