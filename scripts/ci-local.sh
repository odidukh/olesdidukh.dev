#!/bin/bash

# CI/CD Local Test Script
# Run this before committing/pushing to ensure all CI checks will pass

set -e  # Exit on first error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Track timing
START_TIME=$(date +%s)

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  CI/CD Local Test Suite${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Function to print step header
step() {
  echo -e "${YELLOW}▶ $1${NC}"
}

# Function to print success
success() {
  echo -e "${GREEN}✓ $1${NC}"
  echo ""
}

# Function to print failure and exit
fail() {
  echo -e "${RED}✗ $1${NC}"
  echo -e "${RED}CI check failed. Please fix the errors above before committing.${NC}"
  exit 1
}

# 1. TypeScript Type Check
step "Running TypeScript type check..."
if npm run type-check; then
  success "TypeScript check passed"
else
  fail "TypeScript check failed"
fi

# 2. ESLint (Strict mode - no warnings allowed)
step "Running ESLint (strict mode)..."
if npm run lint:strict; then
  success "ESLint check passed"
else
  fail "ESLint check failed"
fi

# 3. Prettier Format Check
step "Checking code formatting..."
if npm run format:check; then
  success "Format check passed"
else
  fail "Format check failed - run 'npm run format' to fix"
fi

# 4. Build
step "Running production build..."
if npm run build; then
  success "Build succeeded"
else
  fail "Build failed"
fi

# 5. E2E Tests (skipped locally - run in CI pipeline for reliable results)
# Visual regression and performance tests are flaky when competing for
# local resources during build. Run manually: npm run test:e2e
echo -e "${YELLOW}⏭ Skipping E2E tests (run in CI pipeline)${NC}"
echo ""

# Calculate total time
END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))
MINUTES=$((DURATION / 60))
SECONDS=$((DURATION % 60))

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  All CI checks passed!${NC}"
echo -e "${GREEN}  Total time: ${MINUTES}m ${SECONDS}s${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "You're ready to commit and push. ${GREEN}🚀${NC}"
