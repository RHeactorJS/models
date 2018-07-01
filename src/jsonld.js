import {Link, LinkType, Index} from './'
import {URIValue, URIValueType} from '@rheactorjs/value-objects'
import {dict, irreducible} from 'tcomb'
import {ValidationFailedError} from '@rheactorjs/errors'
import { NonEmptyStringType } from './types'

const IdMapType = dict(NonEmptyStringType, NonEmptyStringType)

export class JSONLD {
  constructor () {
    this.typeLinks = {
      index: []
    }
    this.typeMap = {}
  }

  /**
   * @param {URIValue} $context
   * @param {URIValue} uri
   */
  mapType ($context, uri) {
    URIValueType($context, ['JSONLD', 'mapType()', '$context:URIValue'])
    URIValueType(uri, ['JSONLD', 'mapType()', 'uri:URIValue'])
    this.typeMap[$context.toString()] = uri.toString()
  }

  /**
   * @param {URIValue} type
   * @param {Link} link
   */
  addLink (type, link) {
    URIValueType(type, ['JSONLD', 'addLink()', 'type:URIValue'])
    LinkType(link, ['JSONLD', 'addLink()', 'link:Link'])
    if (!this.typeLinks[type]) {
      this.typeLinks[type.toString()] = []
    }
    this.typeLinks[type.toString()].push(link)
  }

  addIndexLink (link) {
    LinkType(link)
    this.typeLinks.index.push(link)
  }

  /**
   * @param {URIValue} $context
   * @param {object} idMap
   * @returns {URIValue}
   */
  createIdLink ($context, idMap) {
    if (typeof idMap !== 'object') {
      idMap = {id: idMap}
    }
    URIValueType($context, ['JSONLD', 'createIdLink()', '$context:URIValue'])
    IdMapType(idMap, ['JSONLD', 'createIdLink()', 'idMap:Map<String: AggregateId>'])
    let href = this.typeMap[$context.toString()]
    for (const k in idMap) {
      href = href.replace(':' + k, idMap[k])
    }
    return new URIValue(href)
  }

  /**
   * @param {URIValue} $context
   * @param {URIValue} $id
   * @return String
   */
  parseIdLink ($context, $id) {
    URIValueType($context, ['JSONLD', 'parseIdLink()', '$context:URIValue'])
    URIValueType($id, ['JSONLD', 'parseIdLink()', '$id:URIValue'])
    return this.parseMultiIdLink($context, $id).id
  }

  /**
   * Parse $id link with multiple ids
   * @param {URIValue} $context
   * @param {URIValue} $id
   * @return {Object}
   * @throws ValidationFailedError if $id cannot be matched
   */
  parseMultiIdLink ($context, $id) {
    URIValueType($context, ['JSONLD', 'parseMultiIdLink()', '$context:URIValue'])
    URIValueType($id, ['JSONLD', 'parseMultiIdLink()', '$id:URIValue'])
    const template = this.typeMap[$context.toString()]
    const placeholders = template.match(/:[a-z_]+/g)
    const matches = $id.toString().match(new RegExp(template.replace(/:[a-z_]+/g, '([0-9]+)')))
    if (matches === null) throw new ValidationFailedError(`$id "${$id}" does not match template "${template}"!`)
    const ids = {}
    placeholders.map((v, k) => { ids[v.substr(1)] = matches[k + 1] })
    return ids
  }

  /**
   * @param {URIValue} $context
   * @param {object} idMap
   * @returns {Array.<Link>}
   */
  createLinks ($context, idMap) {
    if (typeof idMap !== 'object') {
      idMap = {id: idMap}
    }
    URIValueType($context, ['JSONLD', 'createLinks()', '$context:URIValue'])
    IdMapType(idMap, ['JSONLD', 'createLinks()', 'idMap:Map<String: AggregateId>'])
    return (this.typeLinks[$context.toString()] || []).map(link => {
      let href = link.href.toString()
      for (let k in idMap) {
        href = href.replace(':' + k, idMap[k])
      }
      return new Link(new URIValue(href), link.subject, link.list, link.rel)
    })
  }

  /**
   * @returns {Index}
   */
  index () {
    return new Index(this.typeLinks.index)
  }

  /**
   * Use to turn $Id urls into Strings that can be safely passed around
   *
   * @param {URIValue} id
   * @returns {String}
   */
  encodeId (id) {
    URIValueType(id, ['JSONLD', 'encodeId()', 'id:URIValue'])
    return Buffer.from(encodeURI(encodeURIComponent(id.toString())), 'binary').toString('base64')
  }
}

export const JSONLDType = irreducible('JSONLDType', x => x instanceof JSONLD)
