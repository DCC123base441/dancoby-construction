import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  MonitorPlay, ExternalLink, Loader2, ChevronDown, ChevronRight, 
  Clock, BookOpen, Search, FolderOpen, X, CheckCircle2, Circle
} from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { useLanguage } from './LanguageContext';

const CATEGORY_ORDER = [
  "Your Account", "Customer Management - CRM", "Vendor Management", "Job Management",
  "Job Budget", "Estimating", "Selections", "Catalog", "Global Catalog",
  "Scheduling and To-Do's", "Invoicing", "Team Management", "Time Tracking",
  "Communications", "Documents", "Reporting", "QuickBooks Integration",
  "Other Integrations", "Automations", "Additional Resources"
];

const CATEGORY_ICONS = {
  "Your Account": "👤",
  "Customer Management - CRM": "🤝",
  "Vendor Management": "🏪",
  "Job Management": "📋",
  "Job Budget": "💰",
  "Estimating": "🧮",
  "Selections": "✅",
  "Catalog": "📦",
  "Global Catalog": "🌐",
  "Scheduling and To-Do's": "📅",
  "Invoicing": "💵",
  "Team Management": "👥",
  "Time Tracking": "⏱️",
  "Communications": "💬",
  "Documents": "📄",
  "Reporting": "📊",
  "QuickBooks Integration": "🔗",
  "Other Integrations": "🔌",
  "Automations": "⚡",
  "Additional Resources": "📚",
};

export default function JobTreadSection({ user }) {
  const { t } = useLanguage();
  const [expandedCats, setExpandedCats] = useState(new Set());
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const queryClient = useQueryClient();

  const { data: tutorials = [], isLoading } = useQuery({
    queryKey: ['jobtread-tutorials-employee'],
    queryFn: () => base44.entities.JobTreadTutorial.filter({ isActive: true }, 'order', 200),
  });

  const { data: progress = [] } = useQuery({
    queryKey: ['tutorial-progress', user?.email],
    queryFn: () => base44.entities.TutorialProgress.filter({ userEmail: user.email }),
    enabled: !!user?.email,
  });

  const completedSet = useMemo(() => {
    return new Set(progress.filter(p => p.completed).map(p => p.tutorialId));
  }, [progress]);

  const filtered = useMemo(() => {
    let result = tutorials;
    if (selectedCategory) result = result.filter(t => t.category === selectedCategory);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(t => 
        t.title?.toLowerCase().includes(q) || 
        t.category?.toLowerCase().includes(q) ||
        t.description?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [tutorials, search, selectedCategory]);

  const grouped = useMemo(() => {
    return filtered.reduce((acc, tut) => {
      const cat = tut.category || 'Other';
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(tut);
      return acc;
    }, {});
  }, [filtered]);

  const sortedCategories = useMemo(() => {
    const ordered = CATEGORY_ORDER.filter(c => grouped[c]);
    Object.keys(grouped).forEach(c => { if (!ordered.includes(c)) ordered.push(c); });
    return ordered;
  }, [grouped]);

  // All categories for the quick-browse chips
  const allCategories = useMemo(() => {
    const cats = {};
    tutorials.forEach(t => {
      const cat = t.category || 'Other';
      cats[cat] = (cats[cat] || 0) + 1;
    });
    const ordered = CATEGORY_ORDER.filter(c => cats[c]);
    Object.keys(cats).forEach(c => { if (!ordered.includes(c)) ordered.push(c); });
    return ordered.map(c => ({ name: c, count: cats[c] }));
  }, [tutorials]);

  const toggleCategory = (cat) => {
    setExpandedCats(prev => {
      const next = new Set(prev);
      next.has(cat) ? next.delete(cat) : next.add(cat);
      return next;
    });
  };

  const isSearching = search.trim().length > 0;
  const completedCount = completedSet.size;
  const totalCount = tutorials.length;
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const toggleComplete = async (tutorialId) => {
    try {
      const existing = progress.find(p => p.tutorialId === tutorialId);
      if (existing) {
        await base44.entities.TutorialProgress.update(existing.id, {
          completed: !existing.completed,
          completedDate: !existing.completed ? new Date().toISOString().split('T')[0] : null,
        });
      } else {
        await base44.entities.TutorialProgress.create({
          userEmail: user.email,
          tutorialId,
          completed: true,
          completedDate: new Date().toISOString().split('T')[0],
        });
      }
      await queryClient.invalidateQueries({ queryKey: ['tutorial-progress', user?.email] });
    } catch (err) {
      console.error('Failed to toggle tutorial:', err);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-blue-100">
          <MonitorPlay className="w-6 h-6 text-blue-700" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-gray-900 text-lg">{t('jobtreadTitle')}</h3>
          <p className="text-sm text-gray-500">{t('jobtreadDesc')}</p>
        </div>
      </div>

      {/* Progress bar */}
      {totalCount > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Your Progress</span>
            <span className="text-sm text-gray-500">{completedCount}/{totalCount} completed</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${progressPct === 100 ? 'bg-green-500' : 'bg-blue-500'}`}
              style={{ width: `${progressPct}%` }}
            />
          </div>
          {progressPct === 100 && (
            <p className="text-xs text-green-600 font-medium mt-2 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> All tutorials completed!
            </p>
          )}
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search tutorials..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 pr-9 bg-gray-50 border-gray-200 focus:bg-white"
        />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
            <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      {/* Category quick-browse chips */}
      {!isSearching && (
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              !selectedCategory
                ? 'bg-blue-100 text-blue-800 ring-1 ring-blue-300'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All ({tutorials.length})
          </button>
          {allCategories.map(({ name, count }) => (
            <button
              key={name}
              onClick={() => setSelectedCategory(selectedCategory === name ? null : name)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedCategory === name
                  ? 'bg-blue-100 text-blue-800 ring-1 ring-blue-300'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {CATEGORY_ICONS[name] || '📖'} {name} ({count})
            </button>
          ))}
        </div>
      )}

      {isSearching && filtered.length > 0 && (
        <p className="text-xs text-gray-500">
          Found <strong>{filtered.length}</strong> tutorial{filtered.length !== 1 ? 's' : ''} matching "{search}"
        </p>
      )}

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <MonitorPlay className="w-10 h-10 mx-auto mb-3 text-gray-300" />
          <p className="text-sm">{isSearching ? 'No tutorials match your search.' : t('noTutorials')}</p>
          {isSearching && (
            <button onClick={() => { setSearch(''); setSelectedCategory(null); }} className="text-blue-500 text-sm mt-2 hover:underline">
              Clear filters
            </button>
          )}
        </div>
      ) : isSearching ? (
        /* Flat results when searching */
        <Card className="border-gray-200 overflow-hidden divide-y divide-gray-50">
          {filtered.map(tut => (
            <TutorialRow key={tut.id} tut={tut} showCategory isCompleted={completedSet.has(tut.id)} onToggle={() => toggleComplete(tut.id)} />
          ))}
        </Card>
      ) : selectedCategory ? (
        /* Single category selected - show flat */
        <Card className="border-gray-200 overflow-hidden divide-y divide-gray-50">
          {filtered.map(tut => (
            <TutorialRow key={tut.id} tut={tut} isCompleted={completedSet.has(tut.id)} onToggle={() => toggleComplete(tut.id)} />
          ))}
        </Card>
      ) : (
        /* Grouped by category */
        <div className="space-y-2">
          {sortedCategories.map((cat) => {
            const isExpanded = expandedCats.has(cat);
            const items = grouped[cat];
            return (
              <Card key={cat} className="border-gray-200 overflow-hidden">
                <button
                  onClick={() => toggleCategory(cat)}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-base">{CATEGORY_ICONS[cat] || '📖'}</span>
                    <span className="font-semibold text-sm text-gray-900">{cat}</span>
                    <Badge variant="outline" className="text-xs font-normal">
                      {items.filter(i => completedSet.has(i.id)).length}/{items.length}
                    </Badge>
                    {items.every(i => completedSet.has(i.id)) && (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    )}
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
                      <TutorialRow key={tut.id} tut={tut} isCompleted={completedSet.has(tut.id)} onToggle={() => toggleComplete(tut.id)} />
                    ))}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* Help link */}
      <Card className="border-blue-200 bg-blue-50/60">
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

function TutorialRow({ tut, showCategory, isCompleted, onToggle }) {
  return (
    <div 
      className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50/50 transition-colors group active:bg-blue-100 cursor-pointer"
      onClick={onToggle}
    >
      <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
        {isCompleted ? (
          <CheckCircle2 className="w-5 h-5 text-green-500" />
        ) : (
          <Circle className="w-5 h-5 text-gray-300" />
        )}
      </div>
      <a
        href={tut.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 min-w-0 flex items-center gap-3"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium truncate ${isCompleted ? 'text-gray-400 line-through' : 'text-gray-800 group-hover:text-blue-700'}`}>
            {tut.title}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            {showCategory && tut.category && (
              <Badge variant="outline" className="text-[10px] font-normal">{tut.category}</Badge>
            )}
            {tut.description && !showCategory && (
              <p className="text-xs text-gray-400 truncate">{tut.description}</p>
            )}
          </div>
        </div>
        {tut.duration && (
          <span className="flex items-center gap-1 text-xs text-gray-400 flex-shrink-0">
            <Clock className="w-3 h-3" /> {tut.duration}
          </span>
        )}
        <ExternalLink className="w-3.5 h-3.5 text-gray-300 group-hover:text-blue-500 flex-shrink-0" />
      </a>
    </div>
  );
}