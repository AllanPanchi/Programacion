import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { JugadorCard } from '@/components/JugadorCard';
import { JugadorModal } from '@/components/JugadorModal';
import { Confirmar } from '@/components/ui/Confirmar';
import { Texto } from '@/components/ui/Texto';
import { ORDEN_ROLES, Radius, ROLES, sinOutline, Spacing } from '@/constants/design';
import { usePlantilla } from '@/context/plantilla';
import { useTema } from '@/hooks/use-tema';
import { Jugador, Rol } from '@/types/futbol';

type Filtro = Rol | 'TODOS';

export default function JugadoresScreen() {
  const t = useTema();
  const {
    jugadores,
    idsEnCancha,
    agregarJugador,
    actualizarJugador,
    eliminarJugador,
  } = usePlantilla();

  const [busqueda, setBusqueda] = useState('');
  const [filtro, setFiltro] = useState<Filtro>('TODOS');
  const [modalVisible, setModalVisible] = useState(false);
  const [editando, setEditando] = useState<Jugador | null>(null);
  const [porEliminar, setPorEliminar] = useState<Jugador | null>(null);

  const conteos = useMemo(() => {
    const base: Record<Rol, number> = { POR: 0, DEF: 0, MED: 0, DEL: 0 };
    for (const j of jugadores) base[j.rol] += 1;
    return base;
  }, [jugadores]);

  const visibles = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return jugadores
      .filter((j) => (filtro === 'TODOS' ? true : j.rol === filtro))
      .filter((j) => (q ? j.nombre.toLowerCase().includes(q) || String(j.numero) === q : true))
      .sort((a, b) => ORDEN_ROLES.indexOf(a.rol) - ORDEN_ROLES.indexOf(b.rol) || a.numero - b.numero);
  }, [jugadores, filtro, busqueda]);

  function abrirNuevo() {
    setEditando(null);
    setModalVisible(true);
  }

  function abrirEdicion(j: Jugador) {
    setEditando(j);
    setModalVisible(true);
  }

  function guardar(datos: Omit<Jugador, 'id'>, id?: string) {
    if (id) actualizarJugador(id, datos);
    else agregarJugador(datos);
    setModalVisible(false);
  }

  return (
    <View style={[styles.raiz, { backgroundColor: t.bg }]}>
      <LinearGradient colors={[t.primaryDeep, t.primary]} style={styles.cabecera}>
        <SafeAreaView edges={['top']}>
          <View style={styles.cabeceraFila}>
            <View style={styles.flex}>
              <Texto variante="overline" color="rgba(255,255,255,0.75)">
                PLANTILLA
              </Texto>
              <Texto variante="display" color="#FFFFFF">
                Jugadores
              </Texto>
            </View>
            <View style={styles.totalCaja}>
              <Texto variante="title" color="#FFFFFF">
                {jugadores.length}
              </Texto>
              <Texto variante="overline" color="rgba(255,255,255,0.75)">
                EN TOTAL
              </Texto>
            </View>
          </View>

          <View style={styles.resumen}>
            {ORDEN_ROLES.map((rol) => (
              <View key={rol} style={styles.resumenItem}>
                <View style={[styles.resumenPunto, { backgroundColor: ROLES[rol].color }]} />
                <Texto variante="captionStrong" color="#FFFFFF">
                  {conteos[rol]}
                </Texto>
                <Texto variante="overline" color="rgba(255,255,255,0.7)">
                  {rol}
                </Texto>
              </View>
            ))}
          </View>
        </SafeAreaView>
      </LinearGradient>

      <View style={styles.cuerpo}>
        <View
          style={[styles.buscador, { backgroundColor: t.surface, borderColor: t.border }]}>
          <Ionicons name="search" size={18} color={t.textFaint} />
          <TextInput
            value={busqueda}
            onChangeText={setBusqueda}
            placeholder="Buscar por nombre o dorsal"
            placeholderTextColor={t.textFaint}
            style={[styles.buscadorInput, sinOutline, { color: t.text }]}
          />
          {busqueda ? (
            <Pressable onPress={() => setBusqueda('')} hitSlop={8} accessibilityLabel="Limpiar búsqueda">
              <Ionicons name="close-circle" size={17} color={t.textFaint} />
            </Pressable>
          ) : null}
        </View>

        <View style={styles.filtros}>
          {(['TODOS', ...ORDEN_ROLES] as Filtro[]).map((f) => {
            const activo = f === filtro;
            const color = f === 'TODOS' ? t.primary : ROLES[f].color;
            return (
              <Pressable
                key={f}
                onPress={() => setFiltro(f)}
                accessibilityRole="tab"
                accessibilityState={{ selected: activo }}
                style={[
                  styles.filtroChip,
                  {
                    backgroundColor: activo ? color : t.surface,
                    borderColor: activo ? color : t.border,
                  },
                ]}>
                <Texto variante="overline" color={activo ? '#FFFFFF' : t.textMuted}>
                  {f}
                </Texto>
              </Pressable>
            );
          })}
        </View>

        <FlatList
          data={visibles}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <JugadorCard
              jugador={item}
              enCancha={idsEnCancha.has(item.id)}
              onEditar={() => abrirEdicion(item)}
              onEliminar={() => setPorEliminar(item)}
            />
          )}
          contentContainerStyle={styles.lista}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            <View style={styles.vacio}>
              <View style={[styles.vacioIcono, { backgroundColor: t.surfaceAlt }]}>
                <Ionicons
                  name={jugadores.length === 0 ? 'people-outline' : 'search-outline'}
                  size={30}
                  color={t.textFaint}
                />
              </View>
              <Texto variante="subtitle" tono="muted">
                {jugadores.length === 0 ? 'Sin jugadores todavía' : 'Sin resultados'}
              </Texto>
              <Texto variante="caption" tono="faint" style={styles.vacioTexto}>
                {jugadores.length === 0
                  ? 'Pulsa el botón + para registrar al primer jugador de tu plantilla.'
                  : 'Prueba con otro nombre, dorsal o posición.'}
              </Texto>
            </View>
          }
        />
      </View>

      <Pressable
        onPress={abrirNuevo}
        accessibilityRole="button"
        accessibilityLabel="Nuevo jugador"
        style={({ pressed }) => [
          styles.fab,
          { backgroundColor: t.accent, boxShadow: t.shadowLg, opacity: pressed ? 0.85 : 1 },
        ]}>
        <Ionicons name="add" size={30} color="#FFFFFF" />
      </Pressable>

      <JugadorModal
        visible={modalVisible}
        jugador={editando}
        jugadores={jugadores}
        onGuardar={guardar}
        onCerrar={() => setModalVisible(false)}
      />

      <Confirmar
        visible={porEliminar !== null}
        titulo="Eliminar jugador"
        mensaje={
          porEliminar
            ? `Se eliminará a ${porEliminar.nombre} de la plantilla y de todas las alineaciones.`
            : ''
        }
        onConfirmar={() => {
          if (porEliminar) eliminarJugador(porEliminar.id);
          setPorEliminar(null);
        }}
        onCancelar={() => setPorEliminar(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  raiz: { flex: 1 },
  flex: { flex: 1 },
  cabecera: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
    borderBottomLeftRadius: Radius.xl,
    borderBottomRightRadius: Radius.xl,
  },
  cabeceraFila: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingTop: Spacing.md,
    gap: Spacing.md,
  },
  totalCaja: { alignItems: 'flex-end' },
  resumen: {
    flexDirection: 'row',
    marginTop: Spacing.lg,
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
  },
  resumenItem: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
  },
  resumenPunto: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 1,
  },
  cuerpo: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
  },
  buscador: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    borderRadius: Radius.md,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    height: 44,
  },
  buscadorInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
  },
  filtros: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
  },
  filtroChip: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: Radius.pill,
    borderWidth: 1,
  },
  lista: { paddingBottom: 110, flexGrow: 1 },
  vacio: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingBottom: 60,
  },
  vacioIcono: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  vacioTexto: { textAlign: 'center', maxWidth: 260 },
  fab: {
    position: 'absolute',
    right: Spacing.xl,
    bottom: Spacing.xl,
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
