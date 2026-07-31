import { Jugador, PosicionJugador, Rol } from '@/types/futbol';

export interface Ranura {
  x: number;
  y: number;
  rol: Rol;
}

export interface Formacion {
  id: string;
  ranuras: Ranura[];
}

/**
 * Ranuras en coordenadas relativas (0..1). El eje Y crece hacia abajo:
 * y ≈ 0.90 es la portería propia y y ≈ 0.18 el área rival.
 */
export const FORMACIONES: Formacion[] = [
  {
    id: '4-4-2',
    ranuras: [
      { x: 0.5, y: 0.875, rol: 'POR' },
      { x: 0.15, y: 0.715, rol: 'DEF' },
      { x: 0.38, y: 0.755, rol: 'DEF' },
      { x: 0.62, y: 0.755, rol: 'DEF' },
      { x: 0.85, y: 0.715, rol: 'DEF' },
      { x: 0.15, y: 0.5, rol: 'MED' },
      { x: 0.38, y: 0.54, rol: 'MED' },
      { x: 0.62, y: 0.54, rol: 'MED' },
      { x: 0.85, y: 0.5, rol: 'MED' },
      { x: 0.35, y: 0.24, rol: 'DEL' },
      { x: 0.65, y: 0.24, rol: 'DEL' },
    ],
  },
  {
    id: '4-3-3',
    ranuras: [
      { x: 0.5, y: 0.875, rol: 'POR' },
      { x: 0.15, y: 0.715, rol: 'DEF' },
      { x: 0.38, y: 0.755, rol: 'DEF' },
      { x: 0.62, y: 0.755, rol: 'DEF' },
      { x: 0.85, y: 0.715, rol: 'DEF' },
      { x: 0.27, y: 0.55, rol: 'MED' },
      { x: 0.5, y: 0.6, rol: 'MED' },
      { x: 0.73, y: 0.55, rol: 'MED' },
      { x: 0.17, y: 0.27, rol: 'DEL' },
      { x: 0.5, y: 0.2, rol: 'DEL' },
      { x: 0.83, y: 0.27, rol: 'DEL' },
    ],
  },
  {
    id: '4-2-3-1',
    ranuras: [
      { x: 0.5, y: 0.875, rol: 'POR' },
      { x: 0.15, y: 0.715, rol: 'DEF' },
      { x: 0.38, y: 0.755, rol: 'DEF' },
      { x: 0.62, y: 0.755, rol: 'DEF' },
      { x: 0.85, y: 0.715, rol: 'DEF' },
      { x: 0.37, y: 0.61, rol: 'MED' },
      { x: 0.63, y: 0.61, rol: 'MED' },
      { x: 0.17, y: 0.41, rol: 'MED' },
      { x: 0.5, y: 0.39, rol: 'MED' },
      { x: 0.83, y: 0.41, rol: 'MED' },
      { x: 0.5, y: 0.18, rol: 'DEL' },
    ],
  },
  {
    id: '3-5-2',
    ranuras: [
      { x: 0.5, y: 0.875, rol: 'POR' },
      { x: 0.26, y: 0.725, rol: 'DEF' },
      { x: 0.5, y: 0.765, rol: 'DEF' },
      { x: 0.74, y: 0.725, rol: 'DEF' },
      { x: 0.1, y: 0.56, rol: 'MED' },
      { x: 0.32, y: 0.54, rol: 'MED' },
      { x: 0.5, y: 0.61, rol: 'MED' },
      { x: 0.68, y: 0.54, rol: 'MED' },
      { x: 0.9, y: 0.56, rol: 'MED' },
      { x: 0.35, y: 0.24, rol: 'DEL' },
      { x: 0.65, y: 0.24, rol: 'DEL' },
    ],
  },
  {
    id: '5-3-2',
    ranuras: [
      { x: 0.5, y: 0.875, rol: 'POR' },
      { x: 0.1, y: 0.695, rol: 'DEF' },
      { x: 0.3, y: 0.755, rol: 'DEF' },
      { x: 0.5, y: 0.755, rol: 'DEF' },
      { x: 0.7, y: 0.755, rol: 'DEF' },
      { x: 0.9, y: 0.695, rol: 'DEF' },
      { x: 0.27, y: 0.51, rol: 'MED' },
      { x: 0.5, y: 0.56, rol: 'MED' },
      { x: 0.73, y: 0.51, rol: 'MED' },
      { x: 0.35, y: 0.24, rol: 'DEL' },
      { x: 0.65, y: 0.24, rol: 'DEL' },
    ],
  },
];

export const FORMACION_POR_DEFECTO = FORMACIONES[0].id;

export function getFormacion(id: string): Formacion {
  return FORMACIONES.find((f) => f.id === id) ?? FORMACIONES[0];
}

/**
 * Reparte jugadores sobre las ranuras de la formación. Primero cubre cada ranura
 * con un jugador de ese mismo rol; después rellena los huecos que queden con el resto.
 */
export function autoAsignar(jugadores: Jugador[], formacion: Formacion): PosicionJugador[] {
  const disponibles = [...jugadores];
  const asignadas: PosicionJugador[] = [];
  const pendientes: Ranura[] = [];

  for (const ranura of formacion.ranuras) {
    const i = disponibles.findIndex((j) => j.rol === ranura.rol);
    if (i === -1) {
      pendientes.push(ranura);
    } else {
      const [jugador] = disponibles.splice(i, 1);
      asignadas.push({ jugadorId: jugador.id, x: ranura.x, y: ranura.y });
    }
  }

  for (const ranura of pendientes) {
    const jugador = disponibles.shift();
    if (!jugador) break;
    asignadas.push({ jugadorId: jugador.id, x: ranura.x, y: ranura.y });
  }

  return asignadas;
}

/** Primera ranura de la formación que todavía no está ocupada, para altas manuales. */
export function ranuraLibre(formacion: Formacion, ocupadas: PosicionJugador[], rol: Rol): Ranura {
  const estaOcupada = (r: Ranura) =>
    ocupadas.some((p) => Math.abs(p.x - r.x) < 0.02 && Math.abs(p.y - r.y) < 0.02);

  return (
    formacion.ranuras.find((r) => r.rol === rol && !estaOcupada(r)) ??
    formacion.ranuras.find((r) => !estaOcupada(r)) ?? { x: 0.5, y: 0.5, rol }
  );
}
