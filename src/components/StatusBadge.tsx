import { Badge } from "@/components/ui";
import type { EventStatus } from "@/types";

export function StatusBadge({ status }: { status: EventStatus }) {
  return <Badge className={`status-${status}`}>{status}</Badge>;
}
