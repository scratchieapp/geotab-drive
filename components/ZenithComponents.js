import dynamic from 'next/dynamic';

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
  })),
  { ssr: false }
);

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

// Export all Zenith components
export const {
  Card,
  SummaryTile,
  SummaryTileBar,
  Button,
  Cards,
  LineChart,
  IconArrowTop,
  IconArrowBottom,
  IconMoney,
  IconStar,
  IconPeople,
} = ZenithComponents;

// Default export for dynamic import
const ZenithComponentsWrapper = ({ 
  database,
  username,
  password,
  loading,
  error,
  result,
  setDatabase,
  setUsername,
  setPassword,
  handleSubmit
}) => {
  return (
    <>
      <Card>
        <CardContent>
          <h3>Enter Geotab Credentials</h3>
          <form onSubmit={handleSubmit}>
            <TextField 
              label='Database' 
              placeholder='Your Geotab database' 
              value={database} 
              onChange={e => setDatabase(e.target.value)} 
              required 
              style={{ marginBottom: '1rem' }}
            />
            <TextField 
              label='Username' 
              placeholder='Your Geotab username' 
              value={username} 
              onChange={e => setUsername(e.target.value)} 
              required 
              style={{ marginBottom: '1rem' }}
            />
            <TextField 
              type='password' 
              label='Password' 
              placeholder='Your Geotab password' 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
              style={{ marginBottom: '1rem' }}
            />
            <Button 
              type='primary' 
              htmlType='submit' 
              disabled={loading}
            >
              {loading ? 'Testing Connection...' : 'Test Connection'}
            </Button>
          </form>

          {error && (
            <div style={{ 
              marginTop: '20px', 
              padding: '10px', 
              backgroundColor: '#ffebee', 
              border: '1px solid #ffcdd2',
              borderRadius: '4px',
              color: '#b71c1c' 
            }}>
              <h4>Error:</h4>
              <p>{error}</p>
            </div>
          )}

          {result && result.success && (
            <div style={{ 
              marginTop: '20px', 
              padding: '10px', 
              backgroundColor: '#e8f5e9', 
              border: '1px solid #c8e6c9',
              borderRadius: '4px',
              color: '#1b5e20' 
            }}>
              <h4>✅ Connection Successful!</h4>
              <p>Successfully connected to Geotab API server: <strong>{result.server}</strong></p>
              <p>Number of drivers retrieved: <strong>{result.driversCount}</strong></p>
              {result.sampleDrivers && result.sampleDrivers.length > 0 && (
                <>
                  <h5>Sample Drivers:</h5>
                  <ul>
                    {result.sampleDrivers.map(driver => (
                      <li key={driver.id}>
                        {driver.name} (ID: {driver.id.substring(0, 8)}...)
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card style={{ marginTop: '20px' }}>
        <CardContent>
          <h3>Usage Notes</h3>
          <ul>
            <li>This page tests direct connection to the Geotab API</li>
            <li>Successful connection confirms your credentials work</li>
            <li>Retrieving drivers confirms API functionality is working</li>
            <li>No data is stored - credentials are only used for this test</li>
          </ul>
        </CardContent>
      </Card>
    </>
  );
};

export default ZenithComponentsWrapper; 