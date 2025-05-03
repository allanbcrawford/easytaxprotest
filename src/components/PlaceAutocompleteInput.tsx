import React, { useEffect, useRef, useState } from 'react';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const SCRIPT_ID = 'google-maps-js';

function loadGoogleMapsScript(callback: () => void) {
  if (window.customElements && window.customElements.get('gmpx-place-autocomplete')) {
    callback();
    return;
  }
  if (document.getElementById(SCRIPT_ID)) {
    const checkLoaded = setInterval(() => {
      if (window.customElements && window.customElements.get('gmpx-place-autocomplete')) {
        clearInterval(checkLoaded);
        callback();
      }
    }, 50);
    return;
  }
  const script = document.createElement('script');
  script.id = SCRIPT_ID;
  script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&v=beta&region=US`;
  script.async = true;
  script.defer = true;
  script.onload = callback;
  document.body.appendChild(script);
}

export default function PlaceAutocompleteInput({ onPlaceSelect }: { onPlaceSelect: (place: any) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [fallbackValue, setFallbackValue] = useState('');

  useEffect(() => {
    console.log('Loading Google Maps script...');
    loadGoogleMapsScript(() => {
      console.log('Google Maps script loaded.');
      setReady(true);
    });
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (ref.current && !ref.current.querySelector('gmpx-place-autocomplete')) {
      console.log('Attaching gmpx-place-autocomplete element...');
      const el = document.createElement('gmpx-place-autocomplete');
      el.setAttribute('placeholder', 'Enter your property address');
      el.setAttribute('style', 'width: 100%; font-size: 16px;');
      el.setAttribute('componentRestrictions', JSON.stringify({ country: 'us' }));
      el.addEventListener('gmpx-place-select', (event: any) => {
        if (event.detail && event.detail.place) {
          onPlaceSelect(event.detail.place);
        }
      });
      ref.current.appendChild(el);
    }
    return () => {
      if (ref.current) {
        ref.current.innerHTML = '';
      }
    };
  }, [ready, onPlaceSelect]);

  // Always show fallback input for now
  return (
    <input
      type="text"
      placeholder="Enter your property address (fallback)"
      value={fallbackValue}
      onChange={e => {
        setFallbackValue(e.target.value);
        onPlaceSelect({ formatted_address: e.target.value });
      }}
      style={{ width: '100%', fontSize: 16, padding: 8 }}
    />
  );
} 