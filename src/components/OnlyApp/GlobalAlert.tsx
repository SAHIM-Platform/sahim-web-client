"use client";

import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks';
import { isAdminOrSuperAdminByRole } from '@/utils/role';

const STORAGE_KEY = 'sahim_admin_alert_closed';

export const GlobalAdminAlert = () => {
  const {auth} = useAuth();
  const [isVisible, setIsVisible] = useState(true);
  
  useEffect(() => {
    const isClosed = localStorage.getItem(STORAGE_KEY) === 'true';
    setIsVisible(!isClosed);
  }, []);

  if (!isAdminOrSuperAdminByRole(auth.user?.role)) return null;

  const handleClose = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="mb-6 bg-primary/5 border border-primary/20 rounded-lg">
      <div className="relative">
        <div className="flex items-center justify-between gap-2 py-2.5 px-4 text-primary">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <p className="text-sm">أنت مسجل الدخول كمُشرف. تأكد من التعامل بحذر.</p>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 hover:bg-primary/10 rounded-full transition-colors"
            aria-label="إغلاق التنبيه"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
