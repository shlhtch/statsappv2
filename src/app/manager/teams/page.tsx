'use client'

import DetailStatsControl from '@/components/manager/DetailStatControl';
import { useEffect } from 'react';

export default function TeamsPage() {

    useEffect(() => {
      document.body.style.overflow = "hidden";

      return () => {
        document.body.style.overflow = "auto";
      };
    }, []);
    
  return (
    <div className="font-montserratAlternates py-2">
      <DetailStatsControl />
    </div>
  );
}
