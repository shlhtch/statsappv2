import PointsControl from '@/components/manager/PointsControl';
import styles from "../manager.module.css";

export default function PointsPage() {

	return (
    <div
      className={`${styles.bodyDefault} font-montserratAlternates`}
      style={{ minHeight: "100vh" }}
    >
      <PointsControl />
    </div>
  );
}