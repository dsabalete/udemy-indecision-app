import React, { useState } from 'react';

export default function AddOption({ handleAddOption }) {
  const [error, setError] = useState(undefined);

  const handleSubmit = (e) => {
    e.preventDefault();
    const option = e.target.elements.option.value.trim();
    const result = handleAddOption(option);
    setError(result);
    if (!result) {
      e.target.elements.option.value = '';
    }
  };

  return (
    <div>
      {error && <p className="add-option-error">{error}</p>}
      <form className="add-option" onSubmit={handleSubmit}>
        <input className="add-option__input" type="text" name="option" />
        <button className="button">Add Option</button>
      </form>
    </div>
  );
}
