import { buildPassengerQrPayload, parsePassengerQrPayload } from './passengerIdentity';

describe('buildPassengerQrPayload', () => {
  it('gera o payload JSON no formato fabtra-passenger v1', () => {
    const payload = JSON.parse(buildPassengerQrPayload({
      id: '5',
      firebaseId: 'abc123',
      line: 'L1',
      lines: ['L1', 'L2'],
    }));

    expect(payload).toEqual({
      type: 'fabtra-passenger',
      version: 1,
      passengerId: '5',
      passengerFirebaseId: 'abc123',
      line: 'L1',
      lines: ['L1', 'L2'],
    });
  });
});

describe('parsePassengerQrPayload', () => {
  it('faz round-trip com buildPassengerQrPayload', () => {
    const raw = buildPassengerQrPayload({ id: '5', firebaseId: 'abc123', line: 'L1', lines: ['L1', 'L2'] });
    expect(parsePassengerQrPayload(raw)).toEqual({
      passengerId: '5',
      passengerFirebaseId: 'abc123',
      line: 'L1',
      lines: ['L1', 'L2'],
    });
  });

  it('retorna null para vazio ou so espacos', () => {
    expect(parsePassengerQrPayload('')).toBeNull();
    expect(parsePassengerQrPayload('   ')).toBeNull();
    expect(parsePassengerQrPayload(null)).toBeNull();
  });

  it('fallback: string nao-JSON vira passengerId cru (QR antigo de codigo puro)', () => {
    expect(parsePassengerQrPayload('123abc')).toEqual({
      passengerId: '123abc',
      passengerFirebaseId: '123abc',
      line: '',
      lines: [],
    });
  });

  it('fallback: JSON valido mas sem type fabtra usa o valor cru como id', () => {
    const raw = '{"foo":1}';
    expect(parsePassengerQrPayload(raw)).toEqual({
      passengerId: raw,
      passengerFirebaseId: raw,
    });
  });

  it('deriva line a partir de lines quando line nao vem no payload', () => {
    const raw = JSON.stringify({ type: 'fabtra-passenger', version: 1, passengerId: '9', lines: ['LX'] });
    const parsed = parsePassengerQrPayload(raw);
    expect(parsed.passengerId).toBe('9');
    expect(parsed.passengerFirebaseId).toBe('9');
    expect(parsed.line).toBe('LX');
    expect(parsed.lines).toEqual(['LX']);
  });
});
