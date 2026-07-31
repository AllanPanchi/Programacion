import { useColorScheme } from '@/hooks/use-color-scheme';
import { Palette, Tema } from '@/constants/design';

export function useTema(): Tema {
  const scheme = useColorScheme();
  return Palette[scheme === 'dark' ? 'dark' : 'light'];
}

export function useEsOscuro(): boolean {
  return useColorScheme() === 'dark';
}
