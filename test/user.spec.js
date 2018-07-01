/* global describe expect, it */

import {User, UserType, MaybeUserType, MaybeUserJSONType, ID} from '../src'
import {URIValue, EmailValue} from '@rheactorjs/value-objects'

const $context = new URIValue('https://github.com/RHeactorJS/models#User')

function validateUser (user) {
  UserType(user)
  expect(user.$id.equals(new ID('7e8edab4-3099-4499-af60-ab29e51dbb95', 'http://example.com/7e8edab4-3099-4499-af60-ab29e51dbb95'))).toEqual(true)
  expect(user.$version).toEqual(17)
  expect(user.$deleted).toEqual(false)
  expect(user.$context.equals($context)).toEqual(true)
  expect(user.$contextVersion).toEqual(2)
  expect(user.$createdAt.toISOString()).toEqual(new Date('2016-01-01T00:00:00Z').toISOString())
  expect(user.$links).toEqual([])
  expect(user.preferences).toEqual({'foo': 'bar', 'baz': [1, 2, 3]})
}
describe('User', () => {
  describe('constructor()', () => {
    it('should accept values', () => {
      const user = new User({
        $id: new ID('7e8edab4-3099-4499-af60-ab29e51dbb95', 'http://example.com/7e8edab4-3099-4499-af60-ab29e51dbb95'),
        $version: 17,
        $context: $context,
        $createdAt: new Date('2016-01-01T00:00:00Z'),
        email: new EmailValue('john@example.com'),
        name: 'John Doe',
        preferences: {'foo': 'bar', 'baz': [1, 2, 3]}
      })
      validateUser(user)
    })
    it('should parse it\'s own values', () => {
      const user = new User({
        $id: new ID('7e8edab4-3099-4499-af60-ab29e51dbb95', 'http://example.com/7e8edab4-3099-4499-af60-ab29e51dbb95'),
        $version: 17,
        $context: $context,
        $createdAt: new Date('2016-01-01T00:00:00Z'),
        email: new EmailValue('john@example.com'),
        name: 'John Doe',
        preferences: {'foo': 'bar', 'baz': [1, 2, 3]}
      })
      const user2 = new User({
        $id: user.$id,
        $version: 17,
        $context: user.$context,
        $createdAt: user.$createdAt,
        email: user.email,
        name: user.name,
        preferences: {'foo': 'bar', 'baz': [1, 2, 3]}
      })
      validateUser(user2)
    })
  })

  describe('updated() (inherited from Aggregate)', () => {
    it('should create a new instance', () => {
      const user = new User({
        $id: new ID('7e8edab4-3099-4499-af60-ab29e51dbb95', 'http://example.com/7e8edab4-3099-4499-af60-ab29e51dbb95'),
        $version: 17,
        $context: $context,
        $createdAt: new Date('2016-01-01T00:00:00Z'),
        email: new EmailValue('john@example.com'),
        name: 'John Doe',
        preferences: {'foo': 'bar', 'baz': [1, 2, 3]}
      })
      const updated = user.updated({})
      expect(user.$version).toEqual(17)
      expect(updated.$version).toEqual(18)
      expect(updated).not.toEqual(user)
      expect(updated.$updatedAt.getTime()).toBeGreaterThan(user.$createdAt.getTime())
    })
  })

  describe('JSON', () => {
    it('should parse it\'s JSON representation', () => {
      const user = User.fromJSON(JSON.parse(JSON.stringify(new User({
        $id: new ID('7e8edab4-3099-4499-af60-ab29e51dbb95', 'http://example.com/7e8edab4-3099-4499-af60-ab29e51dbb95'),
        $version: 17,
        $context: $context,
        $createdAt: new Date('2016-01-01T00:00:00Z'),
        email: new EmailValue('john@example.com'),
        name: 'John Doe',
        preferences: {'foo': 'bar', 'baz': [1, 2, 3]}
      }))))
      validateUser(user)
    })
  })

  describe('$context', () => {
    it('should exist', () => {
      expect(User.$context.toString()).toEqual('https://github.com/RHeactorJS/models#User')
    })
  })

  describe('$contextVersion', () => {
    it('should exist', () => {
      expect(User.$contextVersion).toEqual(2)
    })
    it('should be contained in the JSON', () => {
      expect(new User({
        $id: new ID('7e8edab4-3099-4499-af60-ab29e51dbb95', 'http://example.com/7e8edab4-3099-4499-af60-ab29e51dbb95'),
        $version: 17,
        $context: $context,
        $createdAt: new Date('2016-01-01T00:00:00Z'),
        email: new EmailValue('john@example.com'),
        name: 'John Doe',
        preferences: {'foo': 'bar', 'baz': [1, 2, 3]}
      }).toJSON().$contextVersion).toEqual(2)
    })
  })
})

describe('MaybeUserType', () => {
  it('should accept empty value', () => {
    MaybeUserType()
  })
  it('should accept correct value', () => {
    MaybeUserType(new User({
      $id: new ID('7e8edab4-3099-4499-af60-ab29e51dbb95', 'http://example.com/7e8edab4-3099-4499-af60-ab29e51dbb95'),
      $version: 17,
      $context: $context,
      $createdAt: new Date('2016-01-01T00:00:00Z'),
      email: new EmailValue('john@example.com'),
      name: 'John Doe',
      preferences: {'foo': 'bar', 'baz': [1, 2, 3]}
    }))
  })
})

describe('MaybeUserJSONType', () => {
  it('should accept empty value', () => {
    MaybeUserJSONType()
  })
  it('should accept correct value', () => {
    MaybeUserJSONType(new User({
      $id: new ID('7e8edab4-3099-4499-af60-ab29e51dbb95', 'http://example.com/7e8edab4-3099-4499-af60-ab29e51dbb95'),
      $version: 17,
      $context: $context,
      $createdAt: new Date('2016-01-01T00:00:00Z'),
      email: new EmailValue('john@example.com'),
      name: 'John Doe',
      preferences: {'foo': 'bar', 'baz': [1, 2, 3]}
    }).toJSON())
  })
})
