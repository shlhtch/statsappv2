import StatsControl from '@/components/manager/StatsControl';
import styles from "../manager.module.css";

export default function StatsPage() {
  return (
    <div
      className={`${styles.bodyDefault} font-montserratAlternates text-white`}
      style={{ minHeight: "100vh" }}
    >
      <StatsControl />
    </div>
  );
}