import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { TITULARES_MAX } from '@/constants/design';
import { Alineacion, Jugador } from '@/types/futbol';
import {
  autoAsignar,
  FORMACION_POR_DEFECTO,
  getFormacion,
  ranuraLibre,
} from '@/utils/formaciones';
import {
  getAlineacionActualId,
  getAlineaciones,
  getJugadores,
  saveAlineaciones,
  saveJugadores,
  setAlineacionActualId,
} from '@/utils/storage';

function crearAlineacion(nombre: string): Alineacion {
  return {
    id: `a${Date.now()}${Math.round(Math.random() * 1000)}`,
    nombre,
    formacion: FORMACION_POR_DEFECTO,
    posiciones: [],
    capitanId: null,
    actualizadoEn: Date.now(),
  };
}

interface Plantilla {
  cargado: boolean;
  jugadores: Jugador[];
  alineaciones: Alineacion[];
  alineacionActual: Alineacion | null;
  /** Ids de jugadores colocados en la alineación activa. */
  idsEnCancha: Set<string>;

  agregarJugador: (datos: Omit<Jugador, 'id'>) => void;
  actualizarJugador: (id: string, datos: Omit<Jugador, 'id'>) => void;
  eliminarJugador: (id: string) => void;

  seleccionarAlineacion: (id: string) => void;
  nuevaAlineacion: () => void;
  duplicarAlineacion: (id: string) => void;
  eliminarAlineacion: (id: string) => void;
  renombrarAlineacion: (id: string, nombre: string) => void;

  aplicarFormacion: (formacionId: string) => void;
  autocompletar: () => void;
  vaciarCancha: () => void;
  ponerEnCancha: (jugadorId: string) => void;
  quitarDeCancha: (jugadorId: string) => void;
  moverJugador: (jugadorId: string, x: number, y: number) => void;
  alternarCapitan: (jugadorId: string) => void;
}

const Contexto = createContext<Plantilla | null>(null);

export function PlantillaProvider({ children }: { children: React.ReactNode }) {
  const [cargado, setCargado] = useState(false);
  const [jugadores, setJugadores] = useState<Jugador[]>([]);
  const [alineaciones, setAlineaciones] = useState<Alineacion[]>([]);
  const [actualId, setActualId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const [js, als, guardadoId] = await Promise.all([
        getJugadores(),
        getAlineaciones(),
        getAlineacionActualId(),
      ]);

      const lista = als.length > 0 ? als : [crearAlineacion('Titular')];
      const id = lista.some((a) => a.id === guardadoId) ? guardadoId : lista[0].id;

      setJugadores(js);
      setAlineaciones(lista);
      setActualId(id);
      setCargado(true);
    })();
  }, []);

  useEffect(() => {
    if (cargado) saveJugadores(jugadores);
  }, [jugadores, cargado]);

  useEffect(() => {
    if (cargado) saveAlineaciones(alineaciones);
  }, [alineaciones, cargado]);

  useEffect(() => {
    if (cargado && actualId) setAlineacionActualId(actualId);
  }, [actualId, cargado]);

  const alineacionActual = useMemo(
    () => alineaciones.find((a) => a.id === actualId) ?? null,
    [alineaciones, actualId]
  );

  const idsEnCancha = useMemo(
    () => new Set(alineacionActual?.posiciones.map((p) => p.jugadorId) ?? []),
    [alineacionActual]
  );

  const editarActual = useCallback(
    (fn: (a: Alineacion) => Alineacion) => {
      setAlineaciones((prev) =>
        prev.map((a) => (a.id === actualId ? { ...fn(a), actualizadoEn: Date.now() } : a))
      );
    },
    [actualId]
  );

  const agregarJugador = useCallback((datos: Omit<Jugador, 'id'>) => {
    setJugadores((prev) => [
      ...prev,
      { ...datos, id: `j${Date.now()}${Math.round(Math.random() * 1000)}` },
    ]);
  }, []);

  const actualizarJugador = useCallback((id: string, datos: Omit<Jugador, 'id'>) => {
    setJugadores((prev) => prev.map((j) => (j.id === id ? { ...j, ...datos } : j)));
  }, []);

  /** Al borrar un jugador se le retira de todas las alineaciones donde estuviera. */
  const eliminarJugador = useCallback((id: string) => {
    setJugadores((prev) => prev.filter((j) => j.id !== id));
    setAlineaciones((prev) =>
      prev.map((a) => ({
        ...a,
        posiciones: a.posiciones.filter((p) => p.jugadorId !== id),
        capitanId: a.capitanId === id ? null : a.capitanId,
      }))
    );
  }, []);

  const seleccionarAlineacion = useCallback((id: string) => setActualId(id), []);

  const nuevaAlineacion = useCallback(() => {
    setAlineaciones((prev) => {
      const creada = crearAlineacion(`Alineación ${prev.length + 1}`);
      setActualId(creada.id);
      return [...prev, creada];
    });
  }, []);

  const duplicarAlineacion = useCallback((id: string) => {
    setAlineaciones((prev) => {
      const origen = prev.find((a) => a.id === id);
      if (!origen) return prev;
      const copia: Alineacion = {
        ...origen,
        id: `a${Date.now()}${Math.round(Math.random() * 1000)}`,
        nombre: `${origen.nombre} (copia)`,
        posiciones: origen.posiciones.map((p) => ({ ...p })),
        actualizadoEn: Date.now(),
      };
      setActualId(copia.id);
      return [...prev, copia];
    });
  }, []);

  const eliminarAlineacion = useCallback(
    (id: string) => {
      setAlineaciones((prev) => {
        const restantes = prev.filter((a) => a.id !== id);
        const lista = restantes.length > 0 ? restantes : [crearAlineacion('Titular')];
        if (id === actualId) setActualId(lista[0].id);
        return lista;
      });
    },
    [actualId]
  );

  const renombrarAlineacion = useCallback((id: string, nombre: string) => {
    setAlineaciones((prev) => prev.map((a) => (a.id === id ? { ...a, nombre } : a)));
  }, []);

  /** Cambia de formación y recoloca a los titulares actuales sobre las nuevas ranuras. */
  const aplicarFormacion = useCallback(
    (formacionId: string) => {
      editarActual((a) => {
        const formacion = getFormacion(formacionId);
        const enCancha = a.posiciones
          .map((p) => jugadores.find((j) => j.id === p.jugadorId))
          .filter((j): j is Jugador => !!j);
        return { ...a, formacion: formacionId, posiciones: autoAsignar(enCancha, formacion) };
      });
    },
    [editarActual, jugadores]
  );

  /** Rellena el once titular con la plantilla completa según la formación activa. */
  const autocompletar = useCallback(() => {
    editarActual((a) => ({
      ...a,
      posiciones: autoAsignar(jugadores, getFormacion(a.formacion)),
    }));
  }, [editarActual, jugadores]);

  const vaciarCancha = useCallback(() => {
    editarActual((a) => ({ ...a, posiciones: [], capitanId: null }));
  }, [editarActual]);

  const ponerEnCancha = useCallback(
    (jugadorId: string) => {
      const jugador = jugadores.find((j) => j.id === jugadorId);
      if (!jugador) return;
      editarActual((a) => {
        if (a.posiciones.length >= TITULARES_MAX) return a;
        const ranura = ranuraLibre(getFormacion(a.formacion), a.posiciones, jugador.rol);
        return {
          ...a,
          posiciones: [...a.posiciones, { jugadorId, x: ranura.x, y: ranura.y }],
        };
      });
    },
    [editarActual, jugadores]
  );

  const quitarDeCancha = useCallback(
    (jugadorId: string) => {
      editarActual((a) => ({
        ...a,
        posiciones: a.posiciones.filter((p) => p.jugadorId !== jugadorId),
        capitanId: a.capitanId === jugadorId ? null : a.capitanId,
      }));
    },
    [editarActual]
  );

  const moverJugador = useCallback(
    (jugadorId: string, x: number, y: number) => {
      editarActual((a) => ({
        ...a,
        posiciones: a.posiciones.map((p) => (p.jugadorId === jugadorId ? { ...p, x, y } : p)),
      }));
    },
    [editarActual]
  );

  const alternarCapitan = useCallback(
    (jugadorId: string) => {
      editarActual((a) => ({
        ...a,
        capitanId: a.capitanId === jugadorId ? null : jugadorId,
      }));
    },
    [editarActual]
  );

  const valor: Plantilla = {
    cargado,
    jugadores,
    alineaciones,
    alineacionActual,
    idsEnCancha,
    agregarJugador,
    actualizarJugador,
    eliminarJugador,
    seleccionarAlineacion,
    nuevaAlineacion,
    duplicarAlineacion,
    eliminarAlineacion,
    renombrarAlineacion,
    aplicarFormacion,
    autocompletar,
    vaciarCancha,
    ponerEnCancha,
    quitarDeCancha,
    moverJugador,
    alternarCapitan,
  };

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}

export function usePlantilla(): Plantilla {
  const ctx = useContext(Contexto);
  if (!ctx) throw new Error('usePlantilla debe usarse dentro de <PlantillaProvider>');
  return ctx;
}
