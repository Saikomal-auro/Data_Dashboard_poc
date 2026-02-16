"use client";
import { createContext, useContext, ReactNode } from "react";

interface URLParamsContextType {
  chatDefaultOpen: boolean;
}

const URLParamsContext = createContext<URLParamsContextType>({
  chatDefaultOpen: false,
});

export function URLParamsProvider({ children }: { children: ReactNode }) {
  return (
    <URLParamsContext.Provider value={{ chatDefaultOpen: false }}>
      {children}
    </URLParamsContext.Provider>
  );
}

export function useURLParams() {
  return useContext(URLParamsContext);
}