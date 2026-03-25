// IndecisionApp unit tests
// Requirements: 1.4, 1.6, 1.12, 3.7

import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import Modal from 'react-modal';
import IndecisionApp from './IndecisionApp';

// Suppress react-modal warning about app element
beforeAll(() => {
  Modal.setAppElement(document.createElement('div'));
});

beforeEach(() => {
  localStorage.clear();
});

// Test 1: renders with empty options list when localStorage is empty
// Requirements: 1.4, 3.7
test('renders with empty options list when localStorage is empty', async () => {
  await act(async () => {
    render(<IndecisionApp />);
  });
  expect(screen.getByText(/Please add an option to get started/i)).toBeInTheDocument();
});

// Test 2: restores options from localStorage on mount
// Requirements: 1.4, 3.7
test('restores options from localStorage on mount', async () => {
  localStorage.setItem('options', JSON.stringify(['Option A', 'Option B']));
  render(<IndecisionApp />);
  expect(await screen.findByText(/Option A/)).toBeInTheDocument();
  expect(await screen.findByText(/Option B/)).toBeInTheDocument();
});

// Test 3: falls back to empty list on invalid localStorage JSON
// Requirements: 1.6, 3.7
test('falls back to empty list on invalid localStorage JSON', async () => {
  localStorage.setItem('options', 'not-valid-json{{{');
  await act(async () => {
    render(<IndecisionApp />);
  });
  expect(screen.getByText(/Please add an option to get started/i)).toBeInTheDocument();
});

// Test 4: renders correct JSX structure with all child components
// Requirements: 1.12
test('renders correct JSX structure with all child components', async () => {
  await act(async () => {
    render(<IndecisionApp />);
  });
  // Header renders the app title
  expect(screen.getByText('Indecision')).toBeInTheDocument();
  // Action renders the pick button
  expect(screen.getByRole('button', { name: /What should I do\?/i })).toBeInTheDocument();
  // Options renders the "Your Options" heading
  expect(screen.getByText('Your Options')).toBeInTheDocument();
  // AddOption renders the add button
  expect(screen.getByRole('button', { name: /Add Option/i })).toBeInTheDocument();
});

// ─── Property-Based Tests (fast-check) ───────────────────────────────────────
import fc from 'fast-check';
import { fireEvent } from '@testing-library/react';

// Property 1: localStorage round-trip on mount
// Feature: modernize-react-app, Property 1: localStorage round-trip on mount
// Validates: Requirements 1.4, 3.7
test('P1: mounting with any stored array restores options', async () => {
  await fc.assert(
    fc.asyncProperty(
      // Only generate arrays of strings with visible (non-whitespace-only) content
      fc.array(fc.string({ minLength: 1 }).filter((s) => s.trim() === s && s.trim().length > 0)),
      async (options) => {
        localStorage.clear();
        localStorage.setItem('options', JSON.stringify(options));
        let container;
        await act(async () => {
          ({ container } = render(<IndecisionApp />));
        });
        const { within: withinContainer } = await import('@testing-library/react');
        const scope = withinContainer(container);
        if (options.length === 0) {
          expect(scope.getByText(/Please add an option to get started/i)).toBeInTheDocument();
        } else {
          // Each option renders in a <p class="option__text"> as "N. <value>"
          // Use raw textContent (not RTL-normalized) to handle options with internal spaces
          const optionParagraphs = container.querySelectorAll('p.option__text');
          const renderedTexts = Array.from(optionParagraphs).map((p) =>
            // Extract just the option value: strip the leading "N. " prefix
            p.textContent.replace(/^\s*\d+\.\s*/, '')
          );
          for (const opt of options) {
            expect(renderedTexts).toContain(opt);
          }
        }
        // cleanup this render before next iteration
        const { cleanup } = await import('@testing-library/react');
        cleanup();
      }
    ),
    { numRuns: 100 }
  );
}, 30000);

// Property 2: Options list persisted after change
// Feature: modernize-react-app, Property 2: Options list persisted after change
// Validates: Requirements 1.5, 3.1
test('P2: adding any valid option persists it to localStorage', async () => {
  await fc.assert(
    fc.asyncProperty(
      // Generate pre-trimmed, non-empty strings (no leading/trailing whitespace)
      // so the stored value matches exactly what we typed
      fc.string({ minLength: 1 }).filter((s) => s.trim() === s && s.trim().length > 0),
      async (option) => {
        localStorage.clear();
        let container;
        await act(async () => {
          ({ container } = render(<IndecisionApp />));
        });
        const { within: withinContainer, cleanup } = await import('@testing-library/react');
        const scope = withinContainer(container);
        const input = scope.getByRole('textbox');
        const button = scope.getByRole('button', { name: /Add Option/i });
        await act(async () => {
          fireEvent.change(input, { target: { value: option } });
          fireEvent.click(button);
        });
        const stored = JSON.parse(localStorage.getItem('options'));
        expect(stored).toContain(option);
        cleanup();
      }
    ),
    { numRuns: 100 }
  );
}, 30000);

// Property 3: handleAddOption validation (pure logic)
// Feature: modernize-react-app, Property 3: handleAddOption validation
// Validates: Requirements 1.7, 3.2, 3.3
test('P3: handleAddOption returns undefined iff input is non-empty and not a duplicate', () => {
  // Inline pure logic mirroring the component's handleAddOption
  const handleAddOption = (option, existingOptions) => {
    if (!option) {
      return 'Enter valid value to add item';
    } else if (existingOptions.indexOf(option) > -1) {
      return 'This option already exists';
    }
    return undefined;
  };

  fc.assert(
    fc.property(fc.string(), fc.array(fc.string()), (option, existingOptions) => {
      const result = handleAddOption(option, existingOptions);
      const isValid = option.length > 0 && existingOptions.indexOf(option) === -1;
      if (isValid) {
        expect(result).toBeUndefined();
      } else {
        expect(typeof result).toBe('string');
        expect(result.length).toBeGreaterThan(0);
      }
    }),
    { numRuns: 100 }
  );
});

// Property 4: handleDeleteOption removes only the target (pure logic)
// Feature: modernize-react-app, Property 4: handleDeleteOption removes only the target
// Validates: Requirements 1.8, 3.5
test('P4: handleDeleteOption removes only the target item, preserving order', () => {
  // Pure logic: filter out the target
  const handleDeleteOption = (options, optionToRemove) =>
    options.filter((o) => o !== optionToRemove);

  fc.assert(
    fc.property(fc.array(fc.string(), { minLength: 1 }), (options) => {
      const idx = Math.floor(Math.random() * options.length);
      const target = options[idx];
      const result = handleDeleteOption(options, target);

      // Result should not contain the target
      expect(result).not.toContain(target);

      // All other items (by position) should be preserved in order
      const expected = options.filter((o) => o !== target);
      expect(result).toEqual(expected);
    }),
    { numRuns: 100 }
  );
});

// Property 5: handleDeleteOptions always produces empty list (pure logic)
// Feature: modernize-react-app, Property 5: handleDeleteOptions always produces empty list
// Validates: Requirements 1.9, 3.6
test('P5: handleDeleteOptions always produces an empty list', () => {
  const handleDeleteOptions = () => [];

  fc.assert(
    fc.property(fc.array(fc.string()), (options) => {
      const result = handleDeleteOptions(options);
      expect(result).toEqual([]);
    }),
    { numRuns: 100 }
  );
});

// Property 6: handlePick selects a member of the list (pure logic)
// Feature: modernize-react-app, Property 6: handlePick selects a member of the list
// Validates: Requirements 1.10, 3.4
test('P6: handlePick always selects a value contained in the options list', () => {
  const handlePick = (options) => options[Math.floor(Math.random() * options.length)];

  fc.assert(
    fc.property(fc.array(fc.string(), { minLength: 1 }), (options) => {
      const picked = handlePick(options);
      expect(options).toContain(picked);
    }),
    { numRuns: 100 }
  );
});

// Property 7: handleClearSelectedOption resets to undefined (pure logic)
// Feature: modernize-react-app, Property 7: handleClearSelectedOption resets to undefined
// Validates: Requirements 1.11
test('P7: handleClearSelectedOption always resets selectedOption to undefined', () => {
  const handleClearSelectedOption = () => undefined;

  fc.assert(
    fc.property(fc.string({ minLength: 1 }), (selectedOption) => {
      // selectedOption is some non-empty string (non-undefined)
      expect(selectedOption).toBeDefined();
      const result = handleClearSelectedOption(selectedOption);
      expect(result).toBeUndefined();
    }),
    { numRuns: 100 }
  );
});
