import { URIValue } from '@rheactorjs/value-objects'
import { Model, ModelType } from './model'
import { MaybeDateType, NonEmptyStringType } from './types'
import { MaybeLinkListJSONType } from './link'
import { maybe, irreducible, struct } from 'tcomb'
import { ID, IDJSONType, IDType } from './id'

export class Entity extends Model {
  /**
   * @param {{$id: ID, $context: URIValue, $createdAt: Date|undefined, $updatedAt: Date|undefined, $deletedAt: Date|undefined}} fields
   */
  constructor (fields) {
    super(fields)
    this.$id = IDType(fields.$id, ['Entity', '$id:ID'])
    this.$createdAt = MaybeDateType(fields.$createdAt, ['Entity', '$createdAt:?Date'])
    this.$updatedAt = MaybeDateType(fields.$updatedAt, ['Entity', '$updatedAt:?Date'])
    this.$deletedAt = MaybeDateType(fields.$deletedAt, ['Entity', '$deletedAt:?Date'])
  }

  /**
   * Whether this Aggregate has been deleted
   *
   * @returns {boolean}
   */
  get $deleted () {
    return this.$deletedAt !== undefined
  }

  /**
   * @returns {{$id: {uuid: String, url: String}, $context: String, $links: Array<Link>, $createdAt: String|undefined, $updatedAt: String|undefined, $deletedAt: String|undefined}}
   */
  toJSON () {
    return Object.assign(
      super.toJSON(),
      {
        $id: this.$id.toJSON(),
        $createdAt: this.$createdAt ? this.$createdAt.toISOString() : undefined,
        $updatedAt: this.$updatedAt ? this.$updatedAt.toISOString() : undefined,
        $deletedAt: this.$deletedAt ? this.$deletedAt.toISOString() : undefined
      }
    )
  }

  /**
   * @param {{$id: {uuid: String, url: String}, $context: String, $links: Array<Link>, $createdAt: String|undefined, $updatedAt: String|undefined, $deletedAt: String|undefined}} data
   * @returns {Entity}
   */
  static fromJSON (data) {
    EntityJSONType(data)
    return new Entity(Object.assign(
      super.fromJSON(data), {
        $id: ID.fromJSON(data.$id),
        $context: new URIValue(data.$context),
        $createdAt: data.$createdAt ? new Date(data.$createdAt) : undefined,
        $updatedAt: data.$updatedAt ? new Date(data.$updatedAt) : undefined,
        $deletedAt: data.$deletedAt ? new Date(data.$deletedAt) : undefined
      })
    )
  }

  /**
   * Returns the timestamp when the model was modified the last time, which is the latest value of
   * createdAt, updatedAt or deletedAt
   *
   * @returns {Date|undefined}
   */
  get $modifiedAt () {
    if (this.$deletedAt) {
      return this.$deletedAt
    }
    if (this.$updatedAt) {
      return this.$updatedAt
    }
    return this.$createdAt
  }
}

export const EntityType = irreducible('EntityType', x => {
  ModelType(x, 'EntityType()', 'x:Model')
  return '$id' in x &&
    '$createdAt' in x &&
    '$updatedAt' in x &&
    '$deletedAt' in x &&
    '$modifiedAt' in x
})
export const MaybeEntityType = maybe(EntityType)
export const EntityJSONType = struct({
  $context: NonEmptyStringType,
  $id: IDJSONType,
  $createdAt: maybe(NonEmptyStringType),
  $updatedAt: maybe(NonEmptyStringType),
  $deletedAt: maybe(NonEmptyStringType),
  $links: MaybeLinkListJSONType
}, 'EntityJSONType')
export const MaybeEntityJSONType = maybe(EntityJSONType)
