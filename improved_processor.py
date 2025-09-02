#!/usr/bin/env python3
"""
Improved Scholarship JSON Processor
- Renames "Qualifying Criteria" to "Hard Criteria"
- Separates Banner-accessible information
- Improves SIS field parsing to handle duplicates
"""

import json
import glob
import re
from typing import Dict, List, Set

def parse_sis_criteria(raw_text: str) -> Dict:
    """
    Parse SIS criteria and remove duplicates, organize by field type
    """
    # Split by 'or' to get individual conditions
    conditions = [cond.strip() for cond in raw_text.split(' or ')]
    
    # Dictionary to store parsed conditions by field type
    parsed = {
        'majors': set(),
        'minors': set(),
        'classifications': set(),
        'gpa_requirements': set(),
        'other_sis': set()
    }
    
    for condition in conditions:
        condition = condition.strip()
        
        # Parse major conditions
        if 'SIS_Major' in condition:
            match = re.search(r'SIS_Major[_\d]* is (.+)', condition)
            if match:
                major = match.group(1).strip()
                parsed['majors'].add(major)
        
        # Parse minor conditions
        elif 'SIS_Minor' in condition:
            match = re.search(r'SIS_Minor[_\d]* is (.+)', condition)
            if match:
                minor = match.group(1).strip()
                parsed['minors'].add(minor)
        
        # Parse classification conditions
        elif 'SIS_Classification' in condition:
            match = re.search(r'SIS_Classification is (.+)', condition)
            if match:
                classification = match.group(1).strip()
                parsed['classifications'].add(classification)
        
        # Parse GPA conditions (both cumulative and major GPA)
        elif 'SIS_CumGPA' in condition or 'SIS_MajorGPA' in condition or 'GPA' in condition:
            parsed['gpa_requirements'].add(condition)
        
        # Parse enrollment hours conditions
        elif 'SIS_Enrolled HRS' in condition or 'SIS_Enrolled_HRS' in condition:
            parsed['other_sis'].add(condition)
        
        # Other SIS conditions
        elif 'SIS_' in condition:
            parsed['other_sis'].add(condition)
    
    # Convert sets to sorted lists for consistent output
    result = {
        'majors': sorted(list(parsed['majors'])),
        'minors': sorted(list(parsed['minors'])),
        'classifications': sorted(list(parsed['classifications'])),
        'gpa_requirements': sorted(list(parsed['gpa_requirements'])),
        'other_sis': sorted(list(parsed['other_sis']))
    }
    
    return result

def categorize_banner_accessibility(criteria_type: str, description: str) -> str:
    """
    Determine if criteria can be accessed from Banner system
    Based on actual Banner data fields available:
    Term Code, Term, PIDM, ID, First Name, Last Name, Gender, Hispanic/Latino Flag,
    Term Hours Enrolled, Term Hours Billed, Residency, Sport Code, High School,
    Level, Classification, College 1, Major Code 1, Major 1, College 2, Major Code 2,
    Major 2, College Code 3, Major Code 3, Major 3, Minor Code 1, Minor 1,
    Minor Code 2, Minor 2, Minor Code 3, Minor 3, Term Admitted, Admission Type,
    Transfer Hours, Cumulative Hours, Cumulative GPA, Unmet Need, FAFSA, Emails
    """
    
    # Fields directly available from Banner
    banner_accessible_patterns = [
        # Academic information
        'SIS_Major', 'SIS_Minor', 'SIS_Classification', 'SIS_College', 'SIS_Level',
        'SIS_CumGPA', 'SIS_MajorGPA', 'SIS_Hours', 'SIS_Term_Hours', 'SIS_Cumulative_Hours',
        'SIS_Enrolled HRS', 'SIS_Enrolled_HRS', 'SIS_UCO_Completed_Hours',
        
        # Student demographics  
        'SIS_Gender', 'SIS_Hispanic', 'SIS_Resident', 'SIS_Residency',
        
        # Enrollment status
        'SIS_Enrolled_Status', 'SIS_Term_Enrolled', 'SIS_Full_Time', 'SIS_Part_Time',
        
        # Academic history
        'SIS_Transfer_Hours', 'SIS_Admission_Type', 'SIS_Term_Admitted',
        'SIS_High_School', 'SIS_High_School_Name',
        
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

def improve_criteria_parsing(criteria_item: Dict) -> Dict:
    """
    Improve the parsing of criteria items
    """
    improved_item = criteria_item.copy()
    
    # Parse SIS criteria for better organization
    if any(field in improved_item['description'] for field in ['SIS_Major', 'SIS_Minor', 'SIS_Classification']):
        parsed_sis = parse_sis_criteria(improved_item['description'])
        improved_item['parsed_sis'] = parsed_sis
        
        # Create a cleaner description
        clean_parts = []
        if parsed_sis['majors']:
            clean_parts.append(f"Major: {', '.join(parsed_sis['majors'])}")
        if parsed_sis['minors']:
            clean_parts.append(f"Minor: {', '.join(parsed_sis['minors'])}")
        if parsed_sis['classifications']:
            clean_parts.append(f"Classification: {', '.join(parsed_sis['classifications'])}")
        
        if clean_parts:
            improved_item['clean_description'] = ' | '.join(clean_parts)
    
    # Add Banner accessibility
    improved_item['banner_accessibility'] = categorize_banner_accessibility(
        improved_item['type'], 
        improved_item['description']
    )
    
    return improved_item

def process_scholarship_json(json_file_path: str) -> bool:
    """
    Process a single scholarship JSON file with improvements
    """
    try:
        # Read the JSON file
        with open(json_file_path, 'r', encoding='utf-8') as f:
            scholarship_data = json.load(f)
        
        # Handle both qualifying_criteria (old) and hard_criteria (current)
        if 'qualifying_criteria' in scholarship_data:
            hard_criteria = scholarship_data.pop('qualifying_criteria')
            # Update the description
            hard_criteria['description'] = "Hard requirements that must be met to qualify for the scholarship"
        elif 'hard_criteria' in scholarship_data:
            hard_criteria = scholarship_data['hard_criteria']
        else:
            # No criteria to process
            return True
        
        # Improve each criteria item
        improved_criteria = []
        banner_accessible_count = 0
        application_required_count = 0
        manual_review_count = 0
        
        for criteria in hard_criteria['criteria']:
            improved_criteria_item = improve_criteria_parsing(criteria)
            improved_criteria.append(improved_criteria_item)
            
            # Count by accessibility type
            if improved_criteria_item['banner_accessibility'] == 'banner_accessible':
                banner_accessible_count += 1
            elif improved_criteria_item['banner_accessibility'] == 'application_required':
                application_required_count += 1
            else:
                manual_review_count += 1
        
        hard_criteria['criteria'] = improved_criteria
        
        # Add summary of Banner accessibility
        hard_criteria['banner_summary'] = {
            'total_criteria': len(improved_criteria),
            'banner_accessible': banner_accessible_count,
            'application_required': application_required_count,
            'manual_review': manual_review_count
        }
        
        # Add the improved hard_criteria to scholarship data
        scholarship_data['hard_criteria'] = hard_criteria
        
        # Also process general_criteria (soft requirements) if they exist
        if 'general_criteria' in scholarship_data and 'criteria' in scholarship_data['general_criteria']:
            general_criteria = scholarship_data['general_criteria']
            improved_general_criteria = []
            general_banner_accessible_count = 0
            general_application_required_count = 0
            general_manual_review_count = 0
            
            for criteria in general_criteria['criteria']:
                improved_criteria_item = improve_criteria_parsing(criteria)
                improved_general_criteria.append(improved_criteria_item)
                
                # Count by accessibility type
                if improved_criteria_item['banner_accessibility'] == 'banner_accessible':
                    general_banner_accessible_count += 1
                elif improved_criteria_item['banner_accessibility'] == 'application_required':
                    general_application_required_count += 1
                else:
                    general_manual_review_count += 1
            
            general_criteria['criteria'] = improved_general_criteria
            
            # Add summary of Banner accessibility for general criteria
            general_criteria['banner_summary'] = {
                'total_criteria': len(improved_general_criteria),
                'banner_accessible': general_banner_accessible_count,
                'application_required': general_application_required_count,
                'manual_review': general_manual_review_count
            }
            
            scholarship_data['general_criteria'] = general_criteria
        
        # Add progress_status field if it doesn't exist
        if 'progress_status' not in scholarship_data:
            scholarship_data['progress_status'] = 'not-processed'
        
        # Write back the improved JSON
        with open(json_file_path, 'w', encoding='utf-8') as f:
            json.dump(scholarship_data, f, indent=2, ensure_ascii=False)
        
        return True
        
    except Exception as e:
        print(f"Error processing {json_file_path}: {e}")
        return False

def update_all_scholarships():
    """
    Update all scholarship JSON files with improvements
    """
    json_files = glob.glob('/Users/Nayan/Documents/UCO-Foundation/Python/Scholarship_info_website/scholarship_json_files/*.json')
    
    # Exclude file-list.json
    json_files = [f for f in json_files if not f.endswith('file-list.json')]
    
    print(f"Found {len(json_files)} scholarship files to process...")
    
    updated_count = 0
    failed_count = 0
    
    for json_file in json_files:
        if process_scholarship_json(json_file):
            updated_count += 1
        else:
            failed_count += 1
        
        if updated_count % 50 == 0:
            print(f"Processed {updated_count} files...")
    
    print(f"\\nProcessing complete!")
    print(f"Successfully updated: {updated_count}")
    print(f"Failed: {failed_count}")

if __name__ == "__main__":
    update_all_scholarships()
