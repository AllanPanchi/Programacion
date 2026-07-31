import AsyncStorage from '@react-native-async-storage/async-storage';

import { Alineacion, Jugador, Rol } from '@/types/futbol';
import { FORMACION_POR_DEFECTO } from '@/utils/formaciones';

const JUGADORES_KEY = '@futbol/jugadores';
const ALINEACIONES_KEY = '@futbol/alineaciones';
const ALINEACION_ACTUAL_KEY = '@futbol/alineacion_actual';

const ROLES_VALIDOS: Rol[] = ['POR', 'DEF', 'MED', 'DEL'];

/** Completa los campos que no existían en versiones anteriores de los datos guardados. */
function normalizarJugador(raw: Partial<Jugador>): Jugador {
  const rol = raw.rol && ROLES_VALIDOS.includes(raw.rol) ? raw.rol : 'MED';
  return {
    id: String(raw.id ?? Date.now()),
    nombre: String(raw.nombre ?? ''),
    numero: Number(raw.numero ?? 0),
    rol,
  };
}

function normalizarAlineacion(raw: Partial<Alineacion>): Alineacion {
  return {
    id: String(raw.id ?? Date.now()),
    nombre: String(raw.nombre ?? 'Alineación'),
    formacion: raw.formacion ?? FORMACION_POR_DEFECTO,
    posiciones: Array.isArray(raw.posiciones) ? raw.posiciones : [],
    capitanId: raw.capitanId ?? null,
    actualizadoEn: Number(raw.actualizadoEn ?? Date.now()),
  };
}

async function leerJSON<T>(key: string): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export async function getJugadores(): Promise<Jugador[]> {
  const data = await leerJSON<Partial<Jugador>[]>(JUGADORES_KEY);
  return (data ?? []).map(normalizarJugador);
}

export async function saveJugadores(jugadores: Jugador[]): Promise<void> {
  await AsyncStorage.setItem(JUGADORES_KEY, JSON.stringify(jugadores));
}

export async function getAlineaciones(): Promise<Alineacion[]> {
  const data = await leerJSON<Partial<Alineacion>[]>(ALINEACIONES_KEY);
  return (data ?? []).map(normalizarAlineacion);
}

export async function saveAlineaciones(alineaciones: Alineacion[]): Promise<void> {
  await AsyncStorage.setItem(ALINEACIONES_KEY, JSON.stringify(alineaciones));
}

export async function getAlineacionActualId(): Promise<string | null> {
  return AsyncStorage.getItem(ALINEACION_ACTUAL_KEY);
}

export async function setAlineacionActualId(id: string): Promise<void> {
  await AsyncStorage.setItem(ALINEACION_ACTUAL_KEY, id);
}
