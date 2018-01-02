import {list, maybe, refinement, irreducible, struct} from 'tcomb'
import {URIValue} from '@rheactorjs/value-objects'
import {Link, LinkType, LinkListJSONType} from './link'
import { MaybeVersionNumberType, NonEmptyStringType } from './types'

const $context = new URIValue('https://github.com/RHeactorJS/models#Index')
const $contextVersion = 1

export class Index {
  /**
   * @param {Array<Link>} links
   */
  constructor (links) {
    this.$context = $context
    this.$contextVersion = $contextVersion
    this.$links = LinkIndexType(links)
  }

  /**
   * @returns {{$context: String, $contextVersion: Number, $links: Array<Link>}}
   */
  toJSON () {
    return {
      $context: this.$context.toString(),
      $contextVersion: this.$contextVersion,
      $links: this.$links.map(link => link.toJSON())
    }
  }

  /**
   * @param {{$context: String, $links: Array<Link>}} data
   * @returns {Index}
   */
  static fromJSON (data) {
    IndexJSONType(data)
    return new Index(data.$links.map(Link.fromJSON))
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

export const LinkIndexType = list(LinkType)
export const IndexType = irreducible('IndexType', x => x.constructor.name === Index.name && '$context' in x && x.$context.toString() === $context.toString() && '$contextVersion' in x && x.$contextVersion === $contextVersion)
export const MaybeIndexType = maybe(IndexType)
export const IndexJSONType = struct({
  $context: refinement(NonEmptyStringType, s => s === Index.$context.toString(), 'IndexContext'),
  $contextVersion: MaybeVersionNumberType,
  $links: LinkListJSONType
}, 'IndexJSONType')
