import React, { useState, useEffect } from 'react';
import './SolarEnergy.css';

interface Device {
  id: string;
  name: string;
  power: number;
  duration: number;
  priority: number;
}

interface ManagementPlan {
  recommendation_summary: string;
  energy_allocation_plan: Array<{
    appliance: string;
    time_to_run: string;
    power_source: string;
    priority: string;
  }>;
  battery_management: {
    charging: string;
    discharging: string;
  } | string;
  alerts: string[];
}

interface SolarAnalysisResponse {
  success: boolean;
  management_plan: ManagementPlan;
  timestamp: string;
  input: {
    solar_production_watts: number;
    battery_percentage: number;
    battery_capacity_wh: number;
  };
  error?: string;
}

const SolarEnergy: React.FC = () => {
  const [solarCapacity, setSolarCapacity] = useState(5000); // watts
  const [currentProduction, setCurrentProduction] = useState(2500); // current solar production
  const [batteryLevel, setBatteryLevel] = useState(75); // battery percentage
  const [batteryCapacity, setBatteryCapacity] = useState(10000); // Wh
  const [devices, setDevices] = useState<Device[]>([
    { id: '1', name: 'Refrigerator', power: 200, duration: 24, priority: 1 },
    { id: '2', name: 'Air Conditioner', power: 2000, duration: 8, priority: 2 },
    { id: '3', name: 'Washing Machine', power: 2000, duration: 2, priority: 3 },
    { id: '4', name: 'Water Heater', power: 3000, duration: 2, priority: 4 },
    { id: '5', name: 'LED Lights', power: 50, duration: 12, priority: 5 },
    { id: '6', name: 'Television', power: 150, duration: 6, priority: 6 },
    { id: '7', name: 'Laptop Charger', power: 65, duration: 8, priority: 7 },
  ]);
  const [managementPlan, setManagementPlan] = useState<ManagementPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const calculateEnergyUsage = () => {
    return devices.reduce((total, device) => total + (device.power * device.duration), 0);
  };

  const getAIRecommendations = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // Convert devices to appliances format for the backend
      const appliances: { [key: string]: number } = {};
      devices.forEach(device => {
        appliances[device.name] = device.power;
      });

      const requestBody = {
        solar_production: currentProduction,
        battery_percentage: batteryLevel,
        battery_capacity: batteryCapacity,
        appliances: appliances
      };

      const response = await fetch('http://localhost:5002/api/solar/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      const data: SolarAnalysisResponse = await response.json();

      if (data.success && data.management_plan) {
        setManagementPlan(data.management_plan);
      } else {
        setError(data.error || 'Failed to get AI recommendations');
      }
    } catch (error) {
      console.error('Error getting AI recommendations:', error);
      setError('Unable to connect to the solar analysis service. Please ensure the backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-update recommendations when key parameters change
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentProduction >= 0 && batteryLevel >= 0) {
        getAIRecommendations();
      }
    }, 1000); // Debounce updates

    return () => clearTimeout(timer);
  }, [currentProduction, batteryLevel, devices, batteryCapacity]);

  const addDevice = () => {
    const newDevice: Device = {
      id: Date.now().toString(),
      name: 'New Device',
      power: 100,
      duration: 1,
      priority: devices.length + 1
    };
    setDevices([...devices, newDevice]);
  };

  const updateDevice = (id: string, field: keyof Device, value: string | number) => {
    setDevices(devices.map(device => 
      device.id === id ? { ...device, [field]: value } : device
    ));
  };

  const removeDevice = (id: string) => {
    setDevices(devices.filter(device => device.id !== id));
  };

  const totalConsumption = calculateEnergyUsage();
  const solarUtilization = (totalConsumption / (solarCapacity * 24)) * 100;

  return (
    <div className="solar-energy">
      <div className="module-header">
        <h2>☀️ Solar Energy PowerCheck</h2>
        <p>Optimize your solar panel usage with AI-powered scheduling</p>
      </div>

      <div className="solar-grid">
        <div className="solar-overview">
          <div className="overview-cards">
            <div className="overview-card">
              <h3>Solar Capacity</h3>
              <div className="card-value">
                <input
                  type="number"
                  value={solarCapacity}
                  onChange={(e) => setSolarCapacity(Number(e.target.value))}
                  className="capacity-input"
                />
                <span>W</span>
              </div>
            </div>
            
            <div className="overview-card">
              <h3>Current Production</h3>
              <div className="card-value">
                <input
                  type="number"
                  value={currentProduction}
                  onChange={(e) => setCurrentProduction(Number(e.target.value))}
                  className="capacity-input"
                  min="0"
                  max={solarCapacity}
                />
                <span>W</span>
              </div>
            </div>
            
            <div className="overview-card">
              <h3>Battery Level</h3>
              <div className="card-value">
                <input
                  type="number"
                  value={batteryLevel}
                  onChange={(e) => setBatteryLevel(Number(e.target.value))}
                  className="capacity-input"
                  min="0"
                  max="100"
                />
                <span>%</span>
              </div>
            </div>
            
            <div className="overview-card">
              <h3>Battery Capacity</h3>
              <div className="card-value">
                <input
                  type="number"
                  value={batteryCapacity}
                  onChange={(e) => setBatteryCapacity(Number(e.target.value))}
                  className="capacity-input"
                />
                <span>Wh</span>
              </div>
            </div>
            
            <div className="overview-card">
              <h3>Daily Consumption</h3>
              <div className="card-value">
                {totalConsumption.toLocaleString()}
                <span>Wh</span>
              </div>
            </div>
            
            <div className="overview-card">
              <h3>Solar Utilization</h3>
              <div className="card-value">
                {solarUtilization.toFixed(1)}
                <span>%</span>
              </div>
            </div>
          </div>

          <div className="energy-chart">
            <h3>Energy Distribution</h3>
            <div className="chart-container">
              {devices.map(device => {
                const percentage = (device.power * device.duration / totalConsumption) * 100;
                return (
                  <div key={device.id} className="chart-bar">
                    <div className="bar-label">{device.name}</div>
                    <div className="bar-container">
                      <div 
                        className="bar-fill" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className="bar-value">{percentage.toFixed(1)}%</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="devices-section">
          <div className="section-header">
            <h3>Your Devices</h3>
            <button onClick={addDevice} className="add-device-btn">
              + Add Device
            </button>
          </div>

          <div className="devices-list">
            {devices.map(device => (
              <div key={device.id} className="device-card">
                <div className="device-info">
                  <input
                    type="text"
                    value={device.name}
                    onChange={(e) => updateDevice(device.id, 'name', e.target.value)}
                    className="device-name"
                  />
                  <div className="device-specs">
                    <div className="spec">
                      <label>Power (W)</label>
                      <input
                        type="number"
                        value={device.power}
                        onChange={(e) => updateDevice(device.id, 'power', Number(e.target.value))}
                        min="0"
                      />
                    </div>
                    <div className="spec">
                      <label>Duration (h)</label>
                      <input
                        type="number"
                        value={device.duration}
                        onChange={(e) => updateDevice(device.id, 'duration', Number(e.target.value))}
                        min="0"
                        max="24"
                      />
                    </div>
                    <div className="spec">
                      <label>Priority</label>
                      <input
                        type="number"
                        value={device.priority}
                        onChange={(e) => updateDevice(device.id, 'priority', Number(e.target.value))}
                        min="1"
                      />
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => removeDevice(device.id)}
                  className="remove-device-btn"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="ai-recommendations">
          <div className="section-header">
            <h3>AI Energy Management</h3>
            <button 
              onClick={getAIRecommendations}
              disabled={isLoading}
              className="get-recommendations-btn"
            >
              {isLoading ? 'Analyzing...' : 'Get AI Recommendations'}
            </button>
          </div>
          
          <div className="recommendations-content">
            {error && (
              <div className="error-message">
                <p style={{ color: 'red' }}>{error}</p>
              </div>
            )}
            
            {managementPlan ? (
              <div className="management-plan">
                <div className="plan-section">
                  <h4>📋 Summary</h4>
                  <p className="summary">{managementPlan.recommendation_summary}</p>
                </div>
                
                <div className="plan-section">
                  <h4>⚡ Energy Allocation Plan</h4>
                  <div className="allocation-list">
                    {managementPlan.energy_allocation_plan.map((item, index) => (
                      <div key={index} className="allocation-item">
                        <div className="appliance-info">
                          <span className="appliance-name">{item.appliance}</span>
                          <span className={`priority-badge priority-${item.priority.toLowerCase()}`}>
                            {item.priority}
                          </span>
                        </div>
                        <div className="allocation-details">
                          <span className="time-slot">{item.time_to_run}</span>
                          <span className={`power-source ${item.power_source.toLowerCase().replace(/[^a-z]/g, '-')}`}>
                            {item.power_source}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="plan-section">
                  <h4>🔋 Battery Management</h4>
                  {typeof managementPlan.battery_management === 'string' ? (
                    <p className="battery-advice">{managementPlan.battery_management}</p>
                  ) : (
                    <div className="battery-advice">
                      <div className="battery-strategy">
                        <strong>Charging:</strong> {managementPlan.battery_management.charging}
                      </div>
                      <div className="battery-strategy">
                        <strong>Discharging:</strong> {managementPlan.battery_management.discharging}
                      </div>
                    </div>
                  )}
                </div>
                
                {managementPlan.alerts && managementPlan.alerts.length > 0 && (
                  <div className="plan-section">
                    <h4>⚠️ Alerts</h4>
                    <ul className="alerts-list">
                      {managementPlan.alerts.map((alert, index) => (
                        <li key={index} className="alert-item">{alert}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : !isLoading && !error && (
              <div className="recommendations-placeholder">
                Click "Get AI Recommendations" to receive intelligent energy management advice based on your current solar production and battery level.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolarEnergy;
