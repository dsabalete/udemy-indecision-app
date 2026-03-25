# Implementation Plan: Modernize React App

## Overview

Convert `IndecisionApp` and `AddOption` from class components to functional components with hooks, remove `defaultProps` from `Header`, and add unit and property-based tests to validate the refactor.

## Tasks

- [x] 0. Modernize build tooling and dependencies
  - [x] 0.1 Update outdated dependencies to versions compatible with React 18
    - Bump `react-modal` to `^3.15.1` (React 18 peer dep support)
    - Bump `react-router-dom` to `^6.4.0`, `uuid` to `^9.0.0`, `validator` to `^13.7.0`, `express` to `^4.18.0`, `normalize.css` to `^8.0.1`
    - Update `engines` field to `node >= 18.0.0`
    - Delete stale lockfile and reinstall
  - [x] 0.2 Fix sass-loader deprecation warnings
    - Set `api: 'modern'` in sass-loader options in `webpack.config.js`
    - Migrate all SCSS files from `@import` to `@use` / `@forward`
    - Replace deprecated `lighten()` / `darken()` calls with `color.scale()` from `sass:color`
    - Add `@use '../base/settings' as *` to all component partials that reference design tokens

- [x] 1. Install fast-check and set up test files
  - Run `npm install --save-dev fast-check`
  - Create empty test files: `src/components/IndecisionApp.test.js`, `src/components/AddOption.test.js`, `src/components/Header.test.js`
  - _Requirements: 1.1, 2.1_

- [x] 2. Convert Header to use default parameter instead of defaultProps
  - [x] 2.1 Remove `Header.defaultProps` and add default parameter `title = 'Indecision'` in the function signature
    - _Requirements: 4.3_
  - [x] 2.2 Write unit test for Header default title
    - Verify `Header` renders "Indecision" when no `title` prop is passed
    - _Requirements: 4.3_

- [x] 3. Convert AddOption to a functional component
  - [x] 3.1 Rewrite `AddOption` as a functional component using `useState` for `error` state
    - Use `e.target.elements.option.value.trim()` to read input on submit
    - Call `handleAddOption` prop with trimmed value; set error state from result
    - Clear input field when no error is returned
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_
  - [x] 3.2 Write unit tests for AddOption
    - Test: shows error "This option already exists" for duplicate input
    - Test: shows error "Enter valid value to add item" for empty input
    - Test: clears error and input on successful submission
    - _Requirements: 3.2, 3.3_
  - [x] 3.3 Write property test for AddOption input trimming (Property 8)
    - `// Feature: modernize-react-app, Property 8: AddOption trims input before calling prop`
    - Generator: `fc.string()` with leading/trailing whitespace padding
    - Assert the `handleAddOption` mock is called with the trimmed value
    - **Validates: Requirements 2.3**
  - [x] 3.4 Write property test for AddOption submission result reflection (Property 9)
    - `// Feature: modernize-react-app, Property 9: AddOption reflects submission result`
    - Generator: `fc.boolean()` to control whether mock prop returns error or undefined
    - Assert error is displayed when error string returned; error cleared and input reset when undefined returned
    - **Validates: Requirements 2.4, 2.5**

- [x] 4. Checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Convert IndecisionApp to a functional component
  - [x] 5.1 Rewrite `IndecisionApp` as a functional component with `useState` for `options` and `selectedOption`
    - Initialize `options` to `[]` and `selectedOption` to `undefined`
    - Convert all handler methods to `const` arrow functions: `handleDeleteOptions`, `handleClearSelectedOption`, `handleDeleteOption`, `handlePick`, `handleAddOption`
    - Preserve identical JSX structure and prop passing to child components
    - _Requirements: 1.1, 1.2, 1.3, 1.7, 1.8, 1.9, 1.10, 1.11, 1.12, 4.1, 4.2_
  - [x] 5.2 Add mount `useEffect` to read options from localStorage
    - Wrap `localStorage.getItem` + `JSON.parse` in try/catch; silently ignore errors
    - Dependency array: `[]`
    - _Requirements: 1.4, 1.6, 3.7_
  - [x] 5.3 Add options-change `useEffect` to write options to localStorage
    - Call `localStorage.setItem('options', JSON.stringify(options))` when `options` changes
    - Dependency array: `[options]`
    - _Requirements: 1.5, 3.1_

- [x] 6. Write unit tests for IndecisionApp
  - [x] 6.1 Write unit tests for IndecisionApp rendering and localStorage behavior
    - Test: renders with empty options list when localStorage is empty
    - Test: restores options from localStorage on mount
    - Test: falls back to empty list on invalid localStorage JSON
    - Test: renders correct JSX structure with all child components
    - _Requirements: 1.4, 1.6, 1.12, 3.7_

- [x] 7. Write property-based tests for IndecisionApp
  - [x] 7.1 Write property test for localStorage round-trip on mount (Property 1)
    - `// Feature: modernize-react-app, Property 1: localStorage round-trip on mount`
    - Generator: `fc.array(fc.string())`
    - Pre-populate localStorage, render component, assert `options` state matches stored array
    - **Validates: Requirements 1.4, 3.7**
  - [x] 7.2 Write property test for options persistence after change (Property 2)
    - `// Feature: modernize-react-app, Property 2: Options list persisted after change`
    - Generator: `fc.string({ minLength: 1 })`
    - Add option, assert `localStorage.getItem('options')` contains the new option
    - **Validates: Requirements 1.5, 3.1**
  - [x] 7.3 Write property test for handleAddOption validation (Property 3)
    - `// Feature: modernize-react-app, Property 3: handleAddOption validation`
    - Generators: `fc.string()`, `fc.array(fc.string())`
    - Assert returns `undefined` iff input is non-empty and not a duplicate; otherwise returns non-empty error string
    - **Validates: Requirements 1.7, 3.2, 3.3**
  - [x] 7.4 Write property test for handleDeleteOption (Property 4)
    - `// Feature: modernize-react-app, Property 4: handleDeleteOption removes only the target`
    - Generator: `fc.array(fc.string(), { minLength: 1 })`
    - Assert result equals original list with exactly the target item removed, order preserved
    - **Validates: Requirements 1.8, 3.5**
  - [x] 7.5 Write property test for handleDeleteOptions (Property 5)
    - `// Feature: modernize-react-app, Property 5: handleDeleteOptions always produces empty list`
    - Generator: `fc.array(fc.string())`
    - Assert options list is empty after calling `handleDeleteOptions`
    - **Validates: Requirements 1.9, 3.6**
  - [x] 7.6 Write property test for handlePick (Property 6)
    - `// Feature: modernize-react-app, Property 6: handlePick selects a member of the list`
    - Generator: `fc.array(fc.string(), { minLength: 1 })`
    - Assert `selectedOption` is contained in the options list after `handlePick`
    - **Validates: Requirements 1.10, 3.4**
  - [x] 7.7 Write property test for handleClearSelectedOption (Property 7)
    - `// Feature: modernize-react-app, Property 7: handleClearSelectedOption resets to undefined`
    - Generator: `fc.string({ minLength: 1 })`
    - Set `selectedOption` to a non-undefined value, call `handleClearSelectedOption`, assert it is `undefined`
    - **Validates: Requirements 1.11**

- [x] 8. Final checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Each task references specific requirements for traceability
- Property tests run 100 iterations each (`{ numRuns: 100 }`)
- Property tests are tagged with `// Feature: modernize-react-app, Property N: ...` comments
- Unit tests and property tests are complementary — both should pass before marking a task complete
