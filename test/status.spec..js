/* global describe expect, it */

import {Status, StatusType, MaybeStatusType} from '../src'

const now = new Date()
function validateStatus (problem) {
  StatusType(problem)
  expect(problem).toBeInstanceOf(Status)
  expect(problem.status).toEqual('ok')
  expect(problem.time.getTime()).toEqual(now.getTime())
  expect(problem.version).toEqual('1.8.0+production.1483709132405')
}
describe('Status', function () {
  describe('constructor()', () => {
    it('should accept status', () => {
      const problem = new Status('ok', now, '1.8.0+production.1483709132405')
      validateStatus(problem)
    })
    it('should parse it\'s own values', () => {
      const problem = new Status('ok', now, '1.8.0+production.1483709132405')
      const problem2 = new Status(
        problem.status,
        problem.time,
        problem.version
      )
      validateStatus(problem2)
    })
  })

  describe('$context', () => {
    it('should exist', () => {
      expect(Status.$context.toString()).toEqual('https://github.com/RHeactorJS/models#Status')
    })
  })

  describe('JSON', () => {
    it('should parse it\'s JSON representation', () => {
      const problem = Status.fromJSON(JSON.parse(JSON.stringify(new Status('ok', now, '1.8.0+production.1483709132405'))))
      validateStatus(problem)
    })
  })
})

describe('MaybeStatusType', () => {
  it('should accept empty value', () => {
    MaybeStatusType()
  })
  it('should accept correct value', () => {
    MaybeStatusType(new Status('ok', now, '1.8.0+production.1483709132405'))
  })
})
