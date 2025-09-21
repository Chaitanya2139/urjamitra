import json
from datetime import datetime
from Gemini_API_Client import GeminiClient

class SolarEnergyAgent:
    """
    An AI agent to manage solar energy production, storage, and consumption.
    """
    def __init__(self, battery_capacity_wh: float, appliances: dict):
        """
        Initializes the Solar Energy Agent.

        Args:
            battery_capacity_wh (float): The total capacity of the battery in Watt-hours.
            appliances (dict): A dictionary of appliances and their power consumption in Watts.
        """
        self.gemini_client = GeminiClient()
        self.battery_capacity_wh = battery_capacity_wh
        self.appliances = appliances
        self.energy_log = []

    def _create_prompt(self, solar_production_watts: float, battery_percentage: float) -> str:
        """
        Creates a detailed prompt for the Gemini API based on the current state.
        """
        current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        battery_wh = self.battery_capacity_wh * (battery_percentage / 100.0)

        prompt = f"""
        Act as an expert AI Solar Energy Management Agent.
        
        Current State at {current_time}:
        - Solar Panel Production: {solar_production_watts} Watts
        - Battery Capacity: {self.battery_capacity_wh} Wh
        - Current Battery Charge: {battery_percentage}% ({battery_wh:.2f} Wh)

        List of available electrical appliances and their power draw:
        {json.dumps(self.appliances, indent=2)}

        Previous Energy Log (last 3 entries):
        {json.dumps(self.energy_log[-3:], indent=2)}

        Task:
        Provide a detailed energy management plan in a structured JSON format. 
        
        IMPORTANT: Respond ONLY with valid JSON, no other text or explanations.
        
        The JSON should include:
        1.  `recommendation_summary`: A brief, actionable summary.
        2.  `energy_allocation_plan`: A list of dictionaries, where each dictionary contains `appliance`, `time_to_run`, `power_source` (Direct Solar or Battery), and `priority` (Essential, High, Medium, Low).
        3.  `battery_management`: Specific instructions on when to charge or discharge the battery.
        4.  `alerts`: Any important alerts for the user (e.g., "Low production forecast", "Excess energy available").
        
        Prioritize running high-power appliances directly from solar during peak production.
        Use the battery for essential loads when solar production is low or at night.
        Ensure the battery is preserved for essential needs.
        """
        return prompt.strip()

    def track_and_advise(self, solar_production_watts: float, battery_percentage: float):
        """
        Tracks the current energy state and gets advice from the Gemini API.

        Args:
            solar_production_watts (float): Current power being produced by solar panels.
            battery_percentage (float): Current battery charge percentage.
        """
        # Log the current state
        log_entry = {
            "timestamp": datetime.now().isoformat(),
            "solar_production_watts": solar_production_watts,
            "battery_percentage": battery_percentage
        }
        self.energy_log.append(log_entry)

        # Create the prompt and get recommendations
        prompt = self._create_prompt(solar_production_watts, battery_percentage)
        response = self.gemini_client.generate_content(prompt)

        if response and response.get("candidates"):
            try:
                # Extract the JSON text and parse it
                response_text = response["candidates"][0]["content"]["parts"][0]["text"]
                print(f"Raw API Response: {response_text[:500]}...")
                
                # Try to extract JSON from the response (in case there's extra text)
                import re
                json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
                if json_match:
                    json_text = json_match.group(0)
                    plan = json.loads(json_text)
                    return plan
                else:
                    # If no JSON found, try parsing the whole response
                    plan = json.loads(response_text)
                    return plan
                    
            except (json.JSONDecodeError, KeyError, IndexError) as e:
                print(f"Error parsing Gemini response: {e}")
                print(f"Raw response was: {response}")
                # Fall back to simulated response if parsing fails
                from Gemini_API_Client import GeminiClient
                client = GeminiClient()
                return json.loads(client._get_simulated_response(solar_production_watts, battery_percentage)["candidates"][0]["content"]["parts"][0]["text"])
        else:
            return {"error": "No response from Gemini API."}
