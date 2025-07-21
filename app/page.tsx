import { redirect } from "next/navigation";

export default function Home() {
  // Only redirect to /repos if authenticated
  // Otherwise, the login page will handle redirection
  redirect("/login");
}