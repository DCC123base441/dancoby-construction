import React from 'react';
import { motion } from 'framer-motion';
import { Award, Flame, Crown, Star, Zap, Heart } from 'lucide-react';
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

export default function TenureBadge({ startDate }) {
  const { lang } = useLanguage();
  const info = getTenureInfo(startDate, lang);

  if (!info) return null;

  const Icon = info.icon;
  const isHighTier = ['legend', 'veteran', 'pro'].includes(info.tier);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 0.3, type: 'spring', stiffness: 200, damping: 15 }}
      className="mt-3"
    >
      <div className={`inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full pl-1.5 pr-3 py-1 border border-white/20`}>
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
      </div>
    </motion.div>
  );
}