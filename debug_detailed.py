def categorize_banner_accessibility_debug(criteria_type: str, description: str) -> str:
    """Debug version with detailed logging"""
    
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
    
    print(f"\n=== DEBUGGING: '{description}' ===")
    print(f"Type: {criteria_type}")
    print(f"Description repr: {repr(description)}")
    
    description_lower = description.lower()
    
    # Check if it's Banner accessible FIRST (these take priority)
    print("\nChecking Banner patterns:")
    banner_match = None
    for pattern in banner_accessible_patterns:
        if description.startswith(pattern):
            banner_match = pattern
            print(f"✓ MATCH: '{pattern}' - startswith check passed")
            break
        else:
            if pattern in description:
                print(f"~ Contains '{pattern}' but doesn't start with it")
    
    if banner_match:
        print(f"RESULT: banner_accessible (matched {banner_match})")
        return 'banner_accessible'
    
    # Check for manual review patterns
    print("\nChecking manual review patterns:")
    manual_match = None
    for pattern in manual_review_patterns:
        if pattern in description_lower:
            manual_match = pattern
            print(f"✓ MATCH: '{pattern}' in description")
            break
    
    if manual_match:
        print(f"RESULT: manual_review (matched {manual_match})")
        return 'manual_review'
    
    # Check if it's application required
    print("\nChecking application patterns:")
    app_match = None
    for pattern in application_patterns:
        if pattern.lower() in description_lower:
            app_match = pattern
            print(f"✓ MATCH: '{pattern}' in description")
            break
    
    if app_match:
        print(f"RESULT: application_required (matched {app_match})")
        return 'application_required'
    
    print("RESULT: manual_review (default)")
    return 'manual_review'

def test_problematic_cases():
    test_cases = [
        ("level", "SIS_Level is Undergraduate"),
        ("unknown", "SIS_Enrolled_Status is Full Time"),
        ("unknown", "SIS_Classification is Junior   or SIS_Classification is Senior")
    ]
    
    for criteria_type, description in test_cases:
        result = categorize_banner_accessibility_debug(criteria_type, description)
        print("=" * 60)

if __name__ == "__main__":
    test_problematic_cases()
