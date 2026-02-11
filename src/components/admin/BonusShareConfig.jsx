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

  useEffect(() => {
    if (goalData?.bonusSharePercent != null) {
      setPercent(String(goalData.bonusSharePercent));
    }
  }, [goalData]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const val = parseFloat(percent);
      if (isNaN(val) || val < 0 || val > 10) {
        throw new Error('Enter a value between 0 and 10');
      }
      if (!goalData?.id) {
        await base44.entities.CompanyGoal.create({
          year: currentYear,
          bonusSharePercent: val,
        });
      } else {
        await base44.entities.CompanyGoal.update(goalData.id, { bonusSharePercent: val });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companyGoal'] });
      toast.success('Bonus share % updated');
    },
    onError: (err) => toast.error(err.message),
  });

  const headcount = employees.length;
  const ytdRevenue = goalData?.currentRevenue || 0;
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

        <div className="flex items-center gap-3">
          <div className="flex-1">
            <label className="text-xs text-slate-500 mb-1 block">Revenue share %</label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                step="0.01"
                min="0"
                max="10"
                value={percent}
                onChange={e => setPercent(e.target.value)}
                className="h-8 w-24 text-sm"
              />
              <span className="text-sm text-slate-500">%</span>
              <Button size="sm" className="h-8" onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
                <Save className="w-3.5 h-3.5 mr-1" /> Save
              </Button>
            </div>
          </div>
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