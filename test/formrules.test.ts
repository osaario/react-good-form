import {
  required,
  email,
  minLength,
  maxLength,
  booleanMatches,
  numberMatches,
  stringMatches,
  max,
  min
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
    expect(() => required(undefined, true)).toThrow()
    expect(() => required(null, true)).toThrow()
    expect(() => required(null, 12 as any)).toThrow()
    expect(() => required(null, 'string' as any)).toThrow()
  })
  it('email', () => {
    expect(email('', true)).toBeNull()
    expect(email('tauno@gmail.com', true)).toBeNull()
    expect(email('tauno@gmail.fi', true)).toBeNull()
    expect(email('antto@mail.fi', true)).toBeNull()
    expect(email('esko@hotmail.com', true)).toBeNull()

    expect(email('tauno@gmail', true)).toBeTruthy()
    expect(email('fef', true)).toBeTruthy()

    expect(() => email(null, true)).toThrowError()
    expect(() => email(12, true)).toThrowError()
    expect(() => email(undefined, true)).toThrowError()
    expect(() => email({}, true)).toThrowError()
  })
  it('minLength', () => {
    expect(minLength('1', 1)).toBeNull()
    expect(minLength('114232', 5)).toBeNull()
    // zero as rulevalue should let any string pass
    expect(minLength('', 0)).toBeNull()
    expect(minLength('fef', 0)).toBeNull()

    expect(minLength('1212', 5)).toBeTruthy()
    expect(minLength('10420042024042', 100)).toBeTruthy()

    expect(() => minLength(null, 12)).toThrowError()
    expect(() => minLength(undefined, 0)).toThrowError()
    expect(() => minLength(12, 12)).toThrowError()
  })
  it('maxLength', () => {
    expect(maxLength('1', 2)).toBeNull()
    expect(maxLength('114232', 10)).toBeNull()
    expect(maxLength('', 0)).toBeNull()
    // zero as rulevalue should let any string pass

    expect(maxLength('1212342', 5)).toBeTruthy()
    expect(maxLength('10420042024042', 10)).toBeTruthy()

    expect(() => maxLength(null, 12)).toThrowError()
    expect(() => maxLength(undefined, 0)).toThrowError()
    expect(() => maxLength(12, 12)).toThrowError()
  })
  it('booleanMatches', () => {
    expect(booleanMatches(true, true)).toBeNull()
    expect(booleanMatches(true, false)).toStrictEqual(false)

    expect(() => maxLength(null, 12)).toThrowError()
    expect(() => maxLength(undefined, 0)).toThrowError()
    expect(() => maxLength(12, 12)).toThrowError()
  })
  it('numberMatches', () => {
    expect(numberMatches(5, 5)).toBeNull()
    expect(numberMatches(5, 6)).toBeTruthy()
    expect(() => numberMatches('gkeo', 12)).toThrowError()
  })
  it('stringMatches', () => {
    expect(stringMatches('fekkof', 'fekkof')).toBeNull()
    expect(stringMatches('gkoe', 'good form')).toBeTruthy()
    expect(() => stringMatches('gkeo', 12 as any)).toThrowError()
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
})
