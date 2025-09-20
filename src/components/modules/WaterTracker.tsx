import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import './WaterTracker.css';

interface WaterUsage {
  id: string;
  activity: string;
  amount: number;
  unit: 'liters' | 'gallons';
  timestamp: Date;
  category: 'drinking' | 'cooking' | 'cleaning' | 'bathing' | 'other';
}

const WaterTracker: React.FC = () => {
  const [waterUsage, setWaterUsage] = useState<WaterUsage[]>([]);
  const [dailyGoal, setDailyGoal] = useState(150); // liters
  const [waterQuality] = useState<'excellent' | 'good' | 'fair' | 'poor'>('good');
  const [aiRecommendations, setAiRecommendations] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY || '');

  const totalUsage = waterUsage.reduce((sum, usage) => {
    const liters = usage.unit === 'gallons' ? usage.amount * 3.78541 : usage.amount;
    return sum + liters;
  }, 0);

  const usageByCategory = waterUsage.reduce((acc, usage) => {
    const liters = usage.unit === 'gallons' ? usage.amount * 3.78541 : usage.amount;
    acc[usage.category] = (acc[usage.category] || 0) + liters;
    return acc;
  }, {} as Record<string, number>);

  const getWaterQualityColor = (quality: string) => {
    switch (quality) {
      case 'excellent': return '#4CAF50';
      case 'good': return '#8BC34A';
      case 'fair': return '#FF9800';
      case 'poor': return '#F44336';
      default: return '#666';
    }
  };

  const getWaterQualityIcon = (quality: string) => {
    switch (quality) {
      case 'excellent': return '💧';
      case 'good': return '💧';
      case 'fair': return '⚠️';
      case 'poor': return '🚨';
      default: return '💧';
    }
  };

  const addWaterUsage = () => {
    const activity = prompt('Enter activity:');
    const amount = prompt('Enter amount:');
    const unit = prompt('Enter unit (liters/gallons):') as 'liters' | 'gallons';
    const category = prompt('Enter category (drinking/cooking/cleaning/bathing/other):') as WaterUsage['category'];
    
    if (activity && amount && unit && category) {
      const newUsage: WaterUsage = {
        id: Date.now().toString(),
        activity,
        amount: parseFloat(amount),
        unit,
        timestamp: new Date(),
        category
      };
      setWaterUsage([...waterUsage, newUsage]);
    }
  };

  const getWaterRecommendations = async () => {
    setIsLoading(true);
    try {
      if (!process.env.REACT_APP_GEMINI_API_KEY) {
        setAiRecommendations('AI features require a Gemini API key. Please add REACT_APP_GEMINI_API_KEY to your environment variables.');
        return;
      }
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      
      const prompt = `
        As a water conservation expert, analyze this household water usage:
        
        Daily Goal: ${dailyGoal} liters
        Current Usage: ${totalUsage.toFixed(1)} liters
        Usage by Category: ${JSON.stringify(usageByCategory, null, 2)}
        Water Quality: ${waterQuality}
        
        Please provide:
        1. Water conservation tips specific to their usage patterns
        2. Recommendations to improve water quality
        3. Suggestions to reduce water waste
        4. Health and safety advice for water consumption
        5. Ways to optimize their daily water goal
        
        Format your response in a clear, actionable way.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      setAiRecommendations(response.text());
    } catch (error) {
      console.error('Error getting water recommendations:', error);
      setAiRecommendations('Unable to generate recommendations at this time. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const removeUsage = (id: string) => {
    setWaterUsage(waterUsage.filter(usage => usage.id !== id));
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'drinking': return '🥤';
      case 'cooking': return '🍳';
      case 'cleaning': return '🧽';
      case 'bathing': return '🛁';
      default: return '💧';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'drinking': return '#4CAF50';
      case 'cooking': return '#FF9800';
      case 'cleaning': return '#2196F3';
      case 'bathing': return '#9C27B0';
      default: return '#666';
    }
  };

  return (
    <div className="water-tracker">
      <div className="module-header">
        <h2>💧 Water Safety & Usage Tracker</h2>
        <p>Monitor your water consumption and ensure safe, efficient usage</p>
      </div>

      <div className="water-grid">
        <div className="overview-section">
          <div className="water-summary">
            <div className="summary-card">
              <h3>Daily Goal</h3>
              <div className="goal-input">
                <input
                  type="number"
                  value={dailyGoal}
                  onChange={(e) => setDailyGoal(Number(e.target.value))}
                  className="goal-value"
                />
                <span>liters</span>
              </div>
            </div>
            
            <div className="summary-card">
              <h3>Today's Usage</h3>
              <div className="usage-value">
                {totalUsage.toFixed(1)}
                <span>liters</span>
              </div>
            </div>
            
            <div className="summary-card">
              <h3>Goal Progress</h3>
              <div className="progress-value">
                {((totalUsage / dailyGoal) * 100).toFixed(0)}
                <span>%</span>
              </div>
            </div>
          </div>

          <div className="water-quality">
            <h3>Water Quality Status</h3>
            <div className="quality-indicator">
              <div className="quality-icon">
                {getWaterQualityIcon(waterQuality)}
              </div>
              <div className="quality-info">
                <div 
                  className="quality-level"
                  style={{ color: getWaterQualityColor(waterQuality) }}
                >
                  {waterQuality.toUpperCase()}
                </div>
                <div className="quality-description">
                  {waterQuality === 'excellent' && 'Your water is safe and clean'}
                  {waterQuality === 'good' && 'Water quality is acceptable'}
                  {waterQuality === 'fair' && 'Consider water treatment'}
                  {waterQuality === 'poor' && 'Water treatment recommended'}
                </div>
              </div>
            </div>
          </div>

          <div className="usage-chart">
            <h3>Usage by Category</h3>
            <div className="chart-container">
              {Object.entries(usageByCategory).map(([category, amount]) => {
                const percentage = (amount / totalUsage) * 100;
                return (
                  <div key={category} className="chart-item">
                    <div className="category-info">
                      <span className="category-icon">{getCategoryIcon(category)}</span>
                      <span className="category-name">{category}</span>
                    </div>
                    <div className="chart-bar">
                      <div 
                        className="bar-fill"
                        style={{ 
                          width: `${percentage}%`,
                          backgroundColor: getCategoryColor(category)
                        }}
                      ></div>
                    </div>
                    <div className="category-value">
                      {amount.toFixed(1)}L
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="tracking-section">
          <div className="add-usage">
            <h3>Track Water Usage</h3>
            <button onClick={addWaterUsage} className="add-usage-btn">
              + Add Usage Entry
            </button>
          </div>

          <div className="usage-list">
            <h3>Recent Usage</h3>
            <div className="usage-container">
              {waterUsage.map(usage => {
                const liters = usage.unit === 'gallons' ? usage.amount * 3.78541 : usage.amount;
                return (
                  <div key={usage.id} className="usage-card">
                    <div className="usage-info">
                      <div className="usage-activity">
                        <span className="category-icon">{getCategoryIcon(usage.category)}</span>
                        <span className="activity-name">{usage.activity}</span>
                      </div>
                      <div className="usage-details">
                        <span className="usage-amount">
                          {usage.amount} {usage.unit} ({liters.toFixed(1)}L)
                        </span>
                        <span className="usage-time">
                          {usage.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                    <button 
                      onClick={() => removeUsage(usage.id)}
                      className="remove-usage-btn"
                    >
                      ×
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="ai-recommendations">
          <div className="section-header">
            <h3>AI Water Recommendations</h3>
            <button 
              onClick={getWaterRecommendations}
              disabled={isLoading}
              className="get-recommendations-btn"
            >
              {isLoading ? 'Analyzing...' : 'Get Recommendations'}
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
                Click "Get Recommendations" to receive AI-powered water conservation and safety tips.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaterTracker;
