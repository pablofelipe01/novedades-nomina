# 🚀 Deployment Guide

## 📋 Prerequisites

### System Requirements
- Node.js >= 18.0.0
- npm >= 8.0.0
- Git
- Modern web browser with MediaRecorder API support

### External Services
- Airtable account with configured workspace
- Webhook endpoints accessible via HTTPS
- SSL certificate (required for audio recording)

## 🔧 Environment Setup

### 1. Clone Repository
```bash
git clone <repository-url>
cd novedades-nomina
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Create `.env.local` file:
```bash
# Airtable Configuration
VITE_AIRTABLE_API_KEY=patXXXXXXXXXXXXXXXX.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX

# Optional: Development settings
VITE_DEV_MODE=true
```

### 4. Airtable Setup
Required table structure in Airtable:

**Table Name:** `Nomina Sirius`

| Field Name | Field Type | Required | Description |
|------------|------------|----------|-------------|
| Cedula | Single line text | Yes | Employee ID number |
| Nombre | Single line text | Yes | Full name |
| Cargo | Single line text | Yes | Job position |
| Area | Single line text | Yes | Department/Area |

## 🏗️ Build Process

### Development Build
```bash
npm run dev
```
- Starts development server on `http://localhost:5173`
- Hot module replacement enabled
- Source maps for debugging

### Production Build
```bash
npm run build
```
- Optimized bundle for production
- Assets minified and compressed
- Output in `dist/` directory

### Preview Production Build
```bash
npm run preview
```
- Preview production build locally
- Simulates production environment

## 🌐 Deployment Options

### 1. Vercel (Recommended)

#### Automatic Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables
vercel env add VITE_AIRTABLE_API_KEY
vercel env add VITE_AIRTABLE_BASE_ID
```

#### Manual Deployment
1. Connect GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Auto-deploy on push to main branch

### 2. Netlify

#### Via Netlify CLI
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build and deploy
npm run build
netlify deploy --prod --dir=dist
```

#### Via Git Integration
1. Connect repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Configure environment variables

### 3. Static File Hosting

#### Build and Upload
```bash
npm run build
# Upload dist/ folder to your hosting provider
```

#### Server Configuration
For SPA routing, configure your server:

**Nginx:**
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

**Apache (.htaccess):**
```apache
RewriteEngine On
RewriteRule ^(?!.*\.).*$ /index.html [L]
```

## 🔒 Security Configuration

### HTTPS Requirements
- **Mandatory for production**: MediaRecorder API requires secure context
- Configure SSL certificate
- Redirect HTTP to HTTPS

### Environment Variables Security
- Never commit `.env.local` to version control
- Use deployment platform's environment variable management
- Rotate API keys regularly

### Content Security Policy
Add to `index.html`:
```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  connect-src 'self' https://api.airtable.com https://telegram-apps-u38879.vm.elestio.app;
  media-src 'self' blob:;
">
```

## 📊 Monitoring and Analytics

### Performance Monitoring
```bash
# Analyze bundle size
npm run build
npx vite-bundle-analyzer dist
```

### Error Tracking
Consider integrating:
- Sentry for error monitoring
- Google Analytics for usage tracking
- Custom logging for business metrics

## 🔄 CI/CD Pipeline

### GitHub Actions Example
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build
      run: npm run build
      env:
        VITE_AIRTABLE_API_KEY: ${{ secrets.VITE_AIRTABLE_API_KEY }}
        VITE_AIRTABLE_BASE_ID: ${{ secrets.VITE_AIRTABLE_BASE_ID }}
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
        vercel-args: '--prod'
```

## 🧪 Pre-deployment Checklist

### ✅ Code Quality
- [ ] All TypeScript errors resolved
- [ ] ESLint warnings addressed
- [ ] Components properly tested
- [ ] Error boundaries implemented

### ✅ Configuration
- [ ] Environment variables configured
- [ ] API endpoints verified
- [ ] Webhook URLs tested
- [ ] SSL certificate active

### ✅ Functionality
- [ ] Authentication flow working
- [ ] Audio recording functional
- [ ] Data persistence verified
- [ ] Webhook delivery confirmed

### ✅ Performance
- [ ] Bundle size optimized
- [ ] Images compressed
- [ ] Lazy loading implemented
- [ ] Caching strategies configured

## 🐛 Troubleshooting

### Common Issues

#### Build Failures
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Environment Variable Issues
```bash
# Verify variables are loaded
console.log(import.meta.env.VITE_AIRTABLE_API_KEY)
```

#### HTTPS/SSL Issues
- Verify certificate installation
- Check security headers
- Test MediaRecorder API in production

#### Performance Issues
```bash
# Analyze bundle
npm run build
npx vite-bundle-analyzer dist
```

## 📞 Support

For deployment issues:
1. Check deployment platform logs
2. Verify environment variables
3. Test API endpoints manually
4. Contact development team

---

**Deployment Guide v1.0** - Sistema de Control Laboral
