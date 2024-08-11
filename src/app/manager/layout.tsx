import { PropsWithChildren } from "react";
import NavBar from "@/components/NavBar";

export default function ManagerLayout({ children }: PropsWithChildren) {
  return (
    <div>
      <div className="fixed bottom-2 px-5">
        <NavBar />
      </div>
      <main>{children}</main>
    </div>
  );
}
