# Frontend UI Refactor Report

This report summarizes the modifications, backend integrations, layout updates, and future suggestions as part of the `devcopet_fe` UI/UX refactoring.

---

## 1. Files Modified

The following files were modified to implement course resetting, Next Lesson navigation, difficulty locks, route guards, challenge page layouts, dynamic pet name integration, and global navigation polishing:

* **API & Core Stores**:
  * [src/features/courses/api/course.api.ts](file:///Users/vochithanh/Documents/devcopet_fe/src/features/courses/api/course.api.ts) — Added `resetCourseProgress` and `checkDifficultyUnlock` logic.
  * [src/features/users/store/auth.store.ts](file:///Users/vochithanh/Documents/devcopet_fe/src/features/users/store/auth.store.ts) — Saved `petName` to local storage, updated state/local storage on authentication, and preserved `petName` to avoid backend overwrites from `/users/me`.

* **Routing guards**:
  * [src/routes/roadmap.$courseSlug.medium.nodes.$nodeId.challenge.tsx](file:///Users/vochithanh/Documents/devcopet_fe/src/routes/roadmap.$courseSlug.medium.nodes.$nodeId.challenge.tsx) — Added `beforeLoad` async guard checking Medium unlocks.
  * [src/routes/roadmap.$courseSlug.hard.nodes.$nodeId.challenge.tsx](file:///Users/vochithanh/Documents/devcopet_fe/src/routes/roadmap.$courseSlug.hard.nodes.$nodeId.challenge.tsx) — Added `beforeLoad` async guard checking Hard unlocks.

* **Course & Curriculum Modules**:
  * [src/features/courses/pages/CourseDetailPage.tsx](file:///Users/vochithanh/Documents/devcopet_fe/src/features/courses/pages/CourseDetailPage.tsx) — Integrated overall progress reset handler and fixed a JSX parsing error.
  * [src/features/courses/pages/LessonDetailPage.tsx](file:///Users/vochithanh/Documents/devcopet_fe/src/features/courses/pages/LessonDetailPage.tsx) — Added next lesson inline navigation, course progress synchronization on load, and a mobile overlay menu drawer.
  * [src/features/courses/components/CourseSidebar.tsx](file:///Users/vochithanh/Documents/devcopet_fe/src/features/courses/components/CourseSidebar.tsx) — Supported custom `className` wrappers for responsiveness.
  * [src/components/CodeRunnerBlock/index.tsx](file:///Users/vochithanh/Documents/devcopet_fe/src/components/CodeRunnerBlock/index.tsx) — Improved environment loader UX.

* **World Map & Difficulty Tabs**:
  * [src/features/courses/pages/WorldMapPage.tsx](file:///Users/vochithanh/Documents/devcopet_fe/src/features/courses/pages/WorldMapPage.tsx) — Added difficulty tab selection validation, lock indicators, fallback selection rules, and light-theme contrast overrides.

* **Challenge Pages**:
  * [src/features/courses/pages/EasyNodeChallengePage.tsx](file:///Users/vochithanh/Documents/devcopet_fe/src/features/courses/pages/EasyNodeChallengePage.tsx) — Restructured to centered single-column layout, replaced static text, and updated standard controls.
  * [src/features/courses/pages/MediumNodeChallengePage.tsx](file:///Users/vochithanh/Documents/devcopet_fe/src/features/courses/pages/MediumNodeChallengePage.tsx) — Removed aside sidebar, standardized centered layout, and hooked up Zustand pet name.
  * [src/features/courses/pages/HardNodeChallengePage.tsx](file:///Users/vochithanh/Documents/devcopet_fe/src/features/courses/pages/HardNodeChallengePage.tsx) — Standardized layout, removed sticky footer and duplicate buttons, integrated dynamic pet name inline, and resolved TS strict compiler warnings.

* **Profile & Global UI Settings**:
  * [src/features/users/components/HomePage/index.tsx](file:///Users/vochithanh/Documents/devcopet_fe/src/features/users/components/HomePage/index.tsx) — Persisted chosen onboarding `petName` in local storage and auth store.
  * [src/routes/setting/-PetStatus.tsx](file:///Users/vochithanh/Documents/devcopet_fe/src/routes/setting/-PetStatus.tsx) — Displayed dynamic pet name from state.
  * [src/routes/setting/-ProfileSettings.tsx](file:///Users/vochithanh/Documents/devcopet_fe/src/routes/setting/-ProfileSettings.tsx) — Set dynamic pet name on avatar image alt text.
  * [src/components/layout/Header.tsx](file:///Users/vochithanh/Documents/devcopet_fe/src/components/layout/Header.tsx) — Hid settings gear and dashboard entry points.

---

## 2. Backend Integrations Added

All integrations consume existing backend contracts and constraints:
1. **Course Reset Progress**: Calls `POST /courses/:courseId/reset-progress` to allow users to clear their curriculum progress.
2. **Dynamic Unlock Checking**: Leverages difficulty roadmap completion queries to verify prerequisite counts (Easy completion >= 5 to unlock Medium, Medium completion >= 5 to unlock Hard).
3. **TanStack Router Guards**: Injects async verification in `beforeLoad` challenge routes to prevent manual URL path manipulation.

---

## 3. Remaining Blockers

None. All TypeScript compile-time errors and ESLint parsing warnings have been completely resolved, and the project builds successfully.

---

## 4. Screens Requiring Redesign

* **Onboarding Avatar Setup**: The avatar selection during onboarding currently has placeholder imagery; a premium interactive avatar creator would be ideal here.
* **Arena Victory View**: The victory state display uses layout properties that are not fully responsive under ultra-wide monitors.

---

## 5. Responsive Issues

* **Leaderboard Page**: Mobile table horizontal scrolling could be improved by using sticky index and name headers.
* **Hard Drag Drop Board**: Grid template elements can overlap slightly on small mobile devices (screen width < 360px).

---

## 6. Components Requiring Future Refactor

* **CodeRunnerBlock**: The Python/JavaScript execution sandboxing could be moved to web workers to keep rendering animations smooth.
* **FeedbackPanel / Companion Box**: The feedback boxes across all challenges could be abstracted into a unified `ChallengeFeedback` component to reduce code duplication.
