export type ValidationRuleType<T extends string | number | boolean | RegExp> = (
  value: any,
  ruleValue: T
) => Validation | null
// https://emailregex.com/
const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
//
export const notEmpty: ValidationRuleType<boolean> = (value, ruleValue) => {
  if (!ruleValue) return null
  const pass = !(value == null || value === '')
  if (pass) return null
  else return { validation: 'error', ruleValue }
}

export const email: ValidationRuleType<boolean> = (value, ruleValue) => {
  if (!ruleValue) return null
  const pass = emailRegex.test(value)
  if (pass) return null
  else return { validation: 'error', ruleValue }
}

export const minLength: ValidationRuleType<number> = (value, ruleValue) => {
  if (!!value && typeof value !== 'string') {
    throw Error("Can't have minLength rule on a non string field")
  }
  if (!ruleValue) return null
  const pass = value.length >= ruleValue
  if (pass) return null
  else return { validation: 'error', ruleValue }
}

export const maxLength: ValidationRuleType<number> = (value, ruleValue) => {
  if (value && typeof value !== 'string') {
    throw Error("Can't have maxLength rule on a non string field")
  }
  if (!ruleValue) return null
  const pass = value.length <= ruleValue
  if (pass) return null
  else return { validation: 'error', ruleValue }
}

export const min: ValidationRuleType<number> = (value, ruleValue) => {
  if (value && typeof value !== 'number') {
    throw Error("Can't have min rule on a non number field")
  }
  const pass = value >= ruleValue
  if (pass) return null
  else return { validation: 'error', ruleValue }
}

export const max: ValidationRuleType<number> = (value, ruleValue) => {
  if (value && typeof value !== 'number') {
    throw Error("Can't have min rule on a non number field")
  }
  const pass = value <= ruleValue
  if (pass) return null
  else return { validation: 'error', ruleValue }
}

export const regExp: ValidationRuleType<RegExp> = (value, ruleValue) => {
  if (value && typeof value !== 'string') {
    throw Error("Can't have regex rule on a non string field")
  }
  const pass = ruleValue.test(value)
  if (pass) return null
  else return { validation: 'error', ruleValue }
}

export interface Validation {
  validation: 'error'
  ruleValue: string | number | boolean | RegExp
}

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
export const formRules = { notEmpty, minLength, min, max, maxLength, email, regExp }
