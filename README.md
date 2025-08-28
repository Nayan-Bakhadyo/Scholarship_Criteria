# UCO Foundation Scholarship Portal

A responsive web application to browse and search UCO Foundation scholarships. Built with Bootstrap 5 and vanilla JavaScript for GitHub Pages hosting.

🌐 **[Live Demo](https://yourusername.github.io/uco-scholarship-portal)** (Replace with your GitHub Pages URL)

## ✨ Features

- **📱 Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **🔍 Advanced Search**: Filter by name, committee, renewable status, GPA, and academic level
- **📋 Multiple Views**: Switch between grid and list view modes
- **📄 Detailed Information**: Complete criteria breakdown for each scholarship
- **⚡ Fast Performance**: Optimized for GitHub Pages static hosting
- **🎨 Modern UI**: Clean design with UCO branding colors

## 🚀 Quick Deploy to GitHub Pages

See [DEPLOY.md](DEPLOY.md) for detailed deployment instructions.

### TL;DR Deployment:
1. Create new GitHub repository (public)
2. Upload all files maintaining folder structure
3. Enable GitHub Pages in repository settings
4. Access at `https://yourusername.github.io/repository-name`

## 📊 Scholarship Data

- **670 Scholarships** included
- **3 Criteria Types**: Qualifying (required), General (optional points), Conditional (renewal)
- **Auto-categorized**: GPA, Major, Application, Level, Hours, Activities, etc.
- **Points System**: Soft requirements include point values

## 🏗️ File Structure

```
├── index.html              # Main application
├── css/styles.css         # UCO-branded styles  
├── js/app.js             # Core functionality
├── scholarship_json_files/ # Data directory
│   ├── file-list.json    # Static file index
│   └── *.json           # 670 scholarship files
├── DEPLOY.md            # Deployment guide
└── README.md           # This file
```

## 🎨 UCO Branding

Colors defined in CSS variables:
```css
:root {
    --uco-blue: #003366;
    --uco-gold: #FFB81C;  
    --uco-light-blue: #4A90B8;
}
```

## 🔧 Technologies

- **HTML5**: Semantic structure
- **CSS3**: Grid/Flexbox layouts + animations
- **JavaScript ES6+**: Modern async/await patterns
- **Bootstrap 5.3**: Responsive framework
- **Font Awesome 6**: Icon library
- **GitHub Pages**: Static hosting

## 📱 Browser Support

| Browser | Version |
|---------|---------|
| Chrome  | 60+     |
| Firefox | 55+     |
| Safari  | 12+     |
| Edge    | 79+     |

## 🔄 Data Processing

Scholarships processed from CSV using custom Python script:
- HTML content cleaned and decoded
- Requirements parsed and categorized  
- Criteria types auto-detected
- Points extracted for soft requirements

## 📈 Performance Features

- **Lazy Loading**: JSON files loaded asynchronously
- **Pagination**: 12 items per page default
- **Debounced Search**: 300ms delay to reduce API calls
- **Caching**: Browser caches all static assets
- **Optimized Images**: CSS-only graphics and icons

## 🎯 SEO & Accessibility

- ✅ Semantic HTML structure
- ✅ ARIA labels for screen readers  
- ✅ Keyboard navigation support
- ✅ Meta tags for social sharing
- ✅ High contrast color ratios
- ✅ Responsive typography

## 🛠️ Local Development

```bash
# Simple local server (Python)
python3 -m http.server 8000

# Or use any static file server
npx http-server
```

Open `http://localhost:8000`

## 📝 Adding New Scholarships

1. Create JSON file following existing structure
2. Add filename to `scholarship_json_files/file-list.json`
3. Commit and push to GitHub

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test locally  
5. Submit pull request

## 📄 License

© 2025 University of Central Oklahoma Foundation. All rights reserved.

## 📞 Support

For technical issues, contact UCO Foundation IT team.
