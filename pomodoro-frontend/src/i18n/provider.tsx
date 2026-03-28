'use client';

import { NextIntlClientProvider } from 'next-intl';
import { ReactNode } from 'react';

interface I18nProviderProps {
  children: ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
  // For client-side locale management, we'll use a custom hook
  // that reads from localStorage and updates the provider
  return <NextIntlClientProvider>{children}</NextIntlClientProvider>;
}
