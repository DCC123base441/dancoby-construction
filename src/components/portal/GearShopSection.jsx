import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../../utils';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Tag, ArrowRight, Copy, Check } from 'lucide-react';
import { toast } from "sonner";
import { useLanguage } from './LanguageContext';

const EMPLOYEE_DISCOUNT_CODE = 'TEAM100';

export default function GearShopSection() {
  const { t } = useLanguage();
  const [copied, setCopied] = React.useState(false);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(EMPLOYEE_DISCOUNT_CODE);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = EMPLOYEE_DISCOUNT_CODE;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    setCopied(true);
    toast.success(t('codeCopied'));
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="border-gray-200 overflow-hidden">
      <CardContent className="p-0">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-4 sm:p-6 text-white">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-full bg-white/10">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg">{t('employeeGear')}</h3>
          </div>
          <p className="text-gray-300 text-sm mb-5">{t('gearDesc')}</p>

          <div className="bg-white/10 border border-white/20 rounded-xl p-4 mb-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Tag className="w-4 h-4 text-green-400" />
                  <span className="text-xs text-gray-300 uppercase tracking-wider font-semibold">{t('employeeCode')}</span>
                </div>
                <span className="text-2xl font-mono font-bold tracking-widest">{EMPLOYEE_DISCOUNT_CODE}</span>
                <p className="text-xs text-green-400 mt-1">{t('freeGear')}</p>
              </div>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 h-10 w-10" onClick={copyCode}>
                {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          <Button asChild className="w-full bg-white text-gray-900 hover:bg-gray-100 h-11">
            <Link to={createPageUrl('Shop')} target="_blank">
              <ShoppingBag className="w-4 h-4 mr-2" />
              {t('browseShop')}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}