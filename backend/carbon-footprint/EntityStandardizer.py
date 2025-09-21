import os
import google.generativeai as genai
import json

class EntityStandardizer:
    """
    Uses the Gemini API to perform Entity Recognition and Standardization on JSON data.
    It analyzes a JSON object, normalizes the entity's name, and maps it to a category.
    """

    def __init__(self, api_key):
        """Initializes the standardizer and configures the Gemini API."""
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-1.5-flash')
        # The predefined categories for mapping remain the same
        self.categories = ['Food', 'Beverage', 'Clothing', 'Electronics', 'Flights', 'Other']
        print("✅ JSON-aware EntityStandardizer initialized.")

    def get_prompt_template(self) -> str:
        """
        Creates the master prompt template specifically designed to process JSON input.
        """
        return f"""
        You are a highly accurate data processing engine. Your task is to analyze the user's input JSON object and perform two steps:

        **Step 1: Create a Canonical Name**
        Intelligently combine the most important fields from the JSON to create a single, standardized, and human-readable product name. Extract key attributes like brand, product type, specifications, and routes.

        - For a product photo, combine brand, product name, and a key specification like weight.
        - For a flight, describe the route clearly.
        - For a grocery list, you will process each item individually.

        **Step 2: Categorize the Entity**
        Map the entity to one of the following predefined categories:
        {self.categories}

        **Output Format:**
        You MUST provide your final answer in a single, valid JSON object. The JSON object must have exactly two keys:
        1. "canonical_name": The standardized name from Step 1.
        2. "category": The category assigned in Step 2.

        Do not add any explanations or introductory text outside of the JSON object.
        """

    def standardize_json(self, json_data: dict) -> dict:
        """
        Takes a Python dictionary (from JSON) and returns a dictionary with the
        standardized name and category.
        """
        print(f"\nProcessing input JSON: {json.dumps(json_data, indent=2)}")
        
        # Convert the dictionary to a string to pass it to the model
        input_json_string = json.dumps(json_data)
        
        # Construct the full prompt for the API call
        prompt = self.get_prompt_template() + f"\n\n**Input JSON:**\n{input_json_string}"
        
        try:
            print("🤖 Calling Gemini API for standardization...")
            response = self.model.generate_content(prompt)
            
            # Clean up the response to isolate the JSON object
            json_str = response.text.strip().replace("```json", "").replace("```", "")
            
            print("✅ Received and parsed response.")
            # Parse the JSON string into a Python dictionary
            result = json.loads(json_str)
            
            # Basic validation
            if 'canonical_name' not in result or 'category' not in result:
                raise ValueError("JSON output is missing required keys.")
                
            return result

        except (json.JSONDecodeError, AttributeError, ValueError) as e:
            print(f"❌ Error: Could not parse the API response. Error: {e}")
            if 'response' in locals():
                print(f"   Raw API Response: {response.text}")
            return {"canonical_name": "Error processing JSON", "category": "Error"}
        except Exception as e:
            print(f"❌ An unexpected error occurred: {e}")
            return {"canonical_name": "API call failed", "category": "Error"}


# --- HOW TO RUN ---
if __name__ == "__main__":
    # Use the provided API key
    my_api_key = "AIzaSyCIe9itUnQyhF3wwuDohXCLab6bpgsTWKc"

    # Initialize the standardizer
    standardizer = EntityStandardizer(api_key=my_api_key)

    # The data from the previous input_layer.py result
    input_data = {
        "type": "product_photo",
        "product_name": "Lay's Classic Potato Chips",
        "brand": "Lay's",
        "specifications": {
            "weight": "1 oz (28.3 g)",
            "calories": "160 per pkg"
        }
    }

    # Process the JSON input and print the results
    print("Processing the data from input_layer.py:")
    standardized_output = standardizer.standardize_json(input_data)
    print("--------------------------------------------------")
    print("  --> Standardized Output:")
    print(f"      Canonical Name: '{standardized_output.get('canonical_name')}'")
    print(f"      Category:       '{standardized_output.get('category')}'")
    print("--------------------------------------------------")
