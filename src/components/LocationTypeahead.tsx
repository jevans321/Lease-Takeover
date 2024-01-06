import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './LocationTypeahead.css';

interface LocationTypeaheadProps {
  value: string;
  onChange: (value: string) => void;
}
/**
 * Debouncing in the LocationTypeahead Component:
 *
 * Debouncing is a programming practice used to ensure that time-consuming tasks do not fire so often,
 * which can cause performance issues. In the context of the LocationTypeahead component, debouncing is
 * applied to the input field where users type their search queries (like city names or ZIP codes).
 *
 * Here's how it works:
 * - When a user starts typing in the input field, we don't want to call the API to fetch suggestions
 *   after every single keystroke, as this would lead to excessive and unnecessary API calls.
 * - Instead, we set up a delay (a 'debounce' time) after the user stops typing, and only then do we call
 *   the API. This way, the API is called less frequently.
 * - Specifically, when the user types, a timer starts (set by `setTimeout`). If the user keeps typing,
 *   the timer resets. Only when the user pauses for longer than the specified debounce time (e.g., 300ms),
 *   the API call is made.
 * - This approach significantly reduces the number of API calls, improving the efficiency and performance
 *   of the component, and offering a smoother user experience.
 */
const LocationTypeahead: React.FC<LocationTypeaheadProps> = ({ value, onChange }) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  // State to keep track of the debounce timeout
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clear any existing timeout to reset the debounce timer
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    // Set a new timeout with the debounce interval (e.g., 300ms)
    setDebounceTimeout(setTimeout(() => {
      fetchSuggestions();
    }, 300)); // 300ms debounce time

    // Cleanup function to clear the timeout when the component is unmounted or the value changes
    return () => {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }
    };
  }, [value]); // Effect runs on every change to 'value'

  const fetchSuggestions = async () => {
    if (!value) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await axios.get(`/location-suggestions`, {
        params: { query: value }
      });

      setSuggestions(response.data);
    } catch (error) {
      console.error('Error fetching location suggestions:', error);
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    setShowSuggestions(false);
  };

  return (
    <div className="location-typeahead-container">
      <input
        type="text"
        placeholder="City or ZIP"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
      />
      {showSuggestions && (
        <ul className="suggestions-list">
          {suggestions.map((suggestion, index) => (
            <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LocationTypeahead;
