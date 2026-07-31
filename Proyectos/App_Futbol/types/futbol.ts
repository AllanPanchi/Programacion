export type Rol = 'POR' | 'DEF' | 'MED' | 'DEL';

export interface Jugador {
  id: string;
  nombre: string;
  numero: number;
  rol: Rol;
}

/** Posición relativa (0..1) del centro de la ficha dentro de la cancha. */
export interface PosicionJugador {
  jugadorId: string;
  x: number;
  y: number;
}

export interface Alineacion {
  id: string;
  nombre: string;
  /** Id de la formación usada como base (ver utils/formaciones.ts). */
  formacion: string;
  posiciones: PosicionJugador[];
  /** Jugador marcado como capitán dentro de esta alineación. */
  capitanId: string | null;
  actualizadoEn: number;
}
