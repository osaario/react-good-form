import { required, email, minLength, maxLength } from '../src/formrules'

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
})
