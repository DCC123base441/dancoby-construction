import React from 'react';
import AdminLayout from '../components/admin/AdminLayout';
import HeroImageManager from '../components/admin/HeroImageManager';

export default function AdminHeroSliders() {
  return (
    <AdminLayout title="Hero Sliders">
      <HeroImageManager />
    </AdminLayout>
  );
}