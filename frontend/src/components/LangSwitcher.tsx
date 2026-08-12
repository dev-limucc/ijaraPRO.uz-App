import React from 'react';
import styled from 'styled-components';
import { useLanguage } from '../contexts/LanguageContext';

const LangSwitcherContainer = styled.div`
  position: fixed;
  top: ${props => props.theme.spacing.md};
  right: ${props => props.theme.spacing.md};
  z-index: 1000;
  display: flex;
  gap: ${props => props.theme.spacing.xs};
  background: ${props => props.theme.colors.white};
  border-radius: ${props => props.theme.borderRadius.full};
  padding: ${props => props.theme.spacing.xs};
  box-shadow: ${props => props.theme.shadows.lg};
`;

const LangButton = styled.button<{ active: boolean }>`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border: none;
  background: ${props => props.active ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.active ? props.theme.colors.white : props.theme.colors.text};
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: 12px;
  font-weight: ${props => props.active ? 600 : 400};
  cursor: pointer;
  transition: all 0.2s;
  min-width: 48px;
  min-height: 32px;

  &:hover {
    background: ${props => props.active ? props.theme.colors.primary : props.theme.colors.gray[100]};
  }

  &:active {
    transform: scale(0.95);
  }
`;

const LangSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <LangSwitcherContainer>
      <LangButton
        active={language === 'uz'}
        onClick={() => setLanguage('uz')}
        aria-label="Uzbek"
      >
        UZ
      </LangButton>
      <LangButton
        active={language === 'ru'}
        onClick={() => setLanguage('ru')}
        aria-label="Russian"
      >
        RU
      </LangButton>
      <LangButton
        active={language === 'en'}
        onClick={() => setLanguage('en')}
        aria-label="English"
      >
        EN
      </LangButton>
    </LangSwitcherContainer>
  );
};

export default LangSwitcher;

