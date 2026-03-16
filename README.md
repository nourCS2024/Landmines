# ALMASAR - Safe Ground. Sustainable Life.

A modern, responsive website for ALMASAR, a humanitarian organization dedicated to landmine clearing and agricultural rehabilitation. This project combines technical demining with environmental restoration to transform dangerous fields into sustainable, thriving communities.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Code Documentation](#code-documentation)
- [Future Enhancements](#future-enhancements)
- [Deployment Guide](#deployment-guide)

---

## 🎯 Project Overview

ALMASAR is a full-stack web application designed to raise awareness about landmine threats and promote the organization's mission of reclaiming safe, sustainable land. The website showcases the impact of demining efforts while providing a platform for community engagement through a contact form.

**Mission**: Clearing the path for a safer tomorrow by removing explosive remnants of war and planting olive trees—symbols of peace and resilience.

---

## ✨ Features

### 1. **Responsive Navigation**
- Fixed navbar with smooth scroll effects
- Mobile-friendly hamburger menu that slides in from the right
- Automatic background color change on scroll
- Navigation highlighting with yellow underline animation

### 2. **Hero Section**
- Full-viewport hero with background image and overlay gradient
- Prominent headline and tagline
- Call-to-action button ("Report a Hazard")
- Floating glass card displaying key statistics (12k+ mines cleared)

### 3. **The Silent Threat Section**
- Three danger cards highlighting key issues:
  - **Invisible Danger**: Long-term effects of landmines
  - **Lost Potential**: Abandoned agricultural land
  - **Community Isolation**: Impact on villages
- Hover effects with image desaturation and pulse animation
- Grid layout that adapts to screen size

### 4. **Our Mission Section**
- Split layout: Text on left, image on right
- Mission statement with powerful messaging
- 100% Safe Soil statistics badge
- Color scheme: Olive green background with white accents
- Responsive design that stacks on mobile

### 5. **Partners/Coalition Section**
- Grid of partner organizations
- Hover effects with background color change and scale animation
- Includes: HAMAP Humanitaire, University of Balamand, Beeatoona, LMAC

### 6. **Contact Us Form** ⭐ (Recently Added)
- **Input Fields**:
  - Full Name (Required)
  - Email Address (Required, with format validation)
  - Subject (Optional dropdown with categories)
  - Message (Required, minimum 20 characters)
- **Features**:
  - Real-time character counter (0/1000)
  - Frontend validation with error messages
  - Success notification after submission
  - Error handling with user-friendly alerts
  - Form reset after successful submission
- **Design**: Centered, clean form with ALMASAR color scheme

### 7. **Social Media Integration**
- Five social platform links:
  - Facebook (Blue gradient)
  - X/Twitter (Black gradient)
  - Instagram (Multi-color gradient)
  - LinkedIn (Professional blue)
  - YouTube (Red gradient)
- Hover effects with lift animation and platform-specific shadows

### 8. **Footer**
- Organization info and mission statement
- Navigation links
- Contact email
- Social media links section
- Funding acknowledgment and copyright

---

## 🛠 Technology Stack

### Frontend
- **HTML5**: Semantic structure
- **CSS3**: Modern styling with custom properties (CSS variables)
- **JavaScript (Vanilla)**: No dependencies, pure ES6+

### Libraries & Integrations
- **Google Fonts**: Bebas Neue (titles), Montserrat (subtitles), Open Sans (body)
- **Intersection Observer API**: Scroll reveal animations
- **EmailJS** (Ready for integration): Email service
- **HTTP Server**: Local development

### Version Control
- **Git** with GitHub
- **Repository**: nourCS2024/Landmines

---

## 📂 Project Structure

```
landmines-website/
├── index.html           # Main HTML file with all sections
├── homepage.css         # All styling (700+ lines)
├── homepage.js          # JavaScript functionality
├── package.json         # NPM configuration
├── README.md            # This file
└── sitemap.xml          # SEO sitemap (for Google indexing)
```

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js and npm installed
- Git for version control

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/nourCS2024/Landmines.git
   cd landmines-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   The website will be available at `http://localhost:8000`

4. **View in browser**
   Open your browser and navigate to the local development URL

---

## 📖 Code Documentation

### HTML Structure (`index.html`)
- **Navigation**: Fixed navbar with logo and links
- **Hero Section**: Full-viewport splash with CTA
- **Sections**: Threat → Mission → Partners → Contact
- **Footer**: Company info, links, and social media

### CSS Architecture (`homepage.css`)

#### Design System (1. DESIGN SYSTEM & RESET)
- **Color Variables**:
  - `--primary-red`: #ec3353 (danger, CTA buttons)
  - `--primary-yellow`: #ffcf35 (accents, hover states)
  - `--olive-green`: #acb68f (mission section background)
  - `--deep-green`: #a6ad38 (partners, stats)
  - `--dark-brown`: #643820 (footer, text)
  - `--white`: #ffffff
  - `--light-gray`: #f4f4f4

- **Font Stack**:
  - Titles: Bebas Neue (uppercase, bold)
  - Subtitles: Montserrat (clean, modern)
  - Body: Open Sans (readable, friendly)

#### Components (2. UI COMPONENTS & ANIMATIONS)
- **Buttons**:
  - `.btn-primary`: Red with shadow, hover lift effect
  - `.btn-outline`: Transparent with border, hover fill
  - Full width on form submission

- **Animations**:
  - `.reveal`: Scroll-triggered fade-in from bottom
  - `@keyframes pulse-red`: Pulsing shadow for danger cards
  - `@keyframes slideIn`: Alert message animation

#### Sections Styling
- **Navigation** (3): Sticky positioning, color transition on scroll
- **Hero** (4): Full viewport with gradient overlay
- **Threat Cards** (5): Grayscale images, desaturate on hover
- **Mission** (6): Flexbox with `flex-direction: row-reverse`
- **Partners** (7): CSS Grid with auto-fit
- **Contact** (7B): Max-width container with shadow
- **Footer** (8): Dark brown background with flex layout

#### Responsive Design (9. MEDIA QUERIES)
- Breakpoint: `768px` for mobile
- Hero title: 6rem → 4rem on mobile
- Mission section: Stacks vertically on mobile
- Navigation: Hamburger menu slides in from right
- Contact form: Full-width on mobile

### JavaScript Functionality (`homepage.js`)

#### 1. Navigation Scroll Effect
```javascript
// Adds 'scrolled' class to navbar after 50px scroll
// Changes background color and adds shadow
```

#### 2. Mobile Menu Toggle
```javascript
// Hamburger menu functionality
// Toggles 'active' class on nav-links
// Auto-closes when a link is clicked
```

#### 3. Scroll Reveal Animation (Intersection Observer)
```javascript
// Observes elements with .reveal class
// Triggers fade-in animation when 15% visible
// Smooth entrance effect as user scrolls down
```

#### 4. Contact Form Handler ⭐ (New)
```javascript
// Real-time character counter
// Form validation:
//   - Required fields check
//   - Email format validation
//   - Message minimum 20 characters
// Success/error notifications
// Form reset after submission
// Email integration ready (EmailJS placeholder)
```

---

## 🎨 Design System

### Color Palette
| Color | Hex | Usage |
|-------|-----|-------|
| Primary Red | #ec3353 | Buttons, danger elements |
| Primary Yellow | #ffcf35 | Accents, hover states |
| Olive Green | #acb68f | Mission section |
| Deep Green | #a6ad38 | Partners, badges |
| Dark Brown | #643820 | Footer, primary text |
| White | #ffffff | Backgrounds, text |
| Light Gray | #f4f4f4 | Section backgrounds |

### Typography
- **Titles (h1, h2)**: Bebas Neue, uppercase, bold, letter-spaced
- **Subtitles (h3)**: Montserrat 700, 1.5rem
- **Body Text**: Open Sans, 16px, line-height 1.6
- **Links**: Inherit color, 0.3s ease transition

### Spacing
- Section padding: 80-100px vertical, 10% horizontal
- Gap between elements: 30-50px
- Card padding: 20-40px
- Border radius: 10-20px

---

## 🔮 Future Enhancements

### Phase 1: Messaging & Notifications (Next Sprint)
- [ ] **WhatsApp Integration**: Direct messaging widget
- [ ] **Toast Notifications**: Non-blocking alerts for user actions
- [ ] **Email Confirmation**: Auto-reply to contact form submissions
- [ ] **Push Notifications**: Browser notifications for important updates

### Phase 2: Media Upgrades (Post-Production)
- [ ] **Replace Stock Images**: Use official ALMASAR project photography
  - Hero background: Real demining site photos
  - Threat cards: Before/after comparisons of cleared areas
  - Mission section: Olive tree planting images
  - Partner section: Official partner logos
- [ ] **Video Integration**: Documentary clips or impact videos
- [ ] **Image Optimization**: Lazy loading, WebP format for faster loading

### Phase 3: Backend & Database
- [ ] **Email Backend**: Node.js/Express + Nodemailer setup
- [ ] **Database**: MongoDB for contact submissions storage
- [ ] **Analytics**: Google Analytics 4 integration
- [ ] **Admin Dashboard**: Review contact submissions

### Phase 4: SEO & Performance
- [ ] **Meta Tags**: Open Graph, Twitter Card optimization
- [ ] **Sitemap**: Automated sitemap generation
- [ ] **Robots.txt**: Search engine directives
- [ ] **Image Compression**: Automated optimization pipeline
- [ ] **Performance**: Lighthouse score optimization (Target: 95+)

### Phase 5: Accessibility & A11y
- [ ] **WCAG 2.1 Compliance**: Level AA standards
- [ ] **Keyboard Navigation**: Full keyboard support
- [ ] **Screen Reader Support**: Semantic HTML, ARIA labels
- [ ] **Color Contrast**: WCAG contrast ratio compliance

---

## 🌐 Deployment Guide

### Production Readiness Checklist
- [ ] All images replaced with ALMASAR project photos
- [ ] Contact form backend integrated (EmailJS or custom API)
- [ ] Analytics configured
- [ ] Meta tags and SEO optimized
- [ ] Security headers configured
- [ ] SSL certificate installed

### Hosting & Going Live on Google

#### Step 1: Prepare for Google Indexing
1. Update `sitemap.xml` with all pages
2. Add structured data (JSON-LD) for rich snippets
3. Set up Google Search Console
4. Add canonical URLs

#### Step 2: Choose Hosting Platform

**Recommended Options**:

**Option A: Vercel (Recommended for Static Sites)**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```
- Zero-config deployment
- Free SSL
- Automatic optimizations
- CDN included

**Option B: Netlify**
- Connect GitHub repository
- Auto-deploy on push
- Forms integration
- Free SSL

**Option C: Google Cloud Platform / Firebase**
- Firebase Hosting (easiest for Google integration)
- Connect to Google services
- Analytics integration
- Free tier available

**Option D: Traditional Hosting (GoDaddy, Bluehost)**
- FTP upload
- Manual SSL setup
- More control
- Typically $5-15/month

#### Step 3: Set Up Custom Domain
1. Register domain (godaddy.com, namecheap.com)
2. Point nameservers to hosting provider
3. Enable SSL/HTTPS (usually automatic)

#### Step 4: Google Search Console Setup
```
1. Go to https://search.google.com/search-console
2. Add your domain
3. Verify ownership (DNS or HTML file)
4. Submit sitemap.xml
5. Monitor search analytics
```

#### Step 5: Google Analytics Setup
```html
<!-- Add to index.html <head> -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_ID');
</script>
```

#### Step 6: Firebase Deployment (Recommended)
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Initialize project
firebase init hosting

# Deploy
firebase deploy
```

**Your URL will be**: `https://landmines-project.web.app`

#### Step 7: Custom Domain with Firebase
```bash
firebase hosting:domain:create your-domain.com
```

---

## 📊 Performance Metrics (Target)

| Metric | Target | Current |
|--------|--------|---------|
| Lighthouse Score | 95+ | TBD |
| First Contentful Paint | <1.5s | TBD |
| Largest Contentful Paint | <2.5s | TBD |
| Cumulative Layout Shift | <0.1 | TBD |
| Time to Interactive | <3.5s | TBD |

---

## 📞 Support & Contact

- **Email**: info@almasar-project.org
- **Organization**: ALMASAR
- **GitHub**: https://github.com/nourCS2024/Landmines
- **Funded by**: Ministry of Europe and Foreign Affairs

---

## 📝 License

© 2026 ALMASAR. All rights reserved.

---

## 🚦 Development Workflow

### Current Status
✅ **Phase**: Pre-Production Ready
- ✅ Responsive design complete
- ✅ All sections functional
- ✅ Contact form implemented
- ✅ Mobile-friendly navigation
- ⏳ Awaiting backend integration
- ⏳ Pending image replacement with project photos

### Next Steps (Priority Order)
1. **Setup Backend Email Service** (EmailJS or Node.js)
2. **Replace Stock Images** with ALMASAR project photography
3. **Configure Hosting** (Firebase/Vercel recommended)
4. **Set Up Analytics** (Google Analytics 4)
5. **Submit to Google Search Console**
6. **Monitor Performance** and optimize

### Timeline Estimate
- Backend Setup: 2-3 days
- Image Replacement: 1-2 days
- Hosting & Domain: 1 day
- SEO & Launch: 1-2 days
- **Total**: ~1 week to go live

---

## 🔐 Security Notes

Before production deployment:
- [ ] Enable HTTPS (automatic with most hosts)
- [ ] Set up email authentication (SPF, DKIM, DMARC)
- [ ] Add security headers (CSP, X-Frame-Options)
- [ ] Implement rate limiting on contact form
- [ ] Store contact submissions securely
- [ ] Regular security audits

---

**Ready to make ALMASAR's mission visible to the world!** 🌍
