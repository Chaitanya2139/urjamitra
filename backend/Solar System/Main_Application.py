import time
import json
from Solar_Energy_AI_Agent import SolarEnergyAgent

def main():
    """
    Main function to run the Solar Energy Management Agent simulation.
    """
    # --- Configuration ---
    BATTERY_CAPACITY_WH = 10000  # 10 kWh battery
    APPLIANCES = {
        "Refrigerator": 200,      # Watts
        "Lights (LED x5)": 50,    # Watts
        "Television": 150,        # Watts
        "Washing Machine": 2000,  # Watts (during heating cycle)
        "Water Heater": 3000,     # Watts
        "Laptop Charger": 65,     # Watts
    }

    # --- Initialize Agent ---
    agent = SolarEnergyAgent(
        battery_capacity_wh=BATTERY_CAPACITY_WH,
        appliances=APPLIANCES
    )

    # --- Simulation Loop ---
    # This loop simulates getting new data every few seconds
    simulation_data = [
        {"solar": 3500, "battery": 75}, # Peak sun
        {"solar": 1500, "battery": 95}, # Afternoon
        {"solar": 100,  "battery": 85}, # Evening
        {"solar": 0,    "battery": 70}, # Night
    ]

    print("--- Solar Energy AI Agent Simulation Starting ---")
    for i, data in enumerate(simulation_data):
        print(f"\n--- Simulation Step {i+1} ---")
        solar_production = data["solar"]
        battery_level = data["battery"]
        
        print(f"Input: Solar Production = {solar_production}W, Battery = {battery_level}%")

        # Get the management plan from the agent
        management_plan = agent.track_and_advise(solar_production, battery_level)

        # Print the structured plan
        if "error" not in management_plan:
            print("\n[AI Recommendation Summary]:")
            print(management_plan.get('recommendation_summary', 'N/A'))
            
            print("\n[Energy Allocation Plan]:")
            for item in management_plan.get('energy_allocation_plan', []):
                print(f"  - {item['appliance']} ({item['priority']}): Run {item['time_to_run']} from {item['power_source']}")
            
            print("\n[Battery Management]:")
            print(management_plan.get('battery_management', 'N/A'))
            
            print("\n[Alerts]:")
            for alert in management_plan.get('alerts', []):
                print(f"  - {alert}")
        else:
            print(f"Could not retrieve a plan: {management_plan['error']}")
        
        if i < len(simulation_data) - 1:
            print("\nWaiting for next update...")
            time.sleep(3) # Wait for 3 seconds before the next simulation step

    print("\n--- Simulation Complete ---")


if __name__ == "__main__":
    main()
