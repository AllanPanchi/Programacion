import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { SelectorRol } from '@/components/SelectorRol';
import { Boton } from '@/components/ui/Boton';
import { Texto } from '@/components/ui/Texto';
import { Radius, Spacing } from '@/constants/design';
import { useTema } from '@/hooks/use-tema';
import { Jugador, Rol } from '@/types/futbol';

export function JugadorModal({
  visible,
  jugador,
  jugadores,
  onGuardar,
  onCerrar,
}: {
  visible: boolean;
  /** `null` para dar de alta, o el jugador a editar. */
  jugador: Jugador | null;
  jugadores: Jugador[];
  onGuardar: (datos: Omit<Jugador, 'id'>, id?: string) => void;
  onCerrar: () => void;
}) {
  const t = useTema();
  const [nombre, setNombre] = useState('');
  const [numero, setNumero] = useState('');
  const [rol, setRol] = useState<Rol>('MED');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!visible) return;
    setNombre(jugador?.nombre ?? '');
    setNumero(jugador ? String(jugador.numero) : '');
    setRol(jugador?.rol ?? 'MED');
    setError(null);
  }, [visible, jugador]);

  function handleGuardar() {
    const nombreLimpio = nombre.trim();
    const numeroInt = parseInt(numero, 10);

    if (!nombreLimpio) {
      setError('Escribe el nombre del jugador.');
      return;
    }
    if (!Number.isInteger(numeroInt) || numeroInt < 1 || numeroInt > 99) {
      setError('El dorsal debe ser un número entre 1 y 99.');
      return;
    }
    if (jugadores.some((j) => j.numero === numeroInt && j.id !== jugador?.id)) {
      setError(`El dorsal ${numeroInt} ya lo lleva otro jugador.`);
      return;
    }

    onGuardar({ nombre: nombreLimpio, numero: numeroInt, rol }, jugador?.id);
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onCerrar}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}>
        <Pressable
          style={[styles.fondo, { backgroundColor: t.overlay }]}
          accessibilityLabel="Cerrar"
          onPress={onCerrar}
        />
        <View style={[styles.hoja, { backgroundColor: t.surface, borderColor: t.border }]}>
          <View style={[styles.asa, { backgroundColor: t.border }]} />

          <View style={styles.encabezado}>
            <Texto variante="title">{jugador ? 'Editar jugador' : 'Nuevo jugador'}</Texto>
            <Pressable onPress={onCerrar} hitSlop={10} accessibilityLabel="Cerrar formulario">
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
              placeholder="Ej. Lionel Messi"
              placeholderTextColor={t.textFaint}
              autoFocus={!jugador}
              style={[
                styles.input,
                { backgroundColor: t.surfaceAlt, color: t.text, borderColor: t.border },
              ]}
            />
          </View>

          <View style={styles.campo}>
            <Texto variante="overline" tono="muted">
              DORSAL (1-99)
            </Texto>
            <TextInput
              value={numero}
              onChangeText={(v) => setNumero(v.replace(/[^0-9]/g, '').slice(0, 2))}
              placeholder="10"
              placeholderTextColor={t.textFaint}
              keyboardType="number-pad"
              maxLength={2}
              style={[
                styles.input,
                styles.inputDorsal,
                { backgroundColor: t.surfaceAlt, color: t.text, borderColor: t.border },
              ]}
            />
          </View>

          <View style={styles.campo}>
            <Texto variante="overline" tono="muted">
              POSICIÓN
            </Texto>
            <SelectorRol valor={rol} onCambiar={setRol} />
          </View>

          {error ? (
            <View style={[styles.error, { backgroundColor: t.dangerSoft }]}>
              <Ionicons name="alert-circle" size={16} color={t.danger} />
              <Texto variante="caption" tono="danger" style={styles.flex}>
                {error}
              </Texto>
            </View>
          ) : null}

          <Boton
            titulo={jugador ? 'Guardar cambios' : 'Agregar jugador'}
            icono={jugador ? 'checkmark' : 'add'}
            onPress={handleGuardar}
            estiloContenedor={styles.botonGuardar}
          />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  fondo: { ...StyleSheet.absoluteFillObject },
  hoja: {
    marginTop: 'auto',
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    borderTopWidth: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xxl + Spacing.md,
    gap: Spacing.lg,
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
  inputDorsal: {
    width: 96,
    textAlign: 'center',
    fontSize: 18,
  },
  error: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    borderRadius: Radius.md,
    padding: Spacing.md,
  },
  botonGuardar: { marginTop: Spacing.xs },
});
