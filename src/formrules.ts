export type StringFunctionRule = (value: string) => boolean
export type NumberFunctionRule = (value: number) => boolean
export type ValidationRuleType<
  T extends string | number | boolean | RegExp | StringFunctionRule | NumberFunctionRule
> = (value: any, ruleValue: T) => BrokenRule | null
// https://emailregex.com/
const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
//

function checkTypes(
  value: any,
  ruleValue: any,
  valueType: 'string' | 'boolean' | 'number',
  ruleValueType: 'string' | 'boolean' | 'number' | 'object' | 'function'
) {
  if (typeof value !== valueType) {
    throw Error(`Invalid type ${typeof value} for value in a form field. Should be: ${valueType}.`)
  } else if (typeof ruleValue !== ruleValueType) {
    throw Error(`Invalid type ${typeof ruleValue} for rule value in a form field. Should be: ${ruleValueType}.`)
  }
}

export const required: ValidationRuleType<boolean> = (value, ruleValue) => {
  checkTypes(value, ruleValue, 'string', 'boolean')
  if (!ruleValue) return null
  return !(value == null || value === '') ? null : ruleValue
}

export const email: ValidationRuleType<boolean> = (value, ruleValue) => {
  checkTypes(value, ruleValue, 'string', 'boolean')
  if (!ruleValue) return null
  return !value || emailRegex.test(value) ? null : ruleValue
}

export const minLength: ValidationRuleType<number> = (value, ruleValue) => {
  checkTypes(value, ruleValue, 'string', 'number')
  if (!ruleValue) return null
  return value.length >= ruleValue ? null : ruleValue
}

export const maxLength: ValidationRuleType<number> = (value, ruleValue) => {
  checkTypes(value, ruleValue, 'string', 'number')
  if (ruleValue == null) return null
  return value.length <= ruleValue ? null : ruleValue
}

const matches: ValidationRuleType<number | string | boolean> = (value, ruleValue) => {
  const pass = value === ruleValue
  if (pass) return null
  else return ruleValue
}

export const booleanMatches: ValidationRuleType<boolean> = (value, ruleValue) => {
  checkTypes(value, ruleValue, 'boolean', 'boolean')
  return value === ruleValue ? null : ruleValue
}

export const numberMatches: ValidationRuleType<number> = (value, ruleValue) => {
  checkTypes(value, ruleValue, 'number', 'number')
  return matches(value, ruleValue)
}

export const stringMatches: ValidationRuleType<string> = (value, ruleValue) => {
  checkTypes(value, ruleValue, 'string', 'string')
  return matches(value, ruleValue)
}

export const min: ValidationRuleType<number> = (value, ruleValue) => {
  checkTypes(value, ruleValue, 'number', 'number')
  return value >= ruleValue ? null : ruleValue
}

export const max: ValidationRuleType<number> = (value, ruleValue) => {
  checkTypes(value, ruleValue, 'number', 'number')
  return value <= ruleValue ? null : ruleValue
}

export const regExp: ValidationRuleType<RegExp> = (value, ruleValue) => {
  const pass = value && ruleValue.test(value)
  if (pass) return null
  else return ruleValue
}

export const rule: ValidationRuleType<StringFunctionRule> = (value, ruleValue) => {
  const pass = ruleValue(value)
  if (pass) return null
  else return ruleValue
}

export const numberRule: ValidationRuleType<NumberFunctionRule> = (value, ruleValue) => {
  const pass = ruleValue(value)
  if (pass) return null
  else return ruleValue
}

export type BrokenRule = string | number | boolean | RegExp | StringFunctionRule | NumberFunctionRule

/*
5

export const max: ValidationRuleType<number> = (value, ruleValue, S) => {
  const pass = value <= ruleValue
  if (pass) return null
  else return { validation: 'error', description: `${S.VALUE_TOO_LARGE} (max. ${ruleValue})` }
}

export const email: ValidationRuleType<boolean> = (value, ruleValue, S) => {
  if (!ruleValue || !value) return null
  const pass = isEmailValid(value)
  if (pass) return null
  else return { validation: 'error', description: S.INVALID_EMAIL }
}

export const phone: ValidationRuleType<boolean> = (value, ruleValue, S) => {
  if (!ruleValue || !value) return null
  const pass = isPhoneValid(value)
  if (pass) return null
  else return { validation: 'error', description: S.INCORRECT_FORMAT }
}

*/
