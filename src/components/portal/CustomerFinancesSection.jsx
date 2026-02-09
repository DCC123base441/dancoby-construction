import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ExternalLink } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useLanguage } from './LanguageContext';

export default function CustomerFinancesSection() {
  const { t } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <DollarSign className="w-6 h-6 text-emerald-600" />
        <h2 className="text-xl font-bold text-gray-900">{t('finances') || 'Finances'}</h2>
      </div>

      <Card className="border-emerald-100 bg-emerald-50/50">
        <CardContent className="p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Billing & Invoices</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
                All financial documents, invoices, and payments are managed securely through our partner platform, JobTread.
            </p>
            <Button 
                className="bg-emerald-600 hover:bg-emerald-700"
                onClick={() => window.open('https://app.jobtread.com/login', '_blank')}
            >
                View Invoices on JobTread
                <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-base">Payment Methods</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-gray-500">
                    We accept bank transfers (ACH), checks, and major credit cards via JobTread.
                </p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-base">Questions?</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-gray-500">
                    For billing inquiries, please contact our finance team at <a href="mailto:billing@dancoby.com" className="text-blue-600 hover:underline">billing@dancoby.com</a>.
                </p>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}