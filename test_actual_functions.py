import json
import glob

# Import the actual function from the processor
from improved_processor import categorize_banner_accessibility, improve_criteria_parsing

def test_actual_function():
    # Test with the exact same cases
    test_cases = [
        ("level", "SIS_Level is Undergraduate"),
        ("unknown", "SIS_Enrolled_Status is Full Time")
    ]
    
    for criteria_type, description in test_cases:
        print(f"\nTesting: '{description}' (type: {criteria_type})")
        
        # Test the actual function
        result = categorize_banner_accessibility(criteria_type, description)
        print(f"categorize_banner_accessibility result: {result}")
        
        # Test the improve_criteria_parsing function
        test_item = {
            'type': criteria_type,
            'description': description,
            'raw_text': description
        }
        
        improved_item = improve_criteria_parsing(test_item)
        print(f"improve_criteria_parsing result: {improved_item['banner_accessibility']}")

if __name__ == "__main__":
    test_actual_function()
