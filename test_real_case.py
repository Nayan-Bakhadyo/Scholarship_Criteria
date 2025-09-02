import json

def categorize_banner_accessibility(criteria_type: str, description: str) -> str:
    """
    Determine if criteria can be accessed from Banner system
    """
    
    # Fields directly available from Banner
    banner_accessible_patterns = [
        # Academic information
        'SIS_Major', 'SIS_Minor', 'SIS_Classification', 'SIS_College', 'SIS_Level',
        'SIS_CumGPA', 'SIS_Hours', 'SIS_Term_Hours', 'SIS_Cumulative_Hours',
        
        # Student demographics  
        'SIS_Gender', 'SIS_Hispanic', 'SIS_Resident', 'SIS_Residency',
        
        # Enrollment status - NOW AVAILABLE IN BANNER
        'SIS_Enrolled_Status', 'SIS_Term_Enrolled', 'SIS_Full_Time', 'SIS_Part_Time',
        'SIS_Full Time', 'SIS_Part Time',  # Handle variations in spacing
        'SIS_Enrolled HRS',  # Enrollment hours
        
        # Academic history
        'SIS_Transfer_Hours', 'SIS_Admission_Type', 'SIS_Term_Admitted',
        'SIS_High_School', 'SIS_Overall_Hours',
        
        # Financial aid (from Banner FAFSA integration)
        'SIS_FAFSA', 'SIS_Unmet_Need', 'SIS_Financial_Need',
        
        # Athletics (if Sport Code is tracked)
        'SIS_Sport', 'SIS_Athletic'
    ]
    
    # Requirements that need application materials
    application_patterns = [
        'Complete Attachment', 'Complete Essay', 'Upload', 'Submit',
        'Provide', 'Must provide', 'statement', 'essay', 'attachment',
        'portfolio', 'writing sample', 'recommendation', 'letter',
        'transcript', 'resume', 'interview'
    ]
    
    # Special cases that might need manual review despite being in Banner
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
    
    # Check for manual review patterns (these override application requirements)
    for pattern in manual_review_patterns:
        if pattern in description_lower:
            return 'manual_review'
    
    # Check if it's application required
    for pattern in application_patterns:
        if pattern.lower() in description_lower:
            return 'application_required'
    
    # Default to manual review for unknown criteria
    return 'manual_review'

def test_real_case():
    # The exact case from the JSON file
    test_description = "SIS_Enrolled_Status is Full Time"
    test_type = "unknown"
    
    result = categorize_banner_accessibility(test_type, test_description)
    
    print(f"Testing: '{test_description}'")
    print(f"Type: {test_type}")
    print(f"Result: {result}")
    
    # Debug the exact checking
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
    
    print("\nBanner pattern checking:")
    for pattern in banner_accessible_patterns:
        if test_description.startswith(pattern):
            print(f"✓ Matches: {pattern}")
            break
    else:
        print("✗ No banner patterns match")
    
    print(f"\nstartswith('SIS_Enrolled_Status'): {test_description.startswith('SIS_Enrolled_Status')}")

if __name__ == "__main__":
    test_real_case()
