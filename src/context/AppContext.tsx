/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { NetworkInfo } from "@/types";
import { createContext, useState } from "react";
import { networkItems } from "@/config";

interface AppContextProps {
  selectedFrom: NetworkInfo;
  setSelectedFrom(network: NetworkInfo): void;
}

const initialState = {
  selectedFrom: networkItems[0],
  setSelectedFrom: () => {},
};
export const AppContext = createContext<AppContextProps>(initialState);

interface AppContextProviderProps {
  children: React.ReactNode;
}

export const AppContextProvider: React.FC<AppContextProviderProps> = ({
  children,
}) => {

  const [selectedFrom, setSelectedFrom] =
    useState<NetworkInfo>(networkItems[0]); // Default to

  return (
    <AppContext.Provider
      value={{
        selectedFrom,
        setSelectedFrom,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
