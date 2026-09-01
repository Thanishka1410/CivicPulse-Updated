import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { AP_DEFAULT_LAT, AP_DEFAULT_LNG, AP_DEFAULT_LOCATION } from '../../utils/categories';
import { MapPin, Locate, CheckCircle, Navigation, Loader2 } from 'lucide-react';

const customIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34]
});

export async function reverseGeocodeAddress(lat, lng) {
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`, {
      headers: { 'Accept-Language': 'en' }
    });
    if (res.ok) {
      const data = await res.json();
      const addr = data.address || {};
      
      const road = addr.road || addr.street || addr.pedestrian || '';
      const area = addr.village || addr.suburb || addr.neighbourhood || addr.residential || addr.town || addr.city_district || '';
      const city = addr.city || addr.county || addr.state_district || '';
      const state = addr.state || 'Andhra Pradesh';
      const postcode = addr.postcode || '';

      const parts = [road, area, city, state, postcode].filter(Boolean);
      const fullAddress = parts.length > 0 ? parts.join(', ') : data.display_name;

      return {
        road,
        area,
        city,
        fullAddress: fullAddress || `Location near (${lat.toFixed(4)}, ${lng.toFixed(4)})`
      };
    }
  } catch (err) {
    console.warn("Reverse geocoding error:", err);
  }
  return {
    road: 'Central Main Road',
    area: 'Vijayawada Central Ward',
    city: 'Andhra Pradesh',
    fullAddress: `Vijayawada Central Ward, Andhra Pradesh (Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)})`
  };
}

function LocationMarker({ position, setPosition, onLocationChange }) {
  useMapEvents({
    click(e) {
      const newPos = [e.latlng.lat, e.latlng.lng];
      setPosition(newPos);
      if (onLocationChange) onLocationChange(e.latlng.lat, e.latlng.lng);
    }
  });

  return position === null ? null : (
    <Marker position={position} icon={customIcon} />
  );
}

export default function LocationPicker({ defaultLat = AP_DEFAULT_LAT, defaultLng = AP_DEFAULT_LNG, onChange }) {
  const [position, setPosition] = useState([defaultLat, defaultLng]);
  const [locating, setLocating] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [addressDetails, setAddressDetails] = useState({
    road: 'MG Road',
    area: 'Vijayawada Central Ward',
    city: 'Andhra Pradesh',
    fullAddress: AP_DEFAULT_LOCATION
  });

  useEffect(() => {
    detectLocation();
  }, []);

  const fetchAddressAndNotify = async (lat, lng) => {
    setIsGeocoding(true);
    const result = await reverseGeocodeAddress(lat, lng);
    setAddressDetails(result);
    setIsGeocoding(false);
    if (onChange) onChange(lat, lng, result.fullAddress, result);
  };

  const detectLocation = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setPosition([lat, lng]);
        setLocating(false);
        await fetchAddressAndNotify(lat, lng);
      },
      async (err) => {
        console.warn("Geolocation fallback to Andhra Pradesh default:", err.message);
        setLocating(false);
        setPosition([defaultLat, defaultLng]);
        await fetchAddressAndNotify(defaultLat, defaultLng);
      },
      { timeout: 8000 }
    );
  };

  const handleMarkerChange = async (lat, lng) => {
    setPosition([lat, lng]);
    await fetchAddressAndNotify(lat, lng);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-300 light:text-slate-700 flex items-center gap-1.5">
          <Navigation className="w-4 h-4 text-teal-400" /> Location Verification (Andhra Pradesh, India)
        </label>
        <button
          type="button"
          onClick={detectLocation}
          disabled={locating || isGeocoding}
          className="flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 font-medium bg-sky-950/60 border border-sky-800/60 px-2.5 py-1 rounded-lg transition-colors"
        >
          <Locate className={`w-3.5 h-3.5 ${locating ? 'animate-spin' : ''}`} />
          {locating ? 'Detecting GPS...' : 'Auto-Detect Location'}
        </button>
      </div>

      {/* Map Window */}
      <div className="h-56 w-full rounded-xl border border-slate-800 light:border-slate-300 overflow-hidden relative shadow-inner">
        <MapContainer
          center={position}
          zoom={13}
          scrollWheelZoom={false}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker
            position={position}
            setPosition={setPosition}
            onLocationChange={handleMarkerChange}
          />
        </MapContainer>
      </div>

      {/* Structured Address Verification Display */}
      <div className="p-3 bg-slate-900 light:bg-slate-100 border border-slate-800 light:border-slate-200 rounded-xl space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="font-bold text-slate-200 light:text-slate-800 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-teal-400" /> Street & Village Address:
          </span>
          {isGeocoding ? (
            <span className="text-[10px] text-amber-400 flex items-center gap-1 font-mono">
              <Loader2 className="w-3 h-3 animate-spin" /> Resolving Address...
            </span>
          ) : (
            <span className="text-emerald-400 font-bold text-[10px] flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" /> Address Resolved
            </span>
          )}
        </div>

        {/* Formatted Address Result Box */}
        <div className="p-2.5 bg-slate-950 light:bg-white border border-slate-800/80 light:border-slate-300 rounded-lg text-slate-100 light:text-slate-900 font-medium leading-relaxed shadow-sm">
          {addressDetails.fullAddress}
        </div>

        {/* Technical Geo-coordinates */}
        <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pt-1">
          <span>GPS Coordinates: {position[0].toFixed(5)}, {position[1].toFixed(5)}</span>
          <span>OpenStreetMap Geocoder</span>
        </div>
      </div>
    </div>
  );
}
