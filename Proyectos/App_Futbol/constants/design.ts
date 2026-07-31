import { Platform, TextStyle } from 'react-native';

import { Rol } from '@/types/futbol';

/** Quita el contorno azul de foco que el navegador pinta en los inputs. */
export const sinOutline = (Platform.OS === 'web'
  ? { outlineStyle: 'none' }
  : {}) as unknown as TextStyle;

/** Paleta de la app. Verde césped como color primario, naranja como acento deportivo. */
export const Palette = {
  light: {
    bg: '#F1F5F9',
    surface: '#FFFFFF',
    surfaceAlt: '#E9EFF5',
    surfaceSunken: '#DFE7EF',
    text: '#0F172A',
    textMuted: '#5B6B7F',
    textFaint: '#94A3B8',
    border: '#DCE3EB',
    primary: '#0D7C4D',
    primaryDeep: '#095C39',
    primarySoft: '#DBF2E6',
    onPrimary: '#FFFFFF',
    accent: '#EA6A1F',
    accentSoft: '#FDE8D9',
    danger: '#DC2626',
    dangerSoft: '#FEE2E2',
    overlay: 'rgba(15, 23, 42, 0.5)',
    shadowSm: '0px 1px 3px rgba(15, 23, 42, 0.08)',
    shadowMd: '0px 4px 12px rgba(15, 23, 42, 0.10)',
    shadowLg: '0px 10px 28px rgba(15, 23, 42, 0.18)',
  },
  dark: {
    bg: '#0A0F1A',
    surface: '#151D2B',
    surfaceAlt: '#1E2838',
    surfaceSunken: '#0E1420',
    text: '#E9EEF6',
    textMuted: '#9AA9BC',
    textFaint: '#64748B',
    border: '#2A3648',
    primary: '#17A366',
    primaryDeep: '#0D7C4D',
    primarySoft: '#123528',
    onPrimary: '#FFFFFF',
    accent: '#F97D3C',
    accentSoft: '#33200F',
    danger: '#F06565',
    dangerSoft: '#3A1A1A',
    overlay: 'rgba(0, 0, 0, 0.65)',
    shadowSm: '0px 1px 3px rgba(0, 0, 0, 0.4)',
    shadowMd: '0px 4px 12px rgba(0, 0, 0, 0.45)',
    shadowLg: '0px 10px 28px rgba(0, 0, 0, 0.6)',
  },
};

export type Tema = typeof Palette.light;

/** Metadatos por rol. Los colores funcionan igual sobre fondo claro y oscuro. */
export const ROLES: Record<Rol, { abbr: Rol; label: string; plural: string; color: string }> = {
  POR: { abbr: 'POR', label: 'Portero', plural: 'Porteros', color: '#EFA31D' },
  DEF: { abbr: 'DEF', label: 'Defensa', plural: 'Defensas', color: '#3B82F6' },
  MED: { abbr: 'MED', label: 'Mediocampo', plural: 'Mediocampistas', color: '#10B981' },
  DEL: { abbr: 'DEL', label: 'Delantero', plural: 'Delanteros', color: '#EF4444' },
};

export const ORDEN_ROLES: Rol[] = ['POR', 'DEF', 'MED', 'DEL'];

/** Colores de la cancha, constantes en ambos temas (un campo siempre es verde). */
export const Cesped = {
  franjaA: '#1F8A4C',
  franjaB: '#1A7B43',
  linea: 'rgba(255, 255, 255, 0.82)',
  lineaTenue: 'rgba(255, 255, 255, 0.35)',
  borde: '#0E5B31',
};

export const Spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 28 };

export const Radius = { sm: 8, md: 12, lg: 16, xl: 22, pill: 999 };

export const TITULARES_MAX = 11;
