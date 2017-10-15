/* global describe expect, it */

import {Entity, EntityType, MaybeEntityType, MaybeEntityJSONType} from '../src'
import {URIValue} from '@rheactorjs/value-objects'

const $context = new URIValue('http://example.com/jsonld/some')

function validateEntity (entity) {
  EntityType(entity)
  expect(entity.$id.equals(new URIValue('http://example.com/some-id'))).toEqual(true)
  expect(entity.$context.equals($context)).toEqual(true)
  expect(entity.$createdAt.toISOString()).toEqual(new Date('2016-01-01T00:00:00Z').toISOString())
  expect(entity.$updatedAt.toISOString()).toEqual(new Date('2016-01-02T00:00:00Z').toISOString())
  expect(entity.$deletedAt.toISOString()).toEqual(new Date('2016-01-03T00:00:00Z').toISOString())
  expect(entity.$links).toEqual([])
}
describe('Entity', () => {
  describe('constructor()', () => {
    it('should accept values', () => {
      const entity = new Entity({
        $id: new URIValue('http://example.com/some-id'),
        $context: $context,
        $createdAt: new Date('2016-01-01T00:00:00Z'),
        $updatedAt: new Date('2016-01-02T00:00:00Z'),
        $deletedAt: new Date('2016-01-03T00:00:00Z')
      })
      validateEntity(entity)
    })
    it('should parse it\'s own values', () => {
      const entity = new Entity({
        $id: new URIValue('http://example.com/some-id'),
        $context: $context,
        $createdAt: new Date('2016-01-01T00:00:00Z'),
        $updatedAt: new Date('2016-01-02T00:00:00Z'),
        $deletedAt: new Date('2016-01-03T00:00:00Z')
      })
      const entity2 = new Entity({
        $id: entity.$id,
        $context: entity.$context,
        $createdAt: entity.$createdAt,
        $updatedAt: entity.$updatedAt,
        $deletedAt: entity.$deletedAt
      })
      validateEntity(entity2)
    })
  })

  describe('JSON', () => {
    it('should parse it\'s JSON representation', () => {
      const entity = Entity.fromJSON(JSON.parse(JSON.stringify(new Entity({
        $id: new URIValue('http://example.com/some-id'),
        $context: $context,
        $createdAt: new Date('2016-01-01T00:00:00Z'),
        $updatedAt: new Date('2016-01-02T00:00:00Z'),
        $deletedAt: new Date('2016-01-03T00:00:00Z')
      }))))
      validateEntity(entity)
    })
  })

  describe('.$modifiedAt', () => {
    it('should return $createdAt if defined', () => {
      const entity = new Entity({
        $id: new URIValue('http://example.com/some-id'),
        $context: $context,
        $createdAt: new Date('2016-01-01T00:00:00Z')
      })
      expect(entity.$modifiedAt.toISOString()).toEqual(new Date('2016-01-01T00:00:00Z').toISOString())
    })
    it('should return $updatedAt if defined', () => {
      const entity = new Entity({
        $id: new URIValue('http://example.com/some-id'),
        $context: $context,
        $updatedAt: new Date('2016-01-02T00:00:00Z')
      })
      expect(entity.$modifiedAt.toISOString()).toEqual(new Date('2016-01-02T00:00:00Z').toISOString())
    })
    it('should return $deletedAt if defined', () => {
      const entity = new Entity({
        $id: new URIValue('http://example.com/some-id'),
        $context: $context,
        $deletedAt: new Date('2016-01-03T00:00:00Z')
      })
      expect(entity.$modifiedAt.toISOString()).toEqual(new Date('2016-01-03T00:00:00Z').toISOString())
    })
  })
})

describe('MaybeEntityType', () => {
  it('should accept empty value', () => {
    MaybeEntityType()
  })
  it('should accept correct value', () => {
    MaybeEntityType(new Entity({$id: new URIValue('http://example.com/some-id'), $context: new URIValue('http://example.com')}))
  })
})

describe('MaybeEntityJSONType', () => {
  it('should accept empty value', () => {
    MaybeEntityJSONType()
  })
  it('should accept correct value', () => {
    MaybeEntityJSONType(new Entity({$id: new URIValue('http://example.com/some-id'), $context: new URIValue('http://example.com')}).toJSON())
  })
})
