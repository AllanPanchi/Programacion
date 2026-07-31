import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, View } from 'react-native';

import { InsigniaRol } from '@/components/SelectorRol';
import { Texto } from '@/components/ui/Texto';
import { Radius, ROLES, Spacing } from '@/constants/design';
import { useTema } from '@/hooks/use-tema';
import { Jugador } from '@/types/futbol';

export function JugadorCard({
  jugador,
  enCancha,
  onEditar,
  onEliminar,
}: {
  jugador: Jugador;
  enCancha?: boolean;
  onEditar: () => void;
  onEliminar: () => void;
}) {
  const t = useTema();
  const colorRol = ROLES[jugador.rol].color;

  // Las dos zonas táctiles van una junto a otra, nunca anidadas: los controles
  // interactivos anidados generan HTML inválido en web y touchables ambiguos en nativo.
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: t.surface, borderColor: t.border, boxShadow: t.shadowSm },
      ]}>
      <View style={[styles.franja, { backgroundColor: colorRol }]} />

      <Pressable
        onPress={onEditar}
        accessibilityRole="button"
        accessibilityLabel={`Editar a ${jugador.nombre}`}
        style={({ pressed }) => [styles.zonaEditar, pressed && { opacity: 0.6 }]}>
        <View style={[styles.dorsal, { backgroundColor: colorRol + '1F' }]}>
          <Texto variante="subtitle" color={colorRol}>
            {jugador.numero}
          </Texto>
        </View>

        <View style={styles.info}>
          <Texto variante="bodyStrong" numberOfLines={1}>
            {jugador.nombre}
          </Texto>
          <View style={styles.metaFila}>
            <InsigniaRol rol={jugador.rol} />
            {enCancha ? (
              <View style={[styles.chipCancha, { backgroundColor: t.primarySoft }]}>
                <Ionicons name="checkmark-circle" size={11} color={t.primary} />
                <Texto variante="overline" tono="primary">
                  TITULAR
                </Texto>
              </View>
            ) : null}
          </View>
        </View>
      </Pressable>

      <Pressable
        onPress={onEliminar}
        hitSlop={10}
        accessibilityRole="button"
        accessibilityLabel={`Eliminar a ${jugador.nombre}`}
        style={({ pressed }) => [styles.accion, pressed && { opacity: 0.5 }]}>
        <Ionicons name="trash-outline" size={19} color={t.textFaint} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.lg,
    borderWidth: 1,
    paddingRight: Spacing.md,
    marginBottom: Spacing.md,
    overflow: 'hidden',
  },
  zonaEditar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    paddingLeft: Spacing.lg,
  },
  franja: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  dorsal: {
    width: 46,
    height: 46,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    gap: 5,
  },
  metaFila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  chipCancha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radius.pill,
  },
  accion: {
    padding: Spacing.sm,
  },
});
