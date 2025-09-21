import os
import json
import requests # Using requests library for HTTP calls

class GeminiClient:
    """
    A client to interact with the Google Gemini API.
    """
    def __init__(self, api_key=None):
        # Use the provided API key or get from environment
        self.api_key = api_key or os.environ.get("GEMINI_API_KEY") or "AIzaSyAZqimBViNUgKUAXfM2i_nHnTNH-hbhQcE"
        self.api_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={self.api_key}"
    
    def safe_print(self, message):
        """Safe print function that won't crash on I/O errors"""
        try:
            print(message)
        except:
            pass
        
    def generate_content(self, prompt: str) -> dict:
        """
        Generates content using the Gemini model by sending a prompt.
        """
        try:
            self.safe_print("--- Sending Prompt to Gemini API ---")
            self.safe_print(prompt[:200] + "..." if len(prompt) > 200 else prompt)
            self.safe_print("-" * 40)
        except:
            # Ignore print errors
            pass

        # Try different model versions
        models_to_try = [
            "gemini-1.5-flash",
            "gemini-1.5-pro",
            "gemini-pro"
        ]

        # Prepare the payload for the API request
        payload = {
            "contents": [
                {
                    "parts": [
                        {"text": prompt}
                    ]
                }
            ]
        }
        
        headers = {
            'Content-Type': 'application/json'
        }
        
        for model in models_to_try:
            try:
                api_url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={self.api_key}"
                response = requests.post(api_url, headers=headers, json=payload)
                
                if response.status_code == 200:
                    self.safe_print(f"✅ Successfully used model: {model}")
                    return response.json()
                elif response.status_code == 429:
                    self.safe_print(f"⚠️ Quota exceeded for model {model}. Using simulated response.")
                    # Immediately fall back to simulated response for quota issues
                    return self._get_simulated_response()
                else:
                    self.safe_print(f"❌ Model {model} failed: {response.status_code} - {response.text[:100]}...")
                    continue
                    
            except requests.exceptions.RequestException as e:
                self.safe_print(f"❌ Request error with model {model}: {e}")
                continue
        
        self.safe_print("⚠️ All models failed, using simulated response")
        # Extract solar and battery data from the prompt for dynamic simulation
        solar_watts = 0
        battery_pct = 50
        try:
            import re
            solar_match = re.search(r'Solar Panel Production: (\d+) Watts', prompt)
            battery_match = re.search(r'Current Battery Charge: (\d+)%', prompt)
            if solar_match:
                solar_watts = int(solar_match.group(1))
            if battery_match:
                battery_pct = int(battery_match.group(1))
        except:
            pass
        
        return self._get_simulated_response(solar_watts, battery_pct)
    
    def _get_simulated_response(self, solar_watts=0, battery_pct=50) -> dict:
        """
        Returns a simulated response when the API is unavailable.
        Makes the response more dynamic based on current conditions.
        """
        self.safe_print("--- Using Simulated Response (API Unavailable) ---")
        
        # Dynamic recommendations based on current conditions
        if solar_watts > 2000:
            period = "Peak Sun (High Production)"
            power_source_heavy = "Direct Solar"
            recommendation = "Excellent time for high-power appliances. Run water heater and washing machine now."
        elif solar_watts > 500:
            period = "Moderate Sun"
            power_source_heavy = "Direct Solar"
            recommendation = "Good time for medium-power appliances. Save heavy tasks if possible."
        elif solar_watts > 100:
            period = "Low Sun"
            power_source_heavy = "Battery"
            recommendation = "Transition to battery power. Minimize non-essential usage."
        else:
            period = "Night/No Sun"
            power_source_heavy = "Battery"
            recommendation = "Use only essential appliances. Preserve battery for overnight needs."
        
        # Battery management advice
        if battery_pct > 80:
            battery_advice = "Battery well charged. Can support high-power loads if needed."
        elif battery_pct > 50:
            battery_advice = "Battery at moderate level. Monitor usage and prioritize essentials."
        else:
            battery_advice = "Battery getting low. Conserve power and avoid non-essential appliances."
        
        simulated_response = {
            "candidates": [
                {
                    "content": {
                        "parts": [
                            {
                                "text": json.dumps({
                                    "recommendation_summary": f"{recommendation} Current conditions: {period}, Battery: {battery_pct}%",
                                    "energy_allocation_plan": [
                                        {"appliance": "Refrigerator", "time_to_run": "24/7", "power_source": "Solar/Battery", "priority": "Essential"},
                                        {"appliance": "Lights (LED x5)", "time_to_run": "As needed", "power_source": "Battery" if solar_watts < 100 else "Solar", "priority": "Essential"},
                                        {"appliance": "Water Heater", "time_to_run": "During peak sun if available", "power_source": power_source_heavy, "priority": "High"},
                                        {"appliance": "Washing Machine", "time_to_run": "When solar > 2000W", "power_source": power_source_heavy, "priority": "Medium"},
                                        {"appliance": "Television", "time_to_run": "Evening (limited use)", "power_source": "Battery", "priority": "Low"},
                                        {"appliance": "Laptop Charger", "time_to_run": "Daytime preferred", "power_source": "Solar" if solar_watts > 100 else "Battery", "priority": "Medium"}
                                    ],
                                    "battery_management": f"{battery_advice} Current solar: {solar_watts}W. {'Charge mode active' if solar_watts > 1000 else 'Conservation mode - discharge minimally'}.",
                                    "alerts": [
                                        f"Current solar production: {solar_watts}W",
                                        f"Battery level: {battery_pct}%",
                                        "Demo mode active - simulated AI responses" if solar_watts >= 0 else ""
                                    ]
                                })
                            }
                        ]
                    }
                }
            ]
        }
        
        return simulated_response
