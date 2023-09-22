import { MouseEvent, ReactNode, useEffect, useRef, useState } from 'react';
import { css, styled } from 'styled-components';
import { useScrollLock } from '../../hooks/useScrollLock';
import { useScreenConfigStore } from '../../stores/useScreenConfigStore';
import { Button } from '../button/Button';
import { Icon } from '../icon/Icon';
import { IconsType } from '../icon/icons';

type DropdownProps = {
  children: ReactNode;
  btnText?: string;
  iconName: IconsType;
  align?: 'left' | 'right';
};

export function Dropdown({
  children,
  btnText,
  iconName,
  align = 'left',
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [direction, setDirection] = useState<'up' | 'down'>('down');
  const [lockScroll, unlockScroll] = useScrollLock('home--body__items');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const screenRect = useScreenConfigStore(state => state.screenRect);

  useEffect(() => {
    if (isOpen) {
      lockScroll();
    }
    return () => {
      unlockScroll();
    };
  }, [isOpen, lockScroll, unlockScroll]);

  const onToggle = (event: MouseEvent) => {
    event.stopPropagation();
    if (!isOpen) {
      chooseDirection();
    }
    setIsOpen(!isOpen);
  };

  const onClose = (event: MouseEvent) => {
    event.stopPropagation();
    unlockScroll();
    setIsOpen(false);
  };

  const chooseDirection = () => {
    if (dropdownRef.current && screenRect) {
      const { bottom } = dropdownRef.current.getBoundingClientRect();

      if (screenRect.bottom - 64 < bottom + 230) {
        setDirection('up');
        return;
      }
      setDirection('down');
    }
  };

  return (
    <div ref={dropdownRef}>
      <DropdownButton styledType="text" onClick={onToggle} $isOpen={isOpen}>
        {btnText && <Text>{btnText}</Text>}
        <Icon name={iconName} color="neutralTextStrong" />
      </DropdownButton>
      {isOpen && (
        <Container $isOpen={isOpen} $align={align} $direction={direction}>
          <Menus onClick={onClose}>{children}</Menus>
        </Container>
      )}
    </div>
  );
}

const DropdownButton = styled(Button)<{ $isOpen: boolean }>`
  padding: 0 8px;

  ${({ $isOpen }) => {
    if ($isOpen) {
      return css`
        &::before {
          content: '';
          position: fixed;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 10;
          background-color: ${({ theme }) => theme.color.neutralOverlay};
        }
      `;
    }
  }}
`;

const Text = styled.span`
  font: ${({ theme }) => theme.font.availableStrong16};
  color: ${({ theme }) => theme.color.neutralText};
`;

const Container = styled.div<{
  $isOpen: boolean;
  $align: string;
  $direction: string;
}>`
  border-radius: 12px;
  position: absolute;
  right: ${({ $align }) => ($align === 'right' ? '8px' : 'auto')};
  bottom: ${({ $direction }) => ($direction === 'up' ? '40px' : 'auto')};
  z-index: 10;
  background-color: ${({ theme }) => theme.color.neutralBackground};
`;

const Menus = styled.ul`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;
