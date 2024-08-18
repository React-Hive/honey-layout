import React, { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import hljs from 'highlight.js';

import 'highlight.js/styles/github-dark-dimmed.min.css';

import { PAGES } from './constants';
import { AppProvider } from './providers';
import { HoneyBox } from '../components';
import { HoneyContainer, Menu, TopBar } from './components';

export const App = () => {
  const location = useLocation();

  useEffect(() => {
    hljs.highlightAll();
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

        <HoneyBox $display="flex" $height="100%" $flexGrow={1} $overflow="auto">
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
