import { redirect } from "next/navigation";

export default function IncidentsCreateRedirectPage() {
  redirect("/operations/incidents/create-incident");
}
