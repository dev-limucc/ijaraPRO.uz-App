import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { listingsApi, uploadApi } from '../api/listings';
import { CreateListingData, Category, Tag, Currency } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import YandexMap from '../components/YandexMap';

const Container = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  background: ${props => props.theme.colors.background};
`;

const Header = styled.div`
  position: sticky;
  top: 0;
  background: ${props => props.theme.colors.white};
  padding: ${props => props.theme.spacing.md};
  box-shadow: ${props => props.theme.shadows.sm};
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const BackButton = styled.button`
  width: 48px;
  height: 48px;
  border-radius: ${props => props.theme.borderRadius.full};
  border: none;
  background: ${props => props.theme.colors.gray[100]};
  color: ${props => props.theme.colors.text};
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const Form = styled.form`
  padding: ${props => props.theme.spacing.md};
`;

const FormGroup = styled.div`
  margin-bottom: ${props => props.theme.spacing.md};
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const Input = styled.input`
  width: 100%;
  padding: ${props => props.theme.spacing.md};
  border: 1px solid ${props => props.theme.colors.gray[300]};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 16px;
  min-height: 48px;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: ${props => props.theme.spacing.md};
  border: 1px solid ${props => props.theme.colors.gray[300]};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 16px;
  min-height: 120px;
  resize: vertical;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const Select = styled.select`
  width: 100%;
  padding: ${props => props.theme.spacing.md};
  border: 1px solid ${props => props.theme.colors.gray[300]};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 16px;
  min-height: 48px;
  background: ${props => props.theme.colors.white};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${props => props.theme.spacing.sm};
`;

const TagButton = styled.button<{ active: boolean }>`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border: 1px solid ${props => props.active ? props.theme.colors.primary : props.theme.colors.gray[300]};
  background: ${props => props.active ? props.theme.colors.primary : props.theme.colors.white};
  color: ${props => props.active ? props.theme.colors.white : props.theme.colors.text};
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: 14px;
  cursor: pointer;
  min-height: 40px;

  &:active {
    transform: scale(0.95);
  }
`;

const MapContainerWrapper = styled.div`
  width: 100%;
  height: 300px;
  border-radius: ${props => props.theme.borderRadius.md};
  overflow: hidden;
  margin-bottom: ${props => props.theme.spacing.md};
  border: 1px solid ${props => props.theme.colors.gray[300]};
  position: relative;
`;

const LocationToggle = styled.div`
  position: absolute;
  top: ${props => props.theme.spacing.sm};
  right: ${props => props.theme.spacing.sm};
  z-index: 1000;
  display: flex;
  gap: ${props => props.theme.spacing.xs};
  background: ${props => props.theme.colors.white};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing.xs};
  box-shadow: ${props => props.theme.shadows.md};
`;

const ToggleButton = styled.button<{ active: boolean }>`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border: none;
  background: ${props => props.active ? props.theme.colors.primary : props.theme.colors.gray[100]};
  color: ${props => props.active ? props.theme.colors.white : props.theme.colors.text};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  min-height: 32px;
  white-space: nowrap;

  &:active {
    transform: scale(0.95);
  }
`;

const ImageUploadArea = styled.div`
  border: 2px dashed ${props => props.theme.colors.gray[300]};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing.md};
  text-align: center;
  margin-bottom: ${props => props.theme.spacing.md};
  min-height: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;

  &:active {
    border-color: ${props => props.theme.colors.primary};
    background: ${props => props.theme.colors.gray[100]};
  }
`;

const ImagePreviewContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${props => props.theme.spacing.sm};
  margin-top: ${props => props.theme.spacing.md};
`;

const ImagePreview = styled.div`
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: ${props => props.theme.borderRadius.md};
  overflow: hidden;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 4px;
  right: 4px;
  width: 24px;
  height: 24px;
  border-radius: ${props => props.theme.borderRadius.full};
  border: none;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  margin-top: ${props => props.theme.spacing.xl};
`;

const Button = styled.button<{ primary?: boolean }>`
  flex: 1;
  padding: ${props => props.theme.spacing.md};
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  min-height: 48px;
  background: ${props => props.primary ? props.theme.colors.primary : props.theme.colors.gray[200]};
  color: ${props => props.primary ? props.theme.colors.white : props.theme.colors.text};

  &:active {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ListingForm: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [locationMode, setLocationMode] = useState<'current' | 'map'>('map');
  const [currentLocation, setCurrentLocation] = useState<[number, number] | null>(null);
  const [formData, setFormData] = useState<Partial<CreateListingData>>({
    title: '',
    price: 0,
    currency: 'UZS' as Currency,
    area: undefined,
    rooms: undefined,
    maxPeople: undefined,
    category: '' as Category,
    tags: [],
    description: '',
    address: '',
    name: '',
    phoneNumber: '',
    lat: 41.3111,
    lng: 69.2797,
    imageUrls: [],
  });
  const [images, setImages] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  const categories: Category[] = ['house', 'school', 'office', 'market', 'shopping_center'];
  const tags: Tag[] = ['for_students', 'for_workers', 'for_office_staff', 'for_sellers'];

  // Get current location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation([latitude, longitude]);
          if (locationMode === 'current') {
            setFormData(prev => ({
              ...prev,
              lat: latitude,
              lng: longitude,
            }));
          }
        },
        () => {
          // Location denied or error
        }
      );
    }
  }, []);

  // Update location when mode changes
  useEffect(() => {
    if (locationMode === 'current' && currentLocation) {
      setFormData(prev => ({
        ...prev,
        lat: currentLocation[0],
        lng: currentLocation[1],
      }));
    }
  }, [locationMode, currentLocation]);

  const handleInputChange = (field: keyof CreateListingData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTagToggle = (tag: Tag) => {
    const currentTags = formData.tags || [];
    const newTags = currentTags.includes(tag)
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag];
    handleInputChange('tags', newTags);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.slice(0, 10 - images.length);
    setImages(prev => [...prev, ...validFiles]);
  };

  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleMapClick = (lat: number, lng: number) => {
    if (locationMode === 'map') {
      handleInputChange('lat', lat);
      handleInputChange('lng', lng);
    }
  };

  const handleMarkerDrag = (lat: number, lng: number) => {
    if (locationMode === 'map') {
      handleInputChange('lat', lat);
      handleInputChange('lng', lng);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.price || !formData.category || !formData.name || !formData.phoneNumber) {
      alert(t('required'));
      return;
    }

    setUploading(true);
    try {
      let imageUrls: string[] = [];
      if (images.length > 0) {
        imageUrls = await uploadApi.uploadMultiple(images);
      }

      const listingData: CreateListingData = {
        ...formData,
        imageUrls,
      } as CreateListingData;

      await listingsApi.create(listingData);
      navigate('/');
    } catch (error) {
      console.error('Error creating listing:', error);
      alert('Error creating listing');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate(-1)}>←</BackButton>
        <Title>{t('create_listing')}</Title>
        <div style={{ width: 48 }} />
      </Header>

      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>{t('name')} *</Label>
          <Input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>{t('phone_number')} *</Label>
          <Input
            type="tel"
            value={formData.phoneNumber}
            onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>{t('title')} *</Label>
          <Input
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>{t('price')} *</Label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Input
              type="number"
              value={formData.price}
              onChange={(e) => handleInputChange('price', parseInt(e.target.value))}
              required
              min="0"
              style={{ flex: 1 }}
            />
            <Select
              value={formData.currency}
              onChange={(e) => handleInputChange('currency', e.target.value as Currency)}
              style={{ width: '100px', minWidth: '100px' }}
            >
              <option value="UZS">UZS</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </Select>
          </div>
        </FormGroup>

        <FormGroup>
          <Label>{t('area')} (m²)</Label>
          <Input
            type="number"
            placeholder={t('enter_area') || 'Enter area in m²'}
            value={formData.area || ''}
            onChange={(e) => handleInputChange('area', e.target.value ? parseInt(e.target.value) : undefined)}
            min="0"
          />
        </FormGroup>

        <FormGroup>
          <Label>{t('rooms')}</Label>
          <Input
            type="number"
            placeholder={t('enter_rooms') || 'Number of rooms'}
            value={formData.rooms || ''}
            onChange={(e) => handleInputChange('rooms', e.target.value ? parseInt(e.target.value) : undefined)}
            min="0"
          />
        </FormGroup>

        <FormGroup>
          <Label>{t('max_people')}</Label>
          <Input
            type="number"
            placeholder={t('enter_max_people') || 'How many people can fit'}
            value={formData.maxPeople || ''}
            onChange={(e) => handleInputChange('maxPeople', e.target.value ? parseInt(e.target.value) : undefined)}
            min="0"
          />
        </FormGroup>

        <FormGroup>
          <Label>{t('category')} *</Label>
          <Select
            value={formData.category}
            onChange={(e) => handleInputChange('category', e.target.value as Category)}
            required
          >
            <option value="">{t('select_category')}</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{t(cat)}</option>
            ))}
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>{t('tags')}</Label>
          <TagsContainer>
            {tags.map(tag => (
              <TagButton
                key={tag}
                active={formData.tags?.includes(tag) || false}
                onClick={() => handleTagToggle(tag)}
                type="button"
              >
                {t(tag)}
              </TagButton>
            ))}
          </TagsContainer>
        </FormGroup>

        <FormGroup>
          <Label>{t('address')}</Label>
          <Input
            type="text"
            placeholder={t('enter_address')}
            value={formData.address || ''}
            onChange={(e) => handleInputChange('address', e.target.value)}
          />
        </FormGroup>

        <FormGroup>
          <Label>{t('description')}</Label>
          <TextArea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={4}
          />
        </FormGroup>

        <FormGroup>
          <Label>{t('pick_location')}</Label>
          <MapContainerWrapper>
            <LocationToggle>
              <ToggleButton
                type="button"
                active={locationMode === 'current'}
                onClick={() => setLocationMode('current')}
              >
                {t('use_current_location') || 'Current Location'}
              </ToggleButton>
              <ToggleButton
                type="button"
                active={locationMode === 'map'}
                onClick={() => setLocationMode('map')}
              >
                {t('pick_from_map') || 'Pick from Map'}
              </ToggleButton>
            </LocationToggle>
            <YandexMap
              center={[formData.lat || 41.3111, formData.lng || 69.2797]}
              zoom={locationMode === 'current' && currentLocation ? 15 : 13}
              onMapClick={handleMapClick}
              draggableMarker={
                locationMode === 'map'
                  ? {
                      lat: formData.lat || 41.3111,
                      lng: formData.lng || 69.2797,
                      onDragEnd: handleMarkerDrag,
                    }
                  : undefined
              }
              userLocation={locationMode === 'current' && currentLocation ? currentLocation : undefined}
              showZoomControls={true}
              zoomControlsPosition="bottom-right"
            />
          </MapContainerWrapper>
        </FormGroup>

        <FormGroup>
          <Label>{t('upload_images')}</Label>
          <ImageUploadArea onClick={() => fileInputRef.current?.click()}>
            <div>Tap to upload images</div>
            <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '8px' }}>
              {images.length}/10 images
            </div>
          </ImageUploadArea>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageSelect}
            style={{ display: 'none' }}
          />
          {images.length > 0 && (
            <ImagePreviewContainer>
              {images.map((image, index) => (
                <ImagePreview key={index}>
                  <Image src={URL.createObjectURL(image)} alt={`Preview ${index + 1}`} />
                  <RemoveButton
                    onClick={() => handleRemoveImage(index)}
                    type="button"
                  >
                    ×
                  </RemoveButton>
                </ImagePreview>
              ))}
            </ImagePreviewContainer>
          )}
        </FormGroup>

        <ButtonGroup>
          <Button type="button" onClick={() => navigate(-1)}>
            {t('cancel')}
          </Button>
          <Button type="submit" primary disabled={uploading}>
            {uploading ? 'Uploading...' : t('submit')}
          </Button>
        </ButtonGroup>
      </Form>
    </Container>
  );
};

export default ListingForm;
