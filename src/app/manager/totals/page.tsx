import TotalsControls from '@/components/manager/TotalsControl';
import styles from "../manager.module.css";

export default function TotalsPage() {
  return (
    <div
      className={`${styles.bodyDefault} font-montserrat text-white font-bolt text-[20px]`}
      style={{ minHeight: "100vh" }}
    >
        <div className="text-center pt-4">Итого баллы</div>
        <TotalsControls />
      </div>
  );
}
