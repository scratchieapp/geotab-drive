import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Client-side only wrapper
const ClientOnly = ({ children }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return children;
};

// Dynamically import Zenith components with SSR disabled
const ZenithComponents = dynamic(() => import('@geotab/zenith').then(mod => ({
  Card: mod.Card,
  SummaryTile: mod.SummaryTile,
  Button: mod.Button,
  IconTicket: mod.IconTicket,
  Spinner: mod.Spinner
})), {
  ssr: false,
  loading: () => null
});

// Main wrapper component
export default function ZenithComponentsWrapper({ children }) {
  return (
    <ClientOnly>
      <ZenithComponents>
        {children}
      </ZenithComponents>
    </ClientOnly>
  );
} 