#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/no-unused-vars */

/**
 * Bundle Size Checker
 *
 * Analyzes Next.js build output and compares against performance budgets.
 * Run after `npm run build` to check bundle sizes.
 *
 * Usage: node scripts/check-bundle-size.js
 */

const fs = require('fs');
const path = require('path');

// Load performance budget configuration
const budget = require('../performance-budget.config.js');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

/**
 * Format bytes to human readable string
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Get status indicator based on size vs budget
 */
function getStatus(size, warning, max) {
  if (size > max) {
    return { icon: '❌', color: colors.red, status: 'OVER BUDGET' };
  }
  if (size > warning) {
    return { icon: '⚠️', color: colors.yellow, status: 'WARNING' };
  }
  return { icon: '✅', color: colors.green, status: 'OK' };
}

/**
 * Parse Next.js build manifest
 */
function parseBuildManifest() {
  const buildDir = path.join(process.cwd(), '.next');
  const manifestPath = path.join(buildDir, 'build-manifest.json');

  if (!fs.existsSync(manifestPath)) {
    console.error(
      `${colors.red}Error: Build manifest not found. Run 'npm run build' first.${colors.reset}`
    );
    process.exit(1);
  }

  return JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
}

/**
 * Get file sizes from .next directory
 */
function getFileSizes() {
  const buildDir = path.join(process.cwd(), '.next');
  const staticDir = path.join(buildDir, 'static');
  const sizes = {
    js: [],
    css: [],
    chunks: new Map(),
  };

  function walkDir(dir, callback) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        walkDir(filePath, callback);
      } else {
        callback(filePath, stat.size);
      }
    });
  }

  walkDir(staticDir, (filePath, size) => {
    const ext = path.extname(filePath);
    const relativePath = path.relative(buildDir, filePath);

    if (ext === '.js') {
      sizes.js.push({ path: relativePath, size });

      // Categorize chunks
      if (filePath.includes('chunks')) {
        const chunkName = path.basename(filePath, '.js');
        sizes.chunks.set(chunkName, size);
      }
    } else if (ext === '.css') {
      sizes.css.push({ path: relativePath, size });
    }
  });

  return sizes;
}

/**
 * Calculate total sizes
 */
function calculateTotals(sizes) {
  const totalJs = sizes.js.reduce((sum, f) => sum + f.size, 0);
  const totalCss = sizes.css.reduce((sum, f) => sum + f.size, 0);

  // Estimate first load JS (framework + main chunks)
  const frameworkChunks = sizes.js.filter(
    f =>
      f.path.includes('framework') ||
      f.path.includes('main') ||
      f.path.includes('webpack')
  );
  const firstLoadJs = frameworkChunks.reduce((sum, f) => sum + f.size, 0);

  return { totalJs, totalCss, firstLoadJs };
}

/**
 * Check for heavy dependencies in the bundle
 */
function checkHeavyDependencies() {
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const deps = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
  };

  const warnings = [];
  budget.heavyDependencies.forEach(dep => {
    if (deps[dep]) {
      warnings.push(dep);
    }
  });

  return warnings;
}

/**
 * Main function
 */
function main() {
  console.log(
    `\n${colors.bold}${colors.cyan}📊 Performance Budget Check${colors.reset}\n`
  );
  console.log('─'.repeat(60));

  // Get file sizes
  const sizes = getFileSizes();
  const totals = calculateTotals(sizes);

  let hasErrors = false;
  let hasWarnings = false;

  // Check total JS budget
  console.log(`\n${colors.bold}JavaScript Bundles${colors.reset}`);
  console.log('─'.repeat(40));

  const jsStatus = getStatus(
    totals.totalJs,
    budget.resources.totalJs.warning,
    budget.resources.totalJs.maxSize
  );
  console.log(
    `${jsStatus.icon} Total JS: ${jsStatus.color}${formatBytes(totals.totalJs)}${colors.reset} ` +
      `(budget: ${formatBytes(budget.resources.totalJs.maxSize)}) - ${jsStatus.status}`
  );
  if (jsStatus.status === 'OVER BUDGET') hasErrors = true;
  if (jsStatus.status === 'WARNING') hasWarnings = true;

  // Check first load JS
  const firstLoadStatus = getStatus(
    totals.firstLoadJs,
    budget.bundles.firstLoad.warning,
    budget.bundles.firstLoad.maxSize
  );
  console.log(
    `${firstLoadStatus.icon} First Load JS: ${firstLoadStatus.color}${formatBytes(totals.firstLoadJs)}${colors.reset} ` +
      `(budget: ${formatBytes(budget.bundles.firstLoad.maxSize)}) - ${firstLoadStatus.status}`
  );
  if (firstLoadStatus.status === 'OVER BUDGET') hasErrors = true;
  if (firstLoadStatus.status === 'WARNING') hasWarnings = true;

  // Check CSS budget
  console.log(`\n${colors.bold}CSS${colors.reset}`);
  console.log('─'.repeat(40));

  const cssStatus = getStatus(
    totals.totalCss,
    budget.resources.totalCss.warning,
    budget.resources.totalCss.maxSize
  );
  console.log(
    `${cssStatus.icon} Total CSS: ${cssStatus.color}${formatBytes(totals.totalCss)}${colors.reset} ` +
      `(budget: ${formatBytes(budget.resources.totalCss.maxSize)}) - ${cssStatus.status}`
  );
  if (cssStatus.status === 'OVER BUDGET') hasErrors = true;
  if (cssStatus.status === 'WARNING') hasWarnings = true;

  // Check for heavy dependencies
  const heavyDeps = checkHeavyDependencies();
  if (heavyDeps.length > 0) {
    console.log(
      `\n${colors.bold}${colors.yellow}⚠️ Heavy Dependencies Detected${colors.reset}`
    );
    console.log('─'.repeat(40));
    heavyDeps.forEach(dep => {
      console.log(`  - ${dep}`);
    });
    console.log(`\nConsider using lighter alternatives or tree-shaking.`);
    hasWarnings = true;
  }

  // Top 5 largest JS files
  console.log(`\n${colors.bold}Top 5 Largest JS Files${colors.reset}`);
  console.log('─'.repeat(40));
  const sortedJs = [...sizes.js].sort((a, b) => b.size - a.size).slice(0, 5);
  sortedJs.forEach((file, i) => {
    console.log(
      `  ${i + 1}. ${formatBytes(file.size).padEnd(10)} ${path.basename(file.path)}`
    );
  });

  // Summary
  console.log(`\n${'─'.repeat(60)}`);
  if (hasErrors) {
    console.log(
      `${colors.red}${colors.bold}❌ Performance budget exceeded!${colors.reset}`
    );
    console.log('Please optimize your bundles before deploying.\n');
    process.exit(1);
  } else if (hasWarnings) {
    console.log(
      `${colors.yellow}${colors.bold}⚠️ Performance budget warnings detected.${colors.reset}`
    );
    console.log('Consider optimizing before these become issues.\n');
    process.exit(0);
  } else {
    console.log(
      `${colors.green}${colors.bold}✅ All performance budgets passed!${colors.reset}\n`
    );
    process.exit(0);
  }
}

// Export types for config file
/**
 * @typedef {Object} BudgetLimit
 * @property {number} maxSize - Maximum allowed size in bytes
 * @property {number} warning - Warning threshold in bytes
 */

/**
 * @typedef {Object} PerformanceBudget
 * @property {Object} bundles - Bundle size budgets
 * @property {Object} resources - Resource size budgets
 * @property {Object} webVitals - Core Web Vitals targets
 * @property {string[]} excludePages - Pages to exclude from checks
 * @property {string[]} heavyDependencies - Dependencies that trigger warnings
 */

main();
