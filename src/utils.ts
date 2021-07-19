export interface Loggable {
  toString(): string
}

export const log = (item: Loggable): void => {
  console.log(item.toString())
}

export const assert = (condition: boolean, message: string): void => {
  if (!condition) {
    throw new Error(message)
  }
}

export const isNonNegativeInt = (value: number): boolean => {
  return value >= 0 && value % 1 === 0
}

export function isEqual<T>(value1: T, value2: T): boolean {
  return value1 === value2
}

export const assertNonNegativeInt = (value: number, valueName: string) => {
  assert(isNonNegativeInt(value), `${valueName} must be a non-negative integer`)
}