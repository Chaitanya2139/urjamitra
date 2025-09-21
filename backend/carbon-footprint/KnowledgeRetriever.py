import os
import google.generativeai as genai
import json
import requests
from bs4 import BeautifulSoup
from duckduckgo_search import DDGS

# --- 1. MOCKED KNOWLEDGE SOURCES (Simulating your Databases) ---

# This simulates your internal, high-quality database (like EcoInvent).
# NOTE: "Lay's" is intentionally left out to force the agent to use the web.
MOCK_INTERNAL_DATABASE = {
    "coca-cola, 0.5l, pet bottle": {
        "co2e_kg": 0.17,
        "source": "Internal DB (EcoInvent)",
        "confidence": "High"
    },
    "t-shirt, cotton, blue, large": {
        "co2e_kg": 6.8,
        "source": "Internal DB (OpenApparel)",
        "confidence": "High"
    }
}

# This simulates a fallback for when all other methods fail.
MOCK_CATEGORY_FALLBACKS = {
    "Food": 1.5,       # Average kg CO2e for a packaged food item
    "Beverage": 0.5,
    "Clothing": 7.0,
    "Electronics": 25.0,
    "Flights": 0.115, # Average kg CO2e per passenger-km
    "Other": 5.0
}


class KnowledgeRetriever:
    """
    An agent that decides how to retrieve carbon footprint data using a
    hierarchical decision loop (DB -> Web -> Fallback).
    """

    def __init__(self, api_key):
        genai.configure(api_key=api_key)
        # The model is initialized with the tools it can use.
        self.model = genai.GenerativeModel(
            model_name='gemini-1.5-flash',
            tools=[
                self._lookup_internal_database,
                self._search_web_for_footprint_data,
                self._use_category_fallback_heuristic
            ]
        )
        print("✅ Agentic KnowledgeRetriever initialized.")

    # --- 2. TOOL DEFINITIONS (The Executor) ---
    # These are the functions the Gemini "Planner" can decide to call.

    @staticmethod
    def _lookup_internal_database(canonical_name: str) -> str:
        """
        Looks up a standardized product name in the high-confidence internal database.
        """
        print(f"Tool executing: 📚 Looking up '{canonical_name}' in the internal database...")
        normalized_name = canonical_name.lower()
        if normalized_name in MOCK_INTERNAL_DATABASE:
            print("✅ Found in database.")
            return json.dumps(MOCK_INTERNAL_DATABASE[normalized_name])
        else:
            print("❌ Not found in database.")
            return json.dumps({"error": "Product not found in the internal database."})

    @staticmethod
    def _search_web_for_footprint_data(canonical_name: str) -> str:
        """
        Simulates scraping the web for Life Cycle Assessment (LCA) data.
        In a real scenario, this would be much more complex.
        """
        print(f"Tool executing: 🌐 Simulating web search for '{canonical_name}'...")
        # Mock a successful web search for the specific example product
        if "lay's classic potato chips" in canonical_name.lower():
            print("✅ Found simulated web data for Lay's chips.")
            return json.dumps({
                "co2e_kg": 0.075,
                "source": "Simulated Web Scrape (GoodFood Institute Report)",
                "confidence": "Medium",
                "notes": "Based on potato farming, processing, and packaging."
            })
        else:
            print("❌ No reliable web data found.")
            return json.dumps({"error": "Could not find reliable footprint data from web search."})

    @staticmethod
    def _use_category_fallback_heuristic(category: str) -> str:
        """
        Provides a low-confidence estimate using an average value for the product's category.
        """
        print(f"Tool executing: ⚖️ Using fallback heuristic for category '{category}'...")
        if category in MOCK_CATEGORY_FALLBACKS:
            co2e = MOCK_CATEGORY_FALLBACKS[category]
            print(f"✅ Estimated {co2e} kg CO2e for category '{category}'.")
            return json.dumps({
                "co2e_kg": co2e,
                "source": "Category Fallback Heuristic",
                "confidence": "Low"
            })
        else:
             print(f"❌ Category '{category}' not found in fallbacks.")
             return json.dumps({"error": f"Category '{category}' has no fallback value."})

    # --- 3. AGENTIC DECISION LOOP ---

    def run_agentic_loop(self, standardized_data: dict):
        """
        Starts and manages the agentic loop to process the standardized input.
        """
        print("\n--- Starting Agentic Knowledge Retrieval ---")
        canonical_name = standardized_data['canonical_name']
        category = standardized_data['category']

        # Start the chat with the Gemini model, which acts as the Planner
        chat = self.model.start_chat()

        # The initial prompt frames the problem for the agent.
        initial_prompt = f"""
        My goal is to find the carbon footprint (CO2e in kg) for the following product:
        - Product Name: "{canonical_name}"
        - Category: "{category}"

        Follow this exact decision process:
        1. First, ALWAYS try to find the product in the internal database.
        2. If and ONLY IF it's not in the database, search the web for its data.
        3. If and ONLY IF both the database and web search fail, use the category fallback heuristic as a last resort.

        Execute the appropriate tool now.
        """
        print(f"🤖 Sending initial prompt to Gemini Planner...")
        response = chat.send_message(initial_prompt)

        # This loop continues until Gemini provides a text response instead of a tool call.
        while response.candidates[0].content.parts[0].function_call.name:
            function_call = response.candidates[0].content.parts[0].function_call
            tool_name = function_call.name
            tool_args = dict(function_call.args)

            print(f"🧠 Gemini decided to call tool: `{tool_name}` with args: {tool_args}")

            # The Executor: Our Python code runs the function Gemini chose.
            if tool_name == "_lookup_internal_database":
                tool_response = self._lookup_internal_database(**tool_args)
            elif tool_name == "_search_web_for_footprint_data":
                tool_response = self._search_web_for_footprint_data(**tool_args)
            elif tool_name == "_use_category_fallback_heuristic":
                tool_response = self._use_category_fallback_heuristic(**tool_args)
            else:
                raise ValueError(f"Unknown tool: {tool_name}")

            # Send the tool's output back to the Planner to inform its next decision.
            print(f"↩️ Sending tool output back to Gemini...")
            response = chat.send_message(
                genai.protos.Content(
                    parts=[
                        genai.protos.Part(
                            function_response=genai.protos.FunctionResponse(
                                name=tool_name,
                                response={"result": tool_response}
                            )
                        )
                    ]
                )
            )

        # Once the loop finishes, Gemini has made its final decision and has the data.
        print("\n--- Agentic Loop Finished ---")
        print(f"✅ Final Result from Agent:\n{response.text}")

# --- HOW TO RUN ---
if __name__ == "__main__":
    # Use the provided API key
    my_api_key = "AIzaSyCIe9itUnQyhF3wwuDohXCLab6bpgsTWKc"

    # Initialize the agent
    retriever = KnowledgeRetriever(api_key=my_api_key)

    # This is the standardized output from the EntityStandardizer
    standardized_input_data = {
        'canonical_name': "Lay's Classic Potato Chips (1 oz)",
        'category': 'Food'
    }

    print("Processing data from EntityStandardizer:")
    print(f"Canonical Name: {standardized_input_data['canonical_name']}")
    print(f"Category: {standardized_input_data['category']}")

    # Run the agent with this data
    retriever.run_agentic_loop(standardized_data=standardized_input_data)
