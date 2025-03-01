import React, { useState } from "react";
import { Button, Card, Cards } from "@geotab/zenith";

export const Tab3Content = () => {
  // Rule states
  const [autoWeekly, setAutoWeekly] = useState(true);
  const [maxPerWeek, setMaxPerWeek] = useState<number>(3);
  const [maxPerDriver, setMaxPerDriver] = useState<number>(1);
  const [autoThreshold, setAutoThreshold] = useState(true);
  const [scoreThreshold, setScoreThreshold] = useState<number>(90);
  const [autoImprovement, setAutoImprovement] = useState(true);
  const [improvementThreshold, setImprovementThreshold] = useState<number>(10);

  // Handler for numeric inputs
  const handleNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<number>>
  ) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 0) {
      setter(value);
    }
  };

  // Handler for saving the rules
  const handleSave = () => {
    const rules = {
      autoWeekly,
      maxPerWeek,
      maxPerDriver,
      autoThreshold,
      scoreThreshold,
      autoImprovement,
      improvementThreshold
    };

    // In a real application, this would call an API endpoint
    alert(`Saving Scratchie allocation rules: ${JSON.stringify(rules, null, 2)}`);
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h3 className="heading-02-mobile-drive" style={{ marginBottom: "0.5rem" }}>
        Scratchie Allocation Rules
      </h3>
      <p style={{ marginBottom: "2rem" }}>
        Configure how Scratchies are automatically allocated to drivers. Set weekly limits,
        performance thresholds, and improvement criteria.
      </p>

      <Cards>
        <Card title="Weekly Allocation Limits" size="M">
          <Card.Content>
            <div style={{ marginBottom: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}>
                <input
                  type="checkbox"
                  id="autoWeekly"
                  checked={autoWeekly}
                  onChange={(e) => setAutoWeekly(e.target.checked)}
                  style={{ marginRight: "0.5rem" }}
                />
                <label htmlFor="autoWeekly">Automatically allocate Scratchies to top drivers weekly</label>
              </div>
              
              {autoWeekly && (
                <>
                  <div style={{ display: "flex", alignItems: "center", marginLeft: "1.5rem", marginBottom: "0.75rem" }}>
                    <label htmlFor="maxPerWeek" style={{ marginRight: "0.5rem" }}>
                      Maximum Scratchies to issue per week:
                    </label>
                    <input
                      type="number"
                      id="maxPerWeek"
                      value={maxPerWeek}
                      onChange={(e) => handleNumberChange(e, setMaxPerWeek)}
                      min="0"
                      style={{
                        width: "4rem",
                        padding: "0.5rem",
                        borderRadius: "4px",
                        border: "1px solid #ccc"
                      }}
                    />
                  </div>
                  
                  <div style={{ display: "flex", alignItems: "center", marginLeft: "1.5rem" }}>
                    <label htmlFor="maxPerDriver" style={{ marginRight: "0.5rem" }}>
                      Maximum Scratchies per driver per week:
                    </label>
                    <input
                      type="number"
                      id="maxPerDriver"
                      value={maxPerDriver}
                      onChange={(e) => handleNumberChange(e, setMaxPerDriver)}
                      min="0"
                      style={{
                        width: "4rem",
                        padding: "0.5rem",
                        borderRadius: "4px",
                        border: "1px solid #ccc"
                      }}
                    />
                  </div>
                </>
              )}
            </div>
          </Card.Content>
        </Card>

        <Card title="Performance Threshold" size="M">
          <Card.Content>
            <div style={{ marginBottom: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}>
                <input
                  type="checkbox"
                  id="autoThreshold"
                  checked={autoThreshold}
                  onChange={(e) => setAutoThreshold(e.target.checked)}
                  style={{ marginRight: "0.5rem" }}
                />
                <label htmlFor="autoThreshold">
                  Automatically award Scratchies when driver score exceeds threshold
                </label>
              </div>
              
              {autoThreshold && (
                <div style={{ display: "flex", alignItems: "center", marginLeft: "1.5rem" }}>
                  <label htmlFor="scoreThreshold" style={{ marginRight: "0.5rem" }}>
                    Score threshold (0-100):
                  </label>
                  <input
                    type="number"
                    id="scoreThreshold"
                    value={scoreThreshold}
                    onChange={(e) => handleNumberChange(e, setScoreThreshold)}
                    min="0"
                    max="100"
                    style={{
                      width: "4rem",
                      padding: "0.5rem",
                      borderRadius: "4px",
                      border: "1px solid #ccc"
                    }}
                  />
                </div>
              )}
            </div>
          </Card.Content>
        </Card>

        <Card title="Improvement Awards" size="M">
          <Card.Content>
            <div style={{ marginBottom: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}>
                <input
                  type="checkbox"
                  id="autoImprovement"
                  checked={autoImprovement}
                  onChange={(e) => setAutoImprovement(e.target.checked)}
                  style={{ marginRight: "0.5rem" }}
                />
                <label htmlFor="autoImprovement">
                  Automatically award Scratchies for significant score improvement
                </label>
              </div>
              
              {autoImprovement && (
                <div style={{ display: "flex", alignItems: "center", marginLeft: "1.5rem" }}>
                  <label htmlFor="improvementThreshold" style={{ marginRight: "0.5rem" }}>
                    Minimum improvement percentage:
                  </label>
                  <input
                    type="number"
                    id="improvementThreshold"
                    value={improvementThreshold}
                    onChange={(e) => handleNumberChange(e, setImprovementThreshold)}
                    min="0"
                    style={{
                      width: "4rem",
                      padding: "0.5rem",
                      borderRadius: "4px",
                      border: "1px solid #ccc"
                    }}
                  />
                  <span style={{ marginLeft: "0.25rem" }}>%</span>
                </div>
              )}
            </div>
          </Card.Content>
        </Card>
      </Cards>

      <div style={{ marginTop: "1rem" }}>
        <Button type="primary" onClick={handleSave}>
          Save Settings
        </Button>
      </div>
    </div>
  );
};

export default Tab3Content; 