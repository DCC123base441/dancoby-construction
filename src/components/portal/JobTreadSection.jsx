import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MonitorPlay, ExternalLink, Loader2, ChevronDown, ChevronRight, Clock, BookOpen } from 'lucide-react';
import { useLanguage } from './LanguageContext';

const CATEGORY_ORDER = [
  "Your Account", "Customer Management - CRM", "Vendor Management", "Job Management",
  "Job Budget", "Estimating", "Selections", "Catalog", "Global Catalog",
  "Scheduling and To-Do's", "Invoicing", "Team Management", "Time Tracking",
  "Communications", "Documents", "Reporting", "QuickBooks Integration",
  "Other Integrations", "Automations", "Additional Resources"
];

export default function JobTreadSection() {
  const { t } = useLanguage();
  const [expandedCat, setExpandedCat] = useState(null);

  const { data: tutorials = [], isLoading } = useQuery({
    queryKey: ['jobtread-tutorials-employee'],
    queryFn: () => base44.entities.JobTreadTutorial.filter({ isActive: true }, 'order', 200),
  });

  // Group by category
  const grouped = tutorials.reduce((acc, tut) => {
    const cat = tut.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(tut);
    return acc;
  }, {});

  const sortedCategories = CATEGORY_ORDER.filter(c => grouped[c]);
  // Add any categories not in the predefined order
  Object.keys(grouped).forEach(c => {
    if (!sortedCategories.includes(c)) sortedCategories.push(c);
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
        <div className="space-y-2">
          {sortedCategories.map((cat) => {
            const isExpanded = expandedCat === cat;
            const items = grouped[cat];
            return (
              <Card key={cat} className="border-gray-200 overflow-hidden">
                <button
                  onClick={() => setExpandedCat(isExpanded ? null : cat)}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-4 h-4 text-blue-500" />
                    <span className="font-semibold text-sm text-gray-900">{cat}</span>
                    <Badge variant="outline" className="text-xs">{items.length}</Badge>
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  )}
                </button>
                {isExpanded && (
                  <div className="border-t border-gray-100 divide-y divide-gray-50">
                    {items.map((tut) => (
                      <a
                        key={tut.id}
                        href={tut.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition-colors group"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-800 group-hover:text-blue-700 font-medium truncate">{tut.title}</p>
                          {tut.description && (
                            <p className="text-xs text-gray-400 truncate mt-0.5">{tut.description}</p>
                          )}
                        </div>
                        {tut.duration && (
                          <span className="flex items-center gap-1 text-xs text-gray-400 flex-shrink-0">
                            <Clock className="w-3 h-3" /> {tut.duration}
                          </span>
                        )}
                        <ExternalLink className="w-3.5 h-3.5 text-gray-300 group-hover:text-blue-500 flex-shrink-0" />
                      </a>
                    ))}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      <Card className="border-gray-200 bg-blue-50">
        <CardContent className="p-4 flex items-center justify-between">
          <p className="text-sm text-blue-800">{t('jobtreadMoreHelp')}</p>
          <a
            href="https://app.jobtread.com/help/tutorials"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            All Tutorials <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </CardContent>
      </Card>
    </div>
  );
}