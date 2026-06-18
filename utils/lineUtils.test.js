import {
  formatLines,
  getPrimaryLine,
  normalizeLineList,
  supportsLine,
} from './lineUtils';

describe('normalizeLineList (mobile: string e tratada como valor unico)', () => {
  it('NAO faz split de string com virgula (diferente do admin)', () => {
    // Divergencia intencional: no mobile a string e um unico valor.
    expect(normalizeLineList('Linha A, Linha B')).toEqual(['Linha A, Linha B']);
  });

  it('trata string nao vazia como lista de um item', () => {
    expect(normalizeLineList(' Linha A ')).toEqual(['Linha A']);
  });

  it('normaliza arrays (trim + dedupe + remove vazios)', () => {
    expect(normalizeLineList(['x ', ' y', 'x', ''])).toEqual(['x', 'y']);
  });

  it('retorna lista vazia para vazio/null', () => {
    expect(normalizeLineList('')).toEqual([]);
    expect(normalizeLineList(null)).toEqual([]);
  });
});

describe('getPrimaryLine', () => {
  it('retorna a primeira linha', () => {
    expect(getPrimaryLine(['a', 'b'])).toBe('a');
  });

  it('retorna vazio quando nao ha linhas', () => {
    expect(getPrimaryLine('')).toBe('');
  });
});

describe('supportsLine', () => {
  it('aceita qualquer passageiro quando nao ha linha ativa', () => {
    expect(supportsLine(['L1'], '')).toBe(true);
    expect(supportsLine([], null)).toBe(true);
  });

  it('true quando a linha ativa esta na lista', () => {
    expect(supportsLine(['L1', 'L2'], 'L2')).toBe(true);
  });

  it('false quando a linha ativa nao esta na lista', () => {
    expect(supportsLine(['L1'], 'L3')).toBe(false);
  });
});

describe('formatLines', () => {
  it('junta a lista por virgula', () => {
    expect(formatLines(['a', 'b'])).toBe('a, b');
  });
});
