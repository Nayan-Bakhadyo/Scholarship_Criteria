import json
from improved_processor import process_scholarship_json

def test_single_processing():
    # Test with the specific scholarship we know has the issue
    scholarship_file = "/Users/Nayan/Documents/UCO-Foundation/Python/Scholarship_info_website/scholarship_json_files/107527.json"
    
    print("BEFORE processing:")
    with open(scholarship_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    for criteria in data['hard_criteria']['criteria']:
        if 'SIS_Level is Undergraduate' in criteria['description']:
            print(f"Description: {criteria['description']}")
            print(f"Banner accessibility: {criteria['banner_accessibility']}")
            break
    
    # Process the file
    print("\nProcessing the file...")
    result = process_scholarship_json(scholarship_file)
    print(f"Processing result: {result}")
    
    print("\nAFTER processing:")
    with open(scholarship_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    for criteria in data['hard_criteria']['criteria']:
        if 'SIS_Level is Undergraduate' in criteria['description']:
            print(f"Description: {criteria['description']}")
            print(f"Banner accessibility: {criteria['banner_accessibility']}")
            break

if __name__ == "__main__":
    test_single_processing()
