import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { listingsApi } from '../api/listings';
import { Listing } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

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
  gap: ${props => props.theme.spacing.md};
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
  transition: all 0.2s;

  &:active {
    transform: scale(0.95);
    background: ${props => props.theme.colors.gray[200]};
  }
`;

const ImageCarousel = styled.div`
  width: 100%;
  height: 300px;
  position: relative;
  overflow: hidden;
  background: ${props => props.theme.colors.gray[200]};
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ImageIndicator = styled.div`
  position: absolute;
  bottom: ${props => props.theme.spacing.md};
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: ${props => props.theme.spacing.xs};
  background: rgba(0, 0, 0, 0.5);
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.full};
`;

const Dot = styled.div<{ active: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: ${props => props.theme.borderRadius.full};
  background: ${props => props.active ? props.theme.colors.white : 'rgba(255, 255, 255, 0.5)'};
  cursor: pointer;
`;

const NavButton = styled.button<{ left?: boolean }>`
  position: absolute;
  top: 50%;
  ${props => props.left ? 'left' : 'right'}: ${props => props.theme.spacing.md};
  transform: translateY(-50%);
  width: 48px;
  height: 48px;
  border-radius: ${props => props.theme.borderRadius.full};
  border: none;
  background: rgba(255, 255, 255, 0.9);
  color: ${props => props.theme.colors.text};
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${props => props.theme.shadows.md};

  &:active {
    transform: translateY(-50%) scale(0.95);
  }
`;

const Content = styled.div`
  padding: ${props => props.theme.spacing.md};
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const Price = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const InfoSection = styled.div`
  background: ${props => props.theme.colors.white};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.md};
  box-shadow: ${props => props.theme.shadows.sm};
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${props => props.theme.spacing.sm} 0;
  border-bottom: 1px solid ${props => props.theme.colors.gray[200]};

  &:last-child {
    border-bottom: none;
  }
`;

const InfoLabel = styled.div`
  font-size: 14px;
  color: ${props => props.theme.colors.gray[600]};
`;

const InfoValue = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
`;

const PhoneLink = styled.a`
  color: ${props => props.theme.colors.primary};
  text-decoration: none;
  font-weight: 600;

  &:active {
    opacity: 0.7;
  }
`;

const Description = styled.div`
  font-size: 16px;
  line-height: 1.6;
  color: ${props => props.theme.colors.text};
  margin-top: ${props => props.theme.spacing.sm};
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${props => props.theme.spacing.sm};
  margin-top: ${props => props.theme.spacing.sm};
`;

const Tag = styled.span`
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  background: ${props => props.theme.colors.accent};
  color: ${props => props.theme.colors.white};
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: 12px;
  font-weight: 500;
`;

const ListingDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [listing, setListing] = useState<Listing | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadListing(id);
    }
  }, [id]);

  const loadListing = async (listingId: string) => {
    try {
      const data = await listingsApi.getById(listingId);
      setListing(data);
    } catch (error) {
      console.error('Error loading listing:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextImage = () => {
    if (listing && listing.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % listing.images.length);
    }
  };

  const prevImage = () => {
    if (listing && listing.images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + listing.images.length) % listing.images.length);
    }
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  if (loading) {
    return (
      <Container>
        <Header>
          <BackButton onClick={() => navigate(-1)}>←</BackButton>
        </Header>
        <Content>Loading...</Content>
      </Container>
    );
  }

  if (!listing) {
    return (
      <Container>
        <Header>
          <BackButton onClick={() => navigate(-1)}>←</BackButton>
        </Header>
        <Content>Listing not found</Content>
      </Container>
    );
  }

  const currentImage = listing.images[currentImageIndex];
  const imageUrl = currentImage?.url.startsWith('http')
    ? currentImage.url
    : `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}${currentImage?.url}`;

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate(-1)}>←</BackButton>
      </Header>

      {listing.images.length > 0 && (
        <ImageCarousel>
          <Image src={imageUrl} alt={listing.title} />
          {listing.images.length > 1 && (
            <>
              <NavButton left onClick={prevImage}>‹</NavButton>
              <NavButton onClick={nextImage}>›</NavButton>
              <ImageIndicator>
                {listing.images.map((_, index) => (
                  <Dot
                    key={index}
                    active={index === currentImageIndex}
                    onClick={() => goToImage(index)}
                  />
                ))}
              </ImageIndicator>
            </>
          )}
        </ImageCarousel>
      )}

      <Content>
        <Title>{listing.title}</Title>
        <Price>{listing.price.toLocaleString()} {listing.currency}</Price>

        <InfoSection>
          <InfoRow>
            <InfoLabel>{t('category')}</InfoLabel>
            <InfoValue>{t(listing.category)}</InfoValue>
          </InfoRow>
          {listing.area && (
            <InfoRow>
              <InfoLabel>{t('area')}</InfoLabel>
              <InfoValue>{listing.area} m²</InfoValue>
            </InfoRow>
          )}
          {listing.rooms && (
            <InfoRow>
              <InfoLabel>{t('rooms')}</InfoLabel>
              <InfoValue>{listing.rooms}</InfoValue>
            </InfoRow>
          )}
          {listing.maxPeople && (
            <InfoRow>
              <InfoLabel>{t('max_people')}</InfoLabel>
              <InfoValue>{listing.maxPeople}</InfoValue>
            </InfoRow>
          )}
          {listing.address && (
            <InfoRow>
              <InfoLabel>{t('address')}</InfoLabel>
              <InfoValue>{listing.address}</InfoValue>
            </InfoRow>
          )}
          {listing.distance !== undefined && (
            <InfoRow>
              <InfoLabel>{t('distance')}</InfoLabel>
              <InfoValue>{listing.distance.toFixed(1)} {t('km')}</InfoValue>
            </InfoRow>
          )}
          <InfoRow>
            <InfoLabel>{t('phone')}</InfoLabel>
            <InfoValue>
              <PhoneLink href={`tel:${listing.phoneNumber}`}>
                {listing.phoneNumber}
              </PhoneLink>
            </InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>{t('name')}</InfoLabel>
            <InfoValue>{listing.name}</InfoValue>
          </InfoRow>
        </InfoSection>

        {listing.description && (
          <InfoSection>
            <InfoLabel>{t('description')}</InfoLabel>
            <Description>{listing.description}</Description>
          </InfoSection>
        )}

        {listing.tags.length > 0 && (
          <InfoSection>
            <InfoLabel>{t('tags')}</InfoLabel>
            <TagsContainer>
              {listing.tags.map((tag, index) => (
                <Tag key={index}>{t(tag)}</Tag>
              ))}
            </TagsContainer>
          </InfoSection>
        )}
      </Content>
    </Container>
  );
};

export default ListingDetail;

