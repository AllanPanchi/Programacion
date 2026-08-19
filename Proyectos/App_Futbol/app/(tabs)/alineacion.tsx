import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Cancha, JugadorEnCancha } from '@/components/Cancha';
import { GestionarAlineacionModal } from '@/components/GestionarAlineacionModal';
import { Boton } from '@/components/ui/Boton';
import { Texto } from '@/components/ui/Texto';
import { Radius, ROLES, Spacing, TITULARES_MAX } from '@/constants/design';
import { usePlantilla } from '@/context/plantilla';
import { useTema } from '@/hooks/use-tema';
import { FORMACIONES } from '@/utils/formaciones';

export default function AlineacionScreen() {
  const t = useTema();
  const {
    jugadores,
    categoriaActual,
    alineaciones,
    alineacionActual,
    idsEnCancha,
    seleccionarAlineacion,
    nuevaAlineacion,
    aplicarFormacion,
    autocompletar,
    vaciarCancha,
    ponerEnCancha,
    quitarDeCancha,
    moverJugador,
    alternarCapitan,
  } = usePlantilla();

  const [seleccionadoId, setSeleccionadoId] = useState<string | null>(null);
  const [gestionVisible, setGestionVisible] = useState(false);

  const enCancha: JugadorEnCancha[] = useMemo(() => {
    if (!alineacionActual) return [];
    return alineacionActual.posiciones
      .map((pos) => {
        const jugador = jugadores.find((j) => j.id === pos.jugadorId);
        return jugador ? { jugador, x: pos.x, y: pos.y } : null;
      })
      .filter((v): v is JugadorEnCancha => v !== null);
  }, [alineacionActual, jugadores]);

  const banca = useMemo(
    () => jugadores.filter((j) => !idsEnCancha.has(j.id)),
    [jugadores, idsEnCancha]
  );

  const seleccionado = useMemo(
    () => enCancha.find((e) => e.jugador.id === seleccionadoId)?.jugador ?? null,
    [enCancha, seleccionadoId]
  );

  const titulares = enCancha.length;
  const completo = titulares === TITULARES_MAX;
  const lleno = titulares >= TITULARES_MAX;

  if (!alineacionActual) return <View style={{ flex: 1, backgroundColor: t.bg }} />;

  return (
    <View style={[styles.raiz, { backgroundColor: t.bg }]}>
      <LinearGradient colors={[t.primaryDeep, t.primary]} style={styles.cabecera}>
        <SafeAreaView edges={['top']}>
          <View style={styles.cabeceraFila}>
            <View style={styles.flex}>
              <Texto variante="overline" color="rgba(255,255,255,0.75)" numberOfLines={1}>
                {(categoriaActual?.nombre ?? 'ALINEACIÓN').toUpperCase()} ·{' '}
                {alineacionActual.formacion}
              </Texto>
              <Texto variante="display" color="#FFFFFF" numberOfLines={1}>
                {alineacionActual.nombre}
              </Texto>
            </View>

            <View
              style={[
                styles.contador,
                { backgroundColor: completo ? '#FFFFFF' : 'rgba(255,255,255,0.18)' },
              ]}>
              <Texto variante="subtitle" color={completo ? t.primary : '#FFFFFF'}>
                {titulares}/{TITULARES_MAX}
              </Texto>
            </View>

            <Pressable
              onPress={() => setGestionVisible(true)}
              hitSlop={8}
              accessibilityLabel="Gestionar alineaciones"
              style={styles.iconoCabecera}>
              <Ionicons name="ellipsis-horizontal" size={20} color="#FFFFFF" />
            </Pressable>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tiras}>
            {alineaciones.map((a) => {
              const activa = a.id === alineacionActual.id;
              return (
                <Pressable
                  key={a.id}
                  onPress={() => {
                    seleccionarAlineacion(a.id);
                    setSeleccionadoId(null);
                  }}
                  accessibilityRole="tab"
                  accessibilityState={{ selected: activa }}
                  style={[
                    styles.tira,
                    {
                      backgroundColor: activa ? '#FFFFFF' : 'rgba(255,255,255,0.16)',
                    },
                  ]}>
                  <Texto variante="captionStrong" color={activa ? t.primaryDeep : '#FFFFFF'} numberOfLines={1}>
                    {a.nombre}
                  </Texto>
                </Pressable>
              );
            })}
            <Pressable
              onPress={nuevaAlineacion}
              accessibilityLabel="Nueva alineación"
              style={styles.tiraNueva}>
              <Ionicons name="add" size={17} color="#FFFFFF" />
            </Pressable>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>

      <View style={styles.cuerpo}>
        {/* Formaciones y acciones comparten fila: en pantallas bajas cada línea
            que se ahorra es alto que gana la cancha. */}
        <View style={styles.barraHerramientas}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.formacionesScroll}
            contentContainerStyle={styles.formaciones}>
            {FORMACIONES.map((f) => {
              const activa = f.id === alineacionActual.formacion;
              return (
                <Pressable
                  key={f.id}
                  onPress={() => aplicarFormacion(f.id)}
                  accessibilityRole="tab"
                  accessibilityState={{ selected: activa }}
                  accessibilityLabel={`Formación ${f.id}`}
                  style={[
                    styles.chipFormacion,
                    {
                      backgroundColor: activa ? t.primary : t.surface,
                      borderColor: activa ? t.primary : t.border,
                    },
                  ]}>
                  <Texto variante="captionStrong" color={activa ? '#FFFFFF' : t.textMuted}>
                    {f.id}
                  </Texto>
                </Pressable>
              );
            })}
          </ScrollView>

          <Boton
            icono="flash"
            variante="suave"
            tamano="sm"
            onPress={autocompletar}
            deshabilitado={jugadores.length === 0}
            accessibilityLabel="Autocompletar alineación"
          />
          <Boton
            icono="refresh"
            variante="contorno"
            tamano="sm"
            onPress={() => {
              vaciarCancha();
              setSeleccionadoId(null);
            }}
            deshabilitado={titulares === 0}
            accessibilityLabel="Vaciar la cancha"
          />
        </View>

        <View style={styles.canchaZona}>
          <Cancha
            jugadores={enCancha}
            capitanId={alineacionActual.capitanId}
            seleccionadoId={seleccionadoId}
            onMover={moverJugador}
            onSeleccionar={setSeleccionadoId}
          />
        </View>

        {seleccionado ? (
          <View
            style={[
              styles.barraSeleccion,
              { backgroundColor: t.surface, borderColor: t.border, boxShadow: t.shadowMd },
            ]}>
            <View
              style={[
                styles.barraDorsal,
                { backgroundColor: ROLES[seleccionado.rol].color },
              ]}>
              <Texto variante="captionStrong" color="#FFFFFF">
                {seleccionado.numero}
              </Texto>
            </View>
            <Texto variante="bodyStrong" numberOfLines={1} style={styles.flex}>
              {seleccionado.nombre}
            </Texto>
            <Boton
              icono={alineacionActual.capitanId === seleccionado.id ? 'star' : 'star-outline'}
              variante="suave"
              tamano="sm"
              onPress={() => alternarCapitan(seleccionado.id)}
              accessibilityLabel="Marcar como capitán"
            />
            <Boton
              icono="arrow-down-circle-outline"
              variante="peligro"
              tamano="sm"
              onPress={() => {
                quitarDeCancha(seleccionado.id);
                setSeleccionadoId(null);
              }}
              accessibilityLabel={`Quitar a ${seleccionado.nombre} de la cancha`}
            />
          </View>
        ) : null}

        <View style={styles.bancaCabecera}>
          <Texto variante="overline" tono="muted">
            BANCA · {banca.length}
          </Texto>
          {lleno ? (
            <Texto variante="overline" tono="accent">
              ONCE COMPLETO
            </Texto>
          ) : null}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.bancaScroll}
          contentContainerStyle={styles.banca}>
          {banca.length === 0 ? (
            <Texto variante="caption" tono="faint">
              {jugadores.length === 0
                ? 'Registra jugadores en la pestaña Jugadores.'
                : 'Toda la plantilla está en el campo.'}
            </Texto>
          ) : (
            banca.map((j) => (
              <Pressable
                key={j.id}
                onPress={() => ponerEnCancha(j.id)}
                disabled={lleno}
                accessibilityRole="button"
                accessibilityLabel={`Agregar a ${j.nombre} a la cancha`}
                style={({ pressed }) => [
                  styles.bancaFicha,
                  {
                    backgroundColor: t.surface,
                    borderColor: t.border,
                    opacity: lleno ? 0.45 : pressed ? 0.7 : 1,
                  },
                ]}>
                <View
                  style={[styles.bancaDorsal, { backgroundColor: ROLES[j.rol].color + '1F' }]}>
                  <Texto variante="captionStrong" color={ROLES[j.rol].color}>
                    {j.numero}
                  </Texto>
                </View>
                <View>
                  <Texto variante="captionStrong" numberOfLines={1} style={styles.bancaNombre}>
                    {j.nombre}
                  </Texto>
                  <Texto variante="overline" color={ROLES[j.rol].color}>
                    {j.rol}
                  </Texto>
                </View>
              </Pressable>
            ))
          )}
        </ScrollView>
      </View>

      <GestionarAlineacionModal
        visible={gestionVisible}
        onCerrar={() => setGestionVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  raiz: { flex: 1 },
  flex: { flex: 1 },
  cabecera: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.lg,
    borderBottomLeftRadius: Radius.xl,
    borderBottomRightRadius: Radius.xl,
  },
  cabeceraFila: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Spacing.md,
    gap: Spacing.md,
  },
  contador: {
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.md,
    paddingVertical: 5,
  },
  iconoCabecera: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  tiras: {
    gap: Spacing.sm,
    marginTop: Spacing.lg,
    alignItems: 'center',
  },
  tira: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 7,
    borderRadius: Radius.pill,
    maxWidth: 150,
  },
  tiraNueva: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  cuerpo: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  // Cada fila que no es la cancha lleva flexShrink: 0. Así, cuando la pantalla es
  // baja, lo que se encoge es el campo y la banca nunca se sale de la vista.
  barraHerramientas: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
    flexShrink: 0,
  },
  formacionesScroll: { flexGrow: 0, flexShrink: 1 },
  formaciones: { gap: Spacing.sm, alignItems: 'center' },
  chipFormacion: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: 8,
    borderRadius: Radius.pill,
    borderWidth: 1,
  },
  barraSeleccion: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.md,
    padding: Spacing.sm,
    paddingLeft: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1,
    flexShrink: 0,
  },
  barraDorsal: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bancaCabecera: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
    flexShrink: 0,
  },
  canchaZona: { flex: 1, flexShrink: 1, minHeight: 0 },
  bancaScroll: { flexGrow: 0, flexShrink: 0, height: 52 },
  banca: {
    gap: Spacing.sm,
    alignItems: 'center',
  },
  bancaFicha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    borderRadius: Radius.md,
    borderWidth: 1,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  bancaDorsal: {
    width: 30,
    height: 30,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bancaNombre: { maxWidth: 96 },
});
