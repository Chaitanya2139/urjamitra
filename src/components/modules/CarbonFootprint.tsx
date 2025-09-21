import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  Leaf, 
  BarChart3, 
  Camera, 
  X,
  Check,
  AlertCircle,
  Factory,
  Package,
  Truck,
  Zap,
  TreePine,
  Recycle,
  Target,
  TrendingUp,
  Download,
  Share2
} from 'lucide-react';
import './CarbonFootprint.css';

interface CarbonFootprintData {
  layer1_input_processing: {
    type: string;
    product_name: string;
    brand: string;
    specifications: {
      net_weight: string;
      calories_per_pkg: string;
    };
  };
  layer2_standardization: {
    canonical_name: string;
    category: string;
  };
  layer3_knowledge_retrieval: {
    canonical_name: string;
    category: string;
    co2e_kg: number;
    source: string;
    confidence: string;
  };
  layer4_footprint_estimation: {
    total_co2e_kg: number;
    breakdown: {
      production: number;
      packaging: number;
      transport: number;
    };
    formula: string;
    notes: string;
    canonical_name: string;
    source: string;
    confidence: string;
  };
  layer5_final_summary: string;
}

interface UploadedImage {
  file: File;
  preview: string;
}

const CarbonFootprint: React.FC = () => {
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<CarbonFootprintData | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isBackendConnected, setIsBackendConnected] = useState<boolean | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check backend connectivity on component mount
  useEffect(() => {
    checkBackendHealth();
  }, []);

  const checkBackendHealth = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/health');
      if (response.ok) {
        setIsBackendConnected(true);
      } else {
        setIsBackendConnected(false);
      }
    } catch (error) {
      setIsBackendConnected(false);
    }
  };

  const testWithSampleImage = async () => {
    setIsAnalyzing(true);
    setCurrentStep(0);
    setError(null);
    
    try {
      // Simulate progress through the steps
      const progressInterval = setInterval(() => {
        setCurrentStep(prev => {
          if (prev < analysisSteps.length - 1) {
            return prev + 1;
          }
          return prev;
        });
      }, 800);
      
      // Call the test endpoint
      const response = await fetch('http://localhost:5001/api/test', {
        method: 'POST',
      });
      
      clearInterval(progressInterval);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Test analysis failed');
      }
      
      const results = await response.json();
      
      // Ensure we complete all steps
      setCurrentStep(analysisSteps.length - 1);
      
      // Transform the backend response
      const transformedResults: CarbonFootprintData = {
        layer1_input_processing: results.layer1_input_processing,
        layer2_standardization: results.layer2_standardization,
        layer3_knowledge_retrieval: results.layer3_knowledge_retrieval,
        layer4_footprint_estimation: results.layer4_footprint_estimation,
        layer5_final_summary: results.layer5_final_summary
      };
      
      await new Promise(resolve => setTimeout(resolve, 500));
      setAnalysisResults(transformedResults);
      
    } catch (err) {
      console.error('Test analysis error:', err);
      setError(err instanceof Error ? err.message : 'Failed to run test analysis. Please ensure the backend server is running.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const analysisSteps = [
    { label: 'Image Processing', icon: Camera, description: 'Analyzing product image...' },
    { label: 'Entity Standardization', icon: Target, description: 'Standardizing product information...' },
    { label: 'Knowledge Retrieval', icon: BarChart3, description: 'Retrieving carbon footprint data...' },
    { label: 'Footprint Estimation', icon: Leaf, description: 'Calculating detailed breakdown...' },
    { label: 'Final Summary', icon: Check, description: 'Generating complete analysis...' }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4
      }
    },
    hover: {
      scale: 1.02,
      transition: {
        duration: 0.2
      }
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      handleImageUpload(imageFile);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handleImageUpload(file);
    }
  };

  const handleImageUpload = (file: File) => {
    const preview = URL.createObjectURL(file);
    setUploadedImage({ file, preview });
    setError(null);
    setAnalysisResults(null);
  };

  const startAnalysis = async () => {
    if (!uploadedImage) return;
    
    setIsAnalyzing(true);
    setCurrentStep(0);
    setError(null);
    
    try {
      // Create FormData for image upload
      const formData = new FormData();
      formData.append('image', uploadedImage.file);
      
      // Simulate progress through the steps
      const progressInterval = setInterval(() => {
        setCurrentStep(prev => {
          if (prev < analysisSteps.length - 1) {
            return prev + 1;
          }
          return prev;
        });
      }, 800);
      
      // Call the real backend API
      const response = await fetch('http://localhost:5001/api/analyze', {
        method: 'POST',
        body: formData,
      });
      
      clearInterval(progressInterval);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Analysis failed');
      }
      
      const results = await response.json();
      
      // Ensure we complete all steps
      setCurrentStep(analysisSteps.length - 1);
      
      // Transform the backend response to match our interface
      const transformedResults: CarbonFootprintData = {
        layer1_input_processing: results.layer1_input_processing || {
          type: "product_photo",
          product_name: uploadedImage.file.name.split('.')[0],
          brand: "Detected Brand",
          specifications: {
            net_weight: "Unknown",
            calories_per_pkg: "Unknown"
          }
        },
        layer2_standardization: results.layer2_standardization || {
          canonical_name: uploadedImage.file.name.split('.')[0],
          category: "Unknown"
        },
        layer3_knowledge_retrieval: results.layer3_knowledge_retrieval || {
          canonical_name: uploadedImage.file.name.split('.')[0],
          category: "Unknown",
          co2e_kg: 0,
          source: "Unknown",
          confidence: "Low"
        },
        layer4_footprint_estimation: results.layer4_footprint_estimation || {
          total_co2e_kg: 0,
          breakdown: {
            production: 0,
            packaging: 0,
            transport: 0
          },
          formula: "Total = Production + Packaging + Transport",
          notes: "Analysis failed",
          canonical_name: uploadedImage.file.name.split('.')[0],
          source: "Unknown",
          confidence: "Low"
        },
        layer5_final_summary: results.layer5_final_summary || "Analysis failed"
      };
      
      // Add a final pause for dramatic effect
      await new Promise(resolve => setTimeout(resolve, 500));
      setAnalysisResults(transformedResults);
      
    } catch (err) {
      console.error('Analysis error:', err);
      
      // If backend is not available, fall back to demo mode
      if (err instanceof TypeError && err.message.includes('fetch')) {
        console.log('Backend not available, using demo mode...');
        setIsBackendConnected(false);
        
        // Run demo analysis
        await runDemoAnalysis();
      } else {
        setError(err instanceof Error ? err.message : 'Failed to analyze image. Please try again.');
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const runDemoAnalysis = async () => {
    // Complete the remaining steps with proper timing
    const totalSteps = analysisSteps.length;
    for (let step = 0; step < totalSteps; step++) {
      setCurrentStep(step);
      await new Promise(resolve => setTimeout(resolve, 800));
    }
    
    // Generate demo results
    const imageSize = uploadedImage?.file.size || 100000;
    const baseFootprint = 0.075;
    const variation = (Math.random() - 0.5) * 0.03;
    const totalFootprint = Math.max(0.01, baseFootprint + variation);
    
    const productionRatio = 0.55 + (Math.random() - 0.5) * 0.1;
    const packagingRatio = 0.25 + (Math.random() - 0.5) * 0.1;
    const transportRatio = 1 - productionRatio - packagingRatio;
    
    const production = totalFootprint * productionRatio;
    const packaging = totalFootprint * packagingRatio;
    const transport = totalFootprint * transportRatio;
    
    const confidence = imageSize > 500000 ? 'High' : imageSize > 100000 ? 'Medium' : 'Low';
    
    const demoResults: CarbonFootprintData = {
      layer1_input_processing: {
        type: "product_photo",
        product_name: `${uploadedImage?.file.name.split('.')[0] || 'Sample'} (Demo)`,
        brand: "Demo Brand",
        specifications: {
          net_weight: `${(Math.random() * 200 + 50).toFixed(0)}g`,
          calories_per_pkg: `${(Math.random() * 300 + 100).toFixed(0)}`
        }
      },
      layer2_standardization: {
        canonical_name: `${uploadedImage?.file.name.split('.')[0] || 'Sample'} Product (Demo)`,
        category: "Food & Beverage"
      },
      layer3_knowledge_retrieval: {
        canonical_name: `${uploadedImage?.file.name.split('.')[0] || 'Sample'} Product (Demo)`,
        category: "Food & Beverage",
        co2e_kg: totalFootprint,
        source: "Demo Environmental Database",
        confidence: confidence
      },
      layer4_footprint_estimation: {
        total_co2e_kg: totalFootprint,
        breakdown: {
          production: Math.round(production * 1000) / 1000,
          packaging: Math.round(packaging * 1000) / 1000,
          transport: Math.round(transport * 1000) / 1000
        },
        formula: "Total = Production + Packaging + Transport",
        notes: "Demo analysis - Start backend for real AI analysis",
        canonical_name: `${uploadedImage?.file.name.split('.')[0] || 'Sample'} Product (Demo)`,
        source: "Demo Environmental Database",
        confidence: confidence
      },
      layer5_final_summary: `🌱 **DEMO CARBON FOOTPRINT ANALYSIS** 🌱\n\n**Product:** ${uploadedImage?.file.name.split('.')[0] || 'Sample'} Product\n**Total Carbon Footprint:** ${totalFootprint.toFixed(3)} kg CO₂e\n\n*Start the backend server for real AI analysis*`
    };
    
    setAnalysisResults(demoResults);
  };

  const resetAnalysis = () => {
    setUploadedImage(null);
    setAnalysisResults(null);
    setIsAnalyzing(false);
    setCurrentStep(0);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getBreakdownPercentage = (value: number, total: number) => {
    return ((value / total) * 100).toFixed(1);
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence.toLowerCase()) {
      case 'high': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'low': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <div className="carbon-footprint">
      <div className="carbon-header">
        <motion.div 
          className="header-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="header-icon">
            <Leaf size={32} />
          </div>
          <div className="header-text">
            <h1>Carbon Footprint Analyzer</h1>
            <p>Upload a product image to get instant carbon footprint analysis</p>
            <div className="backend-status">
              {isBackendConnected === true && (
                <div className="status-connected">
                  <Check size={16} />
                  <span>Backend Connected</span>
                </div>
              )}
              {isBackendConnected === false && (
                <div className="status-disconnected">
                  <AlertCircle size={16} />
                  <span>Backend Offline - Using Demo Mode</span>
                </div>
              )}
              {isBackendConnected === null && (
                <div className="status-checking">
                  <div className="loader-spinner small"></div>
                  <span>Checking Connection...</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      <div className="carbon-content">
        <AnimatePresence mode="wait">
          {!uploadedImage && !analysisResults && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="upload-section"
            >
              <div 
                className={`upload-zone ${isDragOver ? 'drag-over' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="upload-content">
                  <div className="upload-icon">
                    <Upload size={48} />
                  </div>
                  <h3>Drop your product image here</h3>
                  <p>Or click to browse files</p>
                  <div className="supported-formats">
                    <span>Supports: JPG, PNG, WEBP</span>
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileInput}
                  style={{ display: 'none' }}
                />
              </div>

              <motion.div 
                className="features-grid"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div 
                  className="feature-card"
                  variants={cardVariants}
                  whileHover="hover"
                >
                  <motion.div 
                    className="feature-icon"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Camera size={24} />
                  </motion.div>
                  <h4>AI Image Analysis</h4>
                  <p>Advanced AI processes your product image to extract detailed information</p>
                </motion.div>
                <motion.div 
                  className="feature-card"
                  variants={cardVariants}
                  whileHover="hover"
                >
                  <motion.div 
                    className="feature-icon"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  >
                    <BarChart3 size={24} />
                  </motion.div>
                  <h4>Detailed Breakdown</h4>
                  <p>Get comprehensive carbon footprint analysis across production, packaging, and transport</p>
                </motion.div>
                <motion.div 
                  className="feature-card"
                  variants={cardVariants}
                  whileHover="hover"
                >
                  <motion.div 
                    className="feature-icon"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                  >
                    <Leaf size={24} />
                  </motion.div>
                  <h4>Environmental Impact</h4>
                  <p>Understand the complete environmental impact of your product choices</p>
                </motion.div>
              </motion.div>
              
              {isBackendConnected && (
                <motion.div 
                  className="test-section"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="test-card">
                    <h4>Try Sample Analysis</h4>
                    <p>Test the carbon footprint analyzer with our sample product image</p>
                    <motion.button 
                      className="test-btn"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={testWithSampleImage}
                      disabled={isAnalyzing}
                    >
                      <Zap size={16} />
                      {isAnalyzing ? 'Analyzing...' : 'Run Sample Analysis'}
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {uploadedImage && !isAnalyzing && !analysisResults && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="image-preview-section"
            >
              <div className="preview-card">
                <div className="preview-header">
                  <h3>Ready to Analyze</h3>
                  <button className="close-btn" onClick={resetAnalysis}>
                    <X size={20} />
                  </button>
                </div>
                <div className="preview-image">
                  <img src={uploadedImage.preview} alt="Product preview" />
                </div>
                <div className="preview-info">
                  <p><strong>File:</strong> {uploadedImage.file.name}</p>
                  <p><strong>Size:</strong> {(uploadedImage.file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <motion.button 
                  className="analyze-btn"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={startAnalysis}
                >
                  <Zap size={20} />
                  Start Carbon Analysis
                </motion.button>
              </div>
            </motion.div>
          )}

          {isAnalyzing && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="analyzing-section"
            >
              <div className="analysis-progress">
                <div className="progress-header">
                  <h3>Analyzing Carbon Footprint</h3>
                  <p>Processing through our 5-layer AI pipeline...</p>
                </div>
                
                <div className="steps-progress">
                  {analysisSteps.map((step, index) => {
                    const StepIcon = step.icon;
                    const isActive = index === currentStep;
                    const isCompleted = index < currentStep;
                    
                    return (
                      <div key={index} className={`step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
                        <div className="step-icon">
                          <StepIcon size={24} />
                        </div>
                        <div className="step-content">
                          <h4>{step.label}</h4>
                          <p>{step.description}</p>
                        </div>
                        {isActive && (
                          <div className="step-loader">
                            <div className="loader-spinner"></div>
                          </div>
                        )}
                        {isCompleted && (
                          <div className="step-check">
                            <Check size={16} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {analysisResults && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              className="results-section"
            >
              <div className="results-header">
                <div className="results-title">
                  <h3>Carbon Footprint Analysis Complete</h3>
                  <div className="confidence-badge" style={{ 
                    backgroundColor: `${getConfidenceColor(analysisResults.layer4_footprint_estimation.confidence)}20`,
                    color: getConfidenceColor(analysisResults.layer4_footprint_estimation.confidence)
                  }}>
                    {analysisResults.layer4_footprint_estimation.confidence} Confidence
                  </div>
                </div>
                <div className="results-actions">
                  <button className="action-btn">
                    <Download size={16} />
                    Export
                  </button>
                  <button className="action-btn">
                    <Share2 size={16} />
                    Share
                  </button>
                  <button className="action-btn" onClick={resetAnalysis}>
                    <X size={16} />
                    New Analysis
                  </button>
                </div>
              </div>

              <div className="results-grid">
                <div className="product-info-card">
                  <h4>Product Information</h4>
                  <div className="product-details">
                    <div className="detail-item">
                      <span className="label">Product:</span>
                      <span className="value">{analysisResults.layer2_standardization.canonical_name}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Category:</span>
                      <span className="value">{analysisResults.layer2_standardization.category}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Weight:</span>
                      <span className="value">{analysisResults.layer1_input_processing.specifications?.net_weight || 'Unknown'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Source:</span>
                      <span className="value">{analysisResults.layer4_footprint_estimation.source}</span>
                    </div>
                  </div>
                </div>

                <div className="total-footprint-card">
                  <div className="total-header">
                    <h4>Total Carbon Footprint</h4>
                    <Leaf size={24} />
                  </div>
                  <div className="total-value">
                    <span className="co2-amount">{analysisResults.layer4_footprint_estimation.total_co2e_kg}</span>
                    <span className="co2-unit">kg CO₂e</span>
                  </div>
                  <div className="comparison">
                    <TreePine size={16} />
                    <span>Equivalent to {(analysisResults.layer4_footprint_estimation.total_co2e_kg * 0.5).toFixed(3)} trees needed for offset</span>
                  </div>
                </div>

                <div className="breakdown-card">
                  <h4>Impact Breakdown</h4>
                  <div className="breakdown-items">
                    <div className="breakdown-item">
                      <div className="breakdown-header">
                        <div className="breakdown-icon production">
                          <Factory size={20} />
                        </div>
                        <div className="breakdown-info">
                          <span className="breakdown-label">Production</span>
                          <span className="breakdown-percentage">
                            {getBreakdownPercentage(
                              analysisResults.layer4_footprint_estimation.breakdown.production,
                              analysisResults.layer4_footprint_estimation.total_co2e_kg
                            )}%
                          </span>
                        </div>
                      </div>
                      <div className="breakdown-value">
                        {analysisResults.layer4_footprint_estimation.breakdown.production} kg CO₂e
                      </div>
                      <div className="breakdown-bar">
                        <div 
                          className="breakdown-fill production"
                          style={{ 
                            width: `${getBreakdownPercentage(
                              analysisResults.layer4_footprint_estimation.breakdown.production,
                              analysisResults.layer4_footprint_estimation.total_co2e_kg
                            )}%` 
                          }}
                        />
                      </div>
                    </div>

                    <div className="breakdown-item">
                      <div className="breakdown-header">
                        <div className="breakdown-icon packaging">
                          <Package size={20} />
                        </div>
                        <div className="breakdown-info">
                          <span className="breakdown-label">Packaging</span>
                          <span className="breakdown-percentage">
                            {getBreakdownPercentage(
                              analysisResults.layer4_footprint_estimation.breakdown.packaging,
                              analysisResults.layer4_footprint_estimation.total_co2e_kg
                            )}%
                          </span>
                        </div>
                      </div>
                      <div className="breakdown-value">
                        {analysisResults.layer4_footprint_estimation.breakdown.packaging} kg CO₂e
                      </div>
                      <div className="breakdown-bar">
                        <div 
                          className="breakdown-fill packaging"
                          style={{ 
                            width: `${getBreakdownPercentage(
                              analysisResults.layer4_footprint_estimation.breakdown.packaging,
                              analysisResults.layer4_footprint_estimation.total_co2e_kg
                            )}%` 
                          }}
                        />
                      </div>
                    </div>

                    <div className="breakdown-item">
                      <div className="breakdown-header">
                        <div className="breakdown-icon transport">
                          <Truck size={20} />
                        </div>
                        <div className="breakdown-info">
                          <span className="breakdown-label">Transport</span>
                          <span className="breakdown-percentage">
                            {getBreakdownPercentage(
                              analysisResults.layer4_footprint_estimation.breakdown.transport,
                              analysisResults.layer4_footprint_estimation.total_co2e_kg
                            )}%
                          </span>
                        </div>
                      </div>
                      <div className="breakdown-value">
                        {analysisResults.layer4_footprint_estimation.breakdown.transport} kg CO₂e
                      </div>
                      <div className="breakdown-bar">
                        <div 
                          className="breakdown-fill transport"
                          style={{ 
                            width: `${getBreakdownPercentage(
                              analysisResults.layer4_footprint_estimation.breakdown.transport,
                              analysisResults.layer4_footprint_estimation.total_co2e_kg
                            )}%` 
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="recommendations-card">
                  <h4>Recommendations</h4>
                  <div className="recommendations">
                    <div className="recommendation">
                      <div className="rec-icon">
                        <Recycle size={16} />
                      </div>
                      <span>Look for products with minimal packaging</span>
                    </div>
                    <div className="recommendation">
                      <div className="rec-icon">
                        <TrendingUp size={16} />
                      </div>
                      <span>Choose locally produced alternatives</span>
                    </div>
                    <div className="recommendation">
                      <div className="rec-icon">
                        <Leaf size={16} />
                      </div>
                      <span>Consider organic or sustainable options</span>
                    </div>
                  </div>
                </div>
              </div>

              {error && (
                <div className="error-message">
                  <AlertCircle size={20} />
                  <span>{error}</span>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CarbonFootprint;