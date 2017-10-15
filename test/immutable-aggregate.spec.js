/* global describe expect, it */

import {ImmutableAggregate, ImmutableAggregateType, MaybeImmutableAggregateType, MaybeImmutableAggregateJSONType} from '../src'
import {URIValue} from '@rheactorjs/value-objects'

const $context = new URIValue('http://example.com/jsonld/some')

function validateImmutableAggregate (aggregate) {
  ImmutableAggregateType(aggregate)
  expect(aggregate.$id.equals(new URIValue('http://example.com/some-id'))).toEqual(true)
  expect(aggregate.$version).toEqual(17)
  expect(aggregate.$deleted).toEqual(false)
  expect(aggregate.$context.equals($context)).toEqual(true)
  expect(aggregate.$createdAt.toISOString()).toEqual(new Date('2016-01-01T00:00:00Z').toISOString())
  expect(aggregate.$links).toEqual([])
}
describe('ImmutableAggregate', () => {
  describe('constructor()', () => {
    it('should accept values', () => {
      const aggregate = new ImmutableAggregate({
        $id: new URIValue('http://example.com/some-id'),
        $version: 17,
        $context: $context,
        $createdAt: new Date('2016-01-01T00:00:00Z')
      })
      validateImmutableAggregate(aggregate)
    })
    it('should parse it\'s own values', () => {
      const aggregate = new ImmutableAggregate({
        $id: new URIValue('http://example.com/some-id'),
        $version: 17,
        $context: $context,
        $createdAt: new Date('2016-01-01T00:00:00Z')
      })
      const aggregate2 = new ImmutableAggregate({
        $id: aggregate.$id,
        $version: 17,
        $context: aggregate.$context,
        $createdAt: new Date('2016-01-01T00:00:00Z')
      })
      validateImmutableAggregate(aggregate2)
    })
  })

  describe('updated()', () => {
    it('should create a new instance', () => {
      const aggregate = new ImmutableAggregate({
        $id: new URIValue('http://example.com/some-id'),
        $version: 17,
        $context: $context,
        $createdAt: new Date('2016-01-01T00:00:00Z')
      })
      const updated = aggregate.updated({foo: 'bar'})
      expect(aggregate.$version).toEqual(17)
      expect(updated.$version).toEqual(18)
      expect(updated).not.toEqual(aggregate)
      expect(updated.$updatedAt.getTime()).toBeGreaterThan(aggregate.$createdAt.getTime())
    })

    it('should apply props', () => {
      class Some extends ImmutableAggregate {
        constructor (fields) {
          super(Object.assign(fields, {$context}))
          this.foo = fields.foo
        }

        toJSON () {
          return Object.assign(
            super.toJSON(),
            {
              foo: this.foo
            }
          )
        }

        static fromJSON (data) {
          return new Some(Object.assign(
            super.fromJSON(data), {
              foo: data.foo
            })
          )
        }
      }
      const s = new Some({foo: 'bar', $version: 1, $createdAt: new Date(), $id: new URIValue('http://example.com/some-id')})
      const u = s.updated({foo: 'baz'})
      expect(s).not.toEqual(u)
      expect(u.$version).toEqual(2)
      expect(s.foo).toEqual('bar')
      expect(u.foo).toEqual('baz')
    })
  })

  describe('updated()', () => {
    it('should create a new instance', () => {
      const aggregate = new ImmutableAggregate({
        $id: new URIValue('http://example.com/some-id'),
        $version: 17,
        $context: $context,
        $createdAt: new Date('2016-01-01T00:00:00Z')
      })
      const deleted = aggregate.deleted()
      expect(aggregate.$version).toEqual(17)
      expect(deleted.$deleted).toEqual(true)
      expect(deleted.$version).toEqual(18)
      expect(deleted).not.toEqual(aggregate)
      expect(deleted.$deletedAt.getTime()).toBeGreaterThan(aggregate.$createdAt.getTime())
    })
  })

  describe('JSON', () => {
    it('should parse it\'s JSON representation', () => {
      const aggregate = ImmutableAggregate.fromJSON(JSON.parse(JSON.stringify(new ImmutableAggregate({
        $id: new URIValue('http://example.com/some-id'),
        $version: 17,
        $context: $context,
        $createdAt: new Date('2016-01-01T00:00:00Z')
      }))))
      validateImmutableAggregate(aggregate)
    })
  })
})

describe('MaybeImmutableAggregateType', () => {
  it('should accept empty value', () => {
    MaybeImmutableAggregateType()
  })
  it('should accept correct value', () => {
    MaybeImmutableAggregateType(new ImmutableAggregate({
      $id: new URIValue('http://example.com/some-id'),
      $version: 1,
      $createdAt: new Date(),
      $context: new URIValue('http://example.com')
    }))
  })
})

describe('MaybeImmutableAggregateJSONType', () => {
  it('should accept empty value', () => {
    MaybeImmutableAggregateJSONType()
  })
  it('should accept correct value', () => {
    MaybeImmutableAggregateJSONType(new ImmutableAggregate({
      $id: new URIValue('http://example.com/some-id'),
      $version: 1,
      $createdAt: new Date(),
      $context: new URIValue('http://example.com')
    }).toJSON())
  })
})
