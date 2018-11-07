const L: any = require('partial.lenses')

export const wrappedTypeName = 'oTMiaY58D7'
const isObject = (val: any) => typeof val === 'object'

export function isWrappedValue(o: any) {
  return o && o.type && o.type === wrappedTypeName
}

export const wrappedFieldsOrPrimitives = L.lazy((rec: any) => {
  return L.ifElse(isObject, L.ifElse(isWrappedValue, L.optional, [L.children, rec]), L.optional)
})

export const wrappedFields = L.compose(
  wrappedFieldsOrPrimitives,
  L.when(isWrappedValue)
)

export function getIndexesFor(val: any) {
  return L.collectAs(
    (value: any, path: any) => [L.collect(L.flatten, path), value],
    L.lazy((rec: any) => L.ifElse(isObject, [L.joinIx(L.children), rec], [])),
    val
  )
}
