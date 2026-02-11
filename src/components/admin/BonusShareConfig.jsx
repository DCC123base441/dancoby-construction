import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Settings, Save, Users, DollarSign } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function BonusShareConfig() {
  const currentYear = new Date().getFullYear();
  const queryClient = useQueryClient();

  const { data: goalData } = useQuery({
    queryKey: ['companyGoal', currentYear],
    queryFn: async () => {
      const results = await base44.entities.CompanyGoal.filter({ year: currentYear });
      return results[0] || null;
    }
  });

  const { data: employees = [] } = useQuery({
    queryKey: ['activeEmployees'],
    queryFn: () => base44.entities.EmployeeProfile.filter({ status: 'active' }),
  });

  const [percent, setPercent] = useState('');
  const [revenue, setRevenue] = useState('');
  const [headcountOverride, setHeadcountOverride] = useState('');

  useEffect(() => {
    if (goalData?.bonusSharePercent != null) {
      setPercent(String(goalData.bonusSharePercent));
    }
    if (goalData?.currentRevenue != null) {
      setRevenue(String(goalData.currentRevenue));
    }
  }, [goalData]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const val = parseFloat(percent);
      if (isNaN(val) || val < 0 || val > 100) {
        throw new Error('Enter a valid percentage');
      }
      const rev = parseFloat(revenue);
      if (isNaN(rev) || rev < 0) {
        throw new Error('Enter a valid revenue amount');
      }
      const hc = headcountOverride ? parseInt(headcountOverride) : null;
      if (headcountOverride && (isNaN(hc) || hc < 1)) {
        throw new Error('Enter a valid headcount');
      }

      const updateData = {
        bonusSharePercent: val,
        currentRevenue: rev,
        quarterlyBreakdown: { q1: rev, q2: 0, q3: 0, q4: 0 },
        lastUpdated: new Date().toISOString(),
      };

      if (!goalData?.id) {
        await base44.entities.CompanyGoal.create({
          year: currentYear,
          ...updateData,
        });
      } else {
        await base44.entities.CompanyGoal.update(goalData.id, updateData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companyGoal'] });
      toast.success('Share settings updated');
    },
    onError: (err) => toast.error(err.message),
  });

  const actualHeadcount = employees.length;
  const headcount = headcountOverride ? parseInt(headcountOverride) || actualHeadcount : actualHeadcount;
  const ytdRevenue = parseFloat(revenue) || 0;
  const pct = parseFloat(percent) || 0;
  const pool = ytdRevenue * (pct / 100);
  const perPerson = headcount > 0 ? pool / headcount : 0;

  return (
    <Card className="border-slate-200">
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4 text-slate-500" />
          <h3 className="text-sm font-semibold text-slate-900">Quarterly Share Settings</h3>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs text-slate-500 mb-1 block">YTD Revenue ($)</label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">$</span>
              <Input
                type="number"
                step="1"
                min="0"
                value={revenue}
                onChange={e => setRevenue(e.target.value)}
                className="h-8 w-32 text-sm"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Bonus share %</label>
              <div className="flex items-center gap-1">
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={percent}
                  onChange={e => setPercent(e.target.value)}
                  className="h-8 w-20 text-sm"
                />
                <span className="text-sm text-slate-500">%</span>
              </div>
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Headcount override</label>
              <Input
                type="number"
                step="1"
                min="1"
                value={headcountOverride}
                onChange={e => setHeadcountOverride(e.target.value)}
                placeholder={String(actualHeadcount)}
                className="h-8 w-20 text-sm"
              />
            </div>
          </div>

          <Button size="sm" className="h-8" onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
            <Save className="w-3.5 h-3.5 mr-1" /> Save
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-2 rounded-lg bg-slate-50">
            <p className="text-[10px] text-slate-400 uppercase">Headcount</p>
            <p className="text-lg font-bold text-slate-900 flex items-center justify-center gap-1">
              <Users className="w-3.5 h-3.5 text-slate-400" /> {headcount}
            </p>
          </div>
          <div className="p-2 rounded-lg bg-slate-50">
            <p className="text-[10px] text-slate-400 uppercase">YTD Pool</p>
            <p className="text-lg font-bold text-emerald-700">${pool.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
          </div>
          <div className="p-2 rounded-lg bg-slate-50">
            <p className="text-[10px] text-slate-400 uppercase">Per Person</p>
            <p className="text-lg font-bold text-emerald-700">${perPerson.toFixed(2)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}