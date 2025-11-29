## 📋 Pending Improvements (New)

### 14. Documentation Overhaul (P1)

**Status**: ⏳ Pending
**Effort**: Medium (2-3 hours)
**Impact**: High (Developer Experience)

#### Tasks:

- [ ] Update `README.md` with project overview, setup instructions, tech stack, and deployment info.
- [ ] Create `CONTRIBUTING.md` with guidelines for contributing.
- [ ] Document custom hooks in `src/hooks/README.md` (optional).

### 15. HomePage Refactoring (P2)

**Status**: ⏳ Pending
**Effort**: Medium (3-4 hours)
**Impact**: Medium (Maintainability)

#### Tasks:

- [ ] Split `src/app/page.tsx` (currently ~800 lines) into smaller components:
  - [ ] `HeroSection` (move logic from page)
  - [ ] `StatsSection`
  - [ ] `JourneyTeaser`
  - [ ] `SkillsTeaser`
  - [ ] `PhilosophyTeaser`
- [ ] Optimize `particles` state to avoid re-renders or use CSS-only animation if possible.

### 16. Accessibility Enhancements (P2)

**Status**: ⏳ Pending
**Effort**: Low (1-2 hours)
**Impact**: High (User Experience)

#### Tasks:

- [ ] Update `src/components/ui/Input.tsx` to include `aria-invalid={error}`.
- [ ] Audit color contrast for text overlays on gradients in `HomePage`.
- [ ] Ensure all interactive elements in `HomePage` have visible focus states.

### 17. Focus Trap Optimization (P2)

**Status**: ⏳ Pending
**Effort**: Low (1-2 hours)
**Impact**: Low (Code Quality)

#### Tasks:

- [ ] Evaluate replacing custom `useFocusTrap` with `focus-trap-react` or Radix UI primitives.
- [ ] If keeping custom implementation, add comprehensive unit tests.

### 18. Internationalization (i18n) (P3)

**Status**: ⏳ Pending
**Effort**: High (2-3 days)
**Impact**: Medium (Future Proofing)

#### Tasks:

- [ ] Install and configure `next-intl`.
- [ ] Extract hardcoded strings from `HomePage` and components into message files.
- [ ] Add language switcher to `Navigation`.
