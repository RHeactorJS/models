/* global describe expect, it */

import {Model, ModelType, MaybeModelType, MaybeModelJSONType} from '../src'
import {URIValue} from '@rheactorjs/value-objects'

const $context = new URIValue('http://example.com/jsonld/some')

function validateModel (model) {
  ModelType(model)
  expect(model.$context.equals($context)).toEqual(true)
  expect(model.$links).toEqual([])
}
describe('Model', () => {
  describe('constructor()', () => {
    it('should accept values', () => {
      const model = new Model({$context})
      validateModel(model)
    })
    it('should parse it\'s own values', () => {
      const model = new Model({$context})
      const model2 = new Model({
        $context: model.$context
      })
      validateModel(model2)
    })
  })

  describe('JSON', () => {
    it('should parse it\'s JSON representation', () => {
      const model = Model.fromJSON(JSON.parse(JSON.stringify(new Model({$context}))))
      validateModel(model)
    })
  })

  describe('$contextVersion', () => {
    it('should default to 1', () => {
      const model = new Model({$context})
      expect(model.$contextVersion).toEqual(1)
    })
    it('should use provided $contextVersion', () => {
      const model = new Model({$context, $contextVersion: 2})
      expect(model.$contextVersion).toEqual(2)
    })
  })
})

describe('MaybeModelType', () => {
  it('should accept empty value', () => {
    MaybeModelType()
  })
  it('should accept correct value', () => {
    MaybeModelType(new Model({$context}))
  })
})

describe('MaybeModelJSONType', () => {
  it('should accept empty value', () => {
    MaybeModelJSONType()
  })
  it('should accept correct value', () => {
    MaybeModelJSONType(new Model({$context}).toJSON())
  })
})
