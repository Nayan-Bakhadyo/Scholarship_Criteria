import json

def debug_specific_case():
    test_cases = [
        "SIS_Level is Undergraduate",
        "SIS_Enrolled_Status is Full Time"
    ]
    
    # Banner accessible patterns
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
    
    # Special cases that might need manual review despite being in Banner
    manual_review_patterns = [
        'demonstrated financial need', 'extracurricular activities',
        'community service', 'leadership', 'volunteer', 'employment',
        'family income', 'hardship', 'circumstances'
    ]
    
    for test_case in test_cases:
        print(f"\n=== Testing: '{test_case}' ===")
        description_lower = test_case.lower()
        
        # Check Banner patterns
        banner_match = None
        for pattern in banner_accessible_patterns:
            if test_case.startswith(pattern):
                banner_match = pattern
                break
        
        # Check manual review patterns  
        manual_match = None
        for pattern in manual_review_patterns:
            if pattern in description_lower:
                manual_match = pattern
                break
        
        print(f"Banner match: {banner_match}")
        print(f"Manual review match: {manual_match}")
        
        # Simulate the actual function logic
        if banner_match:
            result = 'banner_accessible'
        elif manual_match:
            result = 'manual_review'  
        else:
            result = 'manual_review (default)'
        
        print(f"Final result: {result}")

if __name__ == "__main__":
    debug_specific_case()
