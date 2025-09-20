import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import './SolarEnergy.css';

interface Device {
  id: string;
  name: string;
  power: number;
  duration: number;
  priority: number;
}

const SolarEnergy: React.FC = () => {
  const [solarCapacity, setSolarCapacity] = useState(5000); // watts
  const [devices, setDevices] = useState<Device[]>([
    { id: '1', name: 'Refrigerator', power: 150, duration: 24, priority: 1 },
    { id: '2', name: 'Air Conditioner', power: 2000, duration: 8, priority: 2 },
    { id: '3', name: 'Washing Machine', power: 500, duration: 2, priority: 3 },
    { id: '4', name: 'Water Heater', power: 3000, duration: 2, priority: 4 },
    { id: '5', name: 'LED Lights', power: 100, duration: 12, priority: 5 },
  ]);
  const [aiRecommendations, setAiRecommendations] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY || '');

  const calculateEnergyUsage = () => {
    return devices.reduce((total, device) => total + (device.power * device.duration), 0);
  };

  const getOptimalSchedule = async () => {
    setIsLoading(true);
    try {
      if (!process.env.REACT_APP_GEMINI_API_KEY) {
        setAiRecommendations('AI features require a Gemini API key. Please add REACT_APP_GEMINI_API_KEY to your environment variables.');
        return;
      }
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      
      const prompt = `
        As a solar energy optimization expert, analyze this household setup:
        
        Solar Panel Capacity: ${solarCapacity}W
        Devices and their usage:
        ${devices.map(d => `${d.name}: ${d.power}W for ${d.duration}h (Priority: ${d.priority})`).join('\n')}
        
        Total daily energy consumption: ${calculateEnergyUsage()}Wh
        
        Please provide:
        1. An optimal daily schedule for running these devices
        2. Energy-saving recommendations
        3. Potential cost savings
        4. Any adjustments needed to maximize solar utilization
        
        Format your response in a clear, actionable way for the homeowner.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      setAiRecommendations(response.text());
    } catch (error) {
      console.error('Error getting AI recommendations:', error);
      setAiRecommendations('Unable to generate recommendations at this time. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

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
            <h3>AI Recommendations</h3>
            <button 
              onClick={getOptimalSchedule}
              disabled={isLoading}
              className="get-recommendations-btn"
            >
              {isLoading ? 'Analyzing...' : 'Get Optimal Schedule'}
            </button>
          </div>
          
          <div className="recommendations-content">
            {aiRecommendations ? (
              <div className="recommendations-text">
                {aiRecommendations.split('\n').map((line, index) => (
                  <p key={index}>{line}</p>
                ))}
              </div>
            ) : (
              <div className="recommendations-placeholder">
                Click "Get Optimal Schedule" to receive AI-powered recommendations for your solar energy usage.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolarEnergy;
