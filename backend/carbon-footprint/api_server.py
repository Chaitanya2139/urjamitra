#!/usr/bin/env python3
"""
Flask API Server for Carbon Footprint Analysis

This server provides REST API endpoints for the React frontend to interact
with the carbon footprint analysis pipeline.
"""

import os
import sys
import json
import tempfile
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
import traceback

# Add the backend directory to the path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Import the pipeline
from master_automation import CarbonFootprintPipeline

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Configuration
API_KEY = "AIzaSyAZqimBViNUgKUAXfM2i_nHnTNH-hbhQcE"  # Your Gemini API key
UPLOAD_FOLDER = tempfile.gettempdir()
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'message': 'Carbon Footprint API is running',
        'version': '1.0.0'
    })

@app.route('/api/analyze', methods=['POST'])
def analyze_carbon_footprint():
    """
    Main endpoint to analyze carbon footprint from uploaded image
    
    Expects:
    - image file in form-data with key 'image'
    
    Returns:
    - JSON with complete pipeline results
    """
    try:
        # Check if image file is present
        if 'image' not in request.files:
            return jsonify({
                'error': 'No image file provided',
                'message': 'Please upload an image file'
            }), 400
        
        file = request.files['image']
        
        # Check if file is selected
        if file.filename == '':
            return jsonify({
                'error': 'No file selected',
                'message': 'Please select a file to upload'
            }), 400
        
        # Check file extension
        if not allowed_file(file.filename):
            return jsonify({
                'error': 'Invalid file type',
                'message': f'Please upload files with extensions: {", ".join(ALLOWED_EXTENSIONS)}'
            }), 400
        
        # Save the uploaded file temporarily
        filename = secure_filename(file.filename)
        temp_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(temp_path)
        
        try:
            # Initialize the pipeline
            print(f"🚀 Starting analysis for: {filename}")
            pipeline = CarbonFootprintPipeline(API_KEY)
            
            # Run the complete pipeline
            results = pipeline.run_complete_pipeline(temp_path)
            
            # Check for errors in results
            if 'error' in results:
                return jsonify({
                    'error': 'Analysis failed',
                    'message': results.get('details', 'Unknown error occurred'),
                    'stage': results.get('error', 'Unknown stage')
                }), 500
            
            # Add metadata
            results['metadata'] = {
                'filename': filename,
                'analysis_timestamp': datetime.now().isoformat(),
                'api_version': '1.0.0'
            }
            
            print(f"✅ Analysis completed successfully for: {filename}")
            return jsonify(results)
            
        finally:
            # Clean up the temporary file
            try:
                os.remove(temp_path)
                print(f"🧹 Cleaned up temporary file: {temp_path}")
            except OSError:
                pass  # File might already be deleted
    
    except Exception as e:
        print(f"❌ Error in analyze_carbon_footprint: {e}")
        print(f"📍 Traceback: {traceback.format_exc()}")
        
        return jsonify({
            'error': 'Internal server error',
            'message': 'An unexpected error occurred during analysis',
            'details': str(e) if app.debug else 'Contact support for assistance'
        }), 500

@app.route('/api/test', methods=['POST'])
def test_analysis():
    """
    Test endpoint using the sample image from the backend directory
    
    Returns:
    - JSON with complete pipeline results using A_bag_of_chpis.png
    """
    try:
        # Use the sample image file
        sample_image_path = os.path.join(os.path.dirname(__file__), 'A_bag_of_chpis.png')
        
        if not os.path.exists(sample_image_path):
            return jsonify({
                'error': 'Sample image not found',
                'message': 'A_bag_of_chpis.png not found in backend directory'
            }), 404
        
        # Initialize the pipeline
        print(f"🚀 Starting test analysis with sample image")
        pipeline = CarbonFootprintPipeline(API_KEY)
        
        # Run the complete pipeline
        results = pipeline.run_complete_pipeline(sample_image_path)
        
        # Check for errors in results
        if 'error' in results:
            return jsonify({
                'error': 'Test analysis failed',
                'message': results.get('details', 'Unknown error occurred'),
                'stage': results.get('error', 'Unknown stage')
            }), 500
        
        # Add metadata
        results['metadata'] = {
            'filename': 'A_bag_of_chpis.png',
            'analysis_timestamp': datetime.now().isoformat(),
            'api_version': '1.0.0',
            'test_mode': True
        }
        
        print(f"✅ Test analysis completed successfully")
        return jsonify(results)
        
    except Exception as e:
        print(f"❌ Error in test_analysis: {e}")
        print(f"📍 Traceback: {traceback.format_exc()}")
        
        return jsonify({
            'error': 'Test analysis failed',
            'message': 'An unexpected error occurred during test analysis',
            'details': str(e) if app.debug else 'Contact support for assistance'
        }), 500

@app.errorhandler(413)
def too_large(e):
    """Handle file too large error"""
    return jsonify({
        'error': 'File too large',
        'message': 'Maximum file size is 16MB'
    }), 413

@app.errorhandler(404)
def not_found(e):
    """Handle 404 errors"""
    return jsonify({
        'error': 'Endpoint not found',
        'message': 'The requested API endpoint does not exist'
    }), 404

@app.errorhandler(500)
def internal_error(e):
    """Handle internal server errors"""
    return jsonify({
        'error': 'Internal server error',
        'message': 'An unexpected error occurred on the server'
    }), 500

if __name__ == '__main__':
    print("🌱 Starting Carbon Footprint Analysis API Server...")
    print("📡 API Endpoints:")
    print("   GET  /api/health     - Health check")
    print("   POST /api/analyze    - Analyze uploaded image")
    print("   POST /api/test       - Test with sample image")
    print("\n🚀 Server starting on http://localhost:5001")
    
    # Run the Flask app
    app.run(
        host='0.0.0.0',
        port=5001,
        debug=True,  # Set to False in production
        threaded=True
    )