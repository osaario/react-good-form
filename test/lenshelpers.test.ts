import { isWrappedValue, getIndexesFor } from '../src/lenshelpers'

describe('lens helpers tests', () => {
  it('isWrappedValue', () => {
    expect(isWrappedValue('')).toBeFalsy()
  })
  it('isWrappedValue', () => {
    expect(getIndexesFor({ a: 1, b: 2 })).toEqual([[['a'], 1], [['b'], 2]])
  })
})
