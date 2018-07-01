import {URIValue, URIValueType} from '@rheactorjs/value-objects'
import { MaybeVersionNumberType, NonEmptyStringType } from './types'
import {EntityType} from './entity'
import {maybe, refinement, irreducible, struct} from 'tcomb'
import { ID, IDJSONType, IDType } from './id'

const $context = new URIValue('https://github.com/RHeactorJS/models#Reference')
const $contextVersion = 1

export class Reference {
  /**
   * @param {ID} $id The id of the referenced item, which also contains the URL to retrieve the reference
   * @param {URIValue} subject The context of the referenced item
   */
  constructor ($id, subject) {
    this.$context = $context
    this.$contextVersion = $contextVersion
    this.$id = IDType($id, ['Reference', '$id:ID'])
    this.subject = URIValueType(subject, ['Reference', 'subject:URIValue'])
  }

  /**
   * @param {Entity} entity
   * @returns {Reference}
   */
  static fromEntity (entity) {
    EntityType(entity, ['Reference', 'fromEntity()', 'entity:Entity'])
    return new Reference(entity.$id, entity.$context)
  }

  /**
   * @returns {{$context: String, $contextVersion: Number, subject: String, $id: {uuid: String, url: String}}}}
   */
  toJSON () {
    return {
      $context: this.$context.toString(),
      $contextVersion: this.$contextVersion,
      subject: this.subject.toString(),
      $id: this.$id.toJSON()
    }
  }

  /**
   * @param {{$context: String, subject: String, $id: {uuid: String, url: String}}} data
   * @returns {Reference}
   */
  static fromJSON (data) {
    ReferenceJSONType(data)
    const {$id, subject} = data
    return new Reference(ID.fromJSON($id), new URIValue(subject))
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

export const ReferenceType = irreducible('ReferenceType', x => x.constructor.name === Reference.name && '$context' in x && x.$context.toString() === $context.toString() && '$contextVersion' in x && x.$contextVersion === $contextVersion)
export const MaybeReferenceType = maybe(ReferenceType)
export const ReferenceJSONType = struct({
  $context: refinement(NonEmptyStringType, s => s === Reference.$context.toString(), 'ReferenceContext'),
  $contextVersion: MaybeVersionNumberType,
  subject: NonEmptyStringType,
  $id: IDJSONType
}, 'ReferenceJSONType')
export const MaybeReferenceJSONType = maybe(ReferenceJSONType)
