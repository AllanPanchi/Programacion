import * as Haptics from 'expo-haptics';
import { useCallback, useEffect, useState } from 'react';
import { LayoutChangeEvent, Platform, StyleSheet, View, ViewStyle } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { Texto } from '@/components/ui/Texto';
import { Cesped, Radius, ROLES } from '@/constants/design';
import { Jugador } from '@/types/futbol';

const CIRCULO = 40;
const FICHA_W = 64;
const FICHA_H = CIRCULO + 18;
const FRANJAS = 9;

/** En web hay que desactivar el gesto de scroll y la selección de texto sobre la ficha. */
const ESTILO_WEB_FICHA = (Platform.OS === 'web'
  ? { touchAction: 'none', userSelect: 'none', cursor: 'grab' }
  : {}) as unknown as ViewStyle;

export interface JugadorEnCancha {
  jugador: Jugador;
  x: number;
  y: number;
}

/** En una camiseta va el apellido, no el nombre de pila. */
function apellido(nombre: string): string {
  const partes = nombre.trim().split(/\s+/);
  return (partes.length > 1 ? partes.slice(1).join(' ') : partes[0]).toUpperCase();
}

function vibrar(estilo: Haptics.ImpactFeedbackStyle) {
  if (Platform.OS !== 'web') {
    Haptics.impactAsync(estilo).catch(() => {});
  }
}

export function Cancha({
  jugadores,
  capitanId,
  seleccionadoId,
  onMover,
  onSeleccionar,
}: {
  jugadores: JugadorEnCancha[];
  capitanId: string | null;
  seleccionadoId: string | null;
  onMover: (jugadorId: string, x: number, y: number) => void;
  onSeleccionar: (jugadorId: string | null) => void;
}) {
  const [size, setSize] = useState({ width: 0, height: 0 });

  const handleLayout = useCallback((e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setSize({ width, height });
  }, []);

  return (
    <View style={styles.cancha} onLayout={handleLayout}>
      <Franjas />
      <Marcas />

      {size.width > 0 &&
        jugadores.map(({ jugador, x, y }) => (
          <Ficha
            key={jugador.id}
            jugador={jugador}
            xRel={x}
            yRel={y}
            esCapitan={jugador.id === capitanId}
            seleccionado={jugador.id === seleccionadoId}
            canchaWidth={size.width}
            canchaHeight={size.height}
            onMover={onMover}
            onSeleccionar={onSeleccionar}
          />
        ))}

      {jugadores.length === 0 ? (
        <View style={styles.vacio}>
          <View style={styles.vacioCaja}>
            <Texto variante="captionStrong" color="#FFFFFF" style={styles.vacioTexto}>
              Toca un jugador de la banca para ponerlo en el campo
            </Texto>
          </View>
        </View>
      ) : null}
    </View>
  );
}

/** Franjas de césped cortado. */
function Franjas() {
  return (
    <View style={styles.capa}>
      {Array.from({ length: FRANJAS }).map((_, i) => (
        <View
          key={i}
          style={{ flex: 1, backgroundColor: i % 2 === 0 ? Cesped.franjaA : Cesped.franjaB }}
        />
      ))}
    </View>
  );
}

/** Líneas reglamentarias del campo. */
function Marcas() {
  return (
    <View style={styles.capa}>
      <View style={styles.perimetro} />
      <View style={styles.medioCampo} />
      <View style={styles.circuloCentral} />
      <View style={styles.puntoCentral} />

      {/* Áreas y porterías, arriba (rival) y abajo (propia) */}
      <View style={[styles.areaGrande, styles.arribaArea]} />
      <View style={[styles.areaChica, styles.arribaChica]} />
      <View style={[styles.penal, styles.penalArriba]} />
      <View style={[styles.porteria, styles.porteriaArriba]} />

      <View style={[styles.areaGrande, styles.abajoArea]} />
      <View style={[styles.areaChica, styles.abajoChica]} />
      <View style={[styles.penal, styles.penalAbajo]} />
      <View style={[styles.porteria, styles.porteriaAbajo]} />

      {/* Córners */}
      <View style={[styles.corner, styles.cornerSupIzq]} />
      <View style={[styles.corner, styles.cornerSupDer]} />
      <View style={[styles.corner, styles.cornerInfIzq]} />
      <View style={[styles.corner, styles.cornerInfDer]} />
    </View>
  );
}

function Ficha({
  jugador,
  xRel,
  yRel,
  esCapitan,
  seleccionado,
  canchaWidth,
  canchaHeight,
  onMover,
  onSeleccionar,
}: {
  jugador: Jugador;
  xRel: number;
  yRel: number;
  esCapitan: boolean;
  seleccionado: boolean;
  canchaWidth: number;
  canchaHeight: number;
  onMover: (jugadorId: string, x: number, y: number) => void;
  onSeleccionar: (jugadorId: string | null) => void;
}) {
  const maxLeft = Math.max(canchaWidth - FICHA_W, 0);
  const maxTop = Math.max(canchaHeight - FICHA_H, 0);

  const aLeft = (x: number) => Math.min(Math.max(x * canchaWidth - FICHA_W / 2, 0), maxLeft);
  const aTop = (y: number) => Math.min(Math.max(y * canchaHeight - CIRCULO / 2, 0), maxTop);

  const left = useSharedValue(aLeft(xRel));
  const top = useSharedValue(aTop(yRel));
  const inicioLeft = useSharedValue(0);
  const inicioTop = useSharedValue(0);
  const escala = useSharedValue(1);
  const capa = useSharedValue(1);

  // Sincroniza cuando la posición cambia desde fuera (auto-asignar, cambio de formación).
  useEffect(() => {
    left.value = withSpring(aLeft(xRel), { damping: 18, stiffness: 160 });
    top.value = withSpring(aTop(yRel), { damping: 18, stiffness: 160 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [xRel, yRel, canchaWidth, canchaHeight]);

  const notificar = useCallback(
    (pxLeft: number, pxTop: number) => {
      onMover(
        jugador.id,
        (pxLeft + FICHA_W / 2) / canchaWidth,
        (pxTop + CIRCULO / 2) / canchaHeight
      );
    },
    [canchaWidth, canchaHeight, jugador.id, onMover]
  );

  const pan = Gesture.Pan()
    .minDistance(4)
    .onStart(() => {
      inicioLeft.value = left.value;
      inicioTop.value = top.value;
      escala.value = withSpring(1.18, { damping: 14, stiffness: 220 });
      capa.value = 999;
      runOnJS(vibrar)(Haptics.ImpactFeedbackStyle.Light);
    })
    .onUpdate((e) => {
      left.value = Math.min(Math.max(inicioLeft.value + e.translationX, 0), maxLeft);
      top.value = Math.min(Math.max(inicioTop.value + e.translationY, 0), maxTop);
    })
    .onEnd(() => {
      escala.value = withSpring(1, { damping: 14, stiffness: 220 });
      capa.value = 1;
      runOnJS(vibrar)(Haptics.ImpactFeedbackStyle.Medium);
      runOnJS(notificar)(left.value, top.value);
    });

  const tap = Gesture.Tap().onEnd(() => {
    runOnJS(onSeleccionar)(seleccionado ? null : jugador.id);
  });

  const gesto = Gesture.Race(pan, tap);

  const estiloAnimado = useAnimatedStyle(() => ({
    left: left.value,
    top: top.value,
    zIndex: capa.value,
    transform: [{ scale: escala.value }],
  }));

  const colorRol = ROLES[jugador.rol].color;

  return (
    <GestureDetector gesture={gesto}>
      <Animated.View
        testID={`ficha-${jugador.id}`}
        accessibilityLabel={`Ficha de ${jugador.nombre}, dorsal ${jugador.numero}`}
        style={[styles.ficha, ESTILO_WEB_FICHA, estiloAnimado]}>
        <View
          style={[
            styles.fichaCirculo,
            { borderColor: colorRol },
            seleccionado && styles.fichaSeleccionada,
          ]}>
          <Texto variante="subtitle" color={colorRol}>
            {jugador.numero}
          </Texto>
          {esCapitan ? (
            <View style={[styles.brazalete, { backgroundColor: colorRol }]}>
              <Texto variante="overline" color="#FFFFFF" style={styles.brazaleteTexto}>
                C
              </Texto>
            </View>
          ) : null}
        </View>

        <View style={styles.pastilla}>
          <Texto variante="overline" color="#FFFFFF" numberOfLines={1}>
            {apellido(jugador.nombre)}
          </Texto>
        </View>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  cancha: {
    flex: 1,
    backgroundColor: Cesped.franjaA,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Cesped.borde,
    overflow: 'hidden',
    minHeight: 400,
  },
  capa: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: 'none',
  },

  perimetro: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    bottom: 10,
    borderWidth: 2,
    borderColor: Cesped.linea,
    borderRadius: 3,
  },
  medioCampo: {
    position: 'absolute',
    left: 10,
    right: 10,
    top: '50%',
    height: 2,
    backgroundColor: Cesped.linea,
  },
  circuloCentral: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 92,
    height: 92,
    marginLeft: -46,
    marginTop: -46,
    borderRadius: 46,
    borderWidth: 2,
    borderColor: Cesped.linea,
  },
  puntoCentral: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 6,
    height: 6,
    marginLeft: -3,
    marginTop: -3,
    borderRadius: 3,
    backgroundColor: Cesped.linea,
  },

  areaGrande: {
    position: 'absolute',
    left: '21%',
    right: '21%',
    height: '16%',
    borderWidth: 2,
    borderColor: Cesped.linea,
  },
  areaChica: {
    position: 'absolute',
    left: '35%',
    right: '35%',
    height: '7%',
    borderWidth: 2,
    borderColor: Cesped.linea,
  },
  arribaArea: { top: 10, borderTopWidth: 0 },
  arribaChica: { top: 10, borderTopWidth: 0 },
  abajoArea: { bottom: 10, borderBottomWidth: 0 },
  abajoChica: { bottom: 10, borderBottomWidth: 0 },

  penal: {
    position: 'absolute',
    left: '50%',
    width: 5,
    height: 5,
    marginLeft: -2.5,
    borderRadius: 2.5,
    backgroundColor: Cesped.linea,
  },
  penalArriba: { top: '11.5%' },
  penalAbajo: { bottom: '11.5%' },

  porteria: {
    position: 'absolute',
    left: '41%',
    right: '41%',
    height: 9,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  porteriaArriba: { top: 2, borderBottomWidth: 0 },
  porteriaAbajo: { bottom: 2, borderTopWidth: 0 },

  corner: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderColor: Cesped.linea,
  },
  cornerSupIzq: {
    top: 10,
    left: 10,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderBottomRightRadius: 16,
  },
  cornerSupDer: {
    top: 10,
    right: 10,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderBottomLeftRadius: 16,
  },
  cornerInfIzq: {
    bottom: 10,
    left: 10,
    borderRightWidth: 2,
    borderTopWidth: 2,
    borderTopRightRadius: 16,
  },
  cornerInfDer: {
    bottom: 10,
    right: 10,
    borderLeftWidth: 2,
    borderTopWidth: 2,
    borderTopLeftRadius: 16,
  },

  ficha: {
    position: 'absolute',
    width: FICHA_W,
    height: FICHA_H,
    alignItems: 'center',
  },
  fichaCirculo: {
    width: CIRCULO,
    height: CIRCULO,
    borderRadius: CIRCULO / 2,
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 3px 8px rgba(0, 0, 0, 0.35)',
  },
  fichaSeleccionada: {
    borderColor: '#FFFFFF',
    boxShadow: '0px 0px 0px 3px rgba(255, 255, 255, 0.9), 0px 4px 12px rgba(0, 0, 0, 0.45)',
  },
  brazalete: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 17,
    height: 17,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brazaleteTexto: { fontSize: 9, letterSpacing: 0 },
  pastilla: {
    marginTop: 4,
    // Puede sobresalir de la ficha: va centrada y así caben más apellidos completos.
    maxWidth: 90,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.pill,
    backgroundColor: 'rgba(6, 30, 18, 0.72)',
  },

  vacio: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    pointerEvents: 'none',
  },
  vacioCaja: {
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
    backgroundColor: 'rgba(6, 30, 18, 0.45)',
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  vacioTexto: { textAlign: 'center' },
});
