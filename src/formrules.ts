export type FunctionRule = (value: string | null | undefined) => boolean
export type NumberFunctionRule = (value: number | null | undefined) => boolean
export type ValidationRuleType<T extends string | number | boolean | RegExp | FunctionRule | NumberFunctionRule> = (
  value: number | string | boolean | null | undefined,
  ruleValue: T
) => BrokenRule | null
// https://emailregex.com/
const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
//

function checkTypes(
  value: any,
  ruleValue: any,
  valueType: 'string' | 'boolean' | 'number',
  ruleValueType: 'string' | 'boolean' | 'number' | 'object' | 'function',
  ruleName: string
) {
  if (typeof ruleValue !== ruleValueType) {
    throw Error(
      `Invalid rule value type ${typeof ruleValue} for field with rule ${ruleName}. Should be: ${ruleValueType}.`
    )
  } else if (value == null) return
  else if (typeof value !== valueType) {
    throw Error(`Invalid value type ${typeof value} for field with rule ${ruleName}. Should be: ${valueType}.`)
  }
}

export const required: ValidationRuleType<boolean> = (value, ruleValue) => {
  checkTypes(value, ruleValue, 'string', 'boolean', 'required')
  if (!ruleValue) return null
  return !(value == null || value === '') ? null : ruleValue
}

export const email: ValidationRuleType<boolean> = (value, ruleValue) => {
  checkTypes(value, ruleValue, 'string', 'boolean', 'email')
  if (!ruleValue) return null
  return !value || emailRegex.test(value as string) ? null : ruleValue
}

export const minLength: ValidationRuleType<number> = (value, ruleValue) => {
  checkTypes(value, ruleValue, 'string', 'number', 'minLength')
  if (!ruleValue) return null
  if (value == null) return ruleValue
  return (value as string).length >= ruleValue ? null : ruleValue
}

export const maxLength: ValidationRuleType<number> = (value, ruleValue) => {
  checkTypes(value, ruleValue, 'string', 'number', 'maxLength')
  if (value == null) return null
  return (value as string).length <= ruleValue ? null : ruleValue
}

export const strictly: ValidationRuleType<boolean> = (value, ruleValue) => {
  checkTypes(value, ruleValue, 'boolean', 'boolean', 'booleanEquals')
  return value === ruleValue ? null : ruleValue
}

export const loosely: ValidationRuleType<boolean> = (value, ruleValue) => {
  checkTypes(value, ruleValue, 'boolean', 'boolean', 'booleanEquals')
  return !!value === !!ruleValue ? null : ruleValue
}

export const equals: ValidationRuleType<number> = (value, ruleValue) => {
  checkTypes(value, ruleValue, 'number', 'number', 'numberEquals')
  return value === ruleValue ? null : ruleValue
}

export const matches: ValidationRuleType<string> = (value, ruleValue) => {
  checkTypes(value, ruleValue, 'string', 'string', 'stringEquals')
  return value === ruleValue ? null : ruleValue
}

export const min: ValidationRuleType<number> = (value, ruleValue) => {
  checkTypes(value, ruleValue, 'number', 'number', 'min')
  if (value == null) return !!value === !!ruleValue ? null : ruleValue
  return value >= ruleValue ? null : ruleValue
}

export const max: ValidationRuleType<number> = (value, ruleValue) => {
  checkTypes(value, ruleValue, 'number', 'number', 'max')
  if (value == null) return ruleValue
  return value <= ruleValue ? null : ruleValue
}

export const regExp: ValidationRuleType<RegExp> = (value, ruleValue) => {
  checkTypes(value, ruleValue, 'string', 'object', 'regExp')
  return !value || ruleValue.test(value as string) ? null : ruleValue
}

export const rule: ValidationRuleType<FunctionRule> = (value, ruleValue) => {
  checkTypes(value, ruleValue, 'string', 'function', 'rule')
  const pass = ruleValue(value as string | null | undefined)
  if (pass) return null
  else return ruleValue
}

export const numberRule: ValidationRuleType<NumberFunctionRule> = (value, ruleValue) => {
  checkTypes(value, ruleValue, 'number', 'function', 'rule')
  const pass = ruleValue(value as number | null | undefined)
  if (pass) return null
  else return ruleValue
}

export type BrokenRule = string | number | boolean | RegExp | FunctionRule | NumberFunctionRule

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
