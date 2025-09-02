# Banner Data Fields Reference
# Available data fields from Banner system for scholarship eligibility checking

## Student Demographics
- **ID**: Student identification number
- **First Name**: Student's first name
- **Last Name**: Student's last name
- **Gender**: Student's gender
- **Hispanic/Latino Flag**: Ethnicity indicator
- **UCO Email**: University email address
- **Other Email**: Alternative email address

## Academic Information
- **Term Code**: Current term code
- **Term**: Current term description
- **Level**: Academic level (Undergraduate, Graduate, etc.)
- **Classification**: Student classification (Freshman, Sophomore, Junior, Senior, Graduate)
- **College 1**: Primary college
- **Major Code 1**: Primary major code
- **Major 1**: Primary major name
- **College 2**: Secondary college (if applicable)
- **Major Code 2**: Secondary major code
- **Major 2**: Secondary major name
- **College Code 3**: Third college (if applicable)
- **Major Code 3**: Third major code
- **Major 3**: Third major name
- **Minor Code 1**: Primary minor code
- **Minor 1**: Primary minor name
- **Minor Code 2**: Secondary minor code
- **Minor 2**: Secondary minor name
- **Minor Code 3**: Third minor code
- **Minor 3**: Third minor name

## Academic Progress
- **Cumulative Hours**: Total credit hours completed
- **Cumulative GPA**: Overall grade point average
- **Transfer Hours**: Credit hours transferred from other institutions
- **Term Hours Enrolled**: Current term enrolled hours
- **Term Hours Billed**: Current term billed hours

## Enrollment & Admission
- **Residency**: In-state/out-of-state status
- **Term Admitted**: Term when student was admitted
- **Admission Type**: Type of admission (Freshman, Transfer, etc.)
- **High School**: High school attended
- **Term Hours Enrolled**: Current term enrolled hours (indicates Full-time/Part-time status)
- **Term Hours Billed**: Current term billed hours

## Financial Aid
- **2425 Unmet Need**: Unmet financial need for 2024-25
- **2526 Unmet Need**: Unmet financial need for 2025-26
- **2425 FAFSA**: FAFSA completion status for 2024-25
- **2526 FAFSA**: FAFSA completion status for 2025-26

## Athletics
- **Sport Code**: Athletic sport participation (if applicable)

## Mapping to SIS Fields in Scholarship Criteria

### Directly Available (banner_accessible)
- `SIS_Major` → Major 1, Major 2, Major 3
- `SIS_Minor` → Minor 1, Minor 2, Minor 3
- `SIS_Classification` → Classification
- `SIS_College` → College 1, College 2, College Code 3
- `SIS_Level` → Level (Undergraduate/Graduate)
- `SIS_CumGPA` → Cumulative GPA
- `SIS_Hours` → Cumulative Hours
- `SIS_Term_Hours` → Term Hours Enrolled
- `SIS_Enrolled_Status` / `SIS_Full_Time` → Term Hours Enrolled (12+ = Full Time)
- `SIS_Gender` → Gender
- `SIS_Hispanic` → Hispanic/Latino Flag
- `SIS_Resident` / `SIS_Residency` → Residency
- `SIS_Transfer_Hours` → Transfer Hours
- `SIS_High_School` → High School
- `SIS_Term_Admitted` → Term Admitted
- `SIS_Admission_Type` → Admission Type
- `SIS_FAFSA` → FAFSA completion status
- `SIS_Unmet_Need` → Unmet Need amounts
- `SIS_Sport` → Sport Code

### Requires Application Materials (application_required)
- Essays, personal statements, writing samples
- Letters of recommendation
- Portfolios, creative works
- Additional transcripts beyond Banner
- Interview requirements
- Specific application forms

### Requires Manual Review (manual_review)
- Demonstrated financial need (beyond FAFSA data)
- Extracurricular activities documentation
- Community service verification
- Leadership experience assessment
- Employment history verification
- Special circumstances evaluation

## Notes
- Financial need can be partially automated using FAFSA and Unmet Need data
- Some criteria may combine Banner data with manual review
- Athletic participation requires Sport Code to be populated in Banner
- Multiple majors/minors are supported through the multiple college/major fields
