import React from 'react';
import { ThemeProvider, CSSReset, theme } from '@chakra-ui/core';

export default function MyApp({ Component, pageProps }: any) {
  return (
    <ThemeProvider theme={theme}>
      <CSSReset />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
