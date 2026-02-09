import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { MonitorPlay, ExternalLink } from 'lucide-react';
import { useLanguage } from './LanguageContext';

const TUTORIALS = [
  {
    title: 'JobTread Overview - Getting Started',
    videoId: 'gVZrGnIVj1I',
    description: 'Learn the basics of JobTread and how to navigate the platform.',
  },
  {
    title: 'How to Create a Job in JobTread',
    videoId: 'z2sXkfR7MIw',
    description: 'Step-by-step guide on creating and setting up a new job.',
  },
  {
    title: 'Creating Estimates in JobTread',
    videoId: 'CQMH7cPzrOc',
    description: 'How to build and send professional estimates to clients.',
  },
  {
    title: 'Managing Your Schedule in JobTread',
    videoId: '0VxzrLXNbDQ',
    description: 'Keep track of tasks, deadlines, and your daily schedule.',
  },
  {
    title: 'JobTread Daily Logs & Updates',
    videoId: 'xWjO2lLJd4A',
    description: 'How to log daily progress and keep your team updated.',
  },
  {
    title: 'Purchase Orders & Budgeting',
    videoId: 'FhNkZ2YaAco',
    description: 'Track costs and manage purchase orders within JobTread.',
  },
];

export default function JobTreadSection() {
  const { t } = useLanguage();

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {TUTORIALS.map((tutorial, i) => (
          <Card key={i} className="border-gray-200 overflow-hidden">
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
              <p className="text-xs text-gray-500 mt-1">{tutorial.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

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