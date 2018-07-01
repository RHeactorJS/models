import { URIValue, UUIDValue } from '@rheactorjs/value-objects'
import { NonEmptyStringType } from './types'
import { irreducible, struct } from 'tcomb'

export class ID {
  constructor (uuid, url) {
    this.url = new URIValue(url)
    this.uuid = new UUIDValue(uuid)
  }

  toJSON () {
    return {
      url: this.url.toString(),
      uuid: this.uuid.toString()
    }
  }

  static fromJSON (data) {
    IDJSONType(data)
    return new ID(data.uuid, data.url)
  }

  equals (id) {
    const {url, uuid} = IDType(id, ['ID.equals(id:ID)'])
    return `${url}` === `${this.url}` && `${uuid}` === `${this.uuid}`
  }
}

export const IDType = irreducible('IDType', x => x && x.constructor.name === ID.name && 'url' in x && 'uuid' in x)
export const IDJSONType = struct({
  url: NonEmptyStringType,
  uuid: NonEmptyStringType
}, 'IDJSONType')
