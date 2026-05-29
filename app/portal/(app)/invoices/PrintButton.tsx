"use client";

import { Button } from "@/components/ui/Button";

/**
 * Triggers the browser's print dialog (Save as PDF). Hidden from the
 * printout itself via the `print:hidden` utility on its wrapper.
 */
export function PrintButton() {
  return (
    <Button type="button" size="md" onClick={() => window.print()}>
      Download / Print PDF
    </Button>
  );
}
