import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { Boton } from '@/components/ui/Boton';
import { Confirmar } from '@/components/ui/Confirmar';
import { Texto } from '@/components/ui/Texto';
import { Radius, sinOutline, Spacing } from '@/constants/design';
import { usePlantilla } from '@/context/plantilla';
import { useTema } from '@/hooks/use-tema';
import { Categoria } from '@/types/futbol';

export function CategoriasModal({
  visible,
  onCerrar,
}: {
  visible: boolean;
  onCerrar: () => void;
}) {
  const t = useTema();
  const {
    categorias,
    categoriaActual,
    conteoPorCategoria,
    seleccionarCategoria,
    agregarCategoria,
    renombrarCategoria,
    eliminarCategoria,
  } = usePlantilla();

  const [nueva, setNueva] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [nombreEdit, setNombreEdit] = useState('');
  const [porEliminar, setPorEliminar] = useState<Categoria | null>(null);

  useEffect(() => {
    if (!visible) return;
    setNueva('');
    setError(null);
    setEditandoId(null);
  }, [visible]);

  const existe = (nombre: string, salvoId?: string) =>
    categorias.some(
      (c) => c.id !== salvoId && c.nombre.toLowerCase() === nombre.trim().toLowerCase()
    );

  function handleAgregar() {
    const nombre = nueva.trim();
    if (!nombre) {
      setError('Escribe el nombre de la categoría.');
      return;
    }
    if (existe(nombre)) {
      setError(`Ya existe una categoría llamada «${nombre}».`);
      return;
    }
    agregarCategoria(nombre);
    setNueva('');
    setError(null);
  }

  function handleGuardarNombre(id: string) {
    const nombre = nombreEdit.trim();
    if (nombre && !existe(nombre, id)) renombrarCategoria(id, nombre);
    setEditandoId(null);
  }

  const unicaCategoria = categorias.length <= 1;

  return (
    <>
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
              <View style={styles.flex}>
                <Texto variante="title">Categorías</Texto>
                <Texto variante="caption" tono="muted">
                  Cada categoría lleva su propia plantilla y sus dorsales.
                </Texto>
              </View>
              <Pressable onPress={onCerrar} hitSlop={10} accessibilityLabel="Cerrar categorías">
                <Ionicons name="close" size={24} color={t.textMuted} />
              </Pressable>
            </View>

            <ScrollView style={styles.lista} keyboardShouldPersistTaps="handled">
              {categorias.map((c) => {
                const activa = c.id === categoriaActual?.id;
                const editando = c.id === editandoId;
                return (
                  <View
                    key={c.id}
                    style={[
                      styles.fila,
                      {
                        backgroundColor: activa ? t.primarySoft : t.surfaceAlt,
                        borderColor: activa ? t.primary : 'transparent',
                      },
                    ]}>
                    {editando ? (
                      <TextInput
                        value={nombreEdit}
                        onChangeText={setNombreEdit}
                        onBlur={() => handleGuardarNombre(c.id)}
                        onSubmitEditing={() => handleGuardarNombre(c.id)}
                        autoFocus
                        style={[
                          styles.inputFila,
                          sinOutline,
                          { color: t.text, borderColor: t.border, backgroundColor: t.surface },
                        ]}
                      />
                    ) : (
                      <Pressable
                        style={styles.filaTexto}
                        onPress={() => {
                          seleccionarCategoria(c.id);
                          onCerrar();
                        }}
                        accessibilityRole="button"
                        accessibilityLabel={`Usar la categoría ${c.nombre}`}>
                        <Ionicons
                          name={activa ? 'radio-button-on' : 'radio-button-off'}
                          size={18}
                          color={activa ? t.primary : t.textFaint}
                        />
                        <View style={styles.flex}>
                          <Texto variante="bodyStrong" numberOfLines={1}>
                            {c.nombre}
                          </Texto>
                          <Texto variante="caption" tono="muted">
                            {conteoPorCategoria[c.id] ?? 0} jugadores
                          </Texto>
                        </View>
                      </Pressable>
                    )}

                    <Pressable
                      hitSlop={8}
                      style={styles.iconoFila}
                      accessibilityLabel={`Renombrar ${c.nombre}`}
                      onPress={() => {
                        setNombreEdit(c.nombre);
                        setEditandoId(c.id);
                      }}>
                      <Ionicons name="pencil" size={17} color={t.textMuted} />
                    </Pressable>

                    <Pressable
                      hitSlop={8}
                      disabled={unicaCategoria}
                      style={[styles.iconoFila, unicaCategoria && styles.deshabilitado]}
                      accessibilityLabel={`Eliminar ${c.nombre}`}
                      onPress={() => setPorEliminar(c)}>
                      <Ionicons name="trash-outline" size={17} color={t.danger} />
                    </Pressable>
                  </View>
                );
              })}
            </ScrollView>

            {unicaCategoria ? (
              <Texto variante="caption" tono="faint">
                Debe quedar al menos una categoría.
              </Texto>
            ) : null}

            <View style={styles.alta}>
              <TextInput
                value={nueva}
                onChangeText={setNueva}
                placeholder="Nueva categoría (Master, Senior…)"
                placeholderTextColor={t.textFaint}
                onSubmitEditing={handleAgregar}
                style={[
                  styles.input,
                  sinOutline,
                  { backgroundColor: t.surfaceAlt, color: t.text, borderColor: t.border },
                ]}
              />
              <Boton icono="add" onPress={handleAgregar} accessibilityLabel="Crear categoría" />
            </View>

            {error ? (
              <View style={[styles.error, { backgroundColor: t.dangerSoft }]}>
                <Ionicons name="alert-circle" size={16} color={t.danger} />
                <Texto variante="caption" tono="danger" style={styles.flex}>
                  {error}
                </Texto>
              </View>
            ) : null}
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <Confirmar
        visible={porEliminar !== null}
        titulo={`Eliminar ${porEliminar?.nombre ?? ''}`}
        mensaje={
          porEliminar
            ? `Se borrarán también sus ${conteoPorCategoria[porEliminar.id] ?? 0} jugadores y sus alineaciones. Las demás categorías no se tocan.`
            : ''
        }
        onConfirmar={() => {
          if (porEliminar) eliminarCategoria(porEliminar.id);
          setPorEliminar(null);
        }}
        onCancelar={() => setPorEliminar(null)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  fondo: { ...StyleSheet.absoluteFillObject },
  hoja: {
    marginTop: 'auto',
    maxHeight: '85%',
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    borderTopWidth: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xxl,
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
    alignItems: 'flex-start',
    gap: Spacing.md,
  },
  lista: { flexGrow: 0 },
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.md,
    borderWidth: 1.5,
    paddingRight: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  filaTexto: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    paddingLeft: Spacing.md,
  },
  iconoFila: { padding: Spacing.sm },
  deshabilitado: { opacity: 0.3 },
  inputFila: {
    flex: 1,
    margin: Spacing.sm,
    borderRadius: Radius.sm,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: 9,
    fontSize: 15,
    fontWeight: '700',
  },
  alta: {
    flexDirection: 'row',
    gap: Spacing.sm,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderRadius: Radius.md,
    borderWidth: 1,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 13,
    fontSize: 15,
    fontWeight: '600',
  },
  error: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    borderRadius: Radius.md,
    padding: Spacing.md,
  },
});
