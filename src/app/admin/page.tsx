import AdminStatsControl from '@/components/admin/AdminStatsControl';
import styles from "./admin.module.css";

export default function AdminPage() {

  return (
    <div
      className={`${styles.bodyDefault} font-montserratAlternates text-white`}
      style={{ minHeight: "100vh" }}
    >
      <AdminStatsControl />
    </div>
  );
}
