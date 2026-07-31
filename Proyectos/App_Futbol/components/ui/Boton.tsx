import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';

import { Texto } from '@/components/ui/Texto';
import { Radius, Spacing } from '@/constants/design';
import { useTema } from '@/hooks/use-tema';

type Variante = 'solido' | 'suave' | 'contorno' | 'fantasma' | 'peligro';
type Tamano = 'sm' | 'md';

export function Boton({
  titulo,
  icono,
  onPress,
  variante = 'solido',
  tamano = 'md',
  deshabilitado,
  estiloContenedor,
  accessibilityLabel,
}: {
  titulo?: string;
  icono?: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  variante?: Variante;
  tamano?: Tamano;
  deshabilitado?: boolean;
  estiloContenedor?: ViewStyle;
  accessibilityLabel?: string;
}) {
  const t = useTema();

  const paletas: Record<Variante, { fondo: string; texto: string; borde: string }> = {
    solido: { fondo: t.primary, texto: t.onPrimary, borde: 'transparent' },
    suave: { fondo: t.primarySoft, texto: t.primary, borde: 'transparent' },
    contorno: { fondo: 'transparent', texto: t.text, borde: t.border },
    fantasma: { fondo: 'transparent', texto: t.textMuted, borde: 'transparent' },
    peligro: { fondo: t.dangerSoft, texto: t.danger, borde: 'transparent' },
  };
  const p = paletas[variante];
  const compacto = tamano === 'sm';
  const soloIcono = !titulo && !!icono;

  return (
    <Pressable
      onPress={onPress}
      disabled={deshabilitado}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? titulo}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: p.fondo,
          borderColor: p.borde,
          borderWidth: variante === 'contorno' ? 1 : 0,
          paddingVertical: compacto ? 8 : 12,
          paddingHorizontal: soloIcono ? (compacto ? 8 : 10) : compacto ? 12 : Spacing.lg,
          opacity: deshabilitado ? 0.45 : pressed ? 0.75 : 1,
        },
        estiloContenedor,
      ]}>
      {icono ? <Ionicons name={icono} size={compacto ? 16 : 18} color={p.texto} /> : null}
      {titulo ? (
        <Texto variante={compacto ? 'captionStrong' : 'bodyStrong'} color={p.texto}>
          {titulo}
        </Texto>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    borderRadius: Radius.md,
  },
});
