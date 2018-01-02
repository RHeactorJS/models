import {Date as DateType, maybe, refinement, irreducible, struct} from 'tcomb'
import {URIValue} from '@rheactorjs/value-objects'
import {Model} from './model'
import { MaybeVersionNumberType, NonEmptyStringType } from './types'

const $context = new URIValue('https://github.com/RHeactorJS/models#Status')
const $contextVersion = 1

export class Status extends Model {
  /**
   * @param {String} status
   * @param {Date} time
   * @param {String} version
   */
  constructor (status, time, version) {
    super({$context, $contextVersion})
    this.status = NonEmptyStringType(status)
    this.time = DateType(time)
    this.version = NonEmptyStringType(version)
  }

  /**
   * @returns {{status: String, time: String, version: String, $context: String, $contextVersion: Number}}
   */
  toJSON () {
    return Object.assign(
      super.toJSON(),
      {
        status: this.status,
        time: this.time.toISOString(),
        version: this.version
      }
    )
  }

  /**
   * @param {{status: String, time: Date}} data
   * @returns {Status}
   */
  static fromJSON (data) {
    StatusJSONType(data)
    const {status, time, version} = data
    return new Status(status, new Date(time), version)
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

export const StatusType = irreducible('StatusType', x => x.constructor.name === Status.name && '$context' in x && x.$context.toString() === $context.toString() && '$contextVersion' in x && x.$contextVersion === $contextVersion)
export const MaybeStatusType = maybe(StatusType)
export const StatusJSONType = struct({
  $context: refinement(NonEmptyStringType, s => s === Status.$context.toString(), 'StatusContext'),
  $contextVersion: MaybeVersionNumberType,
  status: NonEmptyStringType,
  time: NonEmptyStringType,
  version: NonEmptyStringType
}, 'StatusJSONType')
