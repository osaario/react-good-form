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
  it('Basic matching', () => {
    expect(wrappedPerson.name.value).toEqual('Hank Da Silva')
    expect(unWrappedPerson.name).toEqual('Hank Da Silva')

    expect(wrappedPerson.address.city.value).toEqual('New Orleans')
    expect(unWrappedPerson.address.city).toEqual('New Orleans')

    expect(wrappedPerson.pets[0].nickName.value).toEqual('Rufus')
    expect(unWrappedPerson.pets[0].nickName).toEqual('Rufus')
  })

  it('See if partial unwrapping maintains refs', () => {
    expect(L.get(L.inverse(wrappedIso), wrappedPerson.address)).toEqual(unWrappedPerson.address)
    expect(L.get(L.inverse(wrappedIso), wrappedPerson.pets)).toEqual(unWrappedPerson.pets)
    expect(L.get(L.inverse(wrappedIso), wrappedPerson.pets)[0]).toEqual(unWrappedPerson.pets[0])
  })
})
