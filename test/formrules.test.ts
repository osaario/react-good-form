import {
  required,
  email,
  minLength,
  maxLength,
  loosely,
  equals,
  matches,
  max,
  min,
  regExp,
  rule,
  numberRule,
  strictly
} from '../src/formrules'

/**
 * Dummy test
 */
describe('Form rules tests', () => {
  it('required', () => {
    expect(required('', false)).toBeNull()

    expect(required('', true)).toBeTruthy()
    expect(required('geg', true)).toBeNull()
    expect(required('gagaeg', true)).toBeNull()

    expect(() => required(1, true)).toThrow()
    expect(required(undefined, true)).toEqual(true)
    expect(required(null, true)).toEqual(true)
    expect(() => required(null, 12 as any)).toThrow()
    expect(() => required(null, 'string' as any)).toThrow()
  })
  it('email', () => {
    expect(email('', true)).toBeNull()
    expect(email('', false)).toBeNull()
    expect(email('tauno@gmail.com', true)).toBeNull()
    expect(email('tauno@gmail.fi', true)).toBeNull()
    expect(email('antto@mail.fi', true)).toBeNull()
    expect(email('esko@hotmail.com', true)).toBeNull()

    expect(email('tauno@gmail', true)).toBeTruthy()
    expect(email('fef', true)).toBeTruthy()

    expect(email(null, true)).toBeNull()

    expect(() => email(12, true)).toThrowError()
    expect(email(undefined, true)).toBeNull()
    expect(() => email({} as any, true)).toThrowError()
  })
  it('minLength', () => {
    expect(minLength('1', 1)).toBeNull()
    expect(minLength('114232', 5)).toBeNull()
    // zero as rulevalue should let any string pass
    expect(minLength('', 0)).toBeNull()
    expect(minLength('fef', 0)).toBeNull()

    expect(minLength('1212', 5)).toBeTruthy()
    expect(minLength('10420042024042', 100)).toBeTruthy()

    expect(minLength(null, 12)).toEqual(12)
    expect(minLength(undefined, 0)).toBeNull()
    expect(() => minLength(12, 12)).toThrowError()
  })
  it('maxLength', () => {
    expect(maxLength('1', 2)).toBeNull()
    expect(maxLength('114232', 10)).toBeNull()
    expect(maxLength('', 0)).toBeNull()
    // zero as rulevalue should let any string pass

    expect(maxLength('1212342', 5)).toBeTruthy()
    expect(maxLength('10420042024042', 10)).toBeTruthy()

    expect(maxLength(null, 12)).toBeNull()
    expect(maxLength(undefined, 0)).toBeNull()
    expect(() => maxLength(12, 12)).toThrowError()
  })
  it('loosely', () => {
    expect(loosely(true, true)).toBeNull()
    expect(loosely(true, false)).toStrictEqual(false)

    expect(loosely(null, false)).toBeNull()
    expect(loosely(undefined, false)).toBeNull()
    expect(() => loosely(true, 12 as any)).toThrowError()
    expect(() => loosely(null, 12 as any)).toThrowError()
  })
  it('strictly', () => {
    expect(strictly(true, true)).toBeNull()
    expect(strictly(true, false)).toStrictEqual(false)

    expect(strictly(null, false)).toStrictEqual(false)
    expect(strictly(undefined, false)).toStrictEqual(false)
    expect(() => strictly(true, 12 as any)).toThrowError()
    expect(() => strictly(null, 12 as any)).toThrowError()
  })
  it('numberMatches', () => {
    expect(equals(5, 5)).toBeNull()
    expect(equals(5, 6)).toBeTruthy()
    expect(() => equals('gkeo', 12)).toThrowError()
  })
  it('stringMatches', () => {
    expect(matches('fekkof', 'fekkof')).toBeNull()
    expect(matches('gkoe', 'good form')).toBeTruthy()
    expect(() => matches('gkeo', 12 as any)).toThrowError()
  })
  it('min', () => {
    expect(min(1, 0)).toBeNull()
    expect(min(10, 10)).toBeNull()
    expect(min(4, 5)).toBeTruthy()
    expect(min(0, 5)).toBeTruthy()
    expect(() => min('gkeo', 12)).toThrowError()
  })
  it('max', () => {
    expect(max(0, 1)).toBeNull()
    expect(max(10, 10)).toBeNull()
    expect(max(5, 4)).toStrictEqual(4)
    expect(max(5, 0)).toStrictEqual(0)
    expect(() => max('gkeo', 12)).toThrowError()
  })
  it('regExp', () => {
    expect(regExp('ab', /ab/)).toBeNull()
    expect(regExp('ac', /ab/)).toBeTruthy()
    expect(() => regExp('gkeo', 'gkeo' as any)).toThrowError()
  })
  it('rule', () => {
    expect(rule('gkow', val => val === 'gkow')).toBeNull()
    expect(rule('gkow', val => val === 'kow')).toBeTruthy()
    expect(() => rule('gkeo', 12 as any)).toThrowError()
  })
  it('numberRule', () => {
    expect(numberRule(12, val => val === 12)).toBeNull()
    expect(() => rule('gkeo', 12 as any)).toThrowError()
  })
})
