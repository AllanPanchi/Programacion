import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { Boton } from '@/components/ui/Boton';
import { Texto } from '@/components/ui/Texto';
import { Radius, Spacing } from '@/constants/design';
import { useTema } from '@/hooks/use-tema';

/** Diálogo de confirmación propio: `Alert` de React Native no existe en web. */
export function Confirmar({
  visible,
  titulo,
  mensaje,
  textoConfirmar = 'Eliminar',
  onConfirmar,
  onCancelar,
}: {
  visible: boolean;
  titulo: string;
  mensaje: string;
  textoConfirmar?: string;
  onConfirmar: () => void;
  onCancelar: () => void;
}) {
  const t = useTema();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancelar}>
      <View style={styles.centro}>
        <Pressable
          style={[StyleSheet.absoluteFill, { backgroundColor: t.overlay }]}
          accessibilityLabel="Cancelar"
          onPress={onCancelar}
        />
        <View style={[styles.caja, { backgroundColor: t.surface, boxShadow: t.shadowLg }]}>
          <Texto variante="subtitle">{titulo}</Texto>
          <Texto variante="body" tono="muted">
            {mensaje}
          </Texto>
          <View style={styles.acciones}>
            <Boton
              titulo="Cancelar"
              variante="contorno"
              onPress={onCancelar}
              estiloContenedor={styles.flex}
            />
            <Boton
              titulo={textoConfirmar}
              variante="peligro"
              onPress={onConfirmar}
              estiloContenedor={styles.flex}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centro: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  caja: {
    width: '100%',
    maxWidth: 400,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    gap: Spacing.md,
  },
  acciones: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.sm,
  },
  flex: { flex: 1 },
});
