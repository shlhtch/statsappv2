"use client";

import AdminUsdControls from '@/components/admin/AdminUsdControl';
import styles from "../admin.module.css";

export default function UsdPage() {
  return (
    <div
      className={`${styles.bodyDefault} font-montserratAlternates text-white`}
      style={{ minHeight: "100vh" }}
    >
     <AdminUsdControls/>
    </div>
  );
}
