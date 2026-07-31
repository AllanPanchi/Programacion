import { StyleSheet, Text, type TextProps } from 'react-native';

import { useTema } from '@/hooks/use-tema';

type Variante =
  | 'display'
  | 'title'
  | 'subtitle'
  | 'body'
  | 'bodyStrong'
  | 'caption'
  | 'captionStrong'
  | 'overline';

type Tono = 'text' | 'muted' | 'faint' | 'primary' | 'accent' | 'danger' | 'onPrimary';

export type TextoProps = TextProps & {
  variante?: Variante;
  tono?: Tono;
  /** Color explícito; tiene prioridad sobre `tono`. */
  color?: string;
};

export function Texto({
  variante = 'body',
  tono = 'text',
  color,
  style,
  ...rest
}: TextoProps) {
  const t = useTema();
  const tonos: Record<Tono, string> = {
    text: t.text,
    muted: t.textMuted,
    faint: t.textFaint,
    primary: t.primary,
    accent: t.accent,
    danger: t.danger,
    onPrimary: t.onPrimary,
  };

  return <Text style={[{ color: color ?? tonos[tono] }, styles[variante], style]} {...rest} />;
}

const styles = StyleSheet.create({
  display: { fontSize: 30, lineHeight: 36, fontWeight: '800', letterSpacing: -0.6 },
  title: { fontSize: 21, lineHeight: 27, fontWeight: '800', letterSpacing: -0.3 },
  subtitle: { fontSize: 17, lineHeight: 23, fontWeight: '700', letterSpacing: -0.2 },
  body: { fontSize: 15, lineHeight: 21, fontWeight: '500' },
  bodyStrong: { fontSize: 15, lineHeight: 21, fontWeight: '700' },
  caption: { fontSize: 13, lineHeight: 18, fontWeight: '500' },
  captionStrong: { fontSize: 13, lineHeight: 18, fontWeight: '700' },
  overline: { fontSize: 11, lineHeight: 14, fontWeight: '800', letterSpacing: 0.9 },
});
