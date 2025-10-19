# 🚀 Automated Release Process

This system automatically generates release notes and updates the documentation when you release new versions.

## 📋 How It Works

### 1. **Conventional Commits**
Use standardized commit messages for automatic parsing:

```bash
feat: add multi-select artisan types
fix: resolve gallery upload issue
docs: update profile management guide
chore: update dependencies
```

### 2. **Release Commands**
```bash
# Patch release (v1.0.0 → v1.0.1)
npm run release

# Minor release (v1.0.0 → v1.1.0) 
npm run release:minor

# Major release (v1.0.0 → v2.0.0)
npm run release:major
```

### 3. **What Happens Automatically**
- ✅ Parses git commits since last release
- ✅ Generates release notes from commit messages
- ✅ Updates `src/lib/releases.ts` with new data
- ✅ Updates "Recent Updates" on dashboard
- ✅ Creates git tag with release notes
- ✅ Updates version in package.json

## 🎯 Commit Message Format

| Type | Description | Example |
|------|-------------|---------|
| `feat:` | New feature | `feat: add artisan gallery filters` |
| `fix:` | Bug fix | `fix: resolve login redirect issue` |
| `docs:` | Documentation | `docs: update API reference` |
| `style:` | Code style | `style: format components` |
| `refactor:` | Code refactoring | `refactor: simplify auth logic` |
| `test:` | Tests | `test: add gallery upload tests` |
| `chore:` | Maintenance | `chore: update dependencies` |

### Breaking Changes
Add `!` for breaking changes:
```bash
feat!: redesign authentication system
fix!: change API response format
```

## 🔄 Complete Workflow

### Development
```bash
# 1. Create feature branch
git checkout -b feature/new-artisan-filters

# 2. Make commits with conventional format
git commit -m "feat: add advanced filtering for artisan search"
git commit -m "docs: update artisan guide with filter instructions"

# 3. Merge to main
git checkout main
git merge feature/new-artisan-filters
```

### Release
```bash
# 4. Run release script
npm run release:minor

# 5. Push changes and tags
git push origin main --tags
```

### Result
- 📄 Release notes automatically generated
- 📊 Dashboard shows latest updates
- 🏷️ Git tag created: `v1.1.0`
- 📝 Documentation updated

## 📁 Generated Files

- **`src/lib/releases.ts`** - Contains all release data
- **Git tags** - Version tags with release notes
- **Dashboard updates** - Recent Updates section

## 🎨 Dashboard Integration

The Recent Updates section automatically shows:
- Last 3 releases
- Feature/fix/breaking change indicators
- Version numbers and dates
- Direct links to full release notes

## 🔧 Customization

Edit `scripts/release.js` to:
- Change commit parsing rules
- Modify release note format
- Add additional automation
- Integrate with external services

## 💡 Pro Tips

1. **Write descriptive commits** - They become your release notes
2. **Use scopes** - `feat(gallery): add image filters`
3. **Link issues** - `fix: resolve login issue (#123)`
4. **Keep features atomic** - One feature per commit when possible

## 🔍 Troubleshooting

**No commits found since last release**
- Make sure you have commits since the last git tag
- Check `git log --oneline` for recent commits

**Release script fails**
- Ensure you're on main branch
- Check that git is clean (no uncommitted changes)
- Verify conventional commit format

**Missing release notes**
- Check that commits follow conventional format
- Look for typos in commit prefixes (`feat:`, `fix:`, etc.)

---

**Next Steps**: Start using conventional commits and run your first automated release! 🎉