export type Rol = 'POR' | 'DEF' | 'MED' | 'DEL';

/** Agrupación de plantilla: Master, Senior, Sub-20… Los dorsales son únicos dentro de cada una. */
export interface Categoria {
  id: string;
  nombre: string;
}

export interface Jugador {
  id: string;
  nombre: string;
  numero: number;
  rol: Rol;
  categoriaId: string;
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
  /** Cada alineación pertenece a una categoría y solo usa jugadores de esa categoría. */
  categoriaId: string;
  /** Id de la formación usada como base (ver utils/formaciones.ts). */
  formacion: string;
  posiciones: PosicionJugador[];
  /** Jugador marcado como capitán dentro de esta alineación. */
  capitanId: string | null;
  actualizadoEn: number;
}
