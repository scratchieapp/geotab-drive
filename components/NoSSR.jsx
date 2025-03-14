import React, { useState, useEffect } from 'react';

export default function NoSSR({ children, fallback = null }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient ? children : fallback;
} 