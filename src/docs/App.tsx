import React, { useEffect, useRef } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import hljs from 'highlight.js';

import 'highlight.js/styles/github-dark-dimmed.min.css';

import type { Nullable } from '../types';
import { PAGES } from './constants';
import { AppProvider } from './providers';
import { HoneyBox } from '../components';
import { HoneyContainer, Menu, TopBar } from './components';

export const App = () => {
  const location = useLocation();

  const contentRef = useRef<Nullable<HTMLDivElement>>(null);

  useEffect(() => {
    hljs.highlightAll();

    contentRef.current?.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, [location.pathname]);

  return (
    <AppProvider>
      <TopBar />

      <HoneyBox
        $position="relative"
        $display="flex"
        $height="100%"
        $alignItems="flex-start"
        $overflow="hidden"
      >
        <Menu />

        <HoneyBox ref={contentRef} $display="flex" $flexGrow={1} $height="100%" $overflow="auto">
          <HoneyContainer>
            <Routes>
              {PAGES.map(page => (
                <Route key={page.path} path={page.path} element={page.element} />
              ))}

              <Route path="*" element={<Navigate to={PAGES[0].path} replace />} />
            </Routes>
          </HoneyContainer>
        </HoneyBox>
      </HoneyBox>
    </AppProvider>
  );
};
