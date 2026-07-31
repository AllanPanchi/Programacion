import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, TextInput, View } from 'react-native';

import { Boton } from '@/components/ui/Boton';
import { Confirmar } from '@/components/ui/Confirmar';
import { Texto } from '@/components/ui/Texto';
import { Radius, sinOutline, Spacing } from '@/constants/design';
import { usePlantilla } from '@/context/plantilla';
import { useTema } from '@/hooks/use-tema';

export function GestionarAlineacionModal({
  visible,
  onCerrar,
}: {
  visible: boolean;
  onCerrar: () => void;
}) {
  const t = useTema();
  const { alineacionActual, alineaciones, renombrarAlineacion, duplicarAlineacion, eliminarAlineacion } =
    usePlantilla();

  const [nombre, setNombre] = useState('');
  const [confirmarBorrado, setConfirmarBorrado] = useState(false);

  useEffect(() => {
    if (visible) setNombre(alineacionActual?.nombre ?? '');
  }, [visible, alineacionActual]);

  if (!alineacionActual) return null;

  function guardarNombre() {
    if (!alineacionActual) return;
    const limpio = nombre.trim();
    if (limpio) renombrarAlineacion(alineacionActual.id, limpio);
    onCerrar();
  }

  return (
    <>
      <Modal visible={visible} transparent animationType="slide" onRequestClose={onCerrar}>
        <Pressable
          style={[styles.fondo, { backgroundColor: t.overlay }]}
          accessibilityLabel="Cerrar"
          onPress={onCerrar}
        />
        <View style={[styles.hoja, { backgroundColor: t.surface, borderColor: t.border }]}>
          <View style={[styles.asa, { backgroundColor: t.border }]} />

          <View style={styles.encabezado}>
            <Texto variante="title">Alineación</Texto>
            <Pressable onPress={onCerrar} hitSlop={10} accessibilityLabel="Cerrar">
              <Ionicons name="close" size={24} color={t.textMuted} />
            </Pressable>
          </View>

          <View style={styles.campo}>
            <Texto variante="overline" tono="muted">
              NOMBRE
            </Texto>
            <TextInput
              value={nombre}
              onChangeText={setNombre}
              placeholder="Ej. Titular vs. Rival"
              placeholderTextColor={t.textFaint}
              onSubmitEditing={guardarNombre}
              style={[
                styles.input,
                sinOutline,
                { backgroundColor: t.surfaceAlt, color: t.text, borderColor: t.border },
              ]}
            />
          </View>

          <Boton titulo="Guardar nombre" icono="checkmark" onPress={guardarNombre} />

          <View style={[styles.separador, { backgroundColor: t.border }]} />

          <Boton
            titulo="Duplicar alineación"
            icono="copy-outline"
            variante="contorno"
            onPress={() => {
              duplicarAlineacion(alineacionActual.id);
              onCerrar();
            }}
          />
          <Boton
            titulo={
              alineaciones.length > 1 ? 'Eliminar alineación' : 'Vaciar y reiniciar alineación'
            }
            icono="trash-outline"
            variante="peligro"
            onPress={() => setConfirmarBorrado(true)}
          />
        </View>
      </Modal>

      <Confirmar
        visible={confirmarBorrado}
        titulo="Eliminar alineación"
        mensaje={`Se perderán las posiciones guardadas en «${alineacionActual.nombre}».`}
        onConfirmar={() => {
          eliminarAlineacion(alineacionActual.id);
          setConfirmarBorrado(false);
          onCerrar();
        }}
        onCancelar={() => setConfirmarBorrado(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  fondo: { ...StyleSheet.absoluteFillObject },
  hoja: {
    marginTop: 'auto',
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    borderTopWidth: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xxl + Spacing.md,
    gap: Spacing.md,
  },
  asa: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: Spacing.xs,
  },
  encabezado: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  campo: { gap: Spacing.sm },
  input: {
    borderRadius: Radius.md,
    borderWidth: 1,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 13,
    fontSize: 16,
    fontWeight: '600',
  },
  separador: { height: 1, marginVertical: Spacing.xs },
});
