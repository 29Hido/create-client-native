import { createContext } from "react";

export const mercureContext = createContext({
    hubURL: undefined,
    setHubURL: (hubURL: string) => { },
});