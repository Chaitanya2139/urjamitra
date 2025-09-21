import os
import google.generativeai as genai
import json

# This class encapsulates the entire 5-layer pipeline into a single agent.
class CarbonFootprintAgent:
    """
    A master agent that orchestrates the entire carbon footprint calculation
    pipeline using a Planner-Executor model with Gemini function calling.
    """

    def __init__(self, api_key):
        genai.configure(api_key=api_key)
        # Use a simple model for text generation instead of function calling
        self.model = genai.GenerativeModel('gemini-1.5-flash')
        print("✅ Master CarbonFootprintAgent Initialized.")
        print("   Pipeline: [Entity Standardization -> Knowledge Retrieval -> Footprint Estimation -> Summary Generation]")


    # --- LAYER 2 TOOL: Entity Standardization ---
    def _standardize_entity(self, raw_text: str) -> str:
        """
        Takes raw text, calls Gemini to normalize it into a canonical name and category.
        (Simulates Layer 2)
        """
        print(f"\nTool executing: 📝 Layer 2: Standardizing '{raw_text}'...")
        prompt = f"""
        Analyze the text "{raw_text}".
        1. Normalize it into a canonical product name (e.g., "Lay's Classic Potato Chips (1 oz)").
        2. Assign it a category (e.g., "Food", "Electronics").
        Return a JSON object with keys "canonical_name" and "category".
        """
        response = self.model.generate_content(prompt)
        print("✅ Standardization complete.")
        
        # Clean up the response to ensure it's valid JSON
        cleaned_response = response.text.strip().replace("```json", "").replace("```", "")
        return cleaned_response

    # --- LAYER 3 TOOL: Knowledge Retrieval ---
    def _retrieve_knowledge(self, canonical_name: str, category: str) -> str:
        """
        Retrieves carbon data for a standardized entity.
        For this demo, it mocks the DB->Web->Fallback logic.
        (Simulates Layer 3)
        """
        print(f"\nTool executing: 📚 Layer 3: Retrieving knowledge for '{canonical_name}'...")
        # Mocking the decision loop from Layer 3
        if "lay's classic potato chips" in canonical_name.lower():
            print("   -> Decision: Found via (simulated) web search.")
            result = {
                "co2e_kg": 0.075,
                "source": "Simulated Web Scrape",
                "confidence": "Medium"
            }
            return json.dumps(result)
        else:
            print("   -> Decision: Using (simulated) category fallback.")
            result = {"co2e_kg": 1.5, "source": "Category Fallback", "confidence": "Low"}
            return json.dumps(result)

    # --- LAYER 4 TOOL: Footprint Estimation ---
    def _estimate_footprint_breakdown(self, retrieved_data_json: str) -> str:
        """
        Takes retrieved data and creates a detailed breakdown.
        Uses Gemini for reasoning if a breakdown is not present.
        (Simulates Layer 4)
        """
        print("\nTool executing: 📊 Layer 4: Estimating footprint breakdown...")
        data = json.loads(retrieved_data_json)
        total_co2e = data.get("co2e_kg")
        
        prompt = f"""
        Given a total carbon footprint of {total_co2e} kg CO2e, provide a plausible
        breakdown into "production_impact", "packaging_impact", and "transport_impact".
        The sum must equal {total_co2e}.
        Return ONLY the JSON object of the breakdown.
        """
        response = self.model.generate_content(prompt)
        
        # Clean up the response and handle potential parsing issues
        cleaned_response = response.text.strip().replace("```json", "").replace("```", "")
        
        try:
            breakdown = json.loads(cleaned_response)
        except json.JSONDecodeError:
            # Fallback breakdown if parsing fails
            print("⚠️ Using fallback breakdown due to parsing error")
            breakdown = {
                "production_impact": total_co2e * 0.60,
                "packaging_impact": total_co2e * 0.20,
                "transport_impact": total_co2e * 0.20
            }
        
        # Now, we assemble the final estimation object from Layer 4
        final_estimate = {
            "total_co2e_kg": total_co2e,
            "breakdown": breakdown,
            "notes": "Component breakdown was estimated by AI."
        }
        print("✅ Estimation complete.")
        return json.dumps(final_estimate)

    # --- FINAL PRESENTATION TOOL ---
    def _generate_final_summary(self, final_data_json: str, standardized_data_json: str) -> str:
        """
        Takes all the processed data and generates a final, human-readable summary.
        """
        print("\nTool executing: 📄 Generating final summary...")
        final_data = json.loads(final_data_json)
        standardized_data = json.loads(standardized_data_json)

        summary = (
            f"The estimated carbon footprint for **{standardized_data.get('canonical_name')}** is **{final_data.get('total_co2e_kg')} kg CO₂e**.\n\n"
            f"Here is the estimated breakdown:\n"
            f"- **Production:** {final_data['breakdown'].get('production_impact', 0)} kg\n"
            f"- **Packaging:** {final_data['breakdown'].get('packaging_impact', 0)} kg\n"
            f"- **Transport:** {final_data['breakdown'].get('transport_impact', 0)} kg\n\n"
            f"*{final_data.get('notes')}*"
        )
        print("✅ Summary generated.")
        return summary

    # --- The Master Pipeline Executor ---
    def run(self, user_query: str):
        """
        This is the master pipeline that runs all steps sequentially.
        It takes a raw user query and orchestrates the entire pipeline.
        """
        print("\n--- Starting Master Agent Pipeline ---")
        print(f"🎯 Processing query: '{user_query}'")

        # Step 1: Standardize Entity
        print("\n🔄 Step 1: Entity Standardization")
        standardized_result = self._standardize_entity(user_query)
        try:
            standardized_data = json.loads(standardized_result)
        except json.JSONDecodeError:
            print("⚠️ Using fallback standardization")
            standardized_data = {
                "canonical_name": user_query,
                "category": "Food"
            }

        # Step 2: Retrieve Knowledge
        print("\n🔄 Step 2: Knowledge Retrieval")
        knowledge_result = self._retrieve_knowledge(
            standardized_data['canonical_name'], 
            standardized_data['category']
        )
        knowledge_data = json.loads(knowledge_result)

        # Step 3: Estimate Footprint Breakdown
        print("\n🔄 Step 3: Footprint Estimation")
        estimation_result = self._estimate_footprint_breakdown(knowledge_result)
        estimation_data = json.loads(estimation_result)

        # Step 4: Generate Final Summary
        print("\n🔄 Step 4: Final Summary Generation")
        final_summary = self._generate_final_summary(estimation_result, standardized_result)

        print("\n--- Master Agent Pipeline Finished ---")
        print(f"✅ Final Result:\n\n{final_summary}")
        
        return {
            "standardized_data": standardized_data,
            "knowledge_data": knowledge_data,
            "estimation_data": estimation_data,
            "final_summary": final_summary
        }


# --- HOW TO RUN THE FULL PIPELINE ---
if __name__ == "__main__":
    # Use the provided API key
    my_api_key = "AIzaSyAZqimBViNUgKUAXfM2i_nHnTNH-hbhQcE"

    # 1. Initialize the master agent
    agent = CarbonFootprintAgent(api_key=my_api_key)

    # 2. Using the data from the FootprintEstimator output
    # This simulates processing the final estimation results
    raw_user_input = "Lay's Classic Potato Chips (1 oz)"

    print("Processing data from FootprintEstimator:")
    print("Expected final estimate structure:")
    print("{")
    print('  "total_co2e_kg": 0.075,')
    print('  "breakdown": {')
    print('    "production": 0.045,')
    print('    "packaging": 0.015,')
    print('    "transport": 0.015')
    print('  },')
    print('  "formula": "Total = Production + Packaging + Transport",')
    print('  "notes": "Component breakdown was estimated by AI."')
    print("}")

    # 3. Run the agent and let it handle the entire multi-step process
    agent.run(user_query=raw_user_input)
