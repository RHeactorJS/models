/* global describe expect test it */
import { JsonWebToken, JsonWebTokenType, MaybeJsonWebTokenType, Link, MaybeJsonWebTokenJSONType } from '../src'
import { URIValue } from '@rheactorjs/value-objects'
import jwt from 'jsonwebtoken'

const toBeWithin = (v, a, b) => expect(v).toBeGreaterThanOrEqual(a) && expect(v).toBeLessThanOrEqual(b)

function validateToken (webtoken) {
  expect(webtoken).toBeInstanceOf(JsonWebToken)
  expect(webtoken.$context.toString()).toEqual('https://tools.ietf.org/html/rfc7519')
  expect(webtoken.$contextVersion).toEqual(2)
  expect(webtoken.iss).toEqual('test')
  expect(webtoken.sub).toEqual('foo')
  const nbfTime = Date.now() - 60000
  toBeWithin(webtoken.nbf.getTime(), nbfTime - 1000, nbfTime + 1000)
  expect(webtoken.payload).toEqual({foo: 'bar'})
  const inOnHourinSeconds = Math.round((Date.now() + (60 * 60 * 1000)) / 1000)
  toBeWithin(Math.round(new Date(webtoken.exp).getTime() / 1000), inOnHourinSeconds - 10, inOnHourinSeconds + 10)
  jwt.verify(webtoken.token, 'mysecret')
}

describe('JsonWebToken', function () {
  describe('constructor', () => {
    it('should parse a token', () => {
      const token = jwt.sign({foo: 'bar'}, 'mysecret', {algorithm: 'HS256', issuer: 'test', subject: 'foo', expiresIn: 60 * 60, notBefore: -60})
      const webtoken = new JsonWebToken(token)
      validateToken(webtoken)
    })

    it('should parse it\'s own values', () => {
      const token = jwt.sign({foo: 'bar'}, 'mysecret', {algorithm: 'HS256', issuer: 'test', subject: 'foo', expiresIn: 60 * 60, notBefore: -60})
      const webtoken = new JsonWebToken(token)
      const webtoken2 = new JsonWebToken(webtoken.token)
      validateToken(webtoken2)
    })
  })

  describe('isExpired()', () => {
    it('should return true if a token is expired', () => {
      const token = jwt.sign({foo: 'bar'}, 'mysecret', {algorithm: 'HS256', issuer: 'test', subject: 'foo', expiresIn: -10})
      const webtoken = new JsonWebToken(token)
      expect(webtoken.isExpired()).toEqual(true)
    })
  })

  describe('JSON', () => {
    it('should parse it\'s JSON representation', () => {
      const token = jwt.sign({foo: 'bar'}, 'mysecret', {algorithm: 'HS256', issuer: 'test', subject: 'foo', expiresIn: 60 * 60, notBefore: -60})
      const webtoken = JsonWebToken.fromJSON(JSON.parse(JSON.stringify(new JsonWebToken(token))))
      JsonWebTokenType(webtoken)
      validateToken(webtoken)
    })
  })

  describe('$context', () => {
    it('should exist', () => {
      expect(JsonWebToken.$context.toString()).toEqual('https://tools.ietf.org/html/rfc7519')
    })
  })

  describe('$contextVersion', () => {
    it('should exist', () => {
      expect(JsonWebToken.$contextVersion).toEqual(2)
    })
    it('should be contained in the JSON', () => {
      const token = jwt.sign({foo: 'bar'}, 'mysecret', {algorithm: 'HS256', issuer: 'test', subject: 'foo', expiresIn: 60 * 60, notBefore: -60})
      expect(new JsonWebToken(token).toJSON().$contextVersion).toEqual(2)
    })
  })

  describe('$links', () => {
    describe('should parse links', () => {
      const token = jwt.sign({foo: 'bar'}, 'mysecret', {algorithm: 'HS256', issuer: 'test', subject: 'foo', expiresIn: 60 * 60, notBefore: -60})
      const webtoken = JsonWebToken.fromJSON(JSON.parse(JSON.stringify(new JsonWebToken(token, [new Link(
        new URIValue('http://127.0.0.1:8080/api/token/verify'),
        new URIValue('https://tools.ietf.org/html/rfc7519'),
        false,
        'token-verify'
      )
      ]))))
      test('it should be a link', () => {
        expect(webtoken.$links[0] instanceof Link).toEqual(true)
        expect(webtoken.$links[0].rel).toEqual('token-verify')
      })
      test('it should not be a list', () => {
        expect(webtoken.$links[0].list).toEqual(false)
      })
      test('it should be a link', () => {
        expect(webtoken.$links[0].$context.equals(Link.$context)).toEqual(true)
      })
      test('subject should match', () => {
        expect(webtoken.$links[0].subject.equals(new URIValue('https://tools.ietf.org/html/rfc7519'))).toEqual(true)
      })
      test('href should match', () => {
        expect(webtoken.$links[0].href.equals(new URIValue('http://127.0.0.1:8080/api/token/verify'))).toEqual(true)
      })
    })
  })
})

describe('MaybeJsonWebTokenType', () => {
  it('should accept empty value', () => {
    MaybeJsonWebTokenType()
  })
  it('should accept correct value', () => {
    const token = jwt.sign({foo: 'bar'}, 'mysecret', {algorithm: 'HS256', issuer: 'test', subject: 'foo', expiresIn: 60 * 60, notBefore: -60})
    MaybeJsonWebTokenType(new JsonWebToken(token))
  })
})

describe('MaybeJsonWebTokenJSONType', () => {
  it('should accept empty value', () => {
    MaybeJsonWebTokenJSONType()
  })
  it('should accept correct value', () => {
    const token = jwt.sign({foo: 'bar'}, 'mysecret', {algorithm: 'HS256', issuer: 'test', subject: 'foo', expiresIn: 60 * 60, notBefore: -60})
    MaybeJsonWebTokenJSONType(new JsonWebToken(token).toJSON())
  })
})
