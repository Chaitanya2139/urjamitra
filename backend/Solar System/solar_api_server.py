#!/usr/bin/env python3
"""
Flask API Server for Solar Energy Management

This server provides REST API endpoints for the React frontend to interact
with the solar energy AI agent pipeline.
"""

import os
import sys
import json
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
import traceback

# Add the backend directory to the path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Import the solar energy components
from Solar_Energy_AI_Agent import SolarEnergyAgent
from Gemini_API_Client import GeminiClient

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Configuration
API_KEY = "AIzaSyCIe9itUnQyhF3wwuDohXCLab6bpgsTWKc"  # Your Gemini API key

# Global agent instance
solar_agent = None

def initialize_agent(battery_capacity_wh=10000, appliances=None):
    """Initialize the solar energy agent"""
    global solar_agent
    
    if appliances is None:
        appliances = {
            "Refrigerator": 200,
            "Lights (LED x5)": 50,
            "Television": 150,
            "Washing Machine": 2000,
            "Water Heater": 3000,
            "Laptop Charger": 65,
        }
    
    solar_agent = SolarEnergyAgent(
        battery_capacity_wh=battery_capacity_wh,
        appliances=appliances
    )
    return solar_agent

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'message': 'Solar Energy API is running',
        'version': '1.0.0'
    })

@app.route('/api/solar/analyze', methods=['POST'])
def analyze_solar_energy():
    """
    Analyze current solar energy state and get AI recommendations
    
    Expected JSON payload:
    {
        "solar_production": 2500,  # Watts
        "battery_percentage": 75,  # Percentage
        "battery_capacity": 10000, # Wh (optional, defaults to 10000)
        "appliances": {            # Optional custom appliances
            "Device Name": power_watts
        }
    }
    """
    try:
        # Get JSON data from request
        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'error': 'No JSON data provided'
            }), 400
        
        # Extract required fields
        solar_production = data.get('solar_production')
        battery_percentage = data.get('battery_percentage')
        
        if solar_production is None or battery_percentage is None:
            return jsonify({
                'success': False,
                'error': 'Missing required fields: solar_production and battery_percentage'
            }), 400
        
        # Optional fields
        battery_capacity = data.get('battery_capacity', 10000)
        custom_appliances = data.get('appliances')
        
        # Initialize or update agent with current configuration
        global solar_agent
        current_appliances = custom_appliances if custom_appliances else None
        solar_agent = initialize_agent(battery_capacity, current_appliances)
        
        # Get AI recommendations
        management_plan = solar_agent.track_and_advise(
            solar_production_watts=float(solar_production),
            battery_percentage=float(battery_percentage)
        )
        
        # Return the management plan
        return jsonify({
            'success': True,
            'timestamp': datetime.now().isoformat(),
            'input': {
                'solar_production_watts': solar_production,
                'battery_percentage': battery_percentage,
                'battery_capacity_wh': battery_capacity
            },
            'management_plan': management_plan
        })
        
    except Exception as e:
        # Log the full error for debugging
        error_trace = traceback.format_exc()
        print(f"Error in solar analysis: {error_trace}")
        
        return jsonify({
            'success': False,
            'error': f'Internal server error: {str(e)}',
            'details': error_trace if app.debug else 'Enable debug mode for details'
        }), 500

@app.route('/api/solar/simulate', methods=['POST'])
def run_simulation():
    """
    Run a full simulation with multiple data points
    
    Expected JSON payload:
    {
        "battery_capacity": 10000,  # Wh (optional)
        "appliances": {             # Optional custom appliances
            "Device Name": power_watts
        },
        "simulation_data": [        # Array of simulation points
            {"solar": 3500, "battery": 75},
            {"solar": 1500, "battery": 95},
            {"solar": 100, "battery": 85},
            {"solar": 0, "battery": 70}
        ]
    }
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'error': 'No JSON data provided'
            }), 400
        
        # Extract configuration
        battery_capacity = data.get('battery_capacity', 10000)
        custom_appliances = data.get('appliances')
        simulation_data = data.get('simulation_data', [])
        
        if not simulation_data:
            return jsonify({
                'success': False,
                'error': 'No simulation data provided'
            }), 400
        
        # Initialize agent
        solar_agent = initialize_agent(battery_capacity, custom_appliances)
        
        # Run simulation
        simulation_results = []
        
        for i, point in enumerate(simulation_data):
            solar_production = point.get('solar', 0)
            battery_level = point.get('battery', 50)
            
            management_plan = solar_agent.track_and_advise(solar_production, battery_level)
            
            simulation_results.append({
                'step': i + 1,
                'input': {
                    'solar_production_watts': solar_production,
                    'battery_percentage': battery_level
                },
                'management_plan': management_plan
            })
        
        return jsonify({
            'success': True,
            'timestamp': datetime.now().isoformat(),
            'configuration': {
                'battery_capacity_wh': battery_capacity,
                'appliances': solar_agent.appliances if solar_agent else {}
            },
            'simulation_results': simulation_results
        })
        
    except Exception as e:
        error_trace = traceback.format_exc()
        print(f"Error in solar simulation: {error_trace}")
        
        return jsonify({
            'success': False,
            'error': f'Internal server error: {str(e)}',
            'details': error_trace if app.debug else 'Enable debug mode for details'
        }), 500

@app.route('/api/solar/config', methods=['GET', 'POST'])
def handle_configuration():
    """
    GET: Get current agent configuration
    POST: Update agent configuration
    """
    global solar_agent
    
    if request.method == 'GET':
        if not solar_agent:
            solar_agent = initialize_agent()
        
        return jsonify({
            'success': True,
            'configuration': {
                'battery_capacity_wh': solar_agent.battery_capacity_wh,
                'appliances': solar_agent.appliances,
                'energy_log_count': len(solar_agent.energy_log)
            }
        })
    
    elif request.method == 'POST':
        try:
            data = request.get_json()
            battery_capacity = data.get('battery_capacity', 10000)
            appliances = data.get('appliances', {})
            
            solar_agent = initialize_agent(battery_capacity, appliances)
            
            return jsonify({
                'success': True,
                'message': 'Configuration updated successfully',
                'configuration': {
                    'battery_capacity_wh': solar_agent.battery_capacity_wh,
                    'appliances': solar_agent.appliances
                }
            })
            
        except Exception as e:
            return jsonify({
                'success': False,
                'error': f'Failed to update configuration: {str(e)}'
            }), 500

@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    return jsonify({
        'success': False,
        'error': 'Endpoint not found'
    }), 404

@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors"""
    return jsonify({
        'success': False,
        'error': 'Internal server error'
    }), 500

if __name__ == '__main__':
    print("🌞 Starting Solar Energy API Server...")
    print("📊 Available endpoints:")
    print("  GET  /api/health - Health check")
    print("  POST /api/solar/analyze - Analyze current solar state")
    print("  POST /api/solar/simulate - Run full simulation")
    print("  GET  /api/solar/config - Get current configuration")
    print("  POST /api/solar/config - Update configuration")
    print("\n🚀 Server starting on http://localhost:5002")
    
    # Initialize the agent on startup
    initialize_agent()
    
    app.run(
        host='0.0.0.0',
        port=5002,
        debug=True
    )