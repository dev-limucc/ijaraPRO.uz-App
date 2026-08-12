import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import BottomSheet from '../components/BottomSheet';
import LangSwitcher from '../components/LangSwitcher';
import YandexMap from '../components/YandexMap';
import { Listing, Filters } from '../types';
import { listingsApi } from '../api/listings';
import { useLanguage } from '../contexts/LanguageContext';

const MapWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

const CreateButton = styled.button`
  position: fixed;
  top: ${props => props.theme.spacing.md};
  left: ${props => props.theme.spacing.md};
  z-index: 1000;
  width: 56px;
  height: 56px;
  border-radius: ${props => props.theme.borderRadius.full};
  background: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.white};
  border: none;
  font-size: 24px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: ${props => props.theme.shadows.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s;

  &:active {
    transform: scale(0.95);
  }
`;

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  font-size: 16px;
  color: ${props => props.theme.colors.text};
`;

const MapScreen: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [filters, setFilters] = useState<Filters>({});
  const [loading, setLoading] = useState(true);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([41.3111, 69.2797]); // Tashkent default

  useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const location: [number, number] = [latitude, longitude];
          setUserLocation(location);
          setMapCenter(location);
          setLoading(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (userLocation) {
      loadListings(userLocation[0], userLocation[1]);
    } else if (!loading) {
      // Fallback: load listings for default location (Tashkent) if geolocation fails
      loadListings(41.3111, 69.2797);
    }
  }, [userLocation, filters, loading]);

  const loadListings = async (lat: number, lng: number) => {
    try {
      const data = await listingsApi.getNearby(lat, lng, filters);
      console.log('Loaded listings:', data.length, data);
      setListings(data);
    } catch (error) {
      console.error('Error loading listings:', error);
    }
  };

  const handleListingClick = (listing: Listing) => {
    navigate(`/listing/${listing.id}`);
  };

  const handleListingMarkerClick = (listing: Listing) => {
    setSelectedListing(listing);
    setMapCenter([listing.lat, listing.lng]);
  };

  const handleCreateClick = () => {
    navigate('/create');
  };

  if (loading) {
    return (
      <LoadingOverlay>
        {t('loading_location')}
      </LoadingOverlay>
    );
  }

  return (
    <MapWrapper>
      <YandexMap
        center={mapCenter}
        zoom={13}
        userLocation={userLocation || undefined}
        markers={listings.map(listing => ({
          id: listing.id,
          lat: listing.lat,
          lng: listing.lng,
          title: `${listing.title} - ${listing.price.toLocaleString()} ${listing.currency || 'UZS'}`,
          onClick: () => handleListingMarkerClick(listing),
        }))}
        showZoomControls={true}
        zoomControlsPosition="bottom-right"
      />
      <CreateButton onClick={handleCreateClick}>+</CreateButton>
      <LangSwitcher />
      <BottomSheet
        listings={listings}
        filters={filters}
        onFiltersChange={setFilters}
        onListingClick={handleListingClick}
        onListingMarkerClick={handleListingMarkerClick}
      />
    </MapWrapper>
  );
};

export default MapScreen;
