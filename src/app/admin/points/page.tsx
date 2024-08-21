import AdminPoints from '@/components/admin/AdminPointsControl';
import styles from "../admin.module.css";

export default function AdminPointsPage() {
  return (
    <div
      className={`${styles.bodyDefault} font-montserratAlternates text-white`}
      style={{ minHeight: "100vh" }}
    >
      <AdminPoints/>
    </div>
  );
}
