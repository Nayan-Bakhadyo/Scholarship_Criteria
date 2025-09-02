// UCO Foundation Scholarship Portal JavaScript

// Global variables
let scholarships = [];
let filteredScholarships = [];
let currentPage = 1;
const itemsPerPage = 12;
let viewMode = 'grid';

// Calculate complexity score for a scholarship
function calculateComplexityScore(scholarship) {
    let complexity = 0;
    
    // Hard criteria complexity (weighted heavily)
    complexity += scholarship.hard_criteria.criteria_count * 3;
    
    // General criteria complexity
    complexity += scholarship.general_criteria.criteria_count * 1;
    
    // Conditional criteria complexity
    complexity += scholarship.conditional_criteria.criteria_count * 2;
    
    // Application requirements add complexity
    if (scholarship.hard_criteria.criteria) {
        scholarship.hard_criteria.criteria.forEach(criteria => {
            if (criteria.banner_accessibility === 'application_required') {
                complexity += 2;
            } else if (criteria.banner_accessibility === 'manual_review') {
                complexity += 3;
            }
        });
    }
    
    return complexity;
}

// Progress status management functions
function determineProgressStatus(scholarship) {
    const scholarshipId = scholarship.basic_information.scholarship_id;
    
    // Check localStorage first for any manual overrides
    const localStatus = getLocalProgressStatus(scholarshipId);
    if (localStatus) {
        return localStatus;
    }
    
    // Fall back to JSON file status
    return scholarship.progress_status || 'not-processed';
}

function getLocalProgressStatus(scholarshipId) {
    try {
        const localStatuses = JSON.parse(localStorage.getItem('scholarshipProgressStatus') || '{}');
        return localStatuses[scholarshipId];
    } catch (error) {
        console.error('Error reading local progress status:', error);
        return null;
    }
}

function setLocalProgressStatus(scholarshipId, status) {
    try {
        const localStatuses = JSON.parse(localStorage.getItem('scholarshipProgressStatus') || '{}');
        localStatuses[scholarshipId] = status;
        localStorage.setItem('scholarshipProgressStatus', JSON.stringify(localStatuses));
        
        // Also update the in-memory scholarship data
        const scholarship = scholarships.find(s => s.basic_information.scholarship_id === scholarshipId);
        if (scholarship) {
            scholarship.progress_status = status;
        }
        
        return true;
    } catch (error) {
        console.error('Error saving local progress status:', error);
        return false;
    }
}

function getProgressStatusInfo(status) {
    const statusConfig = {
        'not-processed': {
            label: 'Not Processed',
            icon: 'fas fa-circle',
            class: 'text-secondary'
        },
        'in-process': {
            label: 'In Process',
            icon: 'fas fa-clock',
            class: 'text-warning'
        },
        'complete': {
            label: 'Complete',
            icon: 'fas fa-check-circle',
            class: 'text-success'
        }
    };
    
    return statusConfig[status] || statusConfig['not-processed'];
}

// Export/Import functions for syncing across devices
function exportProgressData() {
    try {
        const progressData = localStorage.getItem('scholarshipProgressStatus') || '{}';
        const blob = new Blob([progressData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `scholarship_progress_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showNotification('Progress data exported successfully!', 'success');
    } catch (error) {
        console.error('Error exporting progress data:', error);
        showNotification('Failed to export progress data', 'error');
    }
}

function importProgressData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = function(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const progressData = JSON.parse(e.target.result);
                localStorage.setItem('scholarshipProgressStatus', JSON.stringify(progressData));
                
                // Refresh the display
                displayScholarships();
                showNotification('Progress data imported successfully!', 'success');
            } catch (error) {
                console.error('Error importing progress data:', error);
                showNotification('Failed to import progress data. Invalid file format.', 'error');
            }
        };
        reader.readAsText(file);
    };
    
    input.click();
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'error' ? 'danger' : type === 'success' ? 'success' : 'info'} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 5000);
}

// Get progress status display information
function getProgressStatusInfo(status) {
    switch (status) {
        case 'complete':
            return {
                label: 'Complete',
                class: 'bg-success',
                icon: 'fas fa-check'
            };
        case 'in-process':
            return {
                label: 'In Process',
                class: 'bg-warning text-dark',
                icon: 'fas fa-clock'
            };
        case 'not-processed':
        default:
            return {
                label: 'Not Processed',
                class: 'bg-secondary',
                icon: 'fas fa-hourglass-start'
            };
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadScholarships();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Search input
    document.getElementById('searchInput').addEventListener('input', debounce(applyFilters, 300));
    
    // Filter dropdowns
    ['committeeFilter', 'renewableFilter', 'minGPA', 'levelFilter', 'progressFilter', 'sortBy'].forEach(id => {
        document.getElementById(id).addEventListener('change', applyFilters);
    });
    
    // Initialize status change modal
    initializeStatusChangeModal();
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Load scholarships from JSON files
async function loadScholarships() {
    showLoading(true);
    console.log('Starting to load scholarships...');
    
    try {
        // Static list of all JSON files (GitHub Pages compatible)
        const jsonFiles = await getScholarshipFileList();
        console.log(`Found ${jsonFiles.length} JSON files to load`);
        
        // Load scholarships in batches to avoid overwhelming the browser
        const batchSize = 50;
        scholarships = [];
        
        for (let i = 0; i < jsonFiles.length; i += batchSize) {
            const batch = jsonFiles.slice(i, i + batchSize);
            const batchNum = Math.floor(i/batchSize) + 1;
            const totalBatches = Math.ceil(jsonFiles.length/batchSize);
            
            console.log(`Loading batch ${batchNum}/${totalBatches}`);
            updateLoadingProgress(i, jsonFiles.length, `Loading batch ${batchNum}/${totalBatches}...`);
            
            const promises = batch.map(fileName => 
                fetch(`scholarship_json_files/${fileName}`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`HTTP ${response.status} for ${fileName}`);
                        }
                        return response.json();
                    })
                    .catch(error => {
                        console.error(`Error loading ${fileName}:`, error);
                        return null;
                    })
            );
            
            const results = await Promise.all(promises);
            const validResults = results.filter(scholarship => scholarship !== null);
            
            // Calculate complexity and progress status for each scholarship
            validResults.forEach(scholarship => {
                if (scholarship) {
                    scholarship.complexityScore = calculateComplexityScore(scholarship);
                    scholarship.progressStatus = determineProgressStatus(scholarship);
                }
            });
            
            scholarships.push(...validResults);
            
            // Update progress
            const currentProgress = i + batch.length;
            updateLoadingProgress(currentProgress, jsonFiles.length);
            console.log(`Progress: ${Math.round(currentProgress/jsonFiles.length*100)}% (${scholarships.length} scholarships loaded)`);
        }
        
        console.log(`Successfully loaded ${scholarships.length} scholarships`);
        
        // Initialize filters and display
        populateFilters();
        updateStatistics();
        filteredScholarships = [...scholarships];
        displayScholarships();
        
    } catch (error) {
        console.error('Error loading scholarships:', error);
        showError();
    }
    
    showLoading(false);
}

// Get list of scholarship files (static approach for GitHub Pages)
async function getScholarshipFileList() {
    try {
        // Try to load the file list from a static JSON file
        console.log('Attempting to load file-list.json...');
        const response = await fetch('scholarship_json_files/file-list.json');
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        console.log(`Loaded file list with ${data.files.length} files`);
        return data.files;
        
    } catch (error) {
        // Fallback to predefined list
        console.log('Using fallback file list due to error:', error.message);
        const fallbackFiles = [
            '107109.json', '107526.json', '107527.json', '107528.json', '107531.json',
            '107533.json', '107534.json', '107536.json', '107537.json', '107538.json',
            '107539.json', '107540.json', '107541.json', '107542.json', '107543.json',
            '107545.json', '107548.json', '107550.json', '107551.json', '107552.json',
            '107635.json', '107624.json', '148554.json', '109739.json', '109788.json'
        ];
        console.log(`Using ${fallbackFiles.length} fallback files`);
        return fallbackFiles;
    }
}

// Populate filter dropdowns
function populateFilters() {
    if (scholarships.length === 0) return;
    
    // Populate committee filter
    const committees = [...new Set(scholarships.map(s => s.basic_information.committee_name))].sort();
    const committeeFilter = document.getElementById('committeeFilter');
    committees.forEach(committee => {
        if (committee) {
            const option = document.createElement('option');
            option.value = committee;
            option.textContent = committee;
            committeeFilter.appendChild(option);
        }
    });
}

// Update statistics
function updateStatistics() {
    console.log('Updating statistics with', scholarships.length, 'scholarships');
    
    if (scholarships.length === 0) {
        document.getElementById('total-scholarships').textContent = '0';
        document.getElementById('renewable-scholarships').textContent = '0';
        document.getElementById('committees-count').textContent = '0';
        return;
    }
    
    // Total scholarships
    document.getElementById('total-scholarships').textContent = scholarships.length.toLocaleString();
    
    // Renewable scholarships
    const renewableCount = scholarships.filter(s => 
        s.renewable_information && s.renewable_information.is_renewable === true
    ).length;
    document.getElementById('renewable-scholarships').textContent = renewableCount.toLocaleString();
    
    // Unique committees
    const committees = scholarships
        .map(s => s.basic_information && s.basic_information.committee_name)
        .filter(name => name && name.trim() !== '');
    const committeesCount = new Set(committees).size;
    document.getElementById('committees-count').textContent = committeesCount.toLocaleString();
    
    console.log('Statistics updated:', {
        total: scholarships.length,
        renewable: renewableCount,
        committees: committeesCount
    });
}

// Apply filters
function applyFilters() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const committeeFilter = document.getElementById('committeeFilter').value;
    const renewableFilter = document.getElementById('renewableFilter').value;
    const minGPA = document.getElementById('minGPA').value;
    const levelFilter = document.getElementById('levelFilter').value;
    const progressFilter = document.getElementById('progressFilter').value;
    const sortBy = document.getElementById('sortBy').value;
    
    filteredScholarships = scholarships.filter(scholarship => {
        // Search filter
        if (searchTerm && !scholarship.basic_information.scholarship_name.toLowerCase().includes(searchTerm)) {
            return false;
        }
        
        // Committee filter
        if (committeeFilter && scholarship.basic_information.committee_name !== committeeFilter) {
            return false;
        }
        
        // Renewable filter
        if (renewableFilter !== '') {
            const isRenewable = renewableFilter === 'true';
            if (scholarship.renewable_information.is_renewable !== isRenewable) {
                return false;
            }
        }
        
        // GPA filter
        if (minGPA) {
            const hasGPARequirement = scholarship.hard_criteria.criteria.some(criteria => 
                criteria.type === 'gpa' && extractGPAValue(criteria.description) >= parseFloat(minGPA)
            );
            if (!hasGPARequirement) {
                return false;
            }
        }
        
        // Level filter
        if (levelFilter) {
            const hasLevelRequirement = scholarship.hard_criteria.criteria.some(criteria => 
                criteria.type === 'level' && criteria.description.toLowerCase().includes(levelFilter)
            );
            if (!hasLevelRequirement) {
                return false;
            }
        }
        
        // Progress status filter
        if (progressFilter && scholarship.progressStatus !== progressFilter) {
            return false;
        }
        
        return true;
    });
    
    // Sort filtered results
    sortScholarships(sortBy);
    
    // Reset pagination
    currentPage = 1;
    displayScholarships();
}

// Sort scholarships
function sortScholarships(sortBy) {
    switch (sortBy) {
        case 'name':
            filteredScholarships.sort((a, b) => 
                a.basic_information.scholarship_name.localeCompare(b.basic_information.scholarship_name)
            );
            break;
        case 'name-desc':
            filteredScholarships.sort((a, b) => 
                b.basic_information.scholarship_name.localeCompare(a.basic_information.scholarship_name)
            );
            break;
        case 'id':
            filteredScholarships.sort((a, b) => 
                a.basic_information.scholarship_id - b.basic_information.scholarship_id
            );
            break;
        case 'id-desc':
            filteredScholarships.sort((a, b) => 
                b.basic_information.scholarship_id - a.basic_information.scholarship_id
            );
            break;
        case 'candidates':
            filteredScholarships.sort((a, b) => 
                b.basic_information.candidate_count - a.basic_information.candidate_count
            );
            break;
        case 'complexity':
            filteredScholarships.sort((a, b) => 
                a.complexityScore - b.complexityScore
            );
            break;
        case 'complexity-desc':
            filteredScholarships.sort((a, b) => 
                b.complexityScore - a.complexityScore
            );
            break;
    }
}

// Extract GPA value from requirement text
function extractGPAValue(text) {
    const gpaMatch = text.match(/(\d+\.?\d*)/);
    return gpaMatch ? parseFloat(gpaMatch[1]) : 0;
}

// Display scholarships
function displayScholarships() {
    const container = document.getElementById('scholarships-container');
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageScholarships = filteredScholarships.slice(startIndex, endIndex);
    
    // Update results count
    document.getElementById('results-count').textContent = 
        `${filteredScholarships.length} scholarship${filteredScholarships.length !== 1 ? 's' : ''}`;
    
    // Clear container
    container.innerHTML = '';
    
    // Add view mode class
    container.className = viewMode === 'list' ? 'list-view' : 'row';
    
    if (pageScholarships.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fas fa-search fa-3x text-muted mb-3"></i>
                <h4>No scholarships found</h4>
                <p class="text-muted">Try adjusting your search criteria</p>
            </div>
        `;
        return;
    }
    
    // Display scholarships
    pageScholarships.forEach(scholarship => {
        const scholarshipCard = createScholarshipCard(scholarship);
        container.appendChild(scholarshipCard);
    });
    
    // Update pagination
    updatePagination();
}

// Create scholarship card
function createScholarshipCard(scholarship) {
    const colClass = viewMode === 'list' ? 'col-12' : 'col-lg-4 col-md-6 col-sm-12';
    const cardElement = document.createElement('div');
    cardElement.className = `${colClass} mb-4`;
    
    const hardCount = scholarship.hard_criteria.criteria_count;
    const generalCount = scholarship.general_criteria.criteria_count;
    const conditionalCount = scholarship.conditional_criteria.criteria_count;
    const totalPoints = scholarship.general_criteria.total_possible_points;
    
    // Get progress status info
    const progressStatus = scholarship.progressStatus || 'not-processed';
    const progressInfo = getProgressStatusInfo(progressStatus);
    
    cardElement.innerHTML = `
        <div class="card scholarship-card h-100" onclick="showScholarshipDetails(${scholarship.basic_information.scholarship_id})">
            <div class="card-header">
                <div class="d-flex justify-content-between align-items-start">
                    <h5 class="card-title mb-1">${scholarship.basic_information.scholarship_name}</h5>
                    <div class="d-flex flex-column align-items-end">
                        <span class="badge scholarship-code mb-1">${scholarship.basic_information.scholarship_code}</span>
                        <span class="badge ${progressInfo.class} small progress-status-badge" 
                              onclick="event.stopPropagation(); showStatusChangeModal(${scholarship.basic_information.scholarship_id})"
                              title="Click to change status" style="cursor: pointer;">
                            <i class="${progressInfo.icon} me-1"></i>${progressInfo.label}
                        </span>
                    </div>
                </div>
                <p class="mb-0 small">${scholarship.basic_information.committee_name}</p>
            </div>
            <div class="card-body">
                <div class="row mb-3">
                    <div class="col-4">
                        <small class="text-muted">Candidates</small>
                        <div class="fw-bold">${scholarship.basic_information.candidate_count}</div>
                    </div>
                    <div class="col-4">
                        <small class="text-muted">Renewable</small>
                        <div class="fw-bold">
                            ${scholarship.renewable_information.is_renewable ? 
                                `<i class="fas fa-check text-success"></i> Yes` : 
                                `<i class="fas fa-times text-danger"></i> No`}
                        </div>
                    </div>
                    <div class="col-4">
                        <small class="text-muted">Complexity</small>
                        <div class="fw-bold">${scholarship.complexityScore || 0}</div>
                    </div>
                </div>
                
                <div class="criteria-summary mb-3">
                    <span class="badge bg-primary criteria-badge me-2">
                        <i class="fas fa-exclamation-circle me-1"></i>
                        ${hardCount} Required
                    </span>
                    ${generalCount > 0 ? `
                        <span class="badge bg-info criteria-badge me-2">
                            <i class="fas fa-star me-1"></i>
                            ${generalCount} Optional (${totalPoints} pts)
                        </span>
                    ` : ''}
                    ${conditionalCount > 0 ? `
                        <span class="badge bg-warning criteria-badge">
                            <i class="fas fa-redo me-1"></i>
                            ${conditionalCount} Renewal
                        </span>
                    ` : ''}
                </div>
                
                <p class="card-text">
                    ${scholarship.description.length > 150 ? 
                        scholarship.description.substring(0, 150) + '...' : 
                        scholarship.description}
                </p>
            </div>
            <div class="card-footer bg-transparent">
                <button class="btn btn-uco-blue btn-sm w-100">
                    <i class="fas fa-eye me-2"></i>View Details
                </button>
            </div>
        </div>
    `;
    
    return cardElement;
}

// Show scholarship details in modal
async function showScholarshipDetails(scholarshipId) {
    const scholarship = scholarships.find(s => s.basic_information.scholarship_id === scholarshipId);
    if (!scholarship) return;
    
    const modalTitle = document.getElementById('scholarshipModalLabel');
    const modalBody = document.getElementById('scholarship-details');
    
    modalTitle.textContent = scholarship.basic_information.scholarship_name;
    
    modalBody.innerHTML = `
        <div class="row">
            <div class="col-md-8">
                <div class="mb-4">
                    <h6 class="text-uco-blue">Basic Information</h6>
                    <div class="card">
                        <div class="card-body">
                            <div class="row">
                                <div class="col-md-6">
                                    <strong>Scholarship ID:</strong> ${scholarship.basic_information.scholarship_id}<br>
                                    <strong>Code:</strong> ${scholarship.basic_information.scholarship_code}<br>
                                    <strong>Donor:</strong> ${scholarship.basic_information.donor_name}
                                </div>
                                <div class="col-md-6">
                                    <strong>Committee:</strong> ${scholarship.basic_information.committee_name}<br>
                                    <strong>Candidates:</strong> ${scholarship.basic_information.candidate_count}<br>
                                    <strong>Renewable:</strong> ${scholarship.renewable_information.is_renewable ? 'Yes' : 'No'}
                                    ${scholarship.renewable_information.renewable_years > 0 ? 
                                        ` (${scholarship.renewable_information.renewable_years} years)` : ''}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="mb-4">
                    <h6 class="text-uco-blue">Description</h6>
                    <div class="card">
                        <div class="card-body">
                            <p>${scholarship.description}</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="col-md-4">
                <div class="criteria-section p-3">
                    <h6><i class="fas fa-exclamation-circle me-2"></i>Hard Criteria</h6>
                    <p class="small text-muted">${scholarship.hard_criteria.description}</p>
                    ${scholarship.hard_criteria.criteria.map(criteria => `
                        <div class="criteria-item ${criteria.type}">
                            <strong>${criteria.id}.</strong> ${criteria.clean_description || criteria.description}
                            ${criteria.banner_accessibility ? `<span class="badge ms-2 ${criteria.banner_accessibility === 'banner_accessible' ? 'bg-success' : criteria.banner_accessibility === 'application_required' ? 'bg-warning' : 'bg-secondary'}">${criteria.banner_accessibility.replace('_', ' ')}</span>` : ''}
                        </div>
                    `).join('')}
                    ${scholarship.hard_criteria.banner_summary ? `
                        <div class="mt-3">
                            <small class="text-muted">
                                <strong>Banner Summary:</strong> 
                                ${scholarship.hard_criteria.banner_summary.banner_accessible} Banner accessible, 
                                ${scholarship.hard_criteria.banner_summary.application_required} Application required, 
                                ${scholarship.hard_criteria.banner_summary.manual_review} Manual review
                            </small>
                        </div>
                    ` : ''}
                </div>
                
                ${scholarship.general_criteria.criteria_count > 0 ? `
                    <div class="criteria-section p-3">
                        <h6><i class="fas fa-star me-2"></i>General Criteria 
                            <span class="badge points-badge">${scholarship.general_criteria.total_possible_points} points</span>
                        </h6>
                        <p class="small text-muted">${scholarship.general_criteria.description}</p>
                        ${scholarship.general_criteria.criteria.map(criteria => `
                            <div class="criteria-item ${criteria.type}">
                                <div class="d-flex justify-content-between align-items-start">
                                    <span><strong>${criteria.id}.</strong> ${criteria.description}
                                        ${criteria.banner_accessibility ? `<span class="badge ms-2 ${criteria.banner_accessibility === 'banner_accessible' ? 'bg-success' : criteria.banner_accessibility === 'application_required' ? 'bg-warning' : 'bg-secondary'}">${criteria.banner_accessibility.replace('_', ' ')}</span>` : ''}
                                    </span>
                                    ${criteria.points ? `<span class="badge points-badge">${criteria.points}</span>` : ''}
                                </div>
                            </div>
                        `).join('')}
                        ${scholarship.general_criteria.banner_summary ? `
                            <div class="mt-3">
                                <small class="text-muted">
                                    <strong>Banner Summary:</strong> 
                                    ${scholarship.general_criteria.banner_summary.banner_accessible} Banner accessible, 
                                    ${scholarship.general_criteria.banner_summary.application_required} Application required, 
                                    ${scholarship.general_criteria.banner_summary.manual_review} Manual review
                                </small>
                            </div>
                        ` : ''}
                    </div>
                ` : ''}
                
                ${scholarship.conditional_criteria.criteria_count > 0 ? `
                    <div class="criteria-section p-3">
                        <h6><i class="fas fa-redo me-2"></i>Renewal Requirements</h6>
                        <p class="small text-muted">${scholarship.conditional_criteria.description}</p>
                        ${scholarship.conditional_criteria.criteria.map(criteria => `
                            <div class="criteria-item ${criteria.type}">
                                <strong>${criteria.id}.</strong> ${criteria.description}
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        </div>
    `;
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('scholarshipModal'));
    modal.show();
}

// Update pagination
function updatePagination() {
    const totalPages = Math.ceil(filteredScholarships.length / itemsPerPage);
    const pagination = document.getElementById('pagination');
    
    pagination.innerHTML = '';
    
    if (totalPages <= 1) return;
    
    // Previous button
    const prevLi = document.createElement('li');
    prevLi.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
    prevLi.innerHTML = `<a class="page-link" href="#" onclick="changePage(${currentPage - 1})">Previous</a>`;
    pagination.appendChild(prevLi);
    
    // Page numbers
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);
    
    for (let i = startPage; i <= endPage; i++) {
        const li = document.createElement('li');
        li.className = `page-item ${i === currentPage ? 'active' : ''}`;
        li.innerHTML = `<a class="page-link" href="#" onclick="changePage(${i})">${i}</a>`;
        pagination.appendChild(li);
    }
    
    // Next button
    const nextLi = document.createElement('li');
    nextLi.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
    nextLi.innerHTML = `<a class="page-link" href="#" onclick="changePage(${currentPage + 1})">Next</a>`;
    pagination.appendChild(nextLi);
}

// Change page
function changePage(page) {
    const totalPages = Math.ceil(filteredScholarships.length / itemsPerPage);
    if (page < 1 || page > totalPages) return;
    
    currentPage = page;
    displayScholarships();
    
    // Scroll to top of scholarships section
    document.getElementById('scholarships').scrollIntoView({ behavior: 'smooth' });
}

// Set view mode
function setViewMode(mode) {
    viewMode = mode;
    
    // Update button states
    document.getElementById('grid-view').classList.toggle('active', mode === 'grid');
    document.getElementById('list-view').classList.toggle('active', mode === 'list');
    
    displayScholarships();
}

// Clear filters
function clearFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('committeeFilter').value = '';
    document.getElementById('renewableFilter').value = '';
    document.getElementById('minGPA').value = '';
    document.getElementById('levelFilter').value = '';
    document.getElementById('progressFilter').value = '';
    document.getElementById('sortBy').value = 'name';
    
    applyFilters();
}

// Update loading progress
function updateLoadingProgress(current, total, status = '') {
    const percent = Math.round((current / total) * 100);
    const progressBar = document.getElementById('loading-progress');
    const progressText = document.getElementById('loading-text');
    
    if (progressBar) {
        progressBar.style.width = `${percent}%`;
        progressBar.setAttribute('aria-valuenow', percent);
    }
    
    if (progressText) {
        if (status) {
            progressText.textContent = status;
        } else {
            progressText.textContent = `Loading scholarships... ${percent}% (${current}/${total})`;
        }
    }
    
    console.log(`Progress: ${percent}% - ${status || `${current}/${total} files loaded`}`);
}

// Show/hide loading
function showLoading(show) {
    const loadingDiv = document.getElementById('loading');
    const containerDiv = document.getElementById('scholarships-container');
    
    if (show) {
        loadingDiv.style.display = 'block';
        containerDiv.style.display = 'none';
        
        // Update loading text with progress
        loadingDiv.innerHTML = `
            <div class="text-center py-5">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-3" id="loading-text">Loading scholarships...</p>
                <div class="progress mt-3" style="max-width: 400px; margin: 0 auto;">
                    <div class="progress-bar" role="progressbar" style="width: 0%" id="loading-progress"></div>
                </div>
            </div>
        `;
    } else {
        loadingDiv.style.display = 'none';
        containerDiv.style.display = 'block';
    }
}

// Update loading progress
function updateLoadingProgress(current, total, message = '') {
    const progressBar = document.getElementById('loading-progress');
    const loadingText = document.getElementById('loading-text');
    
    if (progressBar && loadingText) {
        const percentage = Math.round((current / total) * 100);
        progressBar.style.width = `${percentage}%`;
        progressBar.textContent = `${percentage}%`;
        
        if (message) {
            loadingText.textContent = message;
        } else {
            loadingText.textContent = `Loading scholarships... (${current}/${total})`;
        }
    }
}

// Show error message
function showError() {
    document.getElementById('loading').innerHTML = `
        <div class="text-center py-5">
            <i class="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
            <h4>Unable to Load Scholarships</h4>
            <p class="text-muted">Please check your internet connection and try again.</p>
            <button class="btn btn-primary" onclick="location.reload()">
                <i class="fas fa-refresh me-2"></i>Retry
            </button>
        </div>
    `;
}

// Utility function: debounce
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Utility function: scroll to section
function scrollToSection(sectionId) {
    document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
}

// Show status change modal
function showStatusChangeModal(scholarshipId) {
    const scholarship = scholarships.find(s => s.basic_information.scholarship_id === scholarshipId);
    if (!scholarship) return;
    
    // Store the scholarship ID for later use
    document.getElementById('statusChangeModal').setAttribute('data-scholarship-id', scholarshipId);
    
    // Update modal title
    document.getElementById('statusChangeModalLabel').textContent = 
        `Change Status: ${scholarship.basic_information.scholarship_name}`;
    
    // Highlight current status
    const currentStatus = scholarship.progressStatus || 'not-processed';
    document.querySelectorAll('.status-option').forEach(btn => {
        btn.classList.remove('btn-secondary', 'btn-warning', 'btn-success');
        btn.classList.add('btn-outline-secondary', 'btn-outline-warning', 'btn-outline-success');
        
        if (btn.getAttribute('data-status') === currentStatus) {
            const statusClass = currentStatus === 'complete' ? 'btn-success' : 
                               currentStatus === 'in-process' ? 'btn-warning' : 'btn-secondary';
            btn.classList.remove('btn-outline-secondary', 'btn-outline-warning', 'btn-outline-success');
            btn.classList.add(statusClass);
        }
    });
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('statusChangeModal'));
    modal.show();
}

// Handle status change from modal
function changeProgressStatus(newStatus) {
    const scholarshipId = parseInt(document.getElementById('statusChangeModal').getAttribute('data-scholarship-id'));
    
    // Update the status using localStorage
    const success = setLocalProgressStatus(scholarshipId, newStatus);
    
    if (success) {
        // Refresh the display to show updated status
        displayScholarships();
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('statusChangeModal'));
        modal.hide();
        
        showNotification(`Status updated to: ${newStatus.replace('-', ' ')}`, 'success');
    } else {
        showNotification('Failed to update status. Please try again.', 'error');
    }
}

// Initialize status change modal event listeners
function initializeStatusChangeModal() {
    document.querySelectorAll('.status-option').forEach(button => {
        button.addEventListener('click', function() {
            const newStatus = this.getAttribute('data-status');
            changeProgressStatus(newStatus);
        });
    });
}
