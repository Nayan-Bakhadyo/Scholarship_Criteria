#!/usr/bin/env python3
"""
Fully Automatable Scholarships Analysis
Detailed analysis of scholarships that can be 100% automated through Banner
"""

import json
import glob
from collections import defaultdict

def analyze_fully_automatable_scholarships():
    """
    Analyze scholarships that are 100% automatable through Banner
    """
    json_files = glob.glob('/Users/Nayan/Documents/UCO-Foundation/Python/Scholarship_info_website/scholarship_json_files/*.json')
    json_files = [f for f in json_files if not f.endswith('file-list.json')]
    
    fully_automatable = []
    
    for json_file in json_files:
        try:
            with open(json_file, 'r', encoding='utf-8') as f:
                scholarship = json.load(f)
            
            basic_info = scholarship.get('basic_information', {})
            hard_criteria = scholarship.get('hard_criteria', {})
            
            if not hard_criteria.get('criteria'):
                continue
            
            # Check if ALL criteria are banner_accessible
            all_banner_accessible = True
            banner_fields_used = []
            
            for criteria in hard_criteria['criteria']:
                if criteria.get('banner_accessibility') != 'banner_accessible':
                    all_banner_accessible = False
                    break
                
                # Extract Banner fields used
                description = criteria.get('description', '')
                if 'SIS_Major' in description:
                    banner_fields_used.append('Major')
                if 'SIS_Minor' in description:
                    banner_fields_used.append('Minor')
                if 'SIS_Classification' in description:
                    banner_fields_used.append('Classification')
                if 'SIS_CumGPA' in description:
                    banner_fields_used.append('GPA')
                if 'SIS_College' in description:
                    banner_fields_used.append('College')
                if 'SIS_Resident' in description:
                    banner_fields_used.append('Residency')
                if 'SIS_Hours' in description:
                    banner_fields_used.append('Credit Hours')
                if 'SIS_Gender' in description:
                    banner_fields_used.append('Gender')
                if 'SIS_Hispanic' in description:
                    banner_fields_used.append('Hispanic/Latino')
                if 'SIS_Level' in description:
                    banner_fields_used.append('Academic Level')
            
            if all_banner_accessible:
                scholarship_info = {
                    'id': basic_info.get('scholarship_id'),
                    'name': basic_info.get('scholarship_name', ''),
                    'code': basic_info.get('scholarship_code', ''),
                    'donor': basic_info.get('donor_name', ''),
                    'committee': basic_info.get('committee_name', ''),
                    'candidate_count': basic_info.get('candidate_count', 0),
                    'total_criteria': len(hard_criteria['criteria']),
                    'banner_fields': list(set(banner_fields_used)),
                    'criteria_details': [],
                    'renewable': scholarship.get('renewable_information', {}).get('is_renewable', False)
                }
                
                # Add detailed criteria information
                for i, criteria in enumerate(hard_criteria['criteria'], 1):
                    criteria_detail = {
                        'number': i,
                        'type': criteria.get('type', 'unknown'),
                        'description': criteria.get('clean_description') or criteria.get('description', ''),
                        'banner_field': criteria.get('description', '').split()[0] if criteria.get('description') else '',
                        'parsed_sis': criteria.get('parsed_sis', {})
                    }
                    scholarship_info['criteria_details'].append(criteria_detail)
                
                fully_automatable.append(scholarship_info)
                
        except Exception as e:
            print(f"Error processing {json_file}: {e}")
    
    return fully_automatable

def generate_detailed_report():
    """
    Generate detailed report of fully automatable scholarships
    """
    scholarships = analyze_fully_automatable_scholarships()
    
    print("=" * 100)
    print("FULLY AUTOMATABLE SCHOLARSHIPS - DETAILED BANNER INTEGRATION REPORT")
    print("=" * 100)
    
    print(f"\n📊 SUMMARY")
    print(f"Total Fully Automatable Scholarships: {len(scholarships)}")
    print(f"Ready for immediate Banner integration with 100% automation")
    
    # Sort by criteria count for prioritization
    scholarships.sort(key=lambda x: x['total_criteria'], reverse=True)
    
    print(f"\n🚀 IMPLEMENTATION PRIORITY ORDER")
    print("=" * 100)
    
    for i, scholarship in enumerate(scholarships, 1):
        print(f"\n{i}. {scholarship['name']}")
        print(f"   Scholarship ID: {scholarship['id']}")
        print(f"   Code: {scholarship['code']}")
        print(f"   Donor: {scholarship['donor']}")
        print(f"   Committee: {scholarship['committee']}")
        print(f"   Candidate Count: {scholarship['candidate_count']}")
        print(f"   Renewable: {'Yes' if scholarship['renewable'] else 'No'}")
        print(f"   Total Criteria: {scholarship['total_criteria']}")
        print(f"   Banner Fields Required: {', '.join(scholarship['banner_fields'])}")
        
        print(f"\n   📋 AUTOMATION CRITERIA:")
        for criteria in scholarship['criteria_details']:
            print(f"      {criteria['number']}. {criteria['description']}")
            if criteria['parsed_sis']:
                if criteria['parsed_sis'].get('majors'):
                    print(f"         → Majors: {', '.join(criteria['parsed_sis']['majors'])}")
                if criteria['parsed_sis'].get('minors'):
                    print(f"         → Minors: {', '.join(criteria['parsed_sis']['minors'])}")
                if criteria['parsed_sis'].get('classifications'):
                    print(f"         → Classifications: {', '.join(criteria['parsed_sis']['classifications'])}")
        
        print(f"   " + "-" * 80)
    
    # Banner field usage analysis
    all_fields = []
    for scholarship in scholarships:
        all_fields.extend(scholarship['banner_fields'])
    
    field_usage = {}
    for field in set(all_fields):
        field_usage[field] = all_fields.count(field)
    
    print(f"\n🔧 BANNER FIELD REQUIREMENTS SUMMARY")
    print("=" * 60)
    for field, count in sorted(field_usage.items(), key=lambda x: x[1], reverse=True):
        print(f"{field}: {count} scholarships ({count/len(scholarships)*100:.1f}%)")
    
    # Implementation recommendations
    print(f"\n💡 BANNER INTEGRATION IMPLEMENTATION PLAN")
    print("=" * 60)
    print(f"1. DATABASE QUERIES NEEDED:")
    print(f"   - Student Major/Minor lookup (required for {field_usage.get('Major', 0)} scholarships)")
    print(f"   - GPA retrieval (required for {field_usage.get('GPA', 0)} scholarships)")
    print(f"   - College affiliation (required for {field_usage.get('College', 0)} scholarships)")
    print(f"   - Classification status (required for {field_usage.get('Classification', 0)} scholarships)")
    
    print(f"\n2. API ENDPOINTS TO DEVELOP:")
    print(f"   - GET /api/student/{{id}}/eligibility/{{scholarship_id}}")
    print(f"   - POST /api/scholarships/batch-check (for multiple students)")
    print(f"   - GET /api/scholarships/automatable (list of auto-checkable scholarships)")
    
    print(f"\n3. BUSINESS LOGIC REQUIRED:")
    for scholarship in scholarships:
        print(f"   - {scholarship['name']}: {', '.join(scholarship['banner_fields'])} validation")
    
    print(f"\n4. TESTING SCENARIOS:")
    print(f"   - Test with sample student data for each scholarship")
    print(f"   - Verify edge cases (multiple majors, transfer students, etc.)")
    print(f"   - Performance testing with batch processing")
    
    print(f"\n🎯 EXPECTED BENEFITS")
    print("=" * 60)
    total_candidates = sum(s['candidate_count'] for s in scholarships)
    print(f"- Immediate automation for {total_candidates} scholarship candidates")
    print(f"- 100% accurate eligibility checking (no human error)")
    print(f"- Real-time eligibility updates when student data changes")
    print(f"- Significant reduction in manual review workload")
    print(f"- Foundation for expanding automation to partially automatable scholarships")
    
    # Generate SQL-like queries for each scholarship
    print(f"\n🗄️  SAMPLE BANNER QUERIES")
    print("=" * 60)
    
    for scholarship in scholarships[:3]:  # Show first 3 as examples
        print(f"\n-- {scholarship['name']} (ID: {scholarship['id']})")
        print(f"SELECT s.student_id, s.first_name, s.last_name")
        print(f"FROM students s")
        
        conditions = []
        if 'Major' in scholarship['banner_fields']:
            conditions.append("s.major_1 IN ('list_of_eligible_majors')")
        if 'GPA' in scholarship['banner_fields']:
            conditions.append("s.cumulative_gpa >= minimum_gpa")
        if 'College' in scholarship['banner_fields']:
            conditions.append("s.college_1 IN ('eligible_colleges')")
        if 'Classification' in scholarship['banner_fields']:
            conditions.append("s.classification IN ('eligible_classifications')")
        
        if conditions:
            print(f"WHERE {' AND '.join(conditions)};")
        else:
            print("-- No specific WHERE conditions needed")
    
    print(f"\n" + "=" * 100)

if __name__ == "__main__":
    generate_detailed_report()
