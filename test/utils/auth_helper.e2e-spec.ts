import { EncodeAuthClaims, DecodeAuthToken } from '../../src/utils/auth_helper';

describe('Auth Helper (e2e)', () => {
  it('Required tokens are available', () => {
    const sampleUserId = 'b0026fc6-116f-4d1a-a9cb-6bb9b299f1ce';
    const payload = DecodeAuthToken(EncodeAuthClaims(sampleUserId));

    expect(Object.keys(payload)).toContain('userId');
    expect(Object.keys(payload)).toContain('iat');
    expect(Object.keys(payload)).toContain('exp');

    expect(typeof payload.userId).toEqual('string');
    expect(typeof payload.iat).toEqual('number');
    expect(typeof payload.exp).toEqual('number');
  });

  it('Required tokens have valid types', () => {
    const sampleUserId = 'b0026fc6-116f-4d1a-a9cb-6bb9b299f1ce';
    const payload = DecodeAuthToken(EncodeAuthClaims(sampleUserId));

    expect(typeof payload.userId).toEqual('string');
    expect(typeof payload.iat).toEqual('number');
    expect(typeof payload.exp).toEqual('number');
  });
});
