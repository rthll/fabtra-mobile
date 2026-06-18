import {
  formatDateBR,
  formatLocalDate,
  getTodayDateKey,
  isPassValid,
  parseLocalDate,
} from './passValidation';

describe('parseLocalDate / formatLocalDate', () => {
  it('interpreta YYYY-MM-DD em horario local', () => {
    const date = parseLocalDate('2026-06-12');
    expect(date.getFullYear()).toBe(2026);
    expect(date.getMonth()).toBe(5);
    expect(date.getDate()).toBe(12);
  });

  it('formata Date para YYYY-MM-DD com zero a esquerda', () => {
    expect(formatLocalDate(new Date(2026, 0, 5))).toBe('2026-01-05');
  });

  it('faz round-trip', () => {
    expect(formatLocalDate(parseLocalDate('2026-12-31'))).toBe('2026-12-31');
  });
});

describe('formatDateBR', () => {
  it('converte YYYY-MM-DD para dd/mm/aaaa', () => {
    expect(formatDateBR('2026-06-12')).toBe('12/06/2026');
  });

  it('retorna vazio para entrada vazia/invalida', () => {
    expect(formatDateBR('')).toBe('');
    expect(formatDateBR('nao-e-data')).toBe('');
  });
});

describe('getTodayDateKey', () => {
  it('retorna a data de hoje em horario local', () => {
    expect(getTodayDateKey()).toBe(formatLocalDate(new Date()));
  });
});

describe('isPassValid', () => {
  const today = getTodayDateKey();

  it('valido quando hoje esta dentro do intervalo (inclusivo)', () => {
    expect(isPassValid({ startDate: '2000-01-01', endDate: '2999-12-31' })).toBe(true);
    expect(isPassValid({ startDate: today, endDate: today })).toBe(true);
  });

  it('invalido quando vencido', () => {
    expect(isPassValid({ startDate: '2000-01-01', endDate: '2000-01-02' })).toBe(false);
  });

  it('invalido quando ainda nao comecou', () => {
    expect(isPassValid({ startDate: '2999-01-01', endDate: '2999-12-31' })).toBe(false);
  });

  it('invalido com campos ausentes', () => {
    expect(isPassValid(null)).toBe(false);
    expect(isPassValid({})).toBe(false);
    expect(isPassValid({ startDate: today })).toBe(false);
  });
});
