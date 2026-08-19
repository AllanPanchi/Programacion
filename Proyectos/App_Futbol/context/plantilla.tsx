import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { TITULARES_MAX } from '@/constants/design';
import { Alineacion, Categoria, Jugador } from '@/types/futbol';
import {
  autoAsignar,
  FORMACION_POR_DEFECTO,
  getFormacion,
  ranuraLibre,
} from '@/utils/formaciones';
import {
  getAlineacionActualId,
  getAlineaciones,
  getCategoriaActualId,
  getCategorias,
  getJugadores,
  saveAlineaciones,
  saveCategorias,
  saveJugadores,
  setAlineacionActualId,
  setCategoriaActualId,
} from '@/utils/storage';

const idNuevo = (prefijo: string) =>
  `${prefijo}${Date.now()}${Math.round(Math.random() * 1000)}`;

function crearAlineacion(nombre: string, categoriaId: string): Alineacion {
  return {
    id: idNuevo('a'),
    nombre,
    categoriaId,
    formacion: FORMACION_POR_DEFECTO,
    posiciones: [],
    capitanId: null,
    actualizadoEn: Date.now(),
  };
}

interface Plantilla {
  cargado: boolean;
  categorias: Categoria[];
  categoriaActual: Categoria | null;
  /** Jugadores de la categoría activa (los de otras categorías no se mezclan). */
  jugadores: Jugador[];
  /** Alineaciones de la categoría activa. */
  alineaciones: Alineacion[];
  alineacionActual: Alineacion | null;
  /** Ids de jugadores colocados en la alineación activa. */
  idsEnCancha: Set<string>;
  /** Nº de jugadores por categoría, para mostrarlo al gestionarlas. */
  conteoPorCategoria: Record<string, number>;

  seleccionarCategoria: (id: string) => void;
  agregarCategoria: (nombre: string) => void;
  renombrarCategoria: (id: string, nombre: string) => void;
  /** Elimina la categoría junto con sus jugadores y alineaciones. */
  eliminarCategoria: (id: string) => void;

  agregarJugador: (datos: Omit<Jugador, 'id' | 'categoriaId'>) => void;
  actualizarJugador: (id: string, datos: Omit<Jugador, 'id' | 'categoriaId'>) => void;
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
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaId, setCategoriaId] = useState<string | null>(null);
  const [todosJugadores, setJugadores] = useState<Jugador[]>([]);
  const [todasAlineaciones, setAlineaciones] = useState<Alineacion[]>([]);
  const [actualId, setActualId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const [cats, catGuardada, js, als, guardadoId] = await Promise.all([
        getCategorias(),
        getCategoriaActualId(),
        getJugadores(),
        getAlineaciones(),
        getAlineacionActualId(),
      ]);

      const catId = cats.some((c) => c.id === catGuardada) ? catGuardada! : cats[0].id;
      const deCategoria = als.filter((a) => a.categoriaId === catId);
      const lista = deCategoria.length > 0 ? als : [...als, crearAlineacion('Titular', catId)];
      const propias = lista.filter((a) => a.categoriaId === catId);
      const id = propias.some((a) => a.id === guardadoId) ? guardadoId : propias[0].id;

      setCategorias(cats);
      setCategoriaId(catId);
      setJugadores(js);
      setAlineaciones(lista);
      setActualId(id);
      setCargado(true);
    })();
  }, []);

  useEffect(() => {
    if (cargado) saveJugadores(todosJugadores);
  }, [todosJugadores, cargado]);

  useEffect(() => {
    if (cargado) saveAlineaciones(todasAlineaciones);
  }, [todasAlineaciones, cargado]);

  useEffect(() => {
    if (cargado) saveCategorias(categorias);
  }, [categorias, cargado]);

  useEffect(() => {
    if (cargado && categoriaId) setCategoriaActualId(categoriaId);
  }, [categoriaId, cargado]);

  const categoriaActual = useMemo(
    () => categorias.find((c) => c.id === categoriaId) ?? null,
    [categorias, categoriaId]
  );

  const jugadores = useMemo(
    () => todosJugadores.filter((j) => j.categoriaId === categoriaId),
    [todosJugadores, categoriaId]
  );

  const alineaciones = useMemo(
    () => todasAlineaciones.filter((a) => a.categoriaId === categoriaId),
    [todasAlineaciones, categoriaId]
  );

  const conteoPorCategoria = useMemo(() => {
    const conteo: Record<string, number> = {};
    for (const c of categorias) conteo[c.id] = 0;
    for (const j of todosJugadores) conteo[j.categoriaId] = (conteo[j.categoriaId] ?? 0) + 1;
    return conteo;
  }, [categorias, todosJugadores]);

  const alineacionActual = useMemo(
    () => alineaciones.find((a) => a.id === actualId) ?? alineaciones[0] ?? null,
    [alineaciones, actualId]
  );

  // Cada categoría necesita al menos una alineación donde trabajar.
  useEffect(() => {
    if (!cargado || !categoriaId) return;
    if (todasAlineaciones.some((a) => a.categoriaId === categoriaId)) return;
    const creada = crearAlineacion('Titular', categoriaId);
    setAlineaciones((prev) => [...prev, creada]);
    setActualId(creada.id);
  }, [cargado, categoriaId, todasAlineaciones]);

  useEffect(() => {
    if (cargado && alineacionActual) setAlineacionActualId(alineacionActual.id);
  }, [alineacionActual, cargado]);

  const idsEnCancha = useMemo(
    () => new Set(alineacionActual?.posiciones.map((p) => p.jugadorId) ?? []),
    [alineacionActual]
  );

  /**
   * Id de la alineación sobre la que se opera. Al cambiar de categoría `actualId`
   * queda a null y `alineacionActual` cae en la primera de la nueva categoría, así
   * que las mutaciones tienen que usar este id y no el crudo.
   */
  const idEnUso = alineacionActual?.id ?? null;

  const editarActual = useCallback(
    (fn: (a: Alineacion) => Alineacion) => {
      if (!idEnUso) return;
      setAlineaciones((prev) =>
        prev.map((a) => (a.id === idEnUso ? { ...fn(a), actualizadoEn: Date.now() } : a))
      );
    },
    [idEnUso]
  );

  const seleccionarCategoria = useCallback((id: string) => {
    setCategoriaId(id);
    setActualId(null);
  }, []);

  const agregarCategoria = useCallback((nombre: string) => {
    const creada: Categoria = { id: idNuevo('c'), nombre: nombre.trim() };
    setCategorias((prev) => [...prev, creada]);
    setCategoriaId(creada.id);
    setActualId(null);
  }, []);

  const renombrarCategoria = useCallback((id: string, nombre: string) => {
    setCategorias((prev) => prev.map((c) => (c.id === id ? { ...c, nombre: nombre.trim() } : c)));
  }, []);

  /** Borrar una categoría arrastra a sus jugadores y a sus alineaciones. */
  const eliminarCategoria = useCallback((id: string) => {
    setCategorias((prev) => {
      if (prev.length <= 1) return prev;
      const restantes = prev.filter((c) => c.id !== id);
      setJugadores((js) => js.filter((j) => j.categoriaId !== id));
      setAlineaciones((als) => als.filter((a) => a.categoriaId !== id));
      setCategoriaId((actual) => (actual === id ? restantes[0].id : actual));
      setActualId(null);
      return restantes;
    });
  }, []);

  const agregarJugador = useCallback(
    (datos: Omit<Jugador, 'id' | 'categoriaId'>) => {
      if (!categoriaId) return;
      setJugadores((prev) => [...prev, { ...datos, id: idNuevo('j'), categoriaId }]);
    },
    [categoriaId]
  );

  const actualizarJugador = useCallback(
    (id: string, datos: Omit<Jugador, 'id' | 'categoriaId'>) => {
      setJugadores((prev) => prev.map((j) => (j.id === id ? { ...j, ...datos } : j)));
    },
    []
  );

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
    if (!categoriaId) return;
    setAlineaciones((prev) => {
      const enCategoria = prev.filter((a) => a.categoriaId === categoriaId).length;
      const creada = crearAlineacion(`Alineación ${enCategoria + 1}`, categoriaId);
      setActualId(creada.id);
      return [...prev, creada];
    });
  }, [categoriaId]);

  const duplicarAlineacion = useCallback((id: string) => {
    setAlineaciones((prev) => {
      const origen = prev.find((a) => a.id === id);
      if (!origen) return prev;
      const copia: Alineacion = {
        ...origen,
        id: idNuevo('a'),
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
      if (!categoriaId) return;
      setAlineaciones((prev) => {
        const restantes = prev.filter((a) => a.id !== id);
        // Si era la última de su categoría, se repone una vacía para no dejarla sin campo.
        const quedanEnCategoria = restantes.some((a) => a.categoriaId === categoriaId);
        const lista = quedanEnCategoria
          ? restantes
          : [...restantes, crearAlineacion('Titular', categoriaId)];
        if (id === idEnUso) {
          const propia = lista.find((a) => a.categoriaId === categoriaId);
          if (propia) setActualId(propia.id);
        }
        return lista;
      });
    },
    [idEnUso, categoriaId]
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
    categorias,
    categoriaActual,
    conteoPorCategoria,
    seleccionarCategoria,
    agregarCategoria,
    renombrarCategoria,
    eliminarCategoria,
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
