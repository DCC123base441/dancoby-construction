import React from 'react';
import AdminLayout from '../components/admin/AdminLayout';
import ArchitectsImageManager from '../components/admin/ArchitectsImageManager';

export default function AdminArchitectsImages() {
  return (
    <AdminLayout title="Architects Page Images">
      <div className="space-y-6">
        <p className="text-sm text-slate-500">Upload or paste URLs to update the images on the Architects & Designers page.</p>
        <ArchitectsImageManager />
      </div>
    </AdminLayout>
  );
}