"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { SIDEBAR_CONFIG } from "@/lib/constants/navigation";

interface SidebarContextValue {
  isSecondaryOpen: boolean;
  toggleSecondarySidebar: () => void;
  openSecondarySidebar: () => void;
  closeSecondarySidebar: () => void;
  contentPaddingLeft: number;
}

const SidebarContext = createContext<SidebarContextValue | undefined>(undefined);

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}

interface SidebarProviderProps {
  children: ReactNode;
}

export function SidebarProvider({ children }: SidebarProviderProps) {
  const [isSecondaryOpen, setIsSecondaryOpen] = useState(false);

  const toggleSecondarySidebar = useCallback(() => {
    setIsSecondaryOpen((prev) => !prev);
  }, []);

  const openSecondarySidebar = useCallback(() => {
    setIsSecondaryOpen(true);
  }, []);

  const closeSecondarySidebar = useCallback(() => {
    setIsSecondaryOpen(false);
  }, []);

  // Content always has the same padding - secondary sidebar overlays, doesn't push
  const contentPaddingLeft = SIDEBAR_CONFIG.primaryWidth;

  return (
    <SidebarContext.Provider
      value={{
        isSecondaryOpen,
        toggleSecondarySidebar,
        openSecondarySidebar,
        closeSecondarySidebar,
        contentPaddingLeft,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}
