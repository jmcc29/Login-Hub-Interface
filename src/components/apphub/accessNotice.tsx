"use client";

import { addToast } from "@heroui/toast";
import { useEffect, useRef } from "react";

export function AccessNotice() {
  const displayed = useRef(false);

  useEffect(() => {
    if (displayed.current) return;
    displayed.current = true;
    addToast({
      title: "Acceso actualizado",
      description: "Su acceso a la herramienta ya no está disponible.",
      color: "warning",
      timeout: 3500,
      shouldShowTimeoutProgress: true,
    });
    window.history.replaceState(null, "", "/apphub");
  }, []);

  return null;
}
