const L: any = require('partial.lenses')
import * as _ from 'lodash'

const wrappedTypeName = 'oTMiaY58D7'

export function wrapValue(value: number | string | boolean) {
  return {
    rules: [],
    touched: false,
    ref: null,
    type: wrappedTypeName,
    value
  }
}

export function isWrappedValue(o: any) {
  return o.type && o.type === wrappedTypeName
}
export function unWrapValue(wrapped: any) {
  return wrapped.value
}

export const wrappedValues = L.compose(
  L.lazy((rec: any) => {
    return L.ifElse(_.isObject, L.ifElse(isWrappedValue, L.optional, [L.children, rec]), L.optional)
  }),
  L.when(isWrappedValue)
)

export const wrappedIso = L.iso(L.modify(L.leafs, wrapValue), L.modify(wrappedValues, unWrapValue))
