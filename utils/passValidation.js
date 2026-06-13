/**
 * Interpreta "YYYY-MM-DD" como data local (evita ficar 1 dia a menos no fuso Brasil).
 */
export function parseLocalDate(dateStr) {
  if (!dateStr) return new Date();
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/**
 * Formata Date para "YYYY-MM-DD" em horário local.
 */
export function formatLocalDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Formata "YYYY-MM-DD" ou Date para padrão brasileiro (dd/mm/aaaa).
 */
export function formatDateBR(dateStrOrDate) {
  if (!dateStrOrDate) return '';
  const d = typeof dateStrOrDate === 'string' && dateStrOrDate.includes('-')
    ? parseLocalDate(dateStrOrDate)
    : new Date(dateStrOrDate);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString('pt-BR');
}

/**
 * Retorna a data de hoje no formato YYYY-MM-DD
 */
export function getTodayDateKey() {
  return formatLocalDate(new Date());
}

/**
 * Verifica se o passe do passageiro está válido na data de hoje
 * @param {{ startDate: string, endDate: string }} passenger
 * @returns {boolean}
 */
export function isPassValid(passenger) {
  if (!passenger || !passenger.startDate || !passenger.endDate) return false;
  const today = getTodayDateKey();
  return passenger.endDate >= today && passenger.startDate <= today;
}
