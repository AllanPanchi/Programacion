import { Pressable, StyleSheet, View } from 'react-native';

import { Texto } from '@/components/ui/Texto';
import { ORDEN_ROLES, Radius, ROLES, Spacing } from '@/constants/design';
import { useTema } from '@/hooks/use-tema';
import { Rol } from '@/types/futbol';

export function SelectorRol({
  valor,
  onCambiar,
}: {
  valor: Rol;
  onCambiar: (rol: Rol) => void;
}) {
  const t = useTema();

  return (
    <View style={[styles.contenedor, { backgroundColor: t.surfaceAlt }]}>
      {ORDEN_ROLES.map((rol) => {
        const activo = rol === valor;
        return (
          <Pressable
            key={rol}
            onPress={() => onCambiar(rol)}
            accessibilityRole="radio"
            accessibilityState={{ selected: activo }}
            accessibilityLabel={ROLES[rol].label}
            style={[
              styles.opcion,
              activo && { backgroundColor: ROLES[rol].color },
            ]}>
            <Texto variante="captionStrong" color={activo ? '#FFFFFF' : t.textMuted}>
              {rol}
            </Texto>
          </Pressable>
        );
      })}
    </View>
  );
}

/** Punto de color + abreviatura, para usar dentro de tarjetas y listas. */
export function InsigniaRol({ rol, compacta }: { rol: Rol; compacta?: boolean }) {
  const info = ROLES[rol];
  return (
    <View style={[styles.insignia, { backgroundColor: info.color + '22' }]}>
      <View style={[styles.punto, { backgroundColor: info.color }]} />
      <Texto variante="overline" color={info.color}>
        {compacta ? info.abbr : info.label.toUpperCase()}
      </Texto>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flexDirection: 'row',
    borderRadius: Radius.md,
    padding: 4,
    gap: 4,
  },
  opcion: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    borderRadius: Radius.sm,
  },
  insignia: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radius.pill,
  },
  punto: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
