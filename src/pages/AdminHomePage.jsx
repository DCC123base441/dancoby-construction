import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import AdminLayout from '../components/admin/AdminLayout';
import HomePageSectionEditor from '../components/admin/HomePageSectionEditor';
import { Button } from "@/components/ui/button";
import { ExternalLink } from 'lucide-react';

const SECTION_ORDER = ['hero', 'whoWeAre', 'services', 'aboutUs', 'banner', 'featuredProjects', 'cta'];

export default function AdminHomePage() {
  const { data: sections = [], isLoading } = useQuery({
    queryKey: ['homePageContent'],
    queryFn: () => base44.entities.HomePageContent.list(),
  });

  const sortedSections = SECTION_ORDER
    .map(key => sections.find(s => s.section === key))
    .filter(Boolean);

  return (
    <AdminLayout
      title="Home Page"
      actions={
        <Button variant="outline" size="sm" asChild>
          <a href="/" target="_blank" rel="noopener noreferrer">
            <ExternalLink className="w-4 h-4 mr-1.5" />
            Preview
          </a>
        </Button>
      }
    >
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600" />
        </div>
      ) : (
        <div className="space-y-4 max-w-3xl">
          <p className="text-sm text-slate-500 mb-6">
            Edit each section of your home page below. Changes are saved per section and will appear on the live site immediately.
          </p>
          {sortedSections.map(s => (
            <HomePageSectionEditor key={s.id} section={s.section} data={s} />
          ))}
        </div>
      )}
    </AdminLayout>
  );
}