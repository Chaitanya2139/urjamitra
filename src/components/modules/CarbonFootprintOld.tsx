import React, { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import './CarbonFootprint.css';

interface Product {
  id: string;
  name: string;
  category: string;
  carbonFootprint: number;
  alternatives: string[];
}

const CarbonFootprint: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [totalFootprint, setTotalFootprint] = useState(0);
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [, setIsLoading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY || '');

  useEffect(() => {
    const total = products.reduce((sum, product) => sum + product.carbonFootprint, 0);
    setTotalFootprint(total);
  }, [products]);

  const analyzeProduct = async (productName: string, category: string) => {
    setIsLoading(true);
    try {
      if (!process.env.REACT_APP_GEMINI_API_KEY) {
        setAiAnalysis('AI features require a Gemini API key. Please add REACT_APP_GEMINI_API_KEY to your environment variables.');
        return;
      }
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      
      const prompt = `
        As a carbon footprint expert, analyze this product:
        
        Product: ${productName}
        Category: ${category}
        
        Please provide:
        1. Estimated carbon footprint in kg CO2 equivalent
        2. 3 eco-friendly alternatives with their carbon footprints
        3. Tips to reduce environmental impact
        4. Any certifications to look for when buying similar products
        
        Format your response as a structured analysis.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      
      // Parse the response to extract carbon footprint and alternatives
      const text = response.text();
      const carbonMatch = text.match(/(\d+(?:\.\d+)?)\s*kg\s*CO2/i);
      const carbonFootprint = carbonMatch ? parseFloat(carbonMatch[1]) : 0;
      
      const alternatives = text.match(/alternatives?[:-]?\s*([^.]*)/gi) || [];
      
      const newProduct: Product = {
        id: Date.now().toString(),
        name: productName,
        category,
        carbonFootprint,
        alternatives: alternatives.slice(0, 3).map(alt => alt.replace(/alternatives?[:-]?\s*/gi, '').trim())
      };
      
      setProducts([...products, newProduct]);
      setAiAnalysis(text);
    } catch (error) {
      console.error('Error analyzing product:', error);
      setAiAnalysis('Unable to analyze product at this time. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        // Here you would typically send the image to an AI service for analysis
        // For now, we'll just show the image
      };
      reader.readAsDataURL(file);
    }
  };

  const addManualProduct = () => {
    const name = prompt('Enter product name:');
    const category = prompt('Enter product category:');
    if (name && category) {
      analyzeProduct(name, category);
    }
  };

  const removeProduct = (id: string) => {
    setProducts(products.filter(product => product.id !== id));
  };

  const getFootprintColor = (footprint: number) => {
    if (footprint < 5) return '#4CAF50';
    if (footprint < 15) return '#FF9800';
    return '#F44336';
  };

  const getFootprintLevel = (footprint: number) => {
    if (footprint < 5) return 'Low';
    if (footprint < 15) return 'Medium';
    return 'High';
  };

  return (
    <div className="carbon-footprint">
      <div className="module-header">
        <h2>🌱 Carbon Footprint Analyzer</h2>
        <p>Track and reduce your environmental impact with AI-powered analysis</p>
      </div>

      <div className="carbon-grid">
        <div className="overview-section">
          <div className="footprint-summary">
            <div className="summary-card">
              <h3>Total Carbon Footprint</h3>
              <div className="footprint-value">
                {totalFootprint.toFixed(1)}
                <span>kg CO₂</span>
              </div>
            </div>
            
            <div className="summary-card">
              <h3>Products Analyzed</h3>
              <div className="footprint-value">
                {products.length}
                <span>items</span>
              </div>
            </div>
            
            <div className="summary-card">
              <h3>Average Impact</h3>
              <div className="footprint-value">
                {products.length > 0 ? (totalFootprint / products.length).toFixed(1) : 0}
                <span>kg CO₂</span>
              </div>
            </div>
          </div>

          <div className="impact-chart">
            <h3>Environmental Impact</h3>
            <div className="chart-container">
              {products.map(product => {
                const percentage = (product.carbonFootprint / totalFootprint) * 100;
                return (
                  <div key={product.id} className="chart-item">
                    <div className="item-info">
                      <span className="item-name">{product.name}</span>
                      <span className="item-category">{product.category}</span>
                    </div>
                    <div className="chart-bar">
                      <div 
                        className="bar-fill"
                        style={{ 
                          width: `${percentage}%`,
                          backgroundColor: getFootprintColor(product.carbonFootprint)
                        }}
                      ></div>
                    </div>
                    <div className="item-value">
                      {product.carbonFootprint.toFixed(1)} kg CO₂
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="analysis-section">
          <div className="upload-section">
            <h3>Analyze Products</h3>
            <div className="upload-options">
              <div className="upload-option">
                <label htmlFor="image-upload" className="upload-btn">
                  📷 Upload Photo
                </label>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
              </div>
              
              <button onClick={addManualProduct} className="manual-btn">
                ✏️ Add Manually
              </button>
            </div>
            
            {uploadedImage && (
              <div className="uploaded-image">
                <img src={uploadedImage} alt="Uploaded product" />
                <p>Image uploaded! AI analysis coming soon...</p>
              </div>
            )}
          </div>

          <div className="products-list">
            <h3>Your Products</h3>
            <div className="products-container">
              {products.map(product => (
                <div key={product.id} className="product-card">
                  <div className="product-info">
                    <h4>{product.name}</h4>
                    <p className="product-category">{product.category}</p>
                    <div className="product-footprint">
                      <span 
                        className="footprint-badge"
                        style={{ backgroundColor: getFootprintColor(product.carbonFootprint) }}
                      >
                        {product.carbonFootprint.toFixed(1)} kg CO₂
                      </span>
                      <span className="footprint-level">
                        {getFootprintLevel(product.carbonFootprint)} Impact
                      </span>
                    </div>
                  </div>
                  
                  {product.alternatives.length > 0 && (
                    <div className="alternatives">
                      <h5>Eco-friendly Alternatives:</h5>
                      <ul>
                        {product.alternatives.map((alt, index) => (
                          <li key={index}>{alt}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <button 
                    onClick={() => removeProduct(product.id)}
                    className="remove-btn"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="ai-insights">
          <h3>AI Insights & Recommendations</h3>
          <div className="insights-content">
            {aiAnalysis ? (
              <div className="insights-text">
                {aiAnalysis.split('\n').map((line, index) => (
                  <p key={index}>{line}</p>
                ))}
              </div>
            ) : (
              <div className="insights-placeholder">
                Upload a product photo or add products manually to get AI-powered insights and recommendations.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarbonFootprint;
