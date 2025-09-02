import json
import re

def debug_pattern_matching():
    # The exact test cases from our data
    test_criteria = [
        "SIS_Level is Undergraduate",
        "SIS_Enrolled_Status is Full Time",
        "SIS_Enrolled_Status is Part Time",
        "SIS_Major is Music",
        "SIS_CumGPA is Greater than or equal to 3.0"
    ]
    
    # Banner accessible patterns
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
    
    def categorize_test(criterion):
        # Check if criteria starts with any Banner accessible pattern
        for pattern in banner_accessible_patterns:
            if criterion.startswith(pattern):
                return "banner_accessible"
        
        # Check for manual review patterns
        manual_review_keywords = [
            'manual review', 'manual', 'review required', 'contact',
            'special consideration', 'department', 'interview',
            'submit', 'provide', 'attach', 'upload'
        ]
        
        for keyword in manual_review_keywords:
            if keyword in criterion.lower():
                return "manual_review"
        
        return "unknown"
    
    print("Debug Pattern Matching:")
    print("=" * 50)
    
    for criterion in test_criteria:
        result = categorize_test(criterion)
        print(f"Criterion: '{criterion}'")
        print(f"Result: {result}")
        
        # Check which patterns match
        matching_patterns = []
        for pattern in banner_accessible_patterns:
            if criterion.startswith(pattern):
                matching_patterns.append(pattern)
        
        if matching_patterns:
            print(f"Matching patterns: {matching_patterns}")
        else:
            print("No Banner patterns match")
        
        print("-" * 30)

if __name__ == "__main__":
    debug_pattern_matching()
