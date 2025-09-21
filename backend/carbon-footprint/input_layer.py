import google.generativeai as genai
from PIL import Image
import pytesseract
import json
import os
from typing import Union, Optional

class InputProcessor:
    """
    Processes input from images or text for the agentic AI.
    - Prioritizes Gemini Vision for structured JSON output.
    - Falls back to Tesseract OCR for raw text extraction if Gemini fails.
    """
    def __init__(self, google_api_key):
        """
        Initializes the processor and configures the Gemini API.
        """
        if not google_api_key:
            raise ValueError("Google API key is required.")
        genai.configure(api_key=google_api_key)
        self.model = genai.GenerativeModel('gemini-1.5-flash')

    def _process_with_gemini(self, image_path: str) -> Optional[dict]:
        """
        Processes an image using Gemini Vision Pro to extract structured data.
        Returns a dictionary (from JSON) or None if processing fails.
        """
        print("-> Attempting to process with Gemini Vision...")
        try:
            img = Image.open(image_path)
            
            # The prompt is crucial for getting structured JSON output
            prompt = """
            Analyze the image and identify its type (e.g., 'grocery receipt', 'product photo', 'flight ticket').
            Extract all relevant entities based on the type.
            Return the result as a single, clean JSON object.

            - For a 'grocery receipt', extract: 'store_name', and a list of 'items' with 'name', 'quantity', and 'price'.
            - For a 'product photo', extract: 'product_name', 'brand', and potential 'materials' or 'specifications'.
            - For a 'flight ticket', extract: 'passenger_name', 'flight_number', 'departure_airport', 'arrival_airport', and 'date'.
            
            If the image content is unclear or doesn't fit these categories, set the 'type' to 'other' and provide a 'description' and any 'raw_text' you can extract.
            Your entire response must be ONLY the JSON object, without any markdown formatting like ```json.
            """

            response = self.model.generate_content([prompt, img])
            
            # Clean up the response to ensure it's valid JSON
            cleaned_response = response.text.strip().replace("```json", "").replace("```", "")
            
            print("   Gemini processing successful.")
            return json.loads(cleaned_response)

        except Exception as e:
            print(f"   [Error] Gemini processing failed: {e}")
            return None

    def _process_with_tesseract(self, image_path: str) -> Optional[dict]:
        """
        Fallback method: Processes an image using Tesseract for raw OCR.
        Returns a dictionary with the raw text or None if it fails.
        """
        print("-> Falling back to Tesseract OCR...")
        try:
            img = Image.open(image_path)
            raw_text = pytesseract.image_to_string(img)
            
            if raw_text.strip():
                print("   Tesseract processing successful.")
                return {
                    "type": "ocr_fallback",
                    "source": "Tesseract",
                    "raw_text": raw_text.strip()
                }
            else:
                print("   [Warning] Tesseract extracted no text.")
                return None
        except Exception as e:
            print(f"   [Error] Tesseract processing failed: {e}")
            return None

    def process_input(self, input_data: str) -> dict:
        """
        Main method to process user input.
        - If input is a path to an image, it uses the vision pipeline.
        - If input is a string, it treats it as manual text entry.
        Returns a dictionary (not JSON string).
        """
        # Check if input is an image file path
        if os.path.exists(input_data):
            print(f"Processing image file: {input_data}")
            # 1. Try Gemini first
            result = self._process_with_gemini(input_data)
            
            # 2. If Gemini fails, fall back to Tesseract
            if result is None:
                result = self._process_with_tesseract(input_data)

            # 3. If both fail, return an error JSON
            if result is None:
                result = {"error": "Failed to process image with all available tools."}
        
        # Treat as manual text input
        else:
            print(f"Processing manual text entry.")
            result = {
                "type": "manual_text",
                "content": input_data
            }
        
        # Return the result as a dictionary (not JSON string)
        return result


# Main execution
if __name__ == "__main__":
    # API key and image path
    api_key = "AIzaSyCIe9itUnQyhF3wwuDohXCLab6bpgsTWKc"
    image_path = "A_bag_of_chpis.png"
    
    # Create processor instance
    processor = InputProcessor(api_key)
    
    # Process the image
    result = processor.process_input(image_path)
    print("\nFinal Result:")
    print(json.dumps(result, indent=2))