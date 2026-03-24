import { redirect } from "next/navigation";

export default function IncidentsOverviewRedirectPage() {
  redirect("/operations/incidents/active-incidents");
}
