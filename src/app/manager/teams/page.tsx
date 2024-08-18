'use client'

import DetailStatsControl from '@/components/manager/DetailStatControl';
import { useEffect } from 'react';
import styles from "../manager.module.css";

export default function TeamsPage() {

    useEffect(() => {
      document.body.style.overflow = "hidden";

      return () => {
        document.body.style.overflow = "auto";
      };
    }, []);
    
  return (
    <div
      className={`${styles.bodyDefault} font-montserratAlternates text-white py-2`}
      style={{ minHeight: "100vh" }}
    >
      <DetailStatsControl />
    </div>
  );
}
