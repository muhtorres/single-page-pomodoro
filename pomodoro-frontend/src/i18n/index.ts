'use client';

import { useLocale as useNextIntlLocale, useTranslations } from 'next-intl';
import { useCallback } from 'react';
import { Locale, LOCALES, DEFAULT_LOCALE } from './types';

// Storage key for locale preference
const LOCALE_STORAGE_KEY = 'pomodoro_locale';

/**
 * Hook personalizado para gerenciar o locale com persistência em localStorage
 */
export function useLocale() {
  // next-intl's useLocale returns the current locale
  const currentLocale = useNextIntlLocale() as Locale;

  // Função para obter o locale atual do localStorage (client-side)
  const getLocale = useCallback((): Locale => {
    if (typeof window === 'undefined') {
      return DEFAULT_LOCALE;
    }
    const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    if (stored && (stored === 'pt-BR' || stored === 'en-US')) {
      return stored;
    }
    return DEFAULT_LOCALE;
  }, []);

  // Função para definir o locale e salvar no localStorage
  const setLocale = useCallback((locale: Locale) => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    // Reload the page to apply the new locale
    window.location.reload();
  }, []);

  return {
    locale: currentLocale,
    getLocale,
    setLocale,
    locales: LOCALES,
  };
}

/**
 * Hook para acessar as traduções
 * Uso: const t = useTranslation(); t('header.title')
 */
export function useTranslation() {
  return useTranslations();
}

/**
 * Helper para formatar plural em português
 */
export function pluralize(count: number, singular: string, plural: string): string {
  return count === 1 ? singular : plural;
}

/**
 * Helper para substituir variáveis em strings de tradução
 */
export function interpolate(template: string, values: Record<string, string | number>): string {
  return Object.entries(values).reduce((str, [key, value]) => {
    return str.replace(new RegExp(`\\{${key}\\}`, 'g'), String(value));
  }, template);
}
