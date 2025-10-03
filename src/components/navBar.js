import React, { useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const NavBarContainer = styled.header`
  position: sticky;
  top: 0;
  z-index: 1000;
  background: rgba(10, 12, 28, 0.9);
  backdrop-filter: blur(6px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
`;

const NavInner = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  padding: 12px 16px;
`;

const Brand = styled(Link)`
  color: #fff;
  text-decoration: none;
  font-weight: 700;
  letter-spacing: 0.3px;
`;

const Links = styled.ul`
  display: none;
  gap: 20px;
  list-style: none;
  padding: 0;
  margin: 0;

  @media (min-width: 768px) {
    display: flex;
    align-items: center;
  }
`;

const NavItem = styled.li``;

const NavAnchor = styled(Link)`
  color: #dfe6ff;
  text-decoration: none;
  padding: 8px 10px;
  border-radius: 6px;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    color: #ffffff;
  }
`;

const Hamburger = styled.button`
  background: transparent;
  border: none;
  color: #ffffff;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;

  @media (min-width: 768px) {
    display: none;
  }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px);
`;

const Drawer = styled(motion.aside)`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 82vw;
  max-width: 360px;
  background: #0b0e1f;
  border-right: 1px solid rgba(255, 255, 255, 0.08);
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const DrawerTitle = styled.div`
  color: #fff;
  font-weight: 700;
  margin-bottom: 10px;
`;

const DrawerLink = styled(Link)`
  color: #dfe6ff;
  text-decoration: none;
  padding: 12px 10px;
  border-radius: 8px;
  transition:
    background 0.2s ease,
    color 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    color: #ffffff;
  }
`;

const defaultLinks = [
  { to: '/', label: 'Home' },
  { to: '/SecretProjects', label: 'Secret Projects' },
];

export default function NavBar({
  brand = 'davon-whitworth',
  links = defaultLinks,
}) {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const onKeyDown = useCallback(e => {
    if (e.key === 'Escape') setOpen(false);
  }, []);

  useEffect(() => {
    if (!open) return;
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onKeyDown]);

  return (
    <NavBarContainer>
      <NavInner>
        <Brand to="/">{brand}</Brand>

        <Links>
          {links.map(link => (
            <NavItem key={link.to}>
              <NavAnchor to={link.to}>{link.label}</NavAnchor>
            </NavItem>
          ))}
        </Links>

        <Hamburger aria-label="Open menu" onClick={() => setOpen(true)}>
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 6H21"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M3 12H21"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M3 18H21"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </Hamburger>
      </NavInner>

      <AnimatePresence>
        {open && (
          <>
            <Overlay
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <Drawer
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 260, damping: 30 }}
            >
              <DrawerTitle>{brand}</DrawerTitle>
              {links.map(link => (
                <DrawerLink key={link.to} to={link.to}>
                  {link.label}
                </DrawerLink>
              ))}
            </Drawer>
          </>
        )}
      </AnimatePresence>
    </NavBarContainer>
  );
}
