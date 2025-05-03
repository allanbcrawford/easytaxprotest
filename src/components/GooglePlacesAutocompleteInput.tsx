import React, { useEffect, useRef, useState } from 'react';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const SCRIPT_ID = 'google-maps-js';

function loadGoogleMapsScript(callback: () => void) {
  if (window.google && window.google.maps && window.google.maps.places) {
    callback();
    return;
  }
  if (document.getElementById(SCRIPT_ID)) {
    const checkLoaded = setInterval(() => {
      if (window.google && window.google.maps && window.google.maps.places) {
        clearInterval(checkLoaded);
        callback();
      }
    }, 50);
    return;
  }
  const script = document.createElement('script');
  script.id = SCRIPT_ID;
  script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
  script.async = true;
  script.defer = true;
  script.onload = callback;
  document.body.appendChild(script);
}

interface GooglePlacesAutocompleteInputProps {
  onPlaceSelect: (place: any) => void;
  placeholder?: string;
}

const GooglePlacesAutocompleteInput: React.FC<GooglePlacesAutocompleteInputProps> = ({ onPlaceSelect, placeholder }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState('');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    loadGoogleMapsScript(() => setReady(true));
  }, []);

  useEffect(() => {
    if (!ready || !inputRef.current) return;
    // @ts-ignore
    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
      types: ['address'],
      componentRestrictions: { country: 'us' },
    });
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      setInputValue(place.formatted_address || '');
      onPlaceSelect(place);
    });
    return () => {
      // No direct way to remove the listener, but input will unmount
    };
  }, [ready, onPlaceSelect]);

  return (
    <input
      ref={inputRef}
      type="text"
      value={inputValue}
      onChange={e => setInputValue(e.target.value)}
      placeholder={placeholder || 'Enter your property address'}
      style={{ width: '100%', fontSize: 16, padding: 8 }}
      autoComplete="off"
    />
  );
};

export default GooglePlacesAutocompleteInput; 