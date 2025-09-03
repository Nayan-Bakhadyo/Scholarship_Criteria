// Summary Data Handler for Scholarship Analysis
// This file manages loading and displaying JSON data for the summary page

class ScholarshipSummaryData {
    constructor() {
        this.dataCache = {};
        this.baseURL = './';
    }

    // Load actual JSON files from the Python analysis
    async loadActualJSONFile(filename) {
        try {
            const response = await fetch(`${this.baseURL}${filename}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.warn(`Could not load ${filename}, using sample data:`, error);
            return null;
        }
    }

    // Get essay analysis data
    async getEssayAnalysisData() {
        if (this.dataCache.essayAnalysis) {
            return this.dataCache.essayAnalysis;
        }

        // Try to load actual data first
        let data = await this.loadActualJSONFile('essay_scholarships_report.json');
        
        if (!data) {
            // Fallback to constructed data based on our analysis
            data = {
                "metadata": {
                    "total_scholarships_analyzed": 671,
                    "scholarships_requiring_essays": 377,
                    "percentage_requiring_essays": 56.3,
                    "scholarships_with_multiple_essays": 81
                },
                "essay_types_frequency": {
                    "GEN_Financial Need": 113,
                    "GEN_Personal_Statement ": 51,
                    "CFAD_Personal_Artist_Statement": 37,
                    "GEN_Work_History": 9,
                    "GEN_Leadership": 8,
                    "COB_PersonalStatement/Career GOALS": 7,
                    "CLA_MCOMM_Activities": 5,
                    "COB_Financial_Need": 5,
                    "ADV_Personal_Statement": 4,
                    "GEN_UCO": 4,
                    "CEPS_Campus_Organizations": 4,
                    "CEPS_Bottger_Essay": 4,
                    "GEN_Financial_Awards": 3,
                    "CEPS_Ed_Leadership": 3
                },
                "college_essay_breakdown": {
                    "CLA": {
                        "unique_essays": 32,
                        "total_essay_scholarships": 219,
                        "most_common_essay": "GEN_Financial Need",
                        "strategy": "Focus on personal statements and writing samples"
                    },
                    "CEPS": {
                        "unique_essays": 40,
                        "total_essay_scholarships": 164,
                        "most_common_essay": "GEN_Financial Need",
                        "strategy": "Highlight teaching philosophy and campus involvement"
                    },
                    "CMS": {
                        "unique_essays": 11,
                        "total_essay_scholarships": 125,
                        "most_common_essay": "GEN_Financial Need",
                        "strategy": "Focus on research experience and STEM leadership"
                    },
                    "COB": {
                        "unique_essays": 19,
                        "total_essay_scholarships": 212,
                        "most_common_essay": "GEN_Financial Need",
                        "strategy": "Emphasize career goals and professional development"
                    },
                    "CFAD": {
                        "unique_essays": 15,
                        "total_essay_scholarships": 213,
                        "most_common_essay": "GEN_Financial Need",
                        "strategy": "Prepare artist statements and creative portfolios"
                    }
                },
                "application_strategy": {
                    "high_impact_essays": [
                        "Financial need essays are required for 113 scholarships",
                        "Personal statements are needed for 51 scholarships",
                        "Artist statements are crucial for 37 CFAD scholarships"
                    ],
                    "time_investment_tips": [
                        "Prepare standard essays that can be adapted",
                        "Focus on college-specific scholarships first",
                        "Target scholarships with GPA requirements you meet"
                    ]
                }
            };
        }

        this.dataCache.essayAnalysis = data;
        return data;
    }

    // Get criteria summary data
    async getCriteriaSummaryData() {
        if (this.dataCache.criteriaSummary) {
            return this.dataCache.criteriaSummary;
        }

        let data = await this.loadActualJSONFile('criteria_summary.json');
        
        if (!data) {
            data = {
                "totals": {
                    "scholarships": 671,
                    "avg_criteria_per_scholarship": 5.6,
                    "total_criteria": 3758
                },
                "criterion_type_counts": {
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
                "banner_accessibility_counts": {
                    "banner_accessible": 1741,
                    "manual_review": 1223,
                    "application_required": 771,
                    "unknown": 23
                },
                "sis_field_usage": {
                    "sis_major": 5034,
                    "sis_major_1_2": 3642,
                    "sis_major_2": 3592,
                    "sis_major_2_2": 3464,
                    "sis_cumgpa": 816,
                    "sis_level": 686,
                    "sis_classification": 548,
                    "sis_college": 412,
                    "sis_enrolled_status": 320,
                    "sis_minor": 158
                },
                "application_items": {
                    "complete_application": 580,
                    "complete_essay": 412,
                    "complete_attachment": 235
                },
                "gpa_analysis": {
                    "ranges": {
                        "2.0-2.5": 0,
                        "2.5-3.0": 87,
                        "3.0-3.5": 201,
                        "3.5-4.0": 126
                    },
                    "most_common_requirements": [2.5, 3.0, 3.25, 3.5]
                }
            };
        }

        this.dataCache.criteriaSummary = data;
        return data;
    }

    // Get conditional questions data
    async getConditionalQuestionsData() {
        if (this.dataCache.conditionalQuestions) {
            return this.dataCache.conditionalQuestions;
        }

        let data = await this.loadActualJSONFile('practical_conditional_system.json');
        
        if (!data) {
            data = {
                "conditional_questions": {
                    "student_profile": {
                        "title": "Student Profile",
                        "questions": [
                            {
                                "id": "classification",
                                "question": "What is your current academic level?",
                                "type": "single_choice",
                                "options": [
                                    {"value": "freshman", "label": "Freshman"},
                                    {"value": "sophomore", "label": "Sophomore"},
                                    {"value": "junior", "label": "Junior"},
                                    {"value": "senior", "label": "Senior"},
                                    {"value": "graduate", "label": "Graduate Student"}
                                ],
                                "impact": "Filters scholarships by academic level - 671 total scholarships available"
                            },
                            {
                                "id": "college",
                                "question": "Which college is your major in?",
                                "type": "single_choice",
                                "options": [
                                    {"value": "CLA", "label": "College of Liberal Arts"},
                                    {"value": "COB", "label": "College of Business"},
                                    {"value": "CEPS", "label": "College of Education and Professional Studies"},
                                    {"value": "CFAD", "label": "College of Fine Arts and Design"},
                                    {"value": "CMS", "label": "College of Math and Science"}
                                ],
                                "impact": "Determines which majors are available and college-specific scholarships"
                            },
                            {
                                "id": "gpa",
                                "question": "What is your cumulative GPA?",
                                "type": "number_input",
                                "min": 0.0,
                                "max": 4.0,
                                "impact": "GPA requirements range from 2.0 to 4.0"
                            }
                        ]
                    },
                    "eligibility": {
                        "title": "Basic Eligibility",
                        "questions": [
                            {
                                "id": "residency",
                                "question": "Are you an Oklahoma resident?",
                                "type": "yes_no",
                                "impact": "Some scholarships are restricted to Oklahoma residents"
                            },
                            {
                                "id": "citizenship",
                                "question": "Are you a US citizen?",
                                "type": "yes_no",
                                "impact": "Some scholarships require US citizenship"
                            },
                            {
                                "id": "financial_need",
                                "question": "Do you have demonstrated financial need?",
                                "type": "yes_no",
                                "impact": "Financial need is considered for 113 scholarships"
                            }
                        ]
                    },
                    "application_commitment": {
                        "title": "Application Commitment",
                        "questions": [
                            {
                                "id": "essay_willingness",
                                "question": "Are you willing to write essays?",
                                "type": "yes_no",
                                "impact": "Essays are required for 156 different scholarship types"
                            }
                        ]
                    }
                },
                "filtering_impact": {
                    "college_filter": "5 colleges with specific scholarship programs",
                    "gpa_filter": "414 criteria with GPA requirements",
                    "essay_filter": "377 scholarships requiring essays",
                    "classification_filter": "6 academic levels supported",
                    "need_filter": "113 scholarships consider financial need"
                }
            };
        }

        this.dataCache.conditionalQuestions = data;
        return data;
    }

    // Get banner automation analysis
    async getBannerAnalysisData() {
        if (this.dataCache.bannerAnalysis) {
            return this.dataCache.bannerAnalysis;
        }

        let data = await this.loadActualJSONFile('banner_automation_analysis.json');
        
        if (!data) {
            data = {
                "automation_summary": {
                    "total_criteria": 3758,
                    "banner_accessible": {
                        "count": 1741,
                        "percentage": 46.3,
                        "description": "Criteria that can be automatically processed through Banner"
                    },
                    "manual_review": {
                        "count": 1223,
                        "percentage": 32.5,
                        "description": "Criteria requiring human review and verification"
                    },
                    "application_required": {
                        "count": 771,
                        "percentage": 20.5,
                        "description": "Criteria needing additional application materials"
                    },
                    "unknown": {
                        "count": 23,
                        "percentage": 0.6,
                        "description": "Criteria with unclear automation potential"
                    }
                },
                "sis_integration": {
                    "most_automated_fields": [
                        "Major requirements (469 criteria)",
                        "GPA thresholds (414 criteria)",
                        "Classification levels (289 criteria)",
                        "Credit hours (156 criteria)",
                        "Citizenship status (27 criteria)"
                    ],
                    "enhancement_opportunities": [
                        "SIS pattern recognition for soft requirements",
                        "Automated essay type detection",
                        "Dynamic GPA threshold matching",
                        "Real-time enrollment verification"
                    ]
                },
                "automation_recommendations": {
                    "immediate": "Focus on SIS field integration for major, GPA, and classification filtering",
                    "short_term": "Enhance pattern recognition for soft requirements with operators",
                    "long_term": "Implement ML-based criteria categorization and matching algorithms"
                }
            };
        }

        this.dataCache.bannerAnalysis = data;
        return data;
    }

    // Utility method to get all data types
    async getAllData() {
        const [essayData, criteriaData, questionsData, bannerData] = await Promise.all([
            this.getEssayAnalysisData(),
            this.getCriteriaSummaryData(),
            this.getConditionalQuestionsData(),
            this.getBannerAnalysisData()
        ]);

        return {
            essay_analysis: essayData,
            criteria_summary: criteriaData,
            conditional_questions: questionsData,
            banner_analysis: bannerData
        };
    }

    // Get formatted data for charts and displays
    getFormattedCollegeData() {
        return [
            { name: 'CMS', fullName: 'College of Math and Science', majors: 58, color: '#dc3545', scholarships: 125 },
            { name: 'CLA', fullName: 'College of Liberal Arts', majors: 102, color: '#28a745', scholarships: 219 },
            { name: 'COB', fullName: 'College of Business', majors: 50, color: '#007bff', scholarships: 212 },
            { name: 'CFAD', fullName: 'College of Fine Arts and Design', majors: 58, color: '#ffc107', scholarships: 213 },
            { name: 'CEPS', fullName: 'College of Education and Professional Studies', majors: 92, color: '#6f42c1', scholarships: 164 }
        ];
    }

    getFormattedEssayTypes() {
        return [
            { name: 'Financial Need', key: 'GEN_Financial Need', count: 113, color: '#dc3545', description: 'Most common essay requirement' },
            { name: 'Personal Statement', key: 'GEN_Personal_Statement', count: 51, color: '#28a745', description: 'General personal essays' },
            { name: 'Artist Statement', key: 'CFAD_Personal_Artist_Statement', count: 37, color: '#ffc107', description: 'Arts-focused portfolios' },
            { name: 'Work History', key: 'GEN_Work_History', count: 9, color: '#007bff', description: 'Professional experience' },
            { name: 'Leadership', key: 'GEN_Leadership', count: 8, color: '#6f42c1', description: 'Leadership activities' },
            { name: 'Career Goals', key: 'COB_PersonalStatement/Career GOALS', count: 7, color: '#20c997', description: 'Business-focused goals' }
        ];
    }
}

// Create global instance
const summaryData = new ScholarshipSummaryData();
