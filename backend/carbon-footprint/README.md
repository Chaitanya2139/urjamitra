# Carbon Footprint Analyzer - Backend Integration

## 🎯 Overview

This setup integrates your React frontend with the Python carbon footprint analysis pipeline to provide real-time AI-powered environmental impact analysis.

## 🚀 Quick Start

### 1. Start the Backend Server

```bash
# Navigate to the backend directory
cd backend/carbon-footprint

# Run the startup script (recommended)
./start_backend.sh
```

**OR manually:**

```bash
# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the Flask server
python3 api_server.py
```

### 2. Start the React Frontend

```bash
# In the main project directory
npm start
```

### 3. Test the Integration

1. Open http://localhost:3000 in your browser
2. Navigate to the Dashboard → Carbon Footprint
3. Click "Run Sample Analysis" to test backend connectivity
4. Upload your own images for real analysis

## 📡 API Endpoints

### Health Check
```
GET http://localhost:5000/api/health
```

### Analyze Image
```
POST http://localhost:5000/api/analyze
Content-Type: multipart/form-data
Body: image file
```

### Test with Sample
```
POST http://localhost:5000/api/test
```

## 🔧 Backend Features

- **Flask REST API** with CORS support for React frontend
- **Real AI Analysis** using your 5-layer pipeline
- **Image Upload** handling with file validation
- **Error Handling** with detailed error messages
- **Automatic Cleanup** of temporary files
- **Health Monitoring** for connection status

## 🎨 Frontend Integration

- **Real-time Connection Status** indicator
- **Fallback Demo Mode** when backend is offline
- **Progress Tracking** through analysis steps
- **Error Handling** with user-friendly messages
- **Sample Testing** without manual uploads

## 🛠 Architecture

```
Frontend (React)     →     Backend (Flask)     →     AI Pipeline
├── Image Upload     →     ├── File Handling    →     ├── Layer 1: Input Processing
├── Progress UI      →     ├── API Routing      →     ├── Layer 2: Entity Standardization  
├── Results Display  →     ├── Error Handling   →     ├── Layer 3: Knowledge Retrieval
└── Status Monitor   →     └── Response Format  →     ├── Layer 4: Footprint Estimation
                                                      └── Layer 5: Final Summary
```

## 📊 Data Flow

1. **Frontend**: User uploads image → FormData created
2. **Backend**: Receives image → Saves temporarily → Runs pipeline
3. **Pipeline**: 5-layer AI analysis → Returns structured JSON
4. **Backend**: Formats response → Cleans up files → Returns to frontend
5. **Frontend**: Displays results with interactive visualizations

## 🔍 Troubleshooting

### Backend Not Starting
- Ensure Python 3.7+ is installed
- Check if port 5000 is available
- Verify all dependencies are installed
- Check the sample image `A_bag_of_chpis.png` exists

### Frontend Shows "Backend Offline"
- Verify backend is running on http://localhost:5000
- Check browser console for CORS errors
- Ensure backend health endpoint responds

### Analysis Fails
- Check image file format (JPG, PNG, WEBP only)
- Verify file size is under 16MB
- Check backend logs for specific errors
- Ensure Gemini API key is valid

## 🔑 Configuration

### API Key Setup
Your Gemini API key is currently hardcoded in `api_server.py`. For production:

```python
# Use environment variable
API_KEY = os.getenv('GEMINI_API_KEY', 'your-default-key')
```

### CORS Settings
The backend is configured for development with:
```python
CORS(app)  # Allows all origins
```

For production, restrict to your domain:
```python
CORS(app, origins=['https://yourdomain.com'])
```

## 📝 File Structure

```
backend/carbon-footprint/
├── api_server.py           # Flask API server
├── start_backend.sh        # Startup script
├── requirements.txt        # Python dependencies
├── master_automation.py    # Your AI pipeline
├── input_layer.py         # Layer 1 components
├── EntityStandardizer.py  # Layer 2 components
├── KnowledgeRetriever.py  # Layer 3 components
├── FootprintEstimator.py  # Layer 4 components
├── CarbonFootprintAgent.py # Layer 5 components
└── A_bag_of_chpis.png     # Sample image
```

## 🌟 Features Enabled

✅ **Real AI Analysis**: Connect to your actual Python pipeline  
✅ **Live Data**: Get real carbon footprint calculations  
✅ **Image Processing**: Upload any product image  
✅ **Progress Tracking**: Watch analysis steps in real-time  
✅ **Error Handling**: Graceful fallbacks and error messages  
✅ **Demo Mode**: Works offline with simulated data  
✅ **Health Monitoring**: Connection status indicators  
✅ **Sample Testing**: Test with provided sample image  

## 🎯 Next Steps

1. **Start Backend**: Run `./start_backend.sh`
2. **Test Integration**: Use the "Run Sample Analysis" button
3. **Upload Images**: Try your own product images
4. **Monitor Results**: Compare with terminal output from your pipeline
5. **Production Setup**: Configure environment variables and CORS

Your Carbon Footprint Analyzer now has full backend integration! 🌱✨