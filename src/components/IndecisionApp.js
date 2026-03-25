import React, { useState, useEffect } from 'react';
import AddOption from './AddOption';
import Action from './Action';
import Header from './Header';
import Options from './Options';
import OptionModal from './OptionModal';

export default function IndecisionApp() {
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(undefined);

  // Mount: load from localStorage
  useEffect(() => {
    try {
      const json = localStorage.getItem('options');
      const stored = JSON.parse(json);
      if (stored) {
        setOptions(stored);
      }
    } catch (e) {
      // silently ignore — options stays []
    }
  }, []);

  // Update: persist to localStorage on every options change
  useEffect(() => {
    localStorage.setItem('options', JSON.stringify(options));
  }, [options]);

  const handleDeleteOptions = () => setOptions([]);

  const handleClearSelectedOption = () => setSelectedOption(undefined);

  const handleDeleteOption = (optionToRemove) => {
    setOptions((prevOptions) => prevOptions.filter((option) => optionToRemove !== option));
  };

  const handlePick = () => {
    const randomNum = Math.floor(Math.random() * options.length);
    const option = options[randomNum];
    setSelectedOption(option);
  };

  const handleAddOption = (option) => {
    if (!option) {
      return 'Enter valid value to add item';
    } else if (options.indexOf(option) > -1) {
      return 'This option already exists';
    }
    setOptions((prevOptions) => prevOptions.concat(option));
  };

  const subtitle = 'Put your life in the hands of a computer';

  return (
    <div>
      <Header subtitle={subtitle} />
      <div className="container">
        <Action
          hasOptions={options.length > 0}
          handlePick={handlePick}
        />
        <div className="widget">
          <Options
            options={options}
            handleDeleteOptions={handleDeleteOptions}
            handleDeleteOption={handleDeleteOption}
          />
          <AddOption
            handleAddOption={handleAddOption}
          />
        </div>
      </div>
      <OptionModal
        selectedOption={selectedOption}
        handleClearSelectedOption={handleClearSelectedOption}
      />
    </div>
  );
}
