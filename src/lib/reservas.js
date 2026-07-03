import { MOCK_MODE } from './config';
import { reservasSeed } from './mockData';

const CLAVE = 'euromil_reservas';

function leerLocal() {
  const guardadas = JSON.parse(localStorage.getItem(CLAVE) || '[]');
  return [...reservasSeed, ...guardadas];
}

function guardarLocal(reserva) {
  const guardadas = JSON.parse(localStorage.getItem(CLAVE) || '[]');
  guardadas.push(reserva);
  localStorage.setItem(CLAVE, JSON.stringify(guardadas));
}

export async function crearReserva(datos) {
  const reserva = {
    ...datos,
    estado: 'pendiente',
    creada: new Date().toISOString(),
  };

  if (MOCK_MODE) {
    await new Promise((r) => setTimeout(r, 600)); // simula red
    guardarLocal({ ...reserva, id: 'web-' + Date.now() });
    return { ok: true };
  }

  const { supabase } = await import('./supabase');
  const { error } = await supabase.from('reservas').insert(reserva);
  return { ok: !error, error };
}

export async function listarReservas() {
  if (MOCK_MODE) {
    return { ok: true, data: leerLocal().sort((a, b) => a.entrada.localeCompare(b.entrada)) };
  }
  const { supabase } = await import('./supabase');
  const { data, error } = await supabase
    .from('reservas')
    .select('*')
    .order('entrada', { ascending: true });
  return { ok: !error, data: data || [], error };
}

export async function cambiarEstado(id, estado) {
  if (MOCK_MODE) {
    const guardadas = JSON.parse(localStorage.getItem(CLAVE) || '[]');
    const idx = guardadas.findIndex((r) => r.id === id);
    if (idx >= 0) {
      guardadas[idx].estado = estado;
      localStorage.setItem(CLAVE, JSON.stringify(guardadas));
    } else {
      // seeds: se guarda un "override" para la sesión de demo
      const overrides = JSON.parse(localStorage.getItem(CLAVE + '_seed') || '{}');
      overrides[id] = estado;
      localStorage.setItem(CLAVE + '_seed', JSON.stringify(overrides));
    }
    return { ok: true };
  }
  const { supabase } = await import('./supabase');
  const { error } = await supabase.from('reservas').update({ estado }).eq('id', id);
  return { ok: !error, error };
}

/** Aplica los overrides de estado a los seeds (solo mock) */
export function aplicarOverrides(reservas) {
  const overrides = JSON.parse(localStorage.getItem(CLAVE + '_seed') || '{}');
  return reservas.map((r) => (overrides[r.id] ? { ...r, estado: overrides[r.id] } : r));
}

export async function crearReservaManual(datos) {
  const reserva = { ...datos, creada: new Date().toISOString() };

  if (MOCK_MODE) {
    guardarLocal({ ...reserva, id: 'manual-' + Date.now() });
    return { ok: true };
  }
  const { supabase } = await import('./supabase');
  const { error } = await supabase.from('reservas').insert(reserva);
  return { ok: !error, error };
}