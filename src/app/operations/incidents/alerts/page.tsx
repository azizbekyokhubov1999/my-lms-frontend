import { redirect } from "next/navigation";

export default function IncidentsAlertsRedirectPage() {
  redirect("/operations/incidents/active-incidents");
}
