import React from 'react';
import {
  Card as ZenithCard,
  SummaryTile as ZenithSummaryTile,
  SummaryTileBar as ZenithSummaryTileBar,
  Button as ZenithButton,
  Cards as ZenithCards,
  LineChart as ZenithLineChart,
  IconArrowTop as ZenithIconArrowTop,
  IconArrowBottom as ZenithIconArrowBottom,
  IconMoney as ZenithIconMoney,
  IconStar as ZenithIconStar,
  IconPeople as ZenithIconPeople,
  // Add any other Zenith components used in the project
} from '@geotab/zenith';

// Export components with proper names
export const Card = ZenithCard;
export const SummaryTile = ZenithSummaryTile;
export const SummaryTileBar = ZenithSummaryTileBar;
export const Button = ZenithButton;
export const Cards = ZenithCards;
export const LineChart = ZenithLineChart;
export const IconArrowTop = ZenithIconArrowTop;
export const IconArrowBottom = ZenithIconArrowBottom;
export const IconMoney = ZenithIconMoney;
export const IconStar = ZenithIconStar;
export const IconPeople = ZenithIconPeople;

// Add missing components
export const Spinner = () => <div className="zenith-spinner">Loading...</div>;
export const IconTicket = () => <span className="zenith-icon-ticket">🎟️</span>;
export const CardContent = ({ children }) => <div className="zenith-card-content">{children}</div>;
export const TextField = ({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  type = "text", 
  className = "",
  error = false,
  helperText = "" 
}) => (
  <div className={`zenith-text-field ${className} ${error ? 'error' : ''}`}>
    {label && <label>{label}</label>}
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
    {error && helperText && <div className="helper-text">{helperText}</div>}
  </div>
);

// Default export for dynamic import
const ZenithComponentsWrapper = ({ 
  database,
  username,
  password,
  loading,
  error,
  setDatabase,
  setUsername,
  setPassword,
  handleSubmit
}) => {
  return (
    <div style={{ maxWidth: "400px", margin: "100px auto", textAlign: "center" }}>
      <Card>
        <CardContent>
          <h3>Geotab Driver Login</h3>
          {error && <div style={{ color: "red", margin: "10px 0" }}>{error}</div>}
          <form onSubmit={handleSubmit}>
            <TextField
              label="Database"
              value={database}
              onChange={(e) => setDatabase(e.target.value)}
              placeholder="Enter your database"
            />
            <TextField
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
            <Button type="submit" disabled={loading}>
              {loading ? <Spinner /> : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ZenithComponentsWrapper; 