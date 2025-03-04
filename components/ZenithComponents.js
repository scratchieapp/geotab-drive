import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// NoSSR wrapper component
const NoSSR = ({ children }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return children;
};

// Add missing components
export const Spinner = () => <div className='zenith-spinner'>Loading...</div>;
export const IconTicket = () => <span className='zenith-icon-ticket'>🎟️</span>;
export const CardContent = ({ children }) => <div className='zenith-card-content'>{children}</div>;
export const TextField = ({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  type = 'text', 
  className = '',
  error = false,
  helperText = '' 
}) => (
  <div className={`zenith-text-field ${className} ${error ? 'error' : ''}`}>
    {label && <label>{label}</label>}
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
    {error && helperText && <div className='helper-text'>{helperText}</div>}
  </div>
);

// Dynamically import Zenith components with SSR disabled
const ZenithComponents = dynamic(() => import('@geotab/zenith').then(mod => ({
  Card: mod.Card,
  SummaryTile: mod.SummaryTile,
  Button: mod.Button,
  Spinner: mod.Spinner,
  IconTicket: mod.IconTicket
})), {
  ssr: false,
  loading: () => (
    <div style={{ 
      height: '100px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f8f9fa',
      borderRadius: '8px'
    }}>
      <div style={{ 
        width: '30px', 
        height: '30px', 
        border: '3px solid #f3f3f3',
        borderTop: '3px solid #3498db',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
    </div>
  )
});

// Export the dynamic components
export const Card = dynamic(() => import('@geotab/zenith').then(mod => mod.Card), { ssr: false });
export const SummaryTile = dynamic(() => import('@geotab/zenith').then(mod => mod.SummaryTile), { ssr: false });
export const SummaryTileBar = dynamic(() => import('@geotab/zenith').then(mod => mod.SummaryTileBar), { ssr: false });
export const Button = dynamic(() => import('@geotab/zenith').then(mod => mod.Button), { ssr: false });
export const Cards = dynamic(() => import('@geotab/zenith').then(mod => mod.Cards), { ssr: false });
export const LineChart = dynamic(() => import('@geotab/zenith').then(mod => mod.LineChart), { ssr: false });
export const IconArrowTop = dynamic(() => import('@geotab/zenith').then(mod => mod.IconArrowTop), { ssr: false });
export const IconArrowBottom = dynamic(() => import('@geotab/zenith').then(mod => mod.IconArrowBottom), { ssr: false });
export const IconMoney = dynamic(() => import('@geotab/zenith').then(mod => mod.IconMoney), { ssr: false });
export const IconStar = dynamic(() => import('@geotab/zenith').then(mod => mod.IconStar), { ssr: false });
export const IconPeople = dynamic(() => import('@geotab/zenith').then(mod => mod.IconPeople), { ssr: false });

export default function ZenithComponentsWrapper({ children }) {
  return (
    <NoSSR>
      <ZenithComponents>
        {children}
      </ZenithComponents>
    </NoSSR>
  );
} 