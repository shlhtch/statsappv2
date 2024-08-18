import { PropsWithChildren } from "react";
import AdminBar from '@/components/AdminNav';

export default function AdminLayout({ children }: PropsWithChildren) {
  return (
    <div>
      <div className="fixed bottom-3 px-4">
		<AdminBar/>
      </div>
      <main>{children}</main>
    </div>
  );
}
