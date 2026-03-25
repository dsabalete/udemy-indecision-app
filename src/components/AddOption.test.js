// AddOption unit tests
// Requirements: 3.2, 3.3

import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddOption from './AddOption';

// Test 1: shows error for duplicate input
// Requirements: 3.2
test('shows error "This option already exists" for duplicate input', async () => {
  const handleAddOption = jest.fn(() => 'This option already exists');
  render(<AddOption handleAddOption={handleAddOption} />);

  const input = screen.getByRole('textbox');
  const button = screen.getByRole('button', { name: /Add Option/i });

  await act(async () => {
    await userEvent.type(input, 'Go for a walk');
    await userEvent.click(button);
  });

  expect(handleAddOption).toHaveBeenCalledWith('Go for a walk');
  expect(screen.getByText('This option already exists')).toBeInTheDocument();
});

// Test 2: shows error for empty input
// Requirements: 3.3
test('shows error "Enter valid value to add item" for empty input', async () => {
  const handleAddOption = jest.fn(() => 'Enter valid value to add item');
  render(<AddOption handleAddOption={handleAddOption} />);

  const button = screen.getByRole('button', { name: /Add Option/i });

  await act(async () => {
    await userEvent.click(button);
  });

  expect(handleAddOption).toHaveBeenCalledWith('');
  expect(screen.getByText('Enter valid value to add item')).toBeInTheDocument();
});

// Test 3: clears error and input on successful submission
// Requirements: 3.2, 3.3
test('clears error and input on successful submission', async () => {
  // First render with an error, then succeed
  const handleAddOption = jest
    .fn()
    .mockReturnValueOnce('This option already exists')
    .mockReturnValueOnce(undefined);

  render(<AddOption handleAddOption={handleAddOption} />);

  const input = screen.getByRole('textbox');
  const button = screen.getByRole('button', { name: /Add Option/i });

  // First submit — triggers error
  await act(async () => {
    await userEvent.type(input, 'Read a book');
    await userEvent.click(button);
  });
  expect(screen.getByText('This option already exists')).toBeInTheDocument();

  // Second submit — succeeds, error cleared and input reset
  await act(async () => {
    await userEvent.type(input, 'Read a book');
    await userEvent.click(button);
  });
  expect(screen.queryByText('This option already exists')).not.toBeInTheDocument();
  expect(input.value).toBe('');
});

// Property 8: AddOption trims input before calling prop
// Feature: modernize-react-app, Property 8: AddOption trims input before calling prop
// Validates: Requirements 2.3
import fc from 'fast-check';

test('P8: AddOption trims input before calling handleAddOption prop', async () => {
  await fc.assert(
    fc.asyncProperty(fc.string(), async (str) => {
      const paddedInput = `  ${str}  `;
      const handleAddOption = jest.fn(() => undefined);
      const container = document.createElement('div');
      document.body.appendChild(container);
      const { unmount } = render(<AddOption handleAddOption={handleAddOption} />, { container });

      const input = container.querySelector('input[name="option"]');
      const button = container.querySelector('button');

      await act(async () => {
        fireEvent.change(input, { target: { value: paddedInput } });
        fireEvent.submit(input.closest('form'));
      });

      expect(handleAddOption).toHaveBeenCalledWith(str.trim());
      unmount();
      document.body.removeChild(container);
    }),
    { numRuns: 100 }
  );
});

// Property 9: AddOption reflects submission result
// Feature: modernize-react-app, Property 9: AddOption reflects submission result
// Validates: Requirements 2.4, 2.5
test('P9: AddOption reflects submission result — error displayed or cleared based on prop return', async () => {
  await fc.assert(
    fc.asyncProperty(
      fc.string({ minLength: 1 }).filter((s) => s.trim().length > 0),
      fc.boolean(),
      async (inputValue, returnsError) => {
        const errorMessage = 'Some error occurred';
        const handleAddOption = jest.fn(() => (returnsError ? errorMessage : undefined));
        const container = document.createElement('div');
        document.body.appendChild(container);
        const { unmount } = render(<AddOption handleAddOption={handleAddOption} />, { container });

        const input = container.querySelector('input[name="option"]');

        await act(async () => {
          fireEvent.change(input, { target: { value: inputValue } });
          fireEvent.submit(input.closest('form'));
        });

        if (returnsError) {
          // Error string returned — error should be displayed, input value unchanged
          expect(container.querySelector('p.add-option-error')).not.toBeNull();
          expect(container.querySelector('p.add-option-error').textContent).toBe(errorMessage);
          expect(input.value).toBe(inputValue);
        } else {
          // undefined returned — error cleared, input reset to empty
          expect(container.querySelector('p.add-option-error')).toBeNull();
          expect(input.value).toBe('');
        }

        unmount();
        document.body.removeChild(container);
      }
    ),
    { numRuns: 100 }
  );
});
