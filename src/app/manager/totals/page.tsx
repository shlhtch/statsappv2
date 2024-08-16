import TotalsControls from '@/components/manager/TotalsControl';


export default function TotalsPage() {
  return (
    <div className="bg-[#1C1C1E] min-h-screen">
      <div className="font-montserrat text-white font-bolt text-[20px] bg-[#1C1C1E]">
        <div className="text-center pt-4">Итого баллы</div>
        <TotalsControls />
      </div>
    </div>
  );
}
