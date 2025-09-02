import json
import os

def test_single_scholarship():
    # Test with the specific scholarship we know has the issue
    scholarship_file = "/Users/Nayan/Documents/UCO-Foundation/Python/Scholarship_info_website/scholarship_json_files/107109.json"
    
    # Read the current data
    with open(scholarship_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    print("BEFORE UPDATE:")
    print("=" * 50)
    for criteria in data['hard_criteria']['criteria']:
        if 'SIS_Enrolled_Status is Full Time' in criteria['description']:
            print(f"Description: {criteria['description']}")
            print(f"Banner accessibility: {criteria['banner_accessibility']}")
            break
    
    # Now let's manually update this one criterion to test
    def categorize_banner_accessibility(criteria_type: str, description: str) -> str:
        banner_accessible_patterns = [
            'SIS_Major', 'SIS_Minor', 'SIS_Classification', 'SIS_College', 'SIS_Level',
            'SIS_CumGPA', 'SIS_Hours', 'SIS_Term_Hours', 'SIS_Cumulative_Hours',
            'SIS_Gender', 'SIS_Hispanic', 'SIS_Resident', 'SIS_Residency',
            'SIS_Enrolled_Status', 'SIS_Term_Enrolled', 'SIS_Full_Time', 'SIS_Part_Time',
            'SIS_Full Time', 'SIS_Part Time',
            'SIS_Enrolled HRS',
            'SIS_Transfer_Hours', 'SIS_Admission_Type', 'SIS_Term_Admitted',
            'SIS_High_School', 'SIS_Overall_Hours',
            'SIS_FAFSA', 'SIS_Unmet_Need', 'SIS_Financial_Need',
            'SIS_Sport', 'SIS_Athletic'
        ]
        
        application_patterns = [
            'Complete Attachment', 'Complete Essay', 'Upload', 'Submit',
            'Provide', 'Must provide', 'statement', 'essay', 'attachment',
            'portfolio', 'writing sample', 'recommendation', 'letter',
            'transcript', 'resume', 'interview'
        ]
        
        manual_review_patterns = [
            'demonstrated financial need', 'extracurricular activities',
            'community service', 'leadership', 'volunteer', 'employment',
            'family income', 'hardship', 'circumstances'
        ]
        
        description_lower = description.lower()
        
        # Check if it's Banner accessible FIRST (these take priority)
        for pattern in banner_accessible_patterns:
            if description.startswith(pattern):
                return 'banner_accessible'
        
        # Check for manual review patterns
        for pattern in manual_review_patterns:
            if pattern in description_lower:
                return 'manual_review'
        
        # Check if it's application required
        for pattern in application_patterns:
            if pattern.lower() in description_lower:
                return 'application_required'
        
        return 'manual_review'
    
    # Update the banner accessibility for all criteria
    updated = False
    for criteria in data['hard_criteria']['criteria']:
        old_accessibility = criteria['banner_accessibility']
        new_accessibility = categorize_banner_accessibility(criteria['type'], criteria['description'])
        
        if old_accessibility != new_accessibility:
            criteria['banner_accessibility'] = new_accessibility
            updated = True
            print(f"\nUPDATED: {criteria['description'][:50]}...")
            print(f"  From: {old_accessibility} → To: {new_accessibility}")
    
    if updated:
        # Recalculate summary
        banner_accessible = sum(1 for c in data['hard_criteria']['criteria'] if c['banner_accessibility'] == 'banner_accessible')
        application_required = sum(1 for c in data['hard_criteria']['criteria'] if c['banner_accessibility'] == 'application_required')
        manual_review = sum(1 for c in data['hard_criteria']['criteria'] if c['banner_accessibility'] == 'manual_review')
        
        data['hard_criteria']['banner_summary'] = {
            "total_criteria": len(data['hard_criteria']['criteria']),
            "banner_accessible": banner_accessible,
            "application_required": application_required,
            "manual_review": manual_review
        }
        
        # Write the updated file
        with open(scholarship_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        
        print(f"\n✅ Updated {scholarship_file}")
        
        # Verify the update
        with open(scholarship_file, 'r', encoding='utf-8') as f:
            verify_data = json.load(f)
        
        print("\nAFTER UPDATE:")
        print("=" * 50)
        for criteria in verify_data['hard_criteria']['criteria']:
            if 'SIS_Enrolled_Status is Full Time' in criteria['description']:
                print(f"Description: {criteria['description']}")
                print(f"Banner accessibility: {criteria['banner_accessibility']}")
                break
    else:
        print("No updates needed")

if __name__ == "__main__":
    test_single_scholarship()
