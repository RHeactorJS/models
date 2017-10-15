/* global describe expect test it */

import { Link, Model, List, ListType, MaybeListType, MaybeListJSONType } from '../src'
import { URIValue } from '@rheactorjs/value-objects'

const items = [new Model({
  $context: new URIValue('http://example.com/jsonld/some'),
  $id: '17',
  from: {
    name: 'Markus Tacker',
    avatar: new URIValue('https://starhs.net/profileimgs/5d257110-49c4-45e4-b8d5-2b69abf2419d.jpg')
  },
  to: {
    name: 'Heiko Fischer',
    avatar: new URIValue('https://starhs.net/profileimgs/8651161a-ac33-4837-9c33-87997ce7bdc1.jpg')
  },
  amount: 1,
  message: 'Test'
})]

const link = new Link(
  new URIValue('http://example.com/some-item/42'),
  new URIValue('http://example.com/jsonld/some'),
  true,
  'next'
)

function validateList (list) {
  ListType(list)
  expect(list.$context.equals(List.$context)).toEqual(true)
  expect(list.itemsPerPage).toEqual(10)
  expect(list.total).toEqual(1)
  expect(list.hasNext).toEqual(true)
  expect(list.hasPrev).toEqual(false)
  expect(list.$links).toEqual([link])
  expect(list.offset).toEqual(50)
}

describe('List', () => {
  describe('constructor()', () => {
    it('should accept values', () => {
      const list = new List(items, 1, 10, [link], 50)
      validateList(list)
    })
    it('should parse it\'s own values', () => {
      const list = new List(items, 1, 10, [link], 50)
      const list2 = new List(
        list.items,
        list.total,
        list.itemsPerPage,
        list.$links,
        list.offset
      )
      validateList(list2)
    })
  })

  describe('from / to', () => {
    describe('should have the correct values on lists with offset', () => {
      [
        [new List(items, 1, 10, [link], 0), 1, 1],
        [new List(items, 9, 10, [link], 0), 1, 9],
        [new List(items, 10, 10, [link], 0), 1, 10],
        [new List(items, 11, 10, [link], 0), 1, 10],
        [new List(items, 19, 10, [link], 10), 11, 19],
        [new List(items, 20, 10, [link], 10), 11, 20],
        [new List(items, 21, 10, [link], 10), 11, 20]
      ].map(data => {
        const list = data[0]
        const from = data[1]
        const to = data[2]
        test(`list.from should equal ${from}`, () => {
          expect(list.from).toEqual(from)
        })
        test(`list.from should equal ${to}`, () => {
          expect(list.to).toEqual(to)
        })
      })
    })
    it('should be undefined on lists without offset', () => {
      const list = new List(items, 1, 10, [link])
      expect(list.from).toEqual(undefined)
      expect(list.to).toEqual(undefined)
    })
    describe('should be zero if result is empty', () => {
      const l = new List(items, 0, 10, [link], 0)
      test('from should be zero on an empty list', () => {
        expect(l.from).toEqual(0)
      })
      test('to should be zero on an empty list', () => {
        expect(l.to).toEqual(0)
      })
    })
  })

  describe('JSON', () => {
    it('should parse it\'s JSON representation', () => {
      const list = List.fromJSON(JSON.parse(JSON.stringify(new List(items, 1, 10, [link], 50))), Model.fromJSON)
      validateList(list)
    })

    describe('should always return empty item and link arrays', () => {
      let jsondata = JSON.parse(JSON.stringify(new List([], 0, 10)))
      test('if empty items given, it should be empty in JSON', () => {
        expect(jsondata.items).toBeInstanceOf(Array)
      })
      test('if empty $links given, it should be empty in JSON', () => {
        expect(jsondata.$links).toBeInstanceOf(Array)
      })
    })

    it('should allow for empty offset', () => {
      const list = List.fromJSON(JSON.parse(JSON.stringify(new List(items, 1, 10, [link]))), Model.fromJSON)
      expect(list.$context.equals(List.$context)).toEqual(true)
      expect(list.itemsPerPage).toEqual(10)
      expect(list.total).toEqual(1)
      expect(list.hasNext).toEqual(true)
      expect(list.hasPrev).toEqual(false)
      expect(list.$links).toEqual([link])
      expect(list.offset).toEqual(undefined)
    })
  })

  describe('$context', () => {
    it('should exist', () => {
      expect(List.$context.toString()).toEqual('https://github.com/RHeactorJS/models#List')
    })
  })
})

describe('MaybeListType', () => {
  it('should accept empty value', () => {
    MaybeListType()
  })
  it('should accept correct value', () => {
    MaybeListType(new List(items, 1, 10, [link]))
  })
})

describe('MaybeListJSONType', () => {
  it('should accept empty value', () => {
    MaybeListJSONType()
  })
  it('should accept correct value', () => {
    MaybeListJSONType(new List(items, 1, 10, [link]).toJSON())
  })
})
