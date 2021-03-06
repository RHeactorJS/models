import {Boolean as BooleanType, maybe, refinement, irreducible, struct, list} from 'tcomb'
import {URIValue, URIValueType} from '@rheactorjs/value-objects'
import { MaybeStringType, MaybeVersionNumberType, NonEmptyStringType } from './types'

const $context = new URIValue('https://github.com/RHeactorJS/models#Link')
const $contextVersion = 1

export class Link {
  /**
   * @param {URIValue} href The URL to retrieve the link
   * @param {URIValue} subject The context of the linked item
   * @param {Boolean} list True if the linked item is a list
   * @param {String} rel Label for the relation
   */
  constructor (href, subject, list = false, rel) {
    this.href = URIValueType(href, ['Link', 'href:URIValue'])
    this.subject = URIValueType(subject, ['Link', 'subject:URIValue'])
    this.list = BooleanType(list, ['Link', 'list:Boolean'])
    this.rel = MaybeStringType(rel, ['Link', 'rel:?String'])
    this.$context = $context
    this.$contextVersion = $contextVersion
  }

  /**
   * @returns {{$context: String, $contextVersion: Number, subject: String, href: String, list: Boolean|undefined, rel: String|undefined}}}
   */
  toJSON () {
    const d = {
      $context: this.$context.toString(),
      $contextVersion: this.$contextVersion,
      subject: this.subject.toString(),
      href: this.href.toString()
    }
    if (this.list) d.list = true
    if (this.rel) d.rel = this.rel
    return d
  }

  /**
   * @param {{$context: String, subject: String, href: String, list: Boolean|undefined, rel: String|undefined}} data
   * @returns {Link}
   */
  static fromJSON (data) {
    LinkJSONType(data)
    const {href, subject, list, rel} = data
    return new Link(new URIValue(href), new URIValue(subject), list, rel)
  }

  /**
   * @returns {URIValue}
   */
  static get $context () {
    return $context
  }

  /**
   * @returns {Number}
   */
  static get $contextVersion () {
    return $contextVersion
  }
}

export const LinkType = irreducible('LinkType', x => x.constructor.name === Link.name && '$context' in x && x.$context.toString() === $context.toString() && '$contextVersion' in x && x.$contextVersion === $contextVersion)
export const MaybeLinkType = maybe(LinkType)
export const LinkListType = list(LinkType)
export const MaybeLinkListType = maybe(LinkListType)
export const LinkJSONType = struct({
  $context: refinement(NonEmptyStringType, s => s === Link.$context.toString(), 'LinkContext'),
  $contextVersion: MaybeVersionNumberType,
  subject: NonEmptyStringType,
  href: NonEmptyStringType,
  list: maybe(BooleanType),
  rel: MaybeStringType
}, 'LinkJSONType')
export const MaybeLinkJSONType = maybe(LinkJSONType)
export const LinkListJSONType = list(LinkJSONType)
export const MaybeLinkListJSONType = maybe(LinkListJSONType)
