/* global describe expect, it */

import {Reference, ReferenceType, MaybeReferenceType, MaybeReferenceJSONType, Entity, ImmutableAggregate} from '../src'
import {URIValue} from '@rheactorjs/value-objects'

function validateReference (reference) {
  ReferenceType(reference)
  expect(reference.$id.equals(new URIValue('http://example.com/some-item/42'))).toEqual(true)
  expect(reference.subject.equals(new URIValue('http://example.com/jsonld/some'))).toEqual(true)
  expect(reference.$context.equals(Reference.$context)).toEqual(true)
}
describe('Reference', () => {
  describe('constructor()', () => {
    it('should accept values', () => {
      const reference = new Reference(new URIValue('http://example.com/some-item/42'), new URIValue('http://example.com/jsonld/some'))
      validateReference(reference)
    })
    it('should parse it\'s own values', () => {
      const reference = new Reference(
        new URIValue('http://example.com/some-item/42'),
        new URIValue('http://example.com/jsonld/some')
      )
      const reference2 = new Reference(
        reference.$id,
        reference.subject
      )
      validateReference(reference2)
    })
  })

  describe('JSON', () => {
    it('should parse it\'s JSON representation', () => {
      const reference = Reference.fromJSON(JSON.parse(JSON.stringify(new Reference(new URIValue('http://example.com/some-item/42'), new URIValue('http://example.com/jsonld/some')))))
      validateReference(reference)
    })
  })

  describe('$context', () => {
    it('should exist', () => {
      expect(Reference.$context.toString()).toEqual('https://github.com/RHeactorJS/models#Reference')
    })
  })

  describe('fromEntity()', () => {
    it('should create an instance from an entity', () => {
      const entity = new Entity({
        $id: new URIValue('http://example.com/some-item/42'),
        $context: new URIValue('http://example.com/jsonld/some')
      })
      validateReference(Reference.fromEntity(entity))
    })

    it('should create an instance from an aggregate', () => {
      const aggregate = new ImmutableAggregate({
        $id: new URIValue('http://example.com/some-item/42'),
        $context: new URIValue('http://example.com/jsonld/some'),
        $version: 17,
        $createdAt: new Date('2016-01-01T00:00:00Z')
      })
      validateReference(Reference.fromEntity(aggregate))
    })
  })
})

describe('MaybeReferenceType', () => {
  it('should accept empty value', () => {
    MaybeReferenceType()
  })
  it('should accept correct value', () => {
    MaybeReferenceType(new Reference(
      new URIValue('http://example.com/some-item/42'),
      new URIValue('http://example.com/jsonld/some')
    ))
  })
})

describe('MaybeReferenceJSONType', () => {
  it('should accept empty value', () => {
    MaybeReferenceJSONType()
  })
  it('should accept correct value', () => {
    MaybeReferenceJSONType(new Reference(
      new URIValue('http://example.com/some-item/42'),
      new URIValue('http://example.com/jsonld/some')
    ).toJSON())
  })
})
