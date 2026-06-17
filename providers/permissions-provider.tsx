"use client";

import React, { createContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { fetchUserPermissions } from "@/services/roles/permissions";
import { Loader2 } from "lucide-react";

interface PermissionsContextType {
  permissions: string[];
  loading: boolean;
  refetchPermissions: () => Promise<void>;
}

export const PermissionsContext = createContext<PermissionsContextType | undefined>(undefined);

// In-memory flag to force a fresh fetch from the server on hard refreshes/page loads
let isFirstLoad = true;

export const PermissionsProvider = ({ children }: { children: React.ReactNode }) => {
  // Temporary bypass: always return "*" to grant access to all resources
  const [permissions, setPermissions] = useState<string[]>(["*"]);
  const [loading, setLoading] = useState<boolean>(false);
  const token = Cookies.get("authToken");

  const loadPermissions = async (forceRefetch = false) => {
    setPermissions(["*"]);
    setLoading(false);
  };

  // React to token changes (login/logout events)
  useEffect(() => {
    setPermissions(["*"]);
    setLoading(false);
  }, [token]);

  const refetchPermissions = async () => {
    // no-op
  };

  return (
    <PermissionsContext.Provider value={{ permissions, loading, refetchPermissions }}>
      {children}
    </PermissionsContext.Provider>
  );
};
