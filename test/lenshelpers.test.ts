import { wrappedIso } from '../src/lenshelpers'
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
    const newWrapped = L.set(['address', 'street', L.inverse(wrappedIso)], 'Porvoonkatu', wrappedPerson)
    expect(newWrapped).toBeTruthy()
    expect(newWrapped.address.street.value).toEqual('Porvoonkatu')

    expect(L.get(L.inverse(wrappedIso), newWrapped.address) !== unWrappedPerson.address).toBeTruthy()
  })
  it('Inserting new stuff with iso ', () => {
    let _wrappedPerson = L.set(['address', 'street', 'touched'], true, wrappedPerson)
    expect(_wrappedPerson.address.street.touched).toEqual(true)

    //L.set(['address', 'street', wrappedValues2], 'Porvoonkatu', _wrappedPerson)
  })
})
