"use client";

import { toast } from "@heroui/react";
import { useEffect, useRef } from "react";

export function AccessNotice() {
  const displayed = useRef(false);

  useEffect(() => {
    if (displayed.current) return;
    displayed.current = true;
    toast.warning("Su acceso a la herramienta ya no está disponible.");
    window.history.replaceState(null, "", "/apphub");
  }, []);

  return null;
}
