import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import '@mantine/core/styles.css';
import React from 'react';

import { ColorSchemeScript, MantineProvider } from '@mantine/core';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TurboRobot',
  description: 'Real-time chat application',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <ColorSchemeScript />
        </head>

        <body className={inter.className}>
          <MantineProvider>{children}</MantineProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
