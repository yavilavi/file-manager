import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { BrowserRouter } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Notifications } from '@mantine/notifications';
import { NavigationProgress } from '@mantine/nprogress';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <MantineProvider theme={{ focusRing: 'never' }}>
    <NavigationProgress />
    <Notifications />
    <ModalsProvider>
      <BrowserRouter>
        <StrictMode>
          <QueryClientProvider client={queryClient}>
            <App />
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        </StrictMode>
      </BrowserRouter>
    </ModalsProvider>
  </MantineProvider>,
);
