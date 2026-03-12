import { redirect } from "next/navigation";

/**
 * Standards have been moved to /aqad/standards.
 * Redirect any legacy links from /aqad/settings/standards.
 */
export default function SettingsStandardsRedirect() {
  redirect("/aqad/standards");
}
