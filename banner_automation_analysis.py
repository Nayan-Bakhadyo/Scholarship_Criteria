#!/usr/bin/env python3
"""
Banner Automation Analysis
Analyzes all scholarships to provide insights into Banner automation potential
"""

import json
import glob
from collections import defaultdict, Counter

def analyze_banner_automation():
    """
    Analyze all scholarship files for Banner automation potential
    """
    json_files = glob.glob('/Users/Nayan/Documents/UCO-Foundation/Python/Scholarship_info_website/scholarship_json_files/*.json')
    json_files = [f for f in json_files if not f.endswith('file-list.json')]
    
    print(f"Analyzing {len(json_files)} scholarships for Banner automation potential...\n")
    
    # Statistics tracking
    total_scholarships = 0
    total_criteria = 0
    banner_accessible_count = 0
    application_required_count = 0
    manual_review_count = 0
    
    # Detailed analysis
    fully_automatable = []  # All criteria can be checked via Banner
    partially_automatable = []  # Some criteria can be checked via Banner
    manual_only = []  # All criteria require manual review
    
    accessibility_breakdown = defaultdict(list)
    criteria_types = Counter()
    
    for json_file in json_files:
        try:
            with open(json_file, 'r', encoding='utf-8') as f:
                scholarship = json.load(f)
            
            scholarship_name = scholarship['basic_information']['scholarship_name']
            scholarship_id = scholarship['basic_information']['scholarship_id']
            hard_criteria = scholarship.get('hard_criteria', {})
            
            if not hard_criteria.get('criteria'):
                continue
                
            total_scholarships += 1
            scholarship_criteria = len(hard_criteria['criteria'])
            total_criteria += scholarship_criteria
            
            banner_count = 0
            app_count = 0
            manual_count = 0
            
            for criteria in hard_criteria['criteria']:
                accessibility = criteria.get('banner_accessibility', 'manual_review')
                criteria_types[accessibility] += 1
                
                if accessibility == 'banner_accessible':
                    banner_count += 1
                    banner_accessible_count += 1
                elif accessibility == 'application_required':
                    app_count += 1
                    application_required_count += 1
                else:
                    manual_count += 1
                    manual_review_count += 1
            
            # Categorize scholarships by automation potential
            automation_percentage = (banner_count / scholarship_criteria) * 100
            
            scholarship_info = {
                'id': scholarship_id,
                'name': scholarship_name,
                'total_criteria': scholarship_criteria,
                'banner_accessible': banner_count,
                'application_required': app_count,
                'manual_review': manual_count,
                'automation_percentage': automation_percentage
            }
            
            if banner_count == scholarship_criteria:
                fully_automatable.append(scholarship_info)
            elif banner_count > 0:
                partially_automatable.append(scholarship_info)
            else:
                manual_only.append(scholarship_info)
                
        except Exception as e:
            print(f"Error processing {json_file}: {e}")
    
    # Generate report
    print("=" * 80)
    print("BANNER AUTOMATION ANALYSIS REPORT")
    print("=" * 80)
    
    print(f"\n📊 OVERALL STATISTICS")
    print(f"Total Scholarships Analyzed: {total_scholarships}")
    print(f"Total Hard Criteria: {total_criteria}")
    print(f"Average Criteria per Scholarship: {total_criteria/total_scholarships:.1f}")
    
    print(f"\n🤖 AUTOMATION POTENTIAL")
    automation_rate = (banner_accessible_count / total_criteria) * 100
    print(f"Banner Accessible Criteria: {banner_accessible_count} ({automation_rate:.1f}%)")
    print(f"Application Required Criteria: {application_required_count} ({application_required_count/total_criteria*100:.1f}%)")
    print(f"Manual Review Required: {manual_review_count} ({manual_review_count/total_criteria*100:.1f}%)")
    
    print(f"\n🎯 SCHOLARSHIP CATEGORIZATION")
    print(f"Fully Automatable (100% Banner): {len(fully_automatable)} scholarships ({len(fully_automatable)/total_scholarships*100:.1f}%)")
    print(f"Partially Automatable (>0% Banner): {len(partially_automatable)} scholarships ({len(partially_automatable)/total_scholarships*100:.1f}%)")
    print(f"Manual Only (0% Banner): {len(manual_only)} scholarships ({len(manual_only)/total_scholarships*100:.1f}%)")
    
    # Top fully automatable scholarships
    if fully_automatable:
        print(f"\n✅ FULLY AUTOMATABLE SCHOLARSHIPS (Top 10)")
        print("-" * 60)
        for i, scholarship in enumerate(sorted(fully_automatable, key=lambda x: x['total_criteria'], reverse=True)[:10]):
            print(f"{i+1:2d}. {scholarship['name'][:50]}... ({scholarship['total_criteria']} criteria)")
    
    # Top partially automatable scholarships
    if partially_automatable:
        print(f"\n⚡ BEST PARTIAL AUTOMATION CANDIDATES (Top 10)")
        print("-" * 60)
        for i, scholarship in enumerate(sorted(partially_automatable, key=lambda x: x['automation_percentage'], reverse=True)[:10]):
            print(f"{i+1:2d}. {scholarship['name'][:40]}... ({scholarship['automation_percentage']:.0f}% automatable, {scholarship['banner_accessible']}/{scholarship['total_criteria']} criteria)")
    
    # Scholarships requiring most manual work
    if manual_only:
        print(f"\n🔍 MANUAL REVIEW ONLY SCHOLARSHIPS (Top 10 by criteria count)")
        print("-" * 60)
        for i, scholarship in enumerate(sorted(manual_only, key=lambda x: x['total_criteria'], reverse=True)[:10]):
            print(f"{i+1:2d}. {scholarship['name'][:50]}... ({scholarship['total_criteria']} manual criteria)")
    
    print(f"\n💡 RECOMMENDATIONS")
    print("-" * 60)
    print(f"1. Start with {len(fully_automatable)} fully automatable scholarships for immediate Banner integration")
    print(f"2. Focus on top partial automation candidates for hybrid processing")
    print(f"3. Consider workflow automation for application-required criteria")
    print(f"4. Review manual-only scholarships for potential criteria simplification")
    
    # Banner field usage analysis
    print(f"\n🔧 BANNER FIELD USAGE ANALYSIS")
    print("-" * 60)
    banner_fields = defaultdict(int)
    
    for json_file in json_files:
        try:
            with open(json_file, 'r', encoding='utf-8') as f:
                scholarship = json.load(f)
            
            hard_criteria = scholarship.get('hard_criteria', {})
            for criteria in hard_criteria.get('criteria', []):
                if criteria.get('banner_accessibility') == 'banner_accessible':
                    description = criteria.get('description', '')
                    if 'SIS_Major' in description:
                        banner_fields['Major Requirements'] += 1
                    if 'SIS_Minor' in description:
                        banner_fields['Minor Requirements'] += 1
                    if 'SIS_Classification' in description:
                        banner_fields['Classification Requirements'] += 1
                    if 'SIS_CumGPA' in description:
                        banner_fields['GPA Requirements'] += 1
                    if 'SIS_College' in description:
                        banner_fields['College Requirements'] += 1
                    if 'SIS_Resident' in description:
                        banner_fields['Residency Requirements'] += 1
        except:
            continue
    
    for field, count in sorted(banner_fields.items(), key=lambda x: x[1], reverse=True):
        print(f"{field}: {count} scholarships")
    
    print(f"\n" + "=" * 80)

if __name__ == "__main__":
    analyze_banner_automation()
