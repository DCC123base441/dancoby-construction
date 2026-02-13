import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from "@/components/ui/card";
import { MonitorPlay, ExternalLink, Loader2 } from 'lucide-react';
import { useLanguage } from './LanguageContext';

export default function JobTreadSection() {
  const { t } = useLanguage();

  const { data: tutorials = [], isLoading } = useQuery({
    queryKey: ['jobtread-tutorials-employee'],
    queryFn: () => base44.entities.JobTreadTutorial.filter({ isActive: true }, 'order'),
  });

  return (
    <div className="space-y-4">
      <Card className="border-gray-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-full bg-blue-50">
              <MonitorPlay className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">{t('jobtreadTitle')}</h3>
              <p className="text-xs text-gray-500">{t('jobtreadDesc')}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        </div>
      ) : tutorials.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <MonitorPlay className="w-10 h-10 mx-auto mb-3 text-gray-300" />
          <p className="text-sm">{t('noTutorials')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tutorials.map((tutorial) => (
            <Card key={tutorial.id} className="border-gray-200 overflow-hidden">
              <div className="aspect-video">
                <iframe
                  src={`https://www.youtube.com/embed/${tutorial.videoId}`}
                  title={tutorial.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <CardContent className="p-4">
                <h4 className="font-semibold text-sm text-gray-900">{tutorial.title}</h4>
                {tutorial.description && (
                  <p className="text-xs text-gray-500 mt-1">{tutorial.description}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card className="border-gray-200 bg-blue-50">
        <CardContent className="p-4 flex items-center justify-between">
          <p className="text-sm text-blue-800">{t('jobtreadMoreHelp')}</p>
          <a
            href="https://www.jobtread.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            JobTread.com <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </CardContent>
      </Card>
    </div>
  );
}