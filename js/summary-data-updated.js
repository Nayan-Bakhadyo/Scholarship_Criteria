// Updated Summary Data for Scholarship Analysis
// Generated from current scholarship data on 2025-09-04

class ScholarshipSummaryData {
    constructor() {
        this.currentData = {
        "totals": {
                "scholarships": 670,
                "essay_required": 324,
                "essay_percentage": 48.4,
                "renewable": 14,
                "renewable_percentage": 2.1,
                "total_criteria": 3758,
                "banner_accessible": 1741,
                "banner_percentage": 46.3
        },
        "college_distribution": {
                "CEPS": {
                        "count": 126,
                        "percentage": 18.8
                },
                "CLA": {
                        "count": 131,
                        "percentage": 19.6
                },
                "CMS": {
                        "count": 104,
                        "percentage": 15.5
                },
                "CFAD": {
                        "count": 105,
                        "percentage": 15.7
                },
                "COB": {
                        "count": 116,
                        "percentage": 17.3
                },
                "GENERAL": {
                        "count": 88,
                        "percentage": 13.1
                }
        },
        "college_details": {
                "CEPS": {
                        "scholarships": 126,
                        "essay_scholarships": 82,
                        "essay_percentage": 65.1,
                        "renewable": 1,
                        "unique_essays": 50,
                        "total_essay_requirements": 103,
                        "top_criteria_types": {
                                "unknown": 249,
                                "application": 239,
                                "major": 97,
                                "gpa": 88,
                                "level": 66
                        }
                },
                "CLA": {
                        "scholarships": 131,
                        "essay_scholarships": 93,
                        "essay_percentage": 71.0,
                        "renewable": 0,
                        "unique_essays": 45,
                        "total_essay_requirements": 115,
                        "top_criteria_types": {
                                "application": 265,
                                "unknown": 172,
                                "major": 107,
                                "gpa": 91,
                                "hours": 63
                        }
                },
                "CMS": {
                        "scholarships": 104,
                        "essay_scholarships": 29,
                        "essay_percentage": 27.9,
                        "renewable": 0,
                        "unique_essays": 16,
                        "total_essay_requirements": 34,
                        "top_criteria_types": {
                                "unknown": 215,
                                "application": 208,
                                "major": 92,
                                "gpa": 66,
                                "level": 51
                        }
                },
                "CFAD": {
                        "scholarships": 105,
                        "essay_scholarships": 51,
                        "essay_percentage": 48.6,
                        "renewable": 1,
                        "unique_essays": 25,
                        "total_essay_requirements": 72,
                        "top_criteria_types": {
                                "application": 226,
                                "unknown": 208,
                                "gpa": 47,
                                "major": 47,
                                "level": 16
                        }
                },
                "COB": {
                        "scholarships": 116,
                        "essay_scholarships": 44,
                        "essay_percentage": 37.9,
                        "renewable": 7,
                        "unique_essays": 24,
                        "total_essay_requirements": 58,
                        "top_criteria_types": {
                                "unknown": 218,
                                "application": 193,
                                "major": 110,
                                "gpa": 87,
                                "level": 83
                        }
                },
                "GENERAL": {
                        "scholarships": 88,
                        "essay_scholarships": 25,
                        "essay_percentage": 28.4,
                        "renewable": 5,
                        "unique_essays": 23,
                        "total_essay_requirements": 36,
                        "top_criteria_types": {
                                "unknown": 95,
                                "application": 95,
                                "gpa": 35,
                                "level": 17,
                                "major": 16
                        }
                }
        },
        "essay_types": {
                "Complete Essay \"GEN_Financial Need\"": 113,
                "Complete Essay \"GEN_Personal_Statement \"": 51,
                "Complete Essay \"CFAD_Personal_Artist_Statement\"": 37,
                "Complete Essay \"GEN_Work_History\"": 9,
                "Complete Essay \"GEN_Leadership\"": 8,
                "Complete Essay \"COB_PersonalStatement/Career GOALS\"": 6,
                "Complete Essay \"CLA_MCOMM_Activities\"": 5,
                "Complete Essay \"COB_Financial_Need\"": 5,
                "Complete Essay \"ADV_Personal_Statement\"": 4,
                "Complete Essay \"GEN_UCO\"": 4,
                "Complete Essay \"CEPS_Campus_Organizations\"": 4,
                "Complete Essay \"CEPS_Bottger_Essay\"": 4,
                "Complete Essay \"GEN_Financial_Awards\"": 3,
                "Complete Essay \"CEPS_Ed_Leadership\"": 3,
                "Complete Essay \"CLA_Roberson_Background\"": 2,
                "Complete Essay \"CMS_Career_Goals\"": 2,
                "Complete Essay \"CMS_ Beresford_Progress\"": 2,
                "Complete Essay \"COB_PGM_Internship_Date\"": 2,
                "Complete Essay \"CEPS_Essay_Why_you_want_to_teach\"": 2,
                "Complete Essay \"CEPS_Personal_Statement\"": 2
        },
        "criteria_types": {
                "application": 1226,
                "unknown": 1157,
                "major": 469,
                "gpa": 414,
                "level": 289,
                "hours": 156,
                "citizenship": 27,
                "activities": 9,
                "military": 8,
                "financial_need": 3
        },
        "generated_date": "2025-09-04"
};
    }

    // Get current college distribution
    getCollegeDistribution() {
        return this.currentData.college_distribution;
    }

    // Get college details
    getCollegeDetails() {
        return this.currentData.college_details;
    }

    // Get essay analysis data
    async getEssayAnalysisData() {
        return {
            "metadata": {
                "total_scholarships_analyzed": 670,
                "scholarships_requiring_essays": 324,
                "percentage_requiring_essays": 48.4,
                "scholarships_with_multiple_essays": 81
            },
            "essay_types_frequency": {
                "Complete Essay \"GEN_Financial Need\"": 113,
                "Complete Essay \"GEN_Personal_Statement \"": 51,
                "Complete Essay \"CFAD_Personal_Artist_Statement\"": 37,
                "Complete Essay \"GEN_Work_History\"": 9,
                "Complete Essay \"GEN_Leadership\"": 8,
                "Complete Essay \"COB_PersonalStatement/Career GOALS\"": 6,
                "Complete Essay \"CLA_MCOMM_Activities\"": 5,
                "Complete Essay \"COB_Financial_Need\"": 5,
                "Complete Essay \"ADV_Personal_Statement\"": 4,
                "Complete Essay \"GEN_UCO\"": 4,
                "Complete Essay \"CEPS_Campus_Organizations\"": 4,
                "Complete Essay \"CEPS_Bottger_Essay\"": 4,
                "Complete Essay \"GEN_Financial_Awards\"": 3,
                "Complete Essay \"CEPS_Ed_Leadership\"": 3,
                "Complete Essay \"CLA_Roberson_Background\"": 2,
                "Complete Essay \"CMS_Career_Goals\"": 2,
                "Complete Essay \"CMS_ Beresford_Progress\"": 2,
                "Complete Essay \"COB_PGM_Internship_Date\"": 2,
                "Complete Essay \"CEPS_Essay_Why_you_want_to_teach\"": 2,
                "Complete Essay \"CEPS_Personal_Statement\"": 2
},
            "college_essay_breakdown": {
                "CEPS": {
                                "unique_essays": 50,
                                "total_essay_scholarships": 82,
                                "most_common_essay": "GEN_Financial Need",
                                "strategy": "Highlight teaching philosophy and campus involvement"
                },
                "CLA": {
                                "unique_essays": 45,
                                "total_essay_scholarships": 93,
                                "most_common_essay": "GEN_Financial Need",
                                "strategy": "Focus on writing skills, academic achievement, and cultural involvement"
                },
                "CMS": {
                                "unique_essays": 16,
                                "total_essay_scholarships": 29,
                                "most_common_essay": "GEN_Financial Need",
                                "strategy": "Focus on research experience and STEM leadership"
                },
                "CFAD": {
                                "unique_essays": 25,
                                "total_essay_scholarships": 51,
                                "most_common_essay": "GEN_Financial Need",
                                "strategy": "Prepare artist statements and creative portfolios"
                },
                "COB": {
                                "unique_essays": 24,
                                "total_essay_scholarships": 44,
                                "most_common_essay": "GEN_Financial Need",
                                "strategy": "Emphasize career goals, professional development, and leadership"
                }
}
        };
    }

    getCollegeStrategy(college_code) {
        const strategies = {
            'CLA': 'Focus on writing skills, academic achievement, and cultural involvement',
            'COB': 'Emphasize career goals, professional development, and leadership', 
            'CEPS': 'Highlight teaching philosophy and campus involvement',
            'CFAD': 'Prepare artist statements and creative portfolios',
            'CMS': 'Focus on research experience and STEM leadership'
        };
        return strategies[college_code] || 'Focus on academic excellence and program-specific requirements';
    }

    // Get criteria summary data
    async getCriteriaSummaryData() {
        return {
            "total_scholarships": 670,
            "total_criteria": 3758,
            "criteria_types": {
            "application": 1226,
            "unknown": 1157,
            "major": 469,
            "gpa": 414,
            "level": 289,
            "hours": 156,
            "citizenship": 27,
            "activities": 9,
            "military": 8,
            "financial_need": 3
},
            "banner_accessibility": {
                "banner_accessible": 1741,
                "manual_review": 2017,
                "percentage_automated": 46.3
            }
        };
    }
}

// Initialize global instance
window.scholarshipSummaryData = new ScholarshipSummaryData();
