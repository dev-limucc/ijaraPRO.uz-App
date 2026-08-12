import React from 'react';
import styled from 'styled-components';
import { Listing } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

const Card = styled.div`
  background: ${props => props.theme.colors.white};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.md};
  box-shadow: ${props => props.theme.shadows.md};
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  min-height: 48px;

  &:active {
    transform: scale(0.98);
  }

  &:hover {
    box-shadow: ${props => props.theme.shadows.lg};
  }
`;

const ImageContainer = styled.div`
  width: 100%;
  height: 180px;
  border-radius: ${props => props.theme.borderRadius.md};
  overflow: hidden;
  margin-bottom: ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.gray[200]};
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Title = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const Price = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const Address = styled.div`
  font-size: 14px;
  color: ${props => props.theme.colors.gray[600]};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const Distance = styled.div`
  font-size: 12px;
  color: ${props => props.theme.colors.accent};
  font-weight: 500;
`;

interface ListingCardProps {
  listing: Listing;
  onClick: () => void;
}

const ListingCard: React.FC<ListingCardProps> = ({ listing, onClick }) => {
  const { t } = useLanguage();
  const firstImage = listing.images[0];

  return (
    <Card onClick={onClick}>
      {firstImage && (
        <ImageContainer>
          <Image
            src={firstImage.url.startsWith('http') ? firstImage.url : `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}${firstImage.url}`}
            alt={listing.title}
          />
        </ImageContainer>
      )}
      <Title>{listing.title}</Title>
      <Price>
        {listing.price.toLocaleString()} {listing.currency}
      </Price>
      <div style={{ display: 'flex', gap: '12px', fontSize: '14px', color: '#6B7280', marginBottom: '8px', flexWrap: 'wrap' }}>
        {listing.area && <span>{listing.area} m²</span>}
        {listing.rooms && <span>{t('rooms')}: {listing.rooms}</span>}
        {listing.maxPeople && <span>{t('max_people')}: {listing.maxPeople}</span>}
      </div>
      {listing.address && <Address>{listing.address}</Address>}
      {listing.distance !== undefined && (
        <Distance>{t('distance')}: {listing.distance} {t('km')}</Distance>
      )}
    </Card>
  );
};

export default ListingCard;

