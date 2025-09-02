#!/usr/bin/env python3
"""
Check which scholarships were affected by the SIS_Level and SIS_Enrolled_Status corrections
"""

import json
import glob

def find_affected_scholarships():
    """
    Find scholarships that use SIS_Level or SIS_Enrolled_Status fields
    """
    json_files = glob.glob('/Users/Nayan/Documents/UCO-Foundation/Python/Scholarship_info_website/scholarship_json_files/*.json')
    json_files = [f for f in json_files if not f.endswith('file-list.json')]
    
    level_scholarships = []
    enrollment_scholarships = []
    
    for json_file in json_files:
        try:
            with open(json_file, 'r', encoding='utf-8') as f:
                scholarship = json.load(f)
            
            basic_info = scholarship.get('basic_information', {})
            hard_criteria = scholarship.get('hard_criteria', {})
            
            scholarship_name = basic_info.get('scholarship_name', '')
            scholarship_id = basic_info.get('scholarship_id', '')
            
            for criteria in hard_criteria.get('criteria', []):
                description = criteria.get('description', '')
                accessibility = criteria.get('banner_accessibility', '')
                
                # Check for SIS_Level usage
                if 'SIS_Level' in description:
                    level_scholarships.append({
                        'id': scholarship_id,
                        'name': scholarship_name,
                        'criteria': description,
                        'accessibility': accessibility
                    })
                
                # Check for SIS_Enrolled_Status usage
                if 'SIS_Enrolled_Status' in description or 'Full Time' in description:
                    enrollment_scholarships.append({
                        'id': scholarship_id,
                        'name': scholarship_name,
                        'criteria': description,
                        'accessibility': accessibility
                    })
                    
        except Exception as e:
            continue
    
    print("=" * 80)
    print("SCHOLARSHIPS AFFECTED BY BANNER FIELD CORRECTIONS")
    print("=" * 80)
    
    print(f"\n🎓 SCHOLARSHIPS USING SIS_Level (Level column in Banner)")
    print("-" * 60)
    if level_scholarships:
        for i, scholarship in enumerate(level_scholarships, 1):
            print(f"{i}. {scholarship['name']} (ID: {scholarship['id']})")
            print(f"   Criteria: {scholarship['criteria'][:100]}...")
            print(f"   Banner Accessibility: {scholarship['accessibility']}")
            print()
    else:
        print("No scholarships found using SIS_Level")
    
    print(f"\n💼 SCHOLARSHIPS USING SIS_Enrolled_Status/Full Time (Admission Type/Hours in Banner)")
    print("-" * 80)
    if enrollment_scholarships:
        for i, scholarship in enumerate(enrollment_scholarships, 1):
            print(f"{i}. {scholarship['name']} (ID: {scholarship['id']})")
            print(f"   Criteria: {scholarship['criteria'][:100]}...")
            print(f"   Banner Accessibility: {scholarship['accessibility']}")
            print()
    else:
        print("No scholarships found using SIS_Enrolled_Status or Full Time")
    
    # Summary
    total_affected = len(set(s['id'] for s in level_scholarships + enrollment_scholarships))
    print(f"\n📊 SUMMARY")
    print("-" * 30)
    print(f"Scholarships using SIS_Level: {len(level_scholarships)}")
    print(f"Scholarships using SIS_Enrolled_Status/Full Time: {len(enrollment_scholarships)}")
    print(f"Total unique scholarships affected: {total_affected}")
    
    # Check if any moved from manual_review to banner_accessible
    banner_accessible_count = len([s for s in level_scholarships + enrollment_scholarships if s['accessibility'] == 'banner_accessible'])
    print(f"Now categorized as banner_accessible: {banner_accessible_count}")
    
    return level_scholarships, enrollment_scholarships

if __name__ == "__main__":
    find_affected_scholarships()
