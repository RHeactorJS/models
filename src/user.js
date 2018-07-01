import {ImmutableAggregate} from './immutable-aggregate'
import { MaybeStringType, VersionNumberType, MaybeVersionNumberType, MaybeBooleanType, NonEmptyStringType } from './types'
import {MaybeLinkListJSONType} from './link'
import {EmailValue, EmailValueType, URIValue, MaybeURIValueType} from '@rheactorjs/value-objects'
import {Any as AnyType, Boolean as BooleanType, dict, maybe, refinement, irreducible, struct} from 'tcomb'
import { IDJSONType } from './id'
const PreferencesType = dict(NonEmptyStringType, AnyType)

const $context = new URIValue('https://github.com/RHeactorJS/models#User')
const $contextVersion = 2

export class User extends ImmutableAggregate {
  /**
   * @param {{$id: ID, $version: Number, $createdAt: Date|undefined, $updatedAt: Date|undefined, $deletedAt: Date|undefined, email: EmailValue, name: String|undefined, avatar: URIValue|undefined, superUser: Boolean|undefined, active: Boolean|undefined, preferences: Object|undefined}} fields
   */
  constructor (fields) {
    super(Object.assign(fields, {$context, $contextVersion}))

    this.email = EmailValueType(fields.email, ['User', 'email:EmailValue'])
    this.name = NonEmptyStringType(fields.name, ['User', 'name:String'])
    this.avatar = MaybeURIValueType(fields.avatar, ['User', 'avatar:?URIValue'])
    this.superUser = BooleanType(fields.superUser || false, ['User', 'superUser:Boolean'])
    this.active = BooleanType(fields.active || false, ['User', 'active:Boolean'])
    this.preferences = PreferencesType(fields.preferences || {}, ['User', 'preferences:Map(String: Any)'])
  }

  /**
   * @returns {{$id: {uuid: String, url: String}, $version: Number, $context: String, $contextVersion: Number, $links: Array<Link>, $createdAt: String|undefined, $updatedAt: String|undefined, $deletedAt: String|undefined, email: String, name: String|undefined, avatar: String|undefined, superUser: Boolean|undefined, active: Boolean|undefined, preferences: String}}
   */
  toJSON () {
    return Object.assign(
      super.toJSON(),
      {
        email: this.email.toString(),
        name: this.name,
        avatar: this.avatar ? this.avatar.toString() : undefined,
        superUser: this.superUser,
        active: this.active,
        preferences: JSON.stringify(this.preferences)
      }
    )
  }

  /**
   * @param {{$id: {uuid: String, url: String}, $context: String, $links: Array<Link>, $createdAt: String|undefined, $updatedAt: String|undefined, $deletedAt: String|undefined, email: String, name: String|undefined, avatar: String|undefined, superUser: Boolean|undefined, active: Boolean|undefined, preferences: String}} data
   * @returns {Entity}
   */
  static fromJSON (data) {
    UserJSONType(data)
    return new User(Object.assign(
      super.fromJSON(data), {
        email: new EmailValue(data.email),
        name: data.name,
        avatar: data.avatar ? new URIValue(data.avatar) : undefined,
        superUser: data.superUser,
        active: data.active,
        preferences: JSON.parse(data.preferences)
      })
    )
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

export const UserType = irreducible('UserType', x => x.constructor.name === User.name && '$context' in x && x.$context.toString() === $context.toString() && '$contextVersion' in x && x.$contextVersion === $contextVersion)
export const MaybeUserType = maybe(UserType)
export const UserJSONType = struct({
  $context: refinement(NonEmptyStringType, s => s === User.$context.toString(), 'UserContext'),
  $contextVersion: MaybeVersionNumberType,
  $id: IDJSONType,
  $version: VersionNumberType,
  $createdAt: NonEmptyStringType,
  $updatedAt: MaybeStringType,
  $deletedAt: MaybeStringType,
  email: NonEmptyStringType,
  name: NonEmptyStringType,
  avatar: MaybeStringType,
  superUser: MaybeBooleanType,
  active: MaybeBooleanType,
  preferences: NonEmptyStringType,
  $links: MaybeLinkListJSONType
}, 'UserJSONType')
export const MaybeUserJSONType = maybe(UserJSONType)
