import { wrappedIso, wrappedValuesLens, getIndexesFor } from '../src/lenshelpers'
import * as _ from 'lodash'
const L: any = require('partial.lenses')

/**
 * Dummy test
 */
const initialPerson = {
  name: 'Hank Da Silva',
  email: 'hank@timma.fi',
  favoriteHockeyTeam: '',
  age: null as null | number,
  address: {
    street: 'Bourbon st',
    city: 'New Orleans',
    postalCode: '0000'
  },
  pets: [
    {
      nickName: 'Rufus'
    }
  ] as { nickName: string }[]
}

describe('Lens helpers tests', () => {
  const wrappedPerson = L.get(wrappedIso, initialPerson)
  const unWrappedPerson = L.get(L.inverse(wrappedIso), wrappedPerson)
  console.log({ unWrappedPerson })
  it('Basic matching', () => {
    expect(wrappedPerson.name.value).toEqual('Hank Da Silva')
    expect(unWrappedPerson.name).toEqual('Hank Da Silva')

    expect(wrappedPerson.address.city.value).toEqual('New Orleans')
    expect(unWrappedPerson.address.city).toEqual('New Orleans')

    expect(wrappedPerson.pets[0].nickName.value).toEqual('Rufus')
    expect(unWrappedPerson.pets[0].nickName).toEqual('Rufus')
  })
  it('Has all fields matching', () => {
    expect(wrappedPerson.name.touched).toBe(false)
    expect(wrappedPerson.name.rules).toEqual([])
    expect(wrappedPerson.address.city.rules).toEqual([])
    expect(wrappedPerson.address.city.touched).toEqual(false)
    expect(wrappedPerson.pets[0].nickName.touched).toEqual(false)
  })

  it('See if partial unwrapping maintains equality', () => {
    expect(L.get(L.inverse(wrappedIso), wrappedPerson.address)).toEqual(unWrappedPerson.address)
    expect(L.get(L.inverse(wrappedIso), wrappedPerson.pets)).toEqual(unWrappedPerson.pets)
    expect(L.get(L.inverse(wrappedIso), wrappedPerson.pets)[0]).toEqual(unWrappedPerson.pets[0])
    expect(L.get(['pets', L.inverse(wrappedIso)], wrappedPerson)[0]).toEqual(unWrappedPerson.pets[0])
  })
  it('Setting stuff with iso ', () => {
    const newWrapped = L.set(['address', 'street'], L.get(wrappedIso, 'Porvoonkatu'), wrappedPerson)
    expect(newWrapped).toBeTruthy()
    expect(newWrapped.address.street.value).toEqual('Porvoonkatu')

    expect(L.get(L.inverse(wrappedIso), newWrapped.address) !== unWrappedPerson.address).toBeTruthy()
  })
  it('Changing old stuff', () => {
    let _wrappedPerson = L.set(['address', 'street', 'touched'], true, wrappedPerson)
    expect(_wrappedPerson.address.street.touched).toEqual(true)

    _wrappedPerson = L.set(['address', 'street', wrappedValuesLens], 'Porvoonkatu', _wrappedPerson)

    console.log(_wrappedPerson)
    expect(_wrappedPerson.address.street.touched).toBe(true)
    expect(_wrappedPerson.address.street.value).toBe('Porvoonkatu')
    //L.set(['address', 'street', wrappedValues2], 'Porvoonkatu', _wrappedPerson)
  })
  it('Adding new stuff', () => {
    let _wrappedPerson = L.set(['address', 'street', 'touched'], true, wrappedPerson)
    expect(_wrappedPerson.address.street.touched).toEqual(true)

    _wrappedPerson = L.set(['address', 'house', wrappedValuesLens], '2 B', _wrappedPerson)

    console.log(_wrappedPerson)
    expect(_wrappedPerson.address.street.touched).toBe(true)
    expect(_wrappedPerson.address.house.value).toBe('2 B')
    expect(_wrappedPerson.address.house.touched).toBe(false)
    expect(_wrappedPerson.address.house.rules).toEqual([])
    //L.set(['address', 'street', wrappedValues2], 'Porvoonkatu', _wrappedPerson)
  })
  it('Assigining stuff', () => {
    const indexes = getIndexesFor({ house: '2 B', city: 'Porvoo' })
    console.log({ indexes })

    const _wrappedPerson = indexes.reduce((acc: any, val: any) => {
      return L.set(['address', val[0], wrappedValuesLens], val[1], acc)
    }, wrappedPerson)
    console.log(_wrappedPerson)

    expect(_wrappedPerson.address.house.value).toBe('2 B')
    expect(_wrappedPerson.address.city.value).toBe('Porvoo')
    expect(_wrappedPerson.address.house.touched).toBe(false)
    expect(_wrappedPerson.address.house.rules).toEqual([])
    //L.set(['address', 'street', wrappedValues2], 'Porvoonkatu', _wrappedPerson)
  })
  it('Assigining  check mod stuff', () => {
    const indexes = getIndexesFor({ house: '2 B', city: 'Porvoo' })
    console.log({ indexes })

    const _wrappedPerson = indexes.reduce((acc: any, val: any) => {
      return L.set(['address', val[0], wrappedValuesLens], val[1], acc)
    }, wrappedPerson)
    console.log(_wrappedPerson)

    expect(_wrappedPerson.address.house.value).toBe('2 B')
    expect(_wrappedPerson.address.city.value).toBe('Porvoo')
    expect(_wrappedPerson.address.house.touched).toBe(false)
    expect(_wrappedPerson.address.house.rules).toEqual([])
    //L.set(['address', 'street', wrappedValues2], 'Porvoonkatu', _wrappedPerson)
  })
})
