import { useEffect, useState } from "react";
import { MatomoProvider, createInstance } from "@jonkoops/matomo-tracker-react";


interface MatomoInfo {
    baseUrl: string;
    siteId: number;
}


export const MatomoWrapper = ({ children }: any) => {
    const [matomo, setMatomo] = useState<MatomoInfo>();

    useEffect(() => {
        fetchConfig();
      }, []);

    const fetchConfig = () => fetch(`/config.json`)
        .then((res) => res.json())
        .then((config) => {
          const matomoConfig = { baseUrl: config.matomoServer, siteId: parseInt(config.matomoSiteID) }
          matomoConfig?.baseUrl && matomoConfig?.siteId && setMatomo(matomoConfig);
        })
    
    return matomo ? 
        <MatomoProvider value={createInstance({
          urlBase: matomo.baseUrl,
          siteId: matomo.siteId,
        })}>
            {children}
        </MatomoProvider>
        :
        children;
};