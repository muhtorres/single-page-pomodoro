import { getRequestConfig } from 'next-intl/server';
import { DEFAULT_LOCALE } from './types';

export default getRequestConfig(async () => {
  // For client-side, we'll use the locale from localStorage
  // This is mainly for SSR - default to pt-BR
  const locale = DEFAULT_LOCALE;

  return {
    locale,
    messages: (await import(`./locales/${locale}.ts`)).default,
  };
});
