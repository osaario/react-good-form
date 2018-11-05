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
  return o && o.type && o.type === wrappedTypeName
}
export function unWrapValue(wrapped: any) {
  return wrapped.value
}

export const wrappedValuesOrPrimitives = L.lazy((rec: any) => {
  return L.ifElse(_.isObject, L.ifElse(isWrappedValue, L.optional, [L.children, rec]), L.optional)
})

export const wrappedValues = L.compose(
  wrappedValuesOrPrimitives,
  L.when(isWrappedValue)
)

export const newPrimitives = L.compose(
  wrappedValuesOrPrimitives,
  L.unless(isWrappedValue)
)

export function pathsFor(object: any) {
  return L.get(L.keyed, object)
}

export function getIndexesFor(val: any) {
  return L.collectAs(
    (value: any, path: any) => [L.collect(L.flatten, path), value],
    L.lazy((rec: any) => L.ifElse(_.isObject, [L.joinIx(L.children), rec], [])),
    val
  )
}

export const wrappedValuesLens = L.ifElse(
  isWrappedValue,
  ['value'],
  [L.define({ rules: [], touched: false, ref: null, type: wrappedTypeName }), 'value']
)

export const wrappedIso = L.iso(L.modify(L.leafs, wrapValue), L.modify(wrappedValues, unWrapValue))
