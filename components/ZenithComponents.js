import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

// Create a no-SSR wrapper component
const NoSSR = ({ children }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div className="zenith-spinner">Loading components...</div>;
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
const ZenithComponents = dynamic(
  () => import('@geotab/zenith').then(mod => ({
    Card: mod.Card,
    SummaryTile: mod.SummaryTile,
    SummaryTileBar: mod.SummaryTileBar,
    Button: mod.Button,
    Cards: mod.Cards,
    LineChart: mod.LineChart,
    IconArrowTop: mod.IconArrowTop,
    IconArrowBottom: mod.IconArrowBottom,
    IconMoney: mod.IconMoney,
    IconStar: mod.IconStar,
    IconPeople: mod.IconPeople,
    IconTicket: mod.IconTicket,
  })),
  { ssr: false }
);

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

// Wrapper component that handles dynamic loading
const ZenithComponentsWrapper = ({ children }) => {
  const [components, setComponents] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadComponents = async () => {
      try {
        const mod = await import('@geotab/zenith');
        setComponents({
          Card: mod.Card,
          SummaryTile: mod.SummaryTile,
          SummaryTileBar: mod.SummaryTileBar,
          Button: mod.Button,
          Cards: mod.Cards,
          LineChart: mod.LineChart,
          IconArrowTop: mod.IconArrowTop,
          IconArrowBottom: mod.IconArrowBottom,
          IconMoney: mod.IconMoney,
          IconStar: mod.IconStar,
          IconPeople: mod.IconPeople,
          IconTicket: mod.IconTicket,
        });
      } catch (error) {
        console.error('Error loading Zenith components:', error);
      } finally {
        setLoading(false);
      }
    };

    loadComponents();
  }, []);

  if (loading) {
    return <div className="zenith-spinner">Loading components...</div>;
  }

  if (!components) {
    return null;
  }

  return (
    <NoSSR>
      {children(components)}
    </NoSSR>
  );
};

export default ZenithComponentsWrapper; 