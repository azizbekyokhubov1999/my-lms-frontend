import { redirect } from "next/navigation";

export default async function IncidentIdRedirectPage({
  params,
}: {
  params: Promise<{ incidentId: string }>;
}) {
  const { incidentId } = await params;
  redirect(`/operations/incidents/incident-detail?id=${encodeURIComponent(incidentId)}`);
}
