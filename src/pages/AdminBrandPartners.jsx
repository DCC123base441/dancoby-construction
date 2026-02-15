import React from 'react';
import AdminLayout from '../components/admin/AdminLayout';
import BrandPartnerManager from '../components/admin/BrandPartnerManager';

export default function AdminBrandPartners() {
  return (
    <AdminLayout title="Brand Partners">
      <BrandPartnerManager />
    </AdminLayout>
  );
}