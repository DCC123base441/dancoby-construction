import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Save, User, MapPin, Phone } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { toast } from 'sonner';

export default function CustomerProfileSetup({ user, profile, onSaved }) {
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      firstName: profile?.firstName || user?.full_name?.split(' ')[0] || '',
      lastName: profile?.lastName || user?.full_name?.split(' ').slice(1).join(' ') || '',
      phone: profile?.phone || '',
      address: profile?.address || '',
      bio: profile?.bio || '',
    }
  });

  const mutation = useMutation({
    mutationFn: async (data) => {
      const payload = {
        ...data,
        userEmail: user.email,
        profilePicture: profile?.profilePicture // keep existing pic if any
      };
      
      if (profile?.id) {
        return base44.entities.CustomerProfile.update(profile.id, payload);
      } else {
        return base44.entities.CustomerProfile.create(payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customerProfile', user.email] });
      toast.success(t('profileSaved') || 'Profile saved successfully');
      if (onSaved) onSaved();
    },
    onError: (error) => {
      toast.error('Failed to save profile');
      console.error(error);
    }
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            {t('profile') || 'Your Profile'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">{t('firstName') || 'First Name'}</Label>
                <Input id="firstName" {...register('firstName', { required: true })} />
                {errors.firstName && <span className="text-xs text-red-500">Required</span>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">{t('lastName') || 'Last Name'}</Label>
                <Input id="lastName" {...register('lastName', { required: true })} />
                {errors.lastName && <span className="text-xs text-red-500">Required</span>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">{t('phone') || 'Phone'}</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                <Input id="phone" className="pl-9" {...register('phone')} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">{t('address') || 'Address'}</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                <Input id="address" className="pl-9" {...register('address')} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">{t('notes') || 'Notes'}</Label>
              <Textarea 
                id="bio" 
                placeholder="Any special instructions or notes..." 
                className="min-h-[100px]"
                {...register('bio')} 
              />
            </div>

            <div className="pt-4 flex justify-end">
              <Button type="submit" disabled={isSubmitting || mutation.isPending} className="bg-blue-600 hover:bg-blue-700">
                {isSubmitting || mutation.isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {t('saveChanges') || 'Save Changes'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}