import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { Listing, Filters } from '../types';
import ListingCard from './ListingCard';
import FiltersPanel from './FiltersPanel';
import { useLanguage } from '../contexts/LanguageContext';

const SheetContainer = styled.div<{ isOpen: boolean; height: number }>`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: ${props => props.height}px;
  background: ${props => props.theme.colors.white};
  border-radius: ${props => props.theme.borderRadius.xl} ${props => props.theme.borderRadius.xl} 0 0;
  box-shadow: ${props => props.theme.shadows.xl};
  z-index: 1000;
  transform: translateY(${props => props.isOpen ? 0 : props.height - 60}px);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  touch-action: pan-y;
  max-height: 90vh;
`;

const DragHandle = styled.div`
  width: 40px;
  height: 4px;
  background: ${props => props.theme.colors.gray[300]};
  border-radius: ${props => props.theme.borderRadius.full};
  margin: ${props => props.theme.spacing.sm} auto;
  cursor: grab;
  touch-action: none;

  &:active {
    cursor: grabbing;
  }
`;

const TabsContainer = styled.div`
  display: flex;
  border-bottom: 1px solid ${props => props.theme.colors.gray[200]};
  padding: 0 ${props => props.theme.spacing.md};
`;

const Tab = styled.button<{ active: boolean }>`
  flex: 1;
  padding: ${props => props.theme.spacing.md};
  border: none;
  background: transparent;
  font-size: 16px;
  font-weight: ${props => props.active ? 600 : 400};
  color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.gray[600]};
  border-bottom: 2px solid ${props => props.active ? props.theme.colors.primary : 'transparent'};
  cursor: pointer;
  transition: all 0.2s;
  min-height: 48px;

  &:active {
    transform: scale(0.98);
  }
`;

const Content = styled.div`
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding: ${props => props.theme.spacing.md};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing.xl};
  color: ${props => props.theme.colors.gray[500]};
`;

interface BottomSheetProps {
  listings: Listing[];
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  onListingClick: (listing: Listing) => void;
  onListingMarkerClick: (listing: Listing) => void;
}

type TabType = 'listings' | 'filters';

const BottomSheet: React.FC<BottomSheetProps> = ({
  listings,
  filters,
  onFiltersChange,
  onListingClick,
  onListingMarkerClick,
}) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabType>('listings');
  const [isOpen, setIsOpen] = useState(true);
  const [sheetHeight, setSheetHeight] = useState(400);
  const sheetRef = useRef<HTMLDivElement>(null);
  const startY = useRef<number>(0);
  const currentY = useRef<number>(0);
  const isDragging = useRef<boolean>(false);

  const minHeight = 60;
  const maxHeight = window.innerHeight * 0.9;

  useEffect(() => {
    if (activeTab === 'listings' && listings.length > 0) {
      setIsOpen(true);
    }
  }, [activeTab, listings]);

  const handleTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
    isDragging.current = true;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    currentY.current = e.touches[0].clientY;
    const deltaY = startY.current - currentY.current;
    const newHeight = Math.max(minHeight, Math.min(maxHeight, sheetHeight + deltaY));
    setSheetHeight(newHeight);
    startY.current = currentY.current;
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
    if (sheetHeight < 150) {
      setIsOpen(false);
      setSheetHeight(minHeight);
    } else if (sheetHeight > maxHeight - 100) {
      setSheetHeight(maxHeight);
    }
  };

  const handleApplyFilters = () => {
    setActiveTab('listings');
  };

  const handleResetFilters = () => {
    onFiltersChange({});
    setActiveTab('listings');
  };

  return (
    <SheetContainer
      ref={sheetRef}
      isOpen={isOpen}
      height={sheetHeight}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <DragHandle />
      <TabsContainer>
        <Tab
          active={activeTab === 'listings'}
          onClick={() => {
            setActiveTab('listings');
            setIsOpen(true);
          }}
        >
          {t('nearby_listings')} ({listings.length})
        </Tab>
        <Tab
          active={activeTab === 'filters'}
          onClick={() => setActiveTab('filters')}
        >
          {t('filters')}
        </Tab>
      </TabsContainer>
      <Content>
        {activeTab === 'listings' ? (
          listings.length > 0 ? (
            listings.map(listing => (
              <ListingCard
                key={listing.id}
                listing={listing}
                onClick={() => {
                  onListingClick(listing);
                  onListingMarkerClick(listing);
                }}
              />
            ))
          ) : (
            <EmptyState>{t('no_listings')}</EmptyState>
          )
        ) : (
          <FiltersPanel
            filters={filters}
            onFiltersChange={onFiltersChange}
            onApply={handleApplyFilters}
            onReset={handleResetFilters}
          />
        )}
      </Content>
    </SheetContainer>
  );
};

export default BottomSheet;

