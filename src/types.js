import { maybe, refinement, Integer as IntegerType, Boolean as BooleanType, String as StringType, Date as DateType } from 'tcomb'

export const MaybeDateType = maybe(DateType)
export const VersionNumberType = refinement(IntegerType, n => n > 0, 'VersionNumberType')
export const MaybeVersionNumberType = maybe(VersionNumberType)
export const MaybeBooleanType = maybe(BooleanType)
export const NonEmptyStringType = refinement(StringType, s => s && s.length > 0, 'NonEmptyStringType')
export const MaybeStringType = maybe(NonEmptyStringType)
