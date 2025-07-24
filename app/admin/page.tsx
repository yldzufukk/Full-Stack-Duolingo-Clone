import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin";
import dynamic from "next/dynamic";

// Client tarafında dinamik olarak yüklenen bileşen
const App = dynamic(() => import("./app"));

export default function AdminPage() {
  if (!isAdmin()) {
    redirect("/");
  }

  return <App />;
}