#!/usr/bin/env node

/**
 * Automated Release Script for EFD Ecosystem
 * 
 * This script:
 * 1. Reads git commits since last release
 * 2. Generates release notes from conventional commits
 * 3. Updates documentation files
 * 4. Creates git tag and release
 * 
 * Usage: npm run release [major|minor|patch]
 */

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

// Conventional commit patterns
const COMMIT_PATTERNS = {
  feature: /^feat(\(.+\))?: (.+)/,
  fix: /^fix(\(.+\))?: (.+)/,
  breaking: /^feat(\(.+\))!: (.+)|^fix(\(.+\))!: (.+)|^BREAKING CHANGE: (.+)/,
  docs: /^docs(\(.+\))?: (.+)/,
  chore: /^chore(\(.+\))?: (.+)/,
  refactor: /^refactor(\(.+\))?: (.+)/,
  style: /^style(\(.+\))?: (.+)/,
  test: /^test(\(.+\))?: (.+)/
}

function getLatestTag() {
  try {
    return execSync('git describe --tags --abbrev=0', { encoding: 'utf8' }).trim()
  } catch (error) {
    return 'v0.0.0' // First release
  }
}

function getCommitsSinceTag(tag) {
  try {
    const commits = execSync(`git log ${tag}..HEAD --oneline`, { encoding: 'utf8' })
    return commits.trim().split('\n').filter(line => line.length > 0)
  } catch (error) {
    return []
  }
}

function parseCommits(commits) {
  const parsed = {
    features: [],
    fixes: [],
    breaking: [],
    docs: [],
    other: []
  }

  commits.forEach(commit => {
    const message = commit.substring(8) // Remove hash

    if (COMMIT_PATTERNS.breaking.test(message)) {
      const match = message.match(COMMIT_PATTERNS.breaking)
      parsed.breaking.push(match[2] || match[4] || match[5])
    } else if (COMMIT_PATTERNS.feature.test(message)) {
      const match = message.match(COMMIT_PATTERNS.feature)
      parsed.features.push(match[2])
    } else if (COMMIT_PATTERNS.fix.test(message)) {
      const match = message.match(COMMIT_PATTERNS.fix)
      parsed.fixes.push(match[2])
    } else if (COMMIT_PATTERNS.docs.test(message)) {
      const match = message.match(COMMIT_PATTERNS.docs)
      parsed.docs.push(match[2])
    } else {
      parsed.other.push(message)
    }
  })

  return parsed
}

function incrementVersion(currentVersion, releaseType) {
  const version = currentVersion.replace('v', '')
  const [major, minor, patch] = version.split('.').map(Number)

  switch (releaseType) {
    case 'major':
      return `v${major + 1}.0.0`
    case 'minor':
      return `v${major}.${minor + 1}.0`
    case 'patch':
    default:
      return `v${major}.${minor}.${patch + 1}`
  }
}

function generateReleaseNotes(version, parsedCommits) {
  const now = new Date().toISOString().split('T')[0]
  
  return {
    version,
    date: now,
    type: determineReleaseType(parsedCommits),
    summary: generateSummary(parsedCommits),
    features: parsedCommits.features,
    fixes: parsedCommits.fixes,
    breaking: parsedCommits.breaking
  }
}

function determineReleaseType(parsedCommits) {
  if (parsedCommits.breaking.length > 0) return 'major'
  if (parsedCommits.features.length > 0) return 'minor'
  return 'patch'
}

function generateSummary(parsedCommits) {
  const { features, fixes, breaking } = parsedCommits
  
  if (breaking.length > 0) {
    return `Major release with ${breaking.length} breaking change${breaking.length > 1 ? 's' : ''}`
  }
  
  if (features.length > 0) {
    return `Feature release with ${features.length} new feature${features.length > 1 ? 's' : ''}`
  }
  
  if (fixes.length > 0) {
    return `Bug fix release with ${fixes.length} fix${fixes.length > 1 ? 'es' : ''}`
  }
  
  return 'Maintenance release'
}

function generateRecentUpdates(parsedCommits, version) {
  const now = new Date().toISOString().split('T')[0]
  const updates = []

  // Add features
  parsedCommits.features.forEach(feature => {
    updates.push({
      title: feature,
      version,
      description: `New feature: ${feature}`,
      date: now,
      type: 'feature',
      icon: 'feature'
    })
  })

  // Add fixes
  parsedCommits.fixes.forEach(fix => {
    updates.push({
      title: fix,
      version,
      description: `Bug fix: ${fix}`,
      date: now,
      type: 'fix',
      icon: 'fix'
    })
  })

  // Add breaking changes
  parsedCommits.breaking.forEach(breaking => {
    updates.push({
      title: breaking,
      version,
      description: `Breaking change: ${breaking}`,
      date: now,
      type: 'breaking',
      icon: 'breaking'
    })
  })

  return updates
}

function updateReleasesFile(newRelease, newUpdates) {
  const releasesPath = path.join(__dirname, '../src/lib/releases.ts')
  
  // Read current file
  let content = fs.readFileSync(releasesPath, 'utf8')
  
  // Parse existing releases and updates
  const releaseNotesMatch = content.match(/export const RELEASE_NOTES: ReleaseNote\[\] = (\[[\s\S]*?\])/m)
  const recentUpdatesMatch = content.match(/export const RECENT_UPDATES: RecentUpdate\[\] = (\[[\s\S]*?\])/m)
  
  if (releaseNotesMatch && recentUpdatesMatch) {
    let existingReleases = []
    let existingUpdates = []
    
    try {
      // This is a simplified approach - in production you'd want a proper parser
      existingReleases = eval(releaseNotesMatch[1])
      existingUpdates = eval(recentUpdatesMatch[1])
    } catch (error) {
      console.warn('Could not parse existing releases, starting fresh')
    }
    
    // Add new release to beginning
    const updatedReleases = [newRelease, ...existingReleases]
    
    // Add new updates to beginning, keep last 10
    const updatedUpdates = [...newUpdates, ...existingUpdates].slice(0, 10)
    
    // Replace content
    content = content.replace(
      /export const RELEASE_NOTES: ReleaseNote\[\] = \[[\s\S]*?\]/m,
      `export const RELEASE_NOTES: ReleaseNote[] = ${JSON.stringify(updatedReleases, null, 2)}`
    )
    
    content = content.replace(
      /export const RECENT_UPDATES: RecentUpdate\[\] = \[[\s\S]*?\]/m,
      `export const RECENT_UPDATES: RecentUpdate[] = ${JSON.stringify(updatedUpdates, null, 2)}`
    )
    
    fs.writeFileSync(releasesPath, content)
  }
}

function createGitTag(version, releaseNotes) {
  const tagMessage = `${version}\n\n${releaseNotes.summary}\n\nFeatures:\n${releaseNotes.features.map(f => `- ${f}`).join('\n')}\n\nFixes:\n${releaseNotes.fixes.map(f => `- ${f}`).join('\n')}`
  
  try {
    execSync(`git tag -a ${version} -m "${tagMessage}"`, { stdio: 'inherit' })
    console.log(`✅ Created tag ${version}`)
  } catch (error) {
    console.error('❌ Failed to create git tag:', error.message)
  }
}

// Main execution
function main() {
  const releaseType = process.argv[2] || 'patch'
  
  console.log('🚀 Starting automated release process...')
  
  // Get current state
  const latestTag = getLatestTag()
  const commits = getCommitsSinceTag(latestTag)
  
  if (commits.length === 0) {
    console.log('❌ No commits found since last release')
    return
  }
  
  console.log(`📝 Found ${commits.length} commits since ${latestTag}`)
  
  // Parse commits
  const parsedCommits = parseCommits(commits)
  console.log('📋 Parsed commits:', {
    features: parsedCommits.features.length,
    fixes: parsedCommits.fixes.length,
    breaking: parsedCommits.breaking.length
  })
  
  // Generate new version
  const newVersion = incrementVersion(latestTag, releaseType)
  console.log(`📦 New version: ${newVersion}`)
  
  // Generate release notes
  const releaseNotes = generateReleaseNotes(newVersion, parsedCommits)
  const recentUpdates = generateRecentUpdates(parsedCommits, newVersion)
  
  // Update files
  updateReleasesFile(releaseNotes, recentUpdates)
  console.log('📄 Updated releases.ts file')
  
  // Create git tag
  createGitTag(newVersion, releaseNotes)
  
  console.log('✅ Release process completed!')
  console.log(`🎉 Released ${newVersion}`)
}

if (require.main === module) {
  main()
}

module.exports = { main }