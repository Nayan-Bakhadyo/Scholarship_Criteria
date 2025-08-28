# UCO Foundation Scholarship Portal - GitHub Pages Deployment

## Quick Deploy to GitHub Pages

### Step 1: Create GitHub Repository
1. Go to [GitHub.com](https://github.com)
2. Click "+" → "New repository"
3. Repository name: `uco-scholarship-portal`
4. Description: "UCO Foundation Scholarship Portal"
5. Make it **Public** (required for GitHub Pages)
6. ✅ Initialize with README
7. Click "Create repository"

### Step 2: Upload Website Files

#### Option A: Using GitHub Web Interface
1. Click "uploading an existing file"
2. Drag and drop these files/folders:
   ```
   index.html
   css/
   js/
   scholarship_json_files/
   README.md
   ```
3. Commit message: "Initial website upload"
4. Click "Commit changes"

#### Option B: Using Git Commands
```bash
# Clone your repository
git clone https://github.com/yourusername/uco-scholarship-portal.git
cd uco-scholarship-portal

# Copy all website files to this directory
# Then add, commit, and push
git add .
git commit -m "Add scholarship portal website"
git push origin main
```

### Step 3: Enable GitHub Pages
1. Go to repository "Settings"
2. Scroll to "Pages" section
3. Source: "Deploy from a branch"
4. Branch: "main"
5. Folder: "/ (root)"
6. Click "Save"

### Step 4: Access Your Website
- Your site will be live at: `https://yourusername.github.io/uco-scholarship-portal`
- Takes 5-10 minutes to become available
- Any updates pushed to main branch will automatically deploy

## File Structure for Upload
```
uco-scholarship-portal/
├── index.html                 # Main page
├── README.md                  # Documentation
├── css/
│   └── styles.css            # Custom styles
├── js/
│   └── app.js               # JavaScript functionality
└── scholarship_json_files/   # All 670 JSON files
    ├── file-list.json       # File index (auto-generated)
    ├── 107109.json
    ├── 107526.json
    └── ... (668 more files)
```

## Features
✅ **100% Static** - No server required  
✅ **Responsive Design** - Works on all devices  
✅ **Bootstrap 5** - Modern UI framework  
✅ **Advanced Search** - Filter by multiple criteria  
✅ **Fast Loading** - Optimized for GitHub Pages  
✅ **SEO Friendly** - Proper meta tags and structure  

## Technologies Used
- HTML5 + CSS3 + JavaScript (ES6)
- Bootstrap 5.3.0
- Font Awesome 6.4.0
- No external dependencies or build process

## Browser Support
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Customization
- Edit colors in `css/styles.css` (UCO brand colors defined in `:root`)
- Modify layout in `index.html`
- Update functionality in `js/app.js`

## Need Help?
If you encounter issues:
1. Check that all files uploaded correctly
2. Verify GitHub Pages is enabled
3. Wait 10 minutes for DNS propagation
4. Check browser console for JavaScript errors

## Security
- All data is public (suitable for scholarship information)
- No server-side processing
- No user data collection
- HTTPS automatically provided by GitHub Pages
