import { redirect } from "next/navigation";

// There is no home page in Phase 1 — "/" sends you straight to the list.
// redirect() throws internally, so nothing after it runs.
export default function Home() {
  redirect("/applications");
}
