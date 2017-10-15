/* global describe expect, it */

import {HttpProblem, HttpProblemType, MaybeHttpProblemType} from '../src'
import {URIValue} from '@rheactorjs/value-objects'

function validateProblem (problem) {
  HttpProblemType(problem)
  expect(problem).toBeInstanceOf(HttpProblem)
  expect(problem.type.equals(new URIValue('http://example.com'))).toEqual(true)
  expect(problem.title).toEqual('title')
  expect(problem.status).toEqual(123)
  expect(problem.detail).toEqual('detail')
}
describe('HttpProblem', function () {
  describe('constructor()', () => {
    it('should accept problem information', () => {
      const problem = new HttpProblem(new URIValue('http://example.com'), 'title', 123, 'detail')
      validateProblem(problem)
    })
    it('should parse it\'s own values', () => {
      const problem = new HttpProblem(new URIValue('http://example.com'), 'title', 123, 'detail')
      const problem2 = new HttpProblem(
        problem.type,
        problem.title,
        problem.status,
        problem.detail
      )
      validateProblem(problem2)
    })
  })

  describe('$context', () => {
    it('should exist', () => {
      expect(HttpProblem.$context.toString()).toEqual('https://www.ietf.org/id/draft-ietf-appsawg-http-problem-01.txt')
    })
  })

  describe('JSON', () => {
    it('should parse it\'s JSON representation', () => {
      const problem = HttpProblem.fromJSON(JSON.parse(JSON.stringify(new HttpProblem(new URIValue('http://example.com'), 'title', 123, 'detail'))))
      validateProblem(problem)
    })
  })
})

describe('MaybeHttpProblemType', () => {
  it('should accept empty value', () => {
    MaybeHttpProblemType()
  })
  it('should accept correct value', () => {
    MaybeHttpProblemType(new HttpProblem(new URIValue('http://example.com'), 'Error', 500))
  })
})
