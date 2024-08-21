import AdminPatchControl from '@/components/admin/AdminPatchControl';
import styles from "../admin.module.css";

export default function AdminTotalsPage() {
  return (
    <div
      className={`${styles.bodyDefault} font-montserratAlternates text-white`}
      style={{ minHeight: "100vh" }}
    >
      <AdminPatchControl/>
    </div>
  );
}
