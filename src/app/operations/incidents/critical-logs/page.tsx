import { redirect } from "next/navigation";

export default function IncidentsCriticalLogsRedirectPage() {
  redirect("/operations/incidents/incident-history");
}
