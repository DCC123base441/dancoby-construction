import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Flame, Crown, Star, Zap, Heart, ChevronDown } from 'lucide-react';
import { differenceInMonths, differenceInYears, differenceInDays, parseISO } from 'date-fns';
import { useLanguage } from './LanguageContext';

function getTenureInfo(startDate, lang) {
  if (!startDate) return null;

  const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
  const now = new Date();
  const totalDays = differenceInDays(now, start);
  const totalMonths = differenceInMonths(now, start);
  const years = differenceInYears(now, start);
  const months = totalMonths - years * 12;

  // Build display string
  let display;
  if (lang === 'es') {
    if (years >= 1) {
      display = `${years} año${years > 1 ? 's' : ''}${months > 0 ? `, ${months} mes${months > 1 ? 'es' : ''}` : ''}`;
    } else if (totalMonths >= 1) {
      display = `${totalMonths} mes${totalMonths > 1 ? 'es' : ''}`;
    } else {
      display = `${totalDays} día${totalDays !== 1 ? 's' : ''}`;
    }
  } else {
    if (years >= 1) {
      display = `${years} year${years > 1 ? 's' : ''}${months > 0 ? `, ${months} mo` : ''}`;
    } else if (totalMonths >= 1) {
      display = `${totalMonths} month${totalMonths > 1 ? 's' : ''}`;
    } else {
      display = `${totalDays} day${totalDays !== 1 ? 's' : ''}`;
    }
  }

  // Milestone tiers
  if (years >= 10) return { display, tier: 'legend', label: lang === 'es' ? '🏆 Leyenda' : '🏆 Legend', icon: Crown, color: 'from-yellow-400 to-amber-500', glow: 'shadow-amber-400/40', emoji: '👑' };
  if (years >= 5) return { display, tier: 'veteran', label: lang === 'es' ? '⭐ Veterano' : '⭐ Veteran', icon: Star, color: 'from-purple-400 to-indigo-500', glow: 'shadow-purple-400/40', emoji: '💎' };
  if (years >= 3) return { display, tier: 'pro', label: 'Pro', icon: Flame, color: 'from-orange-400 to-red-500', glow: 'shadow-orange-400/40', emoji: '🔥' };
  if (years >= 1) return { display, tier: 'rising', label: lang === 'es' ? 'En Ascenso' : 'Rising Star', icon: Zap, color: 'from-cyan-400 to-blue-500', glow: 'shadow-cyan-400/30', emoji: '⚡' };
  if (totalMonths >= 6) return { display, tier: 'solid', label: lang === 'es' ? 'En Camino' : 'Getting Strong', icon: Award, color: 'from-emerald-400 to-teal-500', glow: 'shadow-emerald-400/30', emoji: '💪' };
  if (totalMonths >= 1) return { display, tier: 'new', label: lang === 'es' ? 'Bienvenido' : 'Welcome Aboard', icon: Heart, color: 'from-pink-400 to-rose-500', glow: 'shadow-pink-400/30', emoji: '🎉' };
  return { display, tier: 'fresh', label: lang === 'es' ? 'Recién Llegado' : 'Just Started', icon: Heart, color: 'from-pink-400 to-rose-500', glow: 'shadow-pink-400/30', emoji: '🌟' };
}

const ALL_TIERS = [
  { tier: 'legend', req: '10+ years', reqEs: '10+ años', label: '🏆 Legend', labelEs: '🏆 Leyenda', icon: Crown, color: 'from-yellow-400 to-amber-500' },
  { tier: 'veteran', req: '5+ years', reqEs: '5+ años', label: '⭐ Veteran', labelEs: '⭐ Veterano', icon: Star, color: 'from-purple-400 to-indigo-500' },
  { tier: 'pro', req: '3+ years', reqEs: '3+ años', label: '🔥 Pro', labelEs: '🔥 Pro', icon: Flame, color: 'from-orange-400 to-red-500' },
  { tier: 'rising', req: '1+ year', reqEs: '1+ año', label: '⚡ Rising Star', labelEs: '⚡ En Ascenso', icon: Zap, color: 'from-cyan-400 to-blue-500' },
  { tier: 'solid', req: '6+ months', reqEs: '6+ meses', label: '💪 Getting Strong', labelEs: '💪 En Camino', icon: Award, color: 'from-emerald-400 to-teal-500' },
  { tier: 'new', req: '1+ month', reqEs: '1+ mes', label: '🎉 Welcome Aboard', labelEs: '🎉 Bienvenido', icon: Heart, color: 'from-pink-400 to-rose-500' },
  { tier: 'fresh', req: 'Day 1', reqEs: 'Día 1', label: '🌟 Just Started', labelEs: '🌟 Recién Llegado', icon: Heart, color: 'from-pink-400 to-rose-500' },
];

export default function TenureBadge({ startDate }) {
  const { lang } = useLanguage();
  const info = getTenureInfo(startDate, lang);
  const [showChart, setShowChart] = useState(false);

  if (!info) return null;

  const Icon = info.icon;
  const isHighTier = ['legend', 'veteran', 'pro'].includes(info.tier);
  const currentTierIndex = ALL_TIERS.findIndex(t => t.tier === info.tier);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 0.3, type: 'spring', stiffness: 200, damping: 15 }}
      className="mt-3 relative"
    >
      <button onClick={() => setShowChart(!showChart)} className="focus:outline-none">
        <div className={`inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full pl-1.5 pr-3 py-1 border border-white/20 hover:bg-white/25 transition-colors cursor-pointer`}>
          {/* Icon pill */}
          <motion.div
            className={`w-7 h-7 rounded-full bg-gradient-to-br ${info.color} flex items-center justify-center shadow-lg ${info.glow}`}
            animate={isHighTier ? { 
              scale: [1, 1.15, 1],
              rotate: [0, 5, -5, 0]
            } : {}}
            transition={isHighTier ? { 
              duration: 2, 
              repeat: Infinity, 
              repeatDelay: 3 
            } : {}}
          >
            <Icon className="w-3.5 h-3.5 text-white" />
          </motion.div>

          {/* Text */}
          <div className="flex items-center gap-1.5">
            <span className="text-white/90 text-xs font-semibold">
              {info.display}
            </span>
            <span className="text-[10px] text-white/60">•</span>
            <span className="text-[10px] text-amber-200 font-medium">
              {info.label}
            </span>
          </div>

          {/* Sparkle for high tiers */}
          {isHighTier && (
            <motion.span
              animate={{ opacity: [0.5, 1, 0.5], scale: [0.9, 1.1, 0.9] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-sm"
            >
              {info.emoji}
            </motion.span>
          )}

          <ChevronDown className={`w-3 h-3 text-white/50 transition-transform ${showChart ? 'rotate-180' : ''}`} />
        </div>
      </button>

      <AnimatePresence>
        {showChart && (
          <motion.div
            initial={{ opacity: 0, y: -5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 mt-2 z-50 w-72 bg-gray-900/95 backdrop-blur-lg rounded-xl border border-white/15 shadow-2xl p-4"
          >
            <p className="text-white/80 text-xs font-semibold mb-3">
              {lang === 'es' ? 'Logros por Antigüedad' : 'Tenure Achievements'}
            </p>
            <div className="space-y-1.5">
              {ALL_TIERS.map((t, i) => {
                const TIcon = t.icon;
                const isCurrent = t.tier === info.tier;
                const isAchieved = i >= currentTierIndex;
                return (
                  <div
                    key={t.tier}
                    className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-colors ${
                      isCurrent ? 'bg-white/15 ring-1 ring-amber-400/50' : isAchieved ? 'bg-white/5' : 'opacity-40'
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center flex-shrink-0 ${
                      !isAchieved ? 'grayscale' : ''
                    }`}>
                      <TIcon className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-semibold ${isCurrent ? 'text-amber-300' : 'text-white/80'}`}>
                        {lang === 'es' ? t.labelEs : t.label}
                        {isCurrent && <span className="ml-1.5 text-[10px] bg-amber-400/20 text-amber-300 px-1.5 py-0.5 rounded-full">{lang === 'es' ? 'TÚ' : 'YOU'}</span>}
                      </p>
                    </div>
                    <span className="text-xs text-white/40 flex-shrink-0">
                      {lang === 'es' ? t.reqEs : t.req}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}