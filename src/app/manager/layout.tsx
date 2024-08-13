import { PropsWithChildren } from "react";
import NavBar from "@/components/NavBar";

export default function ManagerLayout({ children }: PropsWithChildren) {
  return (
    <div>
      <div className="fixed bottom-3 px-4">
        <NavBar />
      </div>
      <main>
        {children}
      </main>
    </div>
  );
}
