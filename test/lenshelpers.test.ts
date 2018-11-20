import { isWrappedValue } from '../src/lenshelpers'

describe('lens helpers tests', () => {
  it('isWrappedValue', () => {
    expect(isWrappedValue('')).toBeFalsy()
  })
})
