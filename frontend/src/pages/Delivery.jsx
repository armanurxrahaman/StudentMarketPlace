import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import toast from 'react-hot-toast';
import { FiMapPin, FiCopy, FiShare2, FiMap } from 'react-icons/fi';

// Import marker images using ES modules
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Configure default icon for Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Draggable marker component
function DraggableMarker({ position, setPosition }) {
  const markerRef = React.useRef(null);

  const eventHandlers = {
    dragend() {
      const marker = markerRef.current;
      if (marker) {
        setPosition(marker.getLatLng());
      }
    },
  };

  return (
    <Marker draggable position={position} ref={markerRef} eventHandlers={eventHandlers}>
      <Popup className="custom-popup">
        <div className="text-sm font-medium">
          Drag me to adjust your delivery location
        </div>
      </Popup>
    </Marker>
  );
}

function Delivery() {
  const [position, setPosition] = useState(null);
  const [shareableLink, setShareableLink] = useState("");

  // Get current location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        (err) => {
          console.error("Error retrieving location:", err);
          toast.error("Unable to retrieve your location.");
        }
      );
    } else {
      toast.error("Geolocation is not supported by this browser.");
    }
  }, []);

  const generateLink = () => {
    if (position) {
      // Generate an OpenStreetMap link with the coordinates
      const { lat, lng } = position;
      const url = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=15/${lat}/${lng}`;
      setShareableLink(url);
    }
  };

  const handleCopy = () => {
    if (shareableLink) {
      navigator.clipboard.writeText(shareableLink).then(() => {
        toast.success("Link copied to clipboard!");
      }).catch((error) => {
        console.error("Error copying link:", error);
        toast.error("Failed to copy link.");
      });
    }
  };

  if (!position) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-gray-100 flex items-center justify-center">
        <div className="text-center space-y-4 p-8 bg-white rounded-2xl shadow-lg animate-pulse">
          <FiMap className="w-12 h-12 mx-auto text-teal-600" />
          <p className="text-lg font-medium text-gray-700">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center justify-center">
            <FiMapPin className="w-8 h-8 mr-3 text-teal-600" />
            Delivery Location
          </h1>
          <p className="text-gray-600 text-lg">Set your precise delivery location on the map</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Map Container */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="h-[500px]">
                <MapContainer 
                  center={position} 
                  zoom={13} 
                  scrollWheelZoom 
                  style={{ height: "100%", width: "100%" }}
                  className="z-0"
                >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <DraggableMarker position={position} setPosition={setPosition} />
        </MapContainer>
      </div>
            </div>
          </div>

          {/* Location Details Panel */}
          <div className="space-y-6">
            {/* Coordinates Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <FiMapPin className="w-5 h-5 mr-2 text-teal-600" />
                Location Details
              </h2>
              <div className="space-y-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-600">Latitude</p>
                  <p className="text-lg font-medium text-gray-900">{position.lat.toFixed(6)}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-600">Longitude</p>
                  <p className="text-lg font-medium text-gray-900">{position.lng.toFixed(6)}</p>
                </div>
              </div>
            </div>

            {/* Share Location Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <FiShare2 className="w-5 h-5 mr-2 text-teal-600" />
                Share Location
              </h2>
        <button 
          onClick={generateLink}
                className="w-full bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center"
        >
                <FiShare2 className="w-5 h-5 mr-2" />
          Generate Shareable Link
        </button>

        {shareableLink && (
                <div className="mt-4 space-y-3">
                  <div className="relative">
            <input 
              type="text"
              readOnly
              value={shareableLink}
              onClick={(e) => e.target.select()}
                      className="w-full p-3 pr-12 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
                    <button 
                      onClick={handleCopy}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-teal-600 hover:text-teal-700 p-2"
                    >
                      <FiCopy className="w-5 h-5" />
            </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Delivery;
