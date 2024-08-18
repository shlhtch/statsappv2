import FormControl from '@/components/manager/FormControl';
import styles from '../manager.module.css'

export default function PointsPage() {
  return (
    <div
      className={`${styles.bodyDefault} font-montserratAlternates`}
      style={{ minHeight: "100vh" }}
    >
      <FormControl />
    </div>
  );
}
