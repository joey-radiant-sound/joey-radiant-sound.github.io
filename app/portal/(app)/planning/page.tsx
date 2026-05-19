import { redirect } from "next/navigation";

// /portal/planning is just an alias for the first tab.
export default function PlanningIndex() {
  redirect("/portal/planning/general");
}
