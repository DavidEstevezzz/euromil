// Horario real del negocio. getDay(): 0 = domingo ... 6 = sábado
export const HORARIOS = {
  0: null,                              // Domingo: cerrado
  1: { abre: '09:00', cierra: '20:00' }, // Lunes
  2: { abre: '09:00', cierra: '20:00' },
  3: { abre: '09:00', cierra: '20:00' },
  4: { abre: '09:00', cierra: '20:00' }, // Jueves
  5: { abre: '10:00', cierra: '21:00' }, // Viernes
  6: { abre: '10:30', cierra: '14:00' }, // Sábado
};

export function esDomingo(fechaStr) {
  if (!fechaStr) return false;
  return new Date(fechaStr + 'T00:00:00').getDay() === 0;
}

/** Devuelve las franjas de entrega/recogida (cada 30 min) para una fecha 'YYYY-MM-DD' */
export function franjasParaFecha(fechaStr) {
  if (!fechaStr) return [];
  const dia = new Date(fechaStr + 'T00:00:00').getDay();
  const h = HORARIOS[dia];
  if (!h) return [];

  const franjas = [];
  let [hh, mm] = h.abre.split(':').map(Number);
  const [ch, cm] = h.cierra.split(':').map(Number);

  while (hh < ch || (hh === ch && mm <= cm)) {
    franjas.push(`${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`);
    mm += 30;
    if (mm >= 60) { mm = 0; hh += 1; }
  }
  return franjas;
}