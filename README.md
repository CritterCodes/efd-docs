# EFD Documentation Hub

A centralized documentation application for the Engel Fine Design ecosystem, providing role-based access to guides, API documentation, and release notes.

## 🏗️ Architecture

This is a Next.js 15 application with:
- **NextAuth** for authentication (same MongoDB as shop/admin)
- **Material-UI** for consistent styling
- **Role-based access control** (admin, artisan, wholesaler, dev)
- **Ecosystem integration** with versioning and changelogs
- **Markdown-based content** with frontmatter metadata

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env.local
   # Update with your MongoDB URI and secrets
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Access the application:**
   - Documentation Hub: http://localhost:3002
   - Sign in with existing EFD admin/artisan/wholesaler credentials

## 🔐 Authentication

Uses the same authentication system as the admin application:
- **MongoDB** user collection
- **Role-based permissions** (internal users only)
- **Shared session** management
- **Automatic role detection** and content filtering

### Supported Roles
- **Admin**: Full access to all documentation
- **Developer**: Full access to all documentation  
- **Artisan**: Access to artisan guides and general documentation
- **Wholesaler**: Access to wholesale guides and general documentation
- **Customer**: No access (redirected)

## 📁 Content Structure

```
docs/
├── welcome.md                    # General welcome guide
├── account-setup.md              # Account configuration
├── artisan/
│   ├── profile-management.md     # Artisan profile guides
│   └── gallery-system.md         # Gallery usage
├── wholesale/
│   ├── application.md            # Wholesale application process
│   └── ordering.md               # Order management
├── admin/
│   ├── user-management.md        # User administration
│   └── content-management.md     # Content management
└── dev/
    ├── api-reference.md          # API documentation
    └── setup.md                  # Development setup
```

### Content Format

All documentation uses Markdown with frontmatter:

```markdown
---
title: "Page Title"
description: "Brief description"
roles: ["admin", "artisan"]
category: "guide"
tags: ["setup", "configuration"]
lastUpdated: "2025-10-18"
version: "1.0.0"
---

# Your Content Here

Regular markdown content...
```

## 🎨 User Interface

### Navigation
- **Sidebar navigation** with role-based filtering
- **Expandable sections** for organized content
- **Search functionality** across all accessible content
- **Quick links** to frequently accessed pages

### Dashboard
- **Welcome interface** tailored to user role
- **Quick start guides** for new users
- **Recent updates** from ecosystem changelog
- **Documentation overview** with progress tracking

### Features
- **Responsive design** for mobile and desktop
- **Dark/light theme** following Material-UI standards
- **Search and filtering** by role, category, and tags
- **Cross-linking** between related documentation
- **Version tracking** integrated with ecosystem releases

## 🔄 Ecosystem Integration

### Version Management
- **Synchronized versioning** with shop and admin applications
- **Automatic changelog** integration from `ECOSYSTEM_CHANGELOG.md`
- **Release notes** automatically generated from ecosystem releases
- **Component tracking** (shop/admin/database changes)

### Cross-Application Links
- **Admin integration**: Documentation links in admin interface
- **Shop integration**: Help links for artisan/wholesaler features
- **Single sign-on**: Shared authentication across all applications

## 🛠️ Development

### Adding New Documentation

1. **Create Markdown file** in appropriate directory:
   ```bash
   touch docs/new-guide.md
   ```

2. **Add frontmatter** with role permissions:
   ```markdown
   ---
   title: "New Guide"
   description: "Guide description"
   roles: ["admin", "artisan"]
   category: "guide"
   ---
   ```

3. **Update navigation** in `src/lib/constants.ts` if needed

4. **Test role access** with different user types

### Deployment

The application follows the same deployment pattern as shop/admin:
- **Development**: `npm run dev` (port 3002)
- **Build**: `npm run build`
- **Production**: `npm start`

### Environment Variables

```bash
# Database (same as shop/admin)
MONGODB_URI=mongodb://localhost:27017/engel-fine-design
MONGODB_DB=engel-fine-design

# Authentication
NEXTAUTH_URL=http://localhost:3002
NEXTAUTH_SECRET=your-secret-key

# Ecosystem Integration
ECOSYSTEM_VERSION=1.0.0
SHOP_URL=http://localhost:3000
ADMIN_URL=http://localhost:3001
```

## 📊 Monitoring

### Analytics
- **Page view tracking** by role and content type
- **Search query analysis** for content gaps
- **User engagement** metrics for documentation effectiveness

### Maintenance
- **Content freshness** tracking with last updated dates
- **Link validation** for cross-references
- **Role access** auditing for security compliance

## 🤝 Contributing

### Content Guidelines
- **Clear, concise** writing targeted to specific user roles
- **Step-by-step instructions** with screenshots when helpful
- **Cross-references** to related documentation
- **Regular updates** as features evolve

### Code Standards
- **TypeScript** for type safety
- **Material-UI** components for consistency
- **Responsive design** principles
- **Accessibility** compliance (WCAG 2.1)

## 🔒 Security

- **Internal access only** (no public content)
- **Role-based content filtering** at component level
- **Session management** shared with ecosystem
- **Environment variable** protection for sensitive data

## 📈 Future Enhancements

- [ ] **Advanced search** with full-text indexing
- [ ] **Interactive tutorials** with guided workflows
- [ ] **API playground** for developer documentation
- [ ] **Content versioning** with historical changes
- [ ] **Collaborative editing** for team-maintained docs
- [ ] **Analytics dashboard** for content performance
- [ ] **Automated testing** for documentation accuracy
- [ ] **PDF export** for offline access

---

For questions or support, contact the development team or create an issue in the project repository.