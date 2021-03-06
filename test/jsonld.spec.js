/* global describe expect it beforeAll */

import { Link, JSONLD } from '../'
import { URIValue } from '@rheactorjs/value-objects'
import { ValidationFailedError } from '@rheactorjs/errors'

const UserContext = new URIValue('https://github.com/RHeactorJS/models#User')
const UserTaskContext = new URIValue('https://github.com/RHeactorJS/models#UserTask')
const ContributionContext = new URIValue('https://github.com/ResourcefulHumans/netwoRHk/wiki/JsonLD#Contribution')
const CommitmentContext = new URIValue('https://github.com/ResourcefulHumans/netwoRHk/wiki/JsonLD#Commitment')
const NetworhkContext = new URIValue('https://github.com/ResourcefulHumans/netwoRHk/wiki/JsonLD#netwoRHk')

describe('jsonld', function () {
  let jsonld

  beforeAll(() => {
    jsonld = new JSONLD()
    jsonld.mapType(UserContext, new URIValue('http://example.com/api/user/:id'))
    jsonld.mapType(UserTaskContext, new URIValue('http://example.com/api/user/:id/task/:task_id'))
    jsonld.addLink(UserContext, new Link(new URIValue('http://example.com/api/user/:id/search/netwoRHk'), NetworhkContext, true))
    jsonld.addLink(ContributionContext, new Link(new URIValue('http://example.com/api/netwoRHk/:networhk_id/search/commitment?contribution=:id'), CommitmentContext, true))
  })

  describe('.createIdLink()', () => {
    it('should create an $id link', () => {
      expect(jsonld.createIdLink(UserContext, '42').equals(new URIValue('http://example.com/api/user/42'))).toEqual(true)
      expect(jsonld.createIdLink(UserContext, '17').equals(new URIValue('http://example.com/api/user/17'))).toEqual(true)
    })
    it('should accept multiple ids', () => {
      const expected = 'http://example.com/api/user/42/task/17'
      const actual = jsonld.createIdLink(UserTaskContext, {'id': '42', 'task_id': '17'}).toString()
      expect(actual).toEqual(expected)
    })
  })

  describe('.parseIdLink()', () => {
    it('should parseIdLink an $id link', () => {
      expect(jsonld.parseIdLink(UserContext, new URIValue('http://example.com/api/user/42'))).toEqual('42')
      expect(jsonld.parseIdLink(UserContext, new URIValue('http://example.com/api/user/17'))).toEqual('17')
    })
  })

  describe('.parseMultiIdLink()', () => {
    it('should parseIdLink an $id link with multiple ids', () => {
      expect(jsonld.parseMultiIdLink(UserTaskContext, new URIValue('http://example.com/api/user/42/task/17'))).toEqual({
        'id': '42',
        'task_id': '17'
      })
    })
    it('should throw an error if $id does not match the pattern', () => {
      try {
        jsonld.parseMultiIdLink(UserTaskContext, new URIValue('http://foo.com/'))
      } catch (err) {
        expect(err instanceof ValidationFailedError).toEqual(true)
      }
    })
  })

  describe('.createLinks()', () => {
    it('should create links', () => {
      const links42 = jsonld.createLinks(UserContext, '42')
      expect(links42[0].$context.equals(Link.$context)).toEqual(true)
      expect(links42[0].subject.equals(NetworhkContext)).toEqual(true)
      expect(links42[0].href.equals(new URIValue('http://example.com/api/user/42/search/netwoRHk'))).toEqual(true)
      expect(links42[0].list).toEqual(true)
      expect(links42[0].rel).toEqual(undefined)
      const links17 = jsonld.createLinks(UserContext, '17')
      expect(links17[0].$context.equals(Link.$context)).toEqual(true)
      expect(links17[0].subject.equals(NetworhkContext)).toEqual(true)
      expect(links17[0].href.equals(new URIValue('http://example.com/api/user/17/search/netwoRHk'))).toEqual(true)
      expect(links17[0].list).toEqual(true)
      expect(links17[0].rel).toEqual(undefined)
    })
    it('should create links for multiple ids', () => {
      const links = jsonld.createLinks(ContributionContext, {
        id: '17',
        networhk_id: '42'
      })
      expect(links[0].$context.equals(Link.$context)).toEqual(true)
      expect(links[0].subject.equals(CommitmentContext)).toEqual(true)
      expect(links[0].href.equals(new URIValue('http://example.com/api/netwoRHk/42/search/commitment?contribution=17'))).toEqual(true)
      expect(links[0].list).toEqual(true)
      expect(links[0].rel).toEqual(undefined)
    })
  })
})
