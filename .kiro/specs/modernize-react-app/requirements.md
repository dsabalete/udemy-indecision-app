# Requirements Document

## Introduction

This feature modernizes the Indecision App by converting all class-based React components to functional components using hooks. The two class components — `IndecisionApp` and `AddOption` — will be rewritten to use `useState` and `useEffect`, replacing lifecycle methods and class state. All existing behavior must be preserved. The remaining components (`Action`, `Header`, `Option`, `Options`, `OptionModal`) are already functional and require no conversion.

## Glossary

- **IndecisionApp**: The root component that manages the options list and selected option state, currently implemented as a class component.
- **AddOption**: The form component that handles user input for adding new options, currently implemented as a class component.
- **Options_List**: The array of string options managed by `IndecisionApp`.
- **Selected_Option**: The randomly chosen option stored in state by `IndecisionApp`.
- **LocalStorage**: The browser's `localStorage` API used to persist the options list across page reloads.
- **Hook**: A React function (e.g., `useState`, `useEffect`) used to manage state and side effects in functional components.

## Requirements

### Requirement 1: Convert IndecisionApp to a Functional Component

**User Story:** As a developer, I want `IndecisionApp` rewritten as a functional component with hooks, so that the codebase follows modern React patterns and eliminates class component usage.

#### Acceptance Criteria

1. THE `IndecisionApp` component SHALL be implemented as a functional component using `useState` and `useEffect` hooks.
2. THE `IndecisionApp` component SHALL manage `options` state as an array initialized to an empty array.
3. THE `IndecisionApp` component SHALL manage `selectedOption` state initialized to `undefined`.
4. WHEN the component mounts, THE `IndecisionApp` component SHALL read the options list from `LocalStorage` and initialize `options` state with the stored value.
5. WHEN the `options` state changes, THE `IndecisionApp` component SHALL write the updated options list to `LocalStorage`.
6. IF `LocalStorage` contains invalid JSON, THEN THE `IndecisionApp` component SHALL silently ignore the error and initialize `options` to an empty array.
7. THE `IndecisionApp` component SHALL expose a `handleAddOption` function that returns an error string when the option is empty or already exists, and returns `undefined` on success.
8. THE `IndecisionApp` component SHALL expose a `handleDeleteOption` function that removes the specified option from the `Options_List`.
9. THE `IndecisionApp` component SHALL expose a `handleDeleteOptions` function that clears all options from the `Options_List`.
10. THE `IndecisionApp` component SHALL expose a `handlePick` function that sets `Selected_Option` to a randomly chosen item from the `Options_List`.
11. THE `IndecisionApp` component SHALL expose a `handleClearSelectedOption` function that resets `Selected_Option` to `undefined`.
12. THE `IndecisionApp` component SHALL render the same JSX structure and pass the same props to child components as the original class implementation.

---

### Requirement 2: Convert AddOption to a Functional Component

**User Story:** As a developer, I want `AddOption` rewritten as a functional component with hooks, so that it is consistent with the rest of the component tree.

#### Acceptance Criteria

1. THE `AddOption` component SHALL be implemented as a functional component using the `useState` hook.
2. THE `AddOption` component SHALL manage an `error` state initialized to `undefined`.
3. WHEN the form is submitted, THE `AddOption` component SHALL call the `handleAddOption` prop with the trimmed input value.
4. WHEN the `handleAddOption` prop returns an error string, THE `AddOption` component SHALL set the `error` state to that string and display it.
5. WHEN the `handleAddOption` prop returns no error, THE `AddOption` component SHALL clear the `error` state and reset the input field value to an empty string.
6. THE `AddOption` component SHALL render the same JSX structure as the original class implementation, including the error paragraph and form elements.

---

### Requirement 3: Preserve Existing Behavior

**User Story:** As a user, I want the app to behave identically after the refactor, so that no functionality is lost or broken.

#### Acceptance Criteria

1. WHEN a user adds a valid option, THE `IndecisionApp` component SHALL append the option to the `Options_List` and persist it to `LocalStorage`.
2. WHEN a user adds a duplicate option, THE `AddOption` component SHALL display the error message "This option already exists".
3. WHEN a user submits an empty input, THE `AddOption` component SHALL display the error message "Enter valid value to add item".
4. WHEN a user clicks "What should I do?", THE `IndecisionApp` component SHALL display a randomly selected option from the `Options_List` in the `OptionModal`.
5. WHEN a user removes a single option, THE `IndecisionApp` component SHALL remove only that option from the `Options_List`.
6. WHEN a user clicks "Remove All", THE `IndecisionApp` component SHALL clear the entire `Options_List`.
7. WHEN the page is reloaded, THE `IndecisionApp` component SHALL restore the `Options_List` from `LocalStorage`.

---

### Requirement 4: Remove Deprecated Patterns

**User Story:** As a developer, I want all deprecated React patterns removed, so that the codebase is free of legacy anti-patterns.

#### Acceptance Criteria

1. THE codebase SHALL contain no class components after the conversion is complete.
2. THE codebase SHALL contain no `componentDidMount`, `componentDidUpdate`, or `componentWillUnmount` lifecycle methods after conversion.
3. THE `Header` component SHALL use a default parameter value instead of `defaultProps` to define the default `title` prop.
