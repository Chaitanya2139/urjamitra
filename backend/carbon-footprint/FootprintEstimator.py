import os
import google.generativeai as genai
import json

# --- 1. MOCKED KNOWLEDGE SOURCES (Simulating LCA Databases) ---

# This simulates a detailed Life Cycle Assessment (LCA) database entry
# where the components are already known.
MOCK_LCA_DATABASE = {
    "t-shirt, cotton, made in india": {
        "source": "Internal LCA DB",
        "confidence": "High",
        "components": {
            "production_impact": 5.5, # Growing cotton, manufacturing
            "packaging_impact": 0.3,  # Simple plastic wrap
            "transport_impact": 1.0   # Shipping from India to US
        }
    }
}

class FootprintEstimator:
    """
    An agent that calculates a final CO2e footprint, breaking it down into
    Production, Packaging, and Transport components. It uses Gemini to

    reason about breakdowns when they are not provided.
    """

    def __init__(self, api_key):
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-1.5-flash')
        print("✅ FootprintEstimator initialized.")

    # --- 2. TOOL DEFINITIONS (The Executor) ---

    @staticmethod
    def _calculate_from_components(production_impact: float, packaging_impact: float, transport_impact: float) -> str:
        """
        Calculates the total CO2e footprint using the formula:
        Total = Production + Packaging + Transport.
        """
        print("Tool executing: ➕ Calculating total from components...")
        total_co2e = production_impact + packaging_impact + transport_impact
        
        result = {
            "total_co2e_kg": round(total_co2e, 4),
            "breakdown": {
                "production": round(production_impact, 4),
                "packaging": round(packaging_impact, 4),
                "transport": round(transport_impact, 4)
            },
            "formula": "Total = Production + Packaging + Transport"
        }
        print(f"✅ Calculation complete. Total: {total_co2e:.4f} kg")
        return json.dumps(result)

    def _breakdown_total_co2e(self, canonical_name: str, total_co2e: float, source_description: str) -> str:
        """
        Uses Gemini to intelligently estimate the breakdown of a total CO2e value
        into production, packaging, and transport components.
        """
        print(f"Tool executing: 🧠 Reasoning about breakdown for '{canonical_name}'...")
        
        prompt = f"""
        You are a Life Cycle Assessment (LCA) expert.
        A product, "{canonical_name}", has a known total carbon footprint of {total_co2e} kg CO2e, according to the source: "{source_description}".

        Your task is to provide a plausible, estimated breakdown of this total into the following three components:
        1. "production_impact": The CO2e from manufacturing the product itself (e.g., growing potatoes, frying chips).
        2. "packaging_impact": The CO2e from the product's packaging (e.g., the chip bag).
        3. "transport_impact": The CO2e from average distribution and shipping.

        The sum of your three estimated components MUST equal the total of {total_co2e} kg.

        Provide your answer ONLY as a valid JSON object with the keys "production_impact", "packaging_impact", and "transport_impact". Do not add any other text.
        Example output for a different product:
        {{
            "production_impact": 0.1,
            "packaging_impact": 0.05,
            "transport_impact": 0.02
        }}
        """
        
        response = self.model.generate_content(prompt)
        print("✅ Gemini provided an estimated breakdown.")
        
        # Clean up the response to ensure it's valid JSON
        cleaned_response = response.text.strip().replace("```json", "").replace("```", "")
        print(f"DEBUG: Cleaned response: {cleaned_response}")
        
        return cleaned_response

    # --- 3. MAIN AGENT LOGIC ---

    def estimate(self, retrieval_data: dict) -> dict:
        """
        Takes the data from the Knowledge Retrieval step and produces a final estimate.
        Returns the final result as a dictionary.
        """
        print("\n--- Starting Footprint Estimation Engine ---")
        canonical_name = retrieval_data.get('canonical_name')
        
        # Scenario 1: The data already has a detailed component breakdown (from LCA DB)
        if 'components' in retrieval_data:
            print("INFO: Found pre-existing component breakdown.")
            components = retrieval_data['components']
            final_result_json = self._calculate_from_components(
                production_impact=components.get('production_impact', 0),
                packaging_impact=components.get('packaging_impact', 0),
                transport_impact=components.get('transport_impact', 0)
            )
            final_result = json.loads(final_result_json)
            
        # Scenario 2: The data only has a total value, so we must reason
        elif 'co2e_kg' in retrieval_data:
            print("INFO: No component breakdown found. Using Gemini to reason...")
            total_co2e = retrieval_data['co2e_kg']
            source = retrieval_data.get('source', 'Unknown source')
            
            # Use Gemini to get the estimated breakdown
            estimated_breakdown_json = self._breakdown_total_co2e(
                canonical_name=canonical_name,
                total_co2e=total_co2e,
                source_description=source
            )
            
            try:
                estimated_components = json.loads(estimated_breakdown_json)
                
                # Now, use the simple calculator tool with the newly generated components
                final_result_json = self._calculate_from_components(
                    production_impact=estimated_components.get('production_impact', 0),
                    packaging_impact=estimated_components.get('packaging_impact', 0),
                    transport_impact=estimated_components.get('transport_impact', 0)
                )
                final_result = json.loads(final_result_json)
                final_result['notes'] = "Component breakdown was estimated by AI."

            except (json.JSONDecodeError, AttributeError) as e:
                print(f"❌ Error parsing Gemini's breakdown response: {e}")
                print(f"❌ Raw response was: {estimated_breakdown_json}")
                
                # Fallback: Create a simple breakdown based on typical percentages
                print("INFO: Using fallback breakdown percentages...")
                estimated_components = {
                    "production_impact": total_co2e * 0.70,  # 70% for production
                    "packaging_impact": total_co2e * 0.20,   # 20% for packaging
                    "transport_impact": total_co2e * 0.10    # 10% for transport
                }
                
                final_result_json = self._calculate_from_components(
                    production_impact=estimated_components['production_impact'],
                    packaging_impact=estimated_components['packaging_impact'],
                    transport_impact=estimated_components['transport_impact']
                )
                final_result = json.loads(final_result_json)
                final_result['notes'] = "Component breakdown used fallback percentages due to parsing error."

        else:
            print("❌ Error: Input data has neither 'components' nor 'co2e_kg'.")
            return {"error": "Input data has neither 'components' nor 'co2e_kg'."}
            
        print("\n--- Estimation Engine Finished ---")
        print("✅ Final Footprint Estimate:")
        print(json.dumps(final_result, indent=2))
        
        return final_result


# --- HOW TO RUN ---
if __name__ == "__main__":
    # Use the provided API key
    my_api_key = "AIzaSyCIe9itUnQyhF3wwuDohXCLab6bpgsTWKc"

    # Initialize the estimator
    estimator = FootprintEstimator(api_key=my_api_key)

    # Data from the KnowledgeRetriever output for Lay's Chips
    retrieved_data_lays = {
        'canonical_name': "Lay's Classic Potato Chips (1 oz)",
        'category': 'Food',
        'co2e_kg': 0.075,
        'source': 'Simulated Web Scrape (GoodFood Institute Report)',
        'confidence': 'Medium'
    }

    print("Processing data from KnowledgeRetriever:")
    print(f"Product: {retrieved_data_lays['canonical_name']}")
    print(f"Total CO2e: {retrieved_data_lays['co2e_kg']} kg")
    print(f"Source: {retrieved_data_lays['source']}")
    print(f"Confidence: {retrieved_data_lays['confidence']}")

    estimator.estimate(retrieval_data=retrieved_data_lays)
