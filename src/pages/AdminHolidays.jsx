import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import AdminLayout from '../components/admin/AdminLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Loader2, CalendarDays, Star } from 'lucide-react';
import { toast } from "sonner";

const TAG_COLORS = {
  off: 'bg-red-50 text-red-700 border-red-200',
  paid: 'bg-green-50 text-green-700 border-green-200',
  working: 'bg-yellow-50 text-yellow-700 border-yellow-200',
};

const TAG_LABELS = { off: 'Off', paid: 'Paid', working: 'Working' };

export default function AdminHolidays() {
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [category, setCategory] = useState('federal');
  const [tag, setTag] = useState('off');
  const queryClient = useQueryClient();

  const { data: holidays = [], isLoading } = useQuery({
    queryKey: ['holidays'],
    queryFn: () => base44.entities.Holiday.list('order'),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Holiday.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['holidays']);
      setName(''); setStartDate(''); setEndDate(''); setCategory('federal'); setTag('off');
      setShowAdd(false);
      toast.success('Holiday added');
    },
  });

  const updateTagMutation = useMutation({
    mutationFn: ({ id, tag }) => base44.entities.Holiday.update(id, { tag }),
    onSuccess: () => {
      queryClient.invalidateQueries(['holidays']);
      toast.success('Tag updated');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Holiday.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['holidays']);
      toast.success('Holiday removed');
    },
  });

  const seedHolidays = async () => {
    const year = new Date().getFullYear();
    const defaults = [
      { name: "New Year's Day", startDate: `${year}-01-01`, endDate: `${year}-01-01`, category: "federal", tag: "paid" },
      { name: "MLK Jr. Day", startDate: `${year}-01-19`, endDate: `${year}-01-19`, category: "federal", tag: "paid" },
      { name: "Presidents' Day", startDate: `${year}-02-16`, endDate: `${year}-02-16`, category: "federal", tag: "paid" },
      { name: "Memorial Day", startDate: `${year}-05-25`, endDate: `${year}-05-25`, category: "federal", tag: "paid" },
      { name: "Independence Day", startDate: `${year}-07-04`, endDate: `${year}-07-04`, category: "federal", tag: "paid" },
      { name: "Labor Day", startDate: `${year}-09-07`, endDate: `${year}-09-07`, category: "federal", tag: "paid" },
      { name: "Thanksgiving", startDate: `${year}-11-26`, endDate: `${year}-11-27`, category: "federal", tag: "paid" },
      { name: "Christmas Eve & Day", startDate: `${year}-12-24`, endDate: `${year}-12-25`, category: "federal", tag: "paid" },
    ];
    await base44.entities.Holiday.bulkCreate(defaults);
    queryClient.invalidateQueries(['holidays']);
    toast.success('Default holidays added — update dates for this year as needed');
  };

  const handleAdd = () => {
    if (!name.trim() || !startDate) return;
    createMutation.mutate({ 
      name, 
      startDate, 
      endDate: endDate || startDate, 
      category, 
      tag, 
      order: 0 
    });
  };

  return (
    <AdminLayout title="Holiday Schedule" currentPage="AdminHolidays">
      <div className="space-y-6">
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => setShowAdd(!showAdd)} className="bg-gray-900 hover:bg-gray-800">
            <Plus className="w-4 h-4 mr-2" /> Add Holiday
          </Button>
          {holidays.length === 0 && (
            <Button variant="outline" onClick={seedHolidays}>
              <CalendarDays className="w-4 h-4 mr-2" /> Load Defaults (Federal + Jewish)
            </Button>
          )}
        </div>

        {showAdd && (
          <Card className="border-gray-200">
            <CardContent className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="space-y-1.5">
                  <Label>Name</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Passover" />
                </div>
                <div className="space-y-1.5">
                  <Label>Start Date</Label>
                  <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>End Date (optional)</Label>
                  <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="federal">Federal</SelectItem>
                      <SelectItem value="jewish">Jewish</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Tag</Label>
                  <Select value={tag} onValueChange={setTag}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="off">Off</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="working">Working</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAdd} disabled={createMutation.isPending} className="bg-gray-900 hover:bg-gray-800">
                  {createMutation.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                  Add
                </Button>
                <Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {isLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>
        ) : holidays.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <CalendarDays className="w-10 h-10 mx-auto mb-3 text-gray-300" />
            <p>No holidays configured. Click "Load Defaults" to get started.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {holidays.map(h => (
              <Card key={h.id} className="border-gray-100">
                <CardContent className="p-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {h.category === 'jewish' ? (
                      <Star className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    ) : (
                      <CalendarDays className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{h.name}</p>
                      <p className="text-xs text-gray-500">
                        {h.startDate ? (
                          <>
                            {h.startDate}
                            {h.endDate && h.endDate !== h.startDate && ` → ${h.endDate}`}
                          </>
                        ) : h.date}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-[10px] capitalize ml-1">
                      {h.category}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Select value={h.tag} onValueChange={(val) => updateTagMutation.mutate({ id: h.id, tag: val })}>
                      <SelectTrigger className="w-28 h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="off">Off</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="working">Working</SelectItem>
                      </SelectContent>
                    </Select>
                    <Badge className={`text-[10px] ${TAG_COLORS[h.tag]}`}>{TAG_LABELS[h.tag]}</Badge>
                    <Button
                      variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-500"
                      onClick={() => deleteMutation.mutate(h.id)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}