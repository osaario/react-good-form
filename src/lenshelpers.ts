const L: any = require('partial.lenses')
import * as _ from 'lodash'
const uuid = require('uuid')

export const wrappedTypeName = 'oTMiaY58D7'

export function wrapValue(value: number | string | boolean) {
  return {
    rules: [],
    touched: false,
    ref: null,
    uuid: uuid.v4(),
    type: wrappedTypeName,
    value
  }
}

export function isWrappedValue(o: any) {
  return o && o.type && o.type === wrappedTypeName
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
