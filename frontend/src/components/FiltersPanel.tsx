import React from 'react';
import styled from 'styled-components';
import { Filters, Category, Tag } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

const Panel = styled.div`
  background: ${props => props.theme.colors.white};
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.lg} ${props => props.theme.borderRadius.lg} 0 0;
  max-height: 50vh;
  overflow-y: auto;
`;

const Title = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: ${props => props.theme.spacing.md};
  color: ${props => props.theme.colors.text};
`;

const Section = styled.div`
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const SectionTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  margin-bottom: ${props => props.theme.spacing.sm};
  color: ${props => props.theme.colors.gray[700]};
`;

const PriceInputs = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.sm};
`;

const Input = styled.input`
  flex: 1;
  padding: ${props => props.theme.spacing.sm};
  border: 1px solid ${props => props.theme.colors.gray[300]};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 14px;
  min-height: 48px;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const Select = styled.select`
  width: 100%;
  padding: ${props => props.theme.spacing.sm};
  border: 1px solid ${props => props.theme.colors.gray[300]};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 14px;
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
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
  min-height: 36px;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
  }

  &:active {
    transform: scale(0.95);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.sm};
  margin-top: ${props => props.theme.spacing.md};
`;

const Button = styled.button<{ primary?: boolean }>`
  flex: 1;
  padding: ${props => props.theme.spacing.md};
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  min-height: 48px;
  background: ${props => props.primary ? props.theme.colors.primary : props.theme.colors.gray[200]};
  color: ${props => props.primary ? props.theme.colors.white : props.theme.colors.text};

  &:active {
    transform: scale(0.98);
  }
`;

interface FiltersPanelProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  onApply: () => void;
  onReset: () => void;
}

const FiltersPanel: React.FC<FiltersPanelProps> = ({
  filters,
  onFiltersChange,
  onApply,
  onReset,
}) => {
  const { t } = useLanguage();

  const categories: Category[] = ['house', 'school', 'office', 'market', 'shopping_center'];
  const tags: Tag[] = ['for_students', 'for_workers', 'for_office_staff', 'for_sellers'];

  const handleTagToggle = (tag: Tag) => {
    const currentTags = filters.tags || [];
    const newTags = currentTags.includes(tag)
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag];
    onFiltersChange({ ...filters, tags: newTags });
  };

  return (
    <Panel>
      <Title>{t('filters')}</Title>

      <Section>
        <SectionTitle>{t('price')}</SectionTitle>
        <PriceInputs>
          <Input
            type="number"
            placeholder={t('min_price')}
            value={filters.minPrice || ''}
            onChange={(e) => onFiltersChange({
              ...filters,
              minPrice: e.target.value ? parseInt(e.target.value) : undefined,
            })}
          />
          <Input
            type="number"
            placeholder={t('max_price')}
            value={filters.maxPrice || ''}
            onChange={(e) => onFiltersChange({
              ...filters,
              maxPrice: e.target.value ? parseInt(e.target.value) : undefined,
            })}
          />
        </PriceInputs>
      </Section>

      <Section>
        <SectionTitle>{t('category')}</SectionTitle>
        <Select
          value={filters.category || ''}
          onChange={(e) => onFiltersChange({
            ...filters,
            category: e.target.value || undefined,
          })}
        >
          <option value="">{t('select_category')}</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{t(cat)}</option>
          ))}
        </Select>
      </Section>

      <Section>
        <SectionTitle>{t('tags')}</SectionTitle>
        <TagsContainer>
          {tags.map(tag => (
            <TagButton
              key={tag}
              active={filters.tags?.includes(tag) || false}
              onClick={() => handleTagToggle(tag)}
            >
              {t(tag)}
            </TagButton>
          ))}
        </TagsContainer>
      </Section>

      <ButtonGroup>
        <Button onClick={onReset}>{t('reset')}</Button>
        <Button primary onClick={onApply}>{t('apply')}</Button>
      </ButtonGroup>
    </Panel>
  );
};

export default FiltersPanel;

