import * as React from 'react'
import {
  ValidationRuleType,
  BrokenRule,
  required,
  minLength,
  min,
  max,
  maxLength,
  stringMatches,
  numberMatches,
  booleanMatches,
  numberRule,
  rule,
  email,
  regExp,
  StringFunctionRule,
  NumberFunctionRule
} from './formrules'
const L: any = require('partial.lenses')
import { getIndexesFor, wrappedFields, wrappedTypeName } from './lenshelpers'

export const formRules = { required, minLength, maxLength, email, regExp, rule, equals: stringMatches }
export const numberRules = { min, max, rule: numberRule, equals: numberMatches }
export const checkBoxRules = { equals: booleanMatches }

const omit = (obj: any, properties: string[]) => {
  const lookup: any = properties.reduce((acc, key) => {
    return {
      ...acc,
      [key]: true
    }
  }, {})
  return Object.keys(obj).reduce((acc, key) => {
    if (!lookup[key]) {
      return {
        ...acc,
        [key]: obj[key]
      }
    }
    return acc
  }, {})
}

const pick = (obj: any, properties: string[]) => {
  const lookup: any = properties.reduce((acc, key) => {
    return {
      ...acc,
      [key]: true
    }
  }, {})
  return Object.keys(obj).reduce((acc, key) => {
    if (lookup[key]) {
      return {
        ...acc,
        [key]: obj[key]
      }
    }
    return acc
  }, {})
}

type StringRules = {
  [P in keyof typeof formRules]?: (typeof formRules)[P] extends ValidationRuleType<boolean>
    ? boolean
    : (typeof formRules)[P] extends ValidationRuleType<number>
      ? number
      : (typeof formRules)[P] extends ValidationRuleType<string>
        ? string
        : (typeof formRules)[P] extends ValidationRuleType<RegExp> ? RegExp : StringFunctionRule
}

type NumberInputRules = {
  [P in keyof typeof numberRules]?: (typeof numberRules)[P] extends ValidationRuleType<boolean>
    ? boolean
    : (typeof numberRules)[P] extends ValidationRuleType<number>
      ? number
      : (typeof numberRules)[P] extends ValidationRuleType<string>
        ? string
        : (typeof numberRules)[P] extends ValidationRuleType<RegExp> ? RegExp : NumberFunctionRule
}

type CheckboxRules = {
  [P in keyof typeof checkBoxRules]?: (typeof checkBoxRules)[P] extends ValidationRuleType<boolean>
    ? boolean
    : (typeof checkBoxRules)[P] extends ValidationRuleType<number>
      ? number
      : (typeof checkBoxRules)[P] extends ValidationRuleType<string>
        ? string
        : (typeof checkBoxRules)[P] extends ValidationRuleType<RegExp> ? RegExp : NumberFunctionRule
}

export type BrokenRules = { [K in keyof typeof formRules]?: BrokenRule } &
  { [K in keyof typeof numberRules]?: BrokenRule } &
  { [K in keyof typeof checkBoxRules]?: BrokenRule }

export type ValidationProps<
  T,
  A extends keyof T,
  U extends keyof T[A],
  S extends keyof T[A][U],
  K extends keyof T[A][U][S]
> = {
  for: LensPathType<T, A, U, S, K>
  children: (
    fieldInteractionState: {
      touched: boolean
      dirty: boolean
      invalid: BrokenRules | false
      valid: boolean
      untouched: boolean
      pristine: boolean
    }
  ) => JSX.Element
}

export type TextAreaProps<
  T,
  A extends keyof T,
  U extends keyof T[A],
  S extends keyof T[A][U],
  K extends keyof T[A][U][S]
> = _.Omit<React.DetailedHTMLProps<React.TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>, 'ref'> &
  StringRules & {
    for: LensPathType<T, A, U, S, K>
    value?: number | string | boolean
  }

export type InputType = 'text' | 'number' | 'checkbox' | 'password' | undefined
export type InputProps<
  T,
  A extends keyof T,
  U extends keyof T[A],
  S extends keyof T[A][U],
  K extends keyof T[A][U][S],
  I extends InputType
> = _.Omit<React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, 'ref'> &
  (I extends 'number' ? NumberInputRules : I extends 'checkbox' ? CheckboxRules : StringRules) & {
    for: LensPathType<T, A, U, S, K>
    value?: number | string | boolean
  } & { type?: I }

export type SelectProps<
  T,
  A extends keyof T,
  U extends keyof T[A],
  S extends keyof T[A][U],
  K extends keyof T[A][U][S]
> = _.Omit<React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>, 'ref'> & {
  for: LensPathType<T, A, U, S, K>
  value?: string
}

type FormGroupAddons = {
  children: React.ReactNode
  leftAddon?: React.ReactNode
  rightAddon?: React.ReactNode
  errorForBrokenRules?: (brokenRules: BrokenRules) => string
}

export type TextAreaFormGroupProps<
  T,
  A extends keyof T,
  U extends keyof T[A],
  S extends keyof T[A][U],
  K extends keyof T[A][U][S]
> = TextAreaProps<T, A, U, S, K> & FormGroupAddons

export type InputFormGroupProps<
  T,
  A extends keyof T,
  U extends keyof T[A],
  S extends keyof T[A][U],
  K extends keyof T[A][U][S],
  I extends InputType
> = InputProps<T, A, U, S, K, I> & FormGroupAddons

export type SelectFormGroupProps<
  T,
  A extends keyof T,
  U extends keyof T[A],
  S extends keyof T[A][U],
  K extends keyof T[A][U][S]
> = SelectProps<T, A, U, S, K> & FormGroupAddons

export type LensPathType<
  T,
  A extends keyof T,
  U extends keyof T[A],
  S extends keyof T[A][U],
  K extends keyof T[A][U][S]
> = T[A] extends (object | Array<any>)
  ? T[A][U] extends (object | Array<any>)
    ? (T[A][U][S] extends (object | Array<any>) ? [A, U, S, K] : [A, U, S])
    : [A, U]
  : (A | [A])

export type FormEventType<
  T,
  A extends keyof T,
  U extends keyof T[A],
  S extends keyof T[A][U],
  K extends keyof T[A][U][S]
> =
  | { value: Partial<T[A][U][S][K]>; for: [A, U, S, K] }
  | { value: Partial<T[A][U][S]>; for: [A, U, S] }
  | { value: Partial<T[A][U]>; for: [A, U] }
  | { value: Partial<T[A]>; for: [A] }
  | { value: Partial<T>; for: [] }

export interface FormProps<T>
  extends _.Omit<React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>, 'onChange'> {
  value: T
  optimized?: boolean
  onChange: (data: T) => void
  children: (
    Form: {
      Input: <
        A extends keyof T,
        U extends keyof T[A],
        S extends keyof T[A][U],
        K extends keyof T[A][U][S],
        I extends InputType
      >(
        props: InputProps<T, A, U, S, K, I>
      ) => JSX.Element
      TextArea: <A extends keyof T, U extends keyof T[A], S extends keyof T[A][U], K extends keyof T[A][U][S]>(
        props: TextAreaProps<T, A, U, S, K>
      ) => JSX.Element
      Select: <A extends keyof T, U extends keyof T[A], S extends keyof T[A][U], K extends keyof T[A][U][S]>(
        props: SelectProps<T, A, U, S, K>
      ) => JSX.Element
      InputFormGroup: <
        A extends keyof T,
        U extends keyof T[A],
        S extends keyof T[A][U],
        K extends keyof T[A][U][S],
        I extends InputType
      >(
        props: InputFormGroupProps<T, A, U, S, K, I>
      ) => JSX.Element
      TextAreaFormGroup: <A extends keyof T, U extends keyof T[A], S extends keyof T[A][U], K extends keyof T[A][U][S]>(
        props: TextAreaFormGroupProps<T, A, U, S, K>
      ) => JSX.Element
      SelectFormGroup: <A extends keyof T, U extends keyof T[A], S extends keyof T[A][U], K extends keyof T[A][U][S]>(
        props: SelectFormGroupProps<T, A, U, S, K>
      ) => JSX.Element
    },
    validations: {
      invalid: <A extends keyof T, U extends keyof T[A], S extends keyof T[A][U], K extends keyof T[A][U][S]>(
        path: LensPathType<T, A, U, S, K>
      ) => null | BrokenRules
      valid: <A extends keyof T, U extends keyof T[A], S extends keyof T[A][U], K extends keyof T[A][U][S]>(
        path: LensPathType<T, A, U, S, K>
      ) => boolean
      touched: <A extends keyof T, U extends keyof T[A], S extends keyof T[A][U], K extends keyof T[A][U][S]>(
        path: LensPathType<T, A, U, S, K>
      ) => boolean
      untouched: <A extends keyof T, U extends keyof T[A], S extends keyof T[A][U], K extends keyof T[A][U][S]>(
        path: LensPathType<T, A, U, S, K>
      ) => boolean
      dirty: <A extends keyof T, U extends keyof T[A], S extends keyof T[A][U], K extends keyof T[A][U][S]>(
        path: LensPathType<T, A, U, S, K>
      ) => boolean
      pristine: <A extends keyof T, U extends keyof T[A], S extends keyof T[A][U], K extends keyof T[A][U][S]>(
        path: LensPathType<T, A, U, S, K>
      ) => boolean
    },
    emitScopedChange: <A extends keyof T, U extends keyof T[A], S extends keyof T[A][U], K extends keyof T[A][U][S]>(
      event: FormEventType<T, A, U, S, K>
    ) => void
  ) => JSX.Element | null
}

class InputInner extends React.Component<
  React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  > & {
    onDidMount: (ref: React.RefObject<any>) => void
    onWillUnmount: () => void
    _textArea: boolean
    _select: boolean
  }
> {
  ref = React.createRef<any>()
  render() {
    const { onDidMount, onWillUnmount, _textArea, _select, ...restProps } = this.props
    if (this.props._textArea) {
      return <textarea ref={this.ref as any} {...restProps} />
    } else if (this.props._select) {
      return <select ref={this.ref as any} {...restProps} />
    } else {
      return <input ref={this.ref as any} {...restProps} />
    }
  }
  componentDidMount() {
    this.props.onDidMount(this.ref)
  }

  componentWillUnmount() {
    this.props.onWillUnmount()
  }
}

function getValidationFromRules(rules: any, value: any): BrokenRules {
  // _.keys is untyped!!
  const { ref, ...withoutRef } = rules
  const validationsForField = Object.keys(withoutRef)
    .map(key => {
      const ruleValue = withoutRef[key]
      const validation = ({ ...formRules, ...numberRules, ...checkBoxRules } as any)[key as any](
        value,
        ruleValue as any
      )
      return { validation, key }
    })
    .filter(v => v.validation != null)
    .reduce((agg, { validation, key }) => {
      return {
        ...agg,
        [key]: validation
      }
    }, {})

  return validationsForField as BrokenRules
}

export interface FormState {
  fields: any
}
const omitFromInputs = ['ref', 'for'].concat(Object.keys(formRules)).concat(Object.keys(numberRules))
export class Form<T> extends React.Component<FormProps<T>, FormState> {
  state: FormState = {
    // no pricings yet registered so lets just cast this
    fields: {}
  }
  getValidationForField(lens: any) {
    // field not touched
    const rules = L.get([lens, 'rules'], this.state.fields)
    if (rules) {
      const ref = L.get([lens, 'ref'], this.state.fields)
      const invalid = getValidationFromRules(
        rules,
        ref.current.type === 'number'
          ? parseInt(ref.current.value, 10)
          : ref.current.type === 'checkbox'
            ? ref.current.checked
            : ref.current.value
      )
      return Object.keys(invalid).length === 0 ? null : invalid
    }
    return null
  }
  TextAreaFormGroup = <A extends keyof T, U extends keyof T[A], S extends keyof T[A][U], K extends keyof T[A][U][S]>(
    props: TextAreaFormGroupProps<T, A, U, S, K>
  ): JSX.Element => {
    throw Error(
      'You should provide your own implementation for Form Groups by inheriting the Form. Field:  ' + props.for
    )
  }
  InputFormGroup = <
    A extends keyof T,
    U extends keyof T[A],
    S extends keyof T[A][U],
    K extends keyof T[A][U][S],
    I extends InputType
  >(
    props: InputFormGroupProps<T, A, U, S, K, I>
  ): JSX.Element => {
    throw Error(
      'You should provide your own implementation for Form Groups by inheriting the Form. Field:  ' + props.for
    )
  }
  SelectFormGroup = <A extends keyof T, U extends keyof T[A], S extends keyof T[A][U], K extends keyof T[A][U][S]>(
    props: SelectFormGroupProps<T, A, U, S, K>
  ): JSX.Element => {
    throw Error(
      'You should provide your own implementation for Form Groups by inheriting the Form. Field:  ' + props.for
    )
  }
  TextArea = <A extends keyof T, U extends keyof T[A], S extends keyof T[A][U], K extends keyof T[A][U][S]>(
    props: TextAreaProps<T, A, U, S, K>
  ) => {
    return this.Input({ ...props, _textArea: true } as any)
  }
  Select = <A extends keyof T, U extends keyof T[A], S extends keyof T[A][U], K extends keyof T[A][U][S]>(
    props: SelectProps<T, A, U, S, K>
  ) => {
    return this.Input({ ...props, _select: true } as any)
  }
  Input = <
    A extends keyof T,
    U extends keyof T[A],
    S extends keyof T[A][U],
    K extends keyof T[A][U][S],
    I extends InputType
  >(
    props: InputProps<T, A, U, S, K, I>
  ) => {
    let rules = pick(props, Object.keys(formRules)) as StringRules
    if (props.type === 'number') {
      rules = pick(props, Object.keys(numberRules)) as any
    } else if (props.type === 'checkbox') {
      rules = pick(props, Object.keys(checkBoxRules)) as any
    }
    const lensPath = props.for
    const value = L.get([lensPath], this.props.value)
    const prevValidation = L.get([lensPath], this.state.fields)
    if (value === null && props.value == null)
      throw Error('Input needs to have value in Form state or provided one in props')
    return (
      <InputInner
        onChange={(e: any) => {
          if (!L.get([lensPath, 'dirty', L.optional], this.state.fields)) {
            this.setState(state => {
              return { fields: L.set([lensPath, 'dirty', L.optional], true, state.fields) }
            })
          }
          const event = {
            for: props.for,
            value:
              e.target.type === 'number'
                ? parseInt(e.target.value, 10)
                : e.target.type === 'checkbox'
                  ? e.target.checked
                  : e.target.value
          }
          this.emitScopedChange(event as any)
        }}
        _textArea={(props as any)._textArea}
        _select={(props as any)._select}
        {...omit(props, omitFromInputs)}
        value={value == null ? props.value : value}
        checked={!!value}
        key={JSON.stringify(rules) + JSON.stringify(props.for)}
        onDidMount={ref => {
          if (props.value === null) {
            throw Error('A value must be provided for mounting input: ' + lensPath.toString())
          }
          this.setState(state => {
            if (prevValidation) {
              return {
                fields: L.assign(
                  lensPath,
                  {
                    rules,
                    ref
                  },
                  state.fields
                )
              }
            } else {
              return {
                fields: L.set(
                  lensPath,
                  {
                    rules,
                    ref,
                    touched: false,
                    dirty: false,
                    type: wrappedTypeName
                  },
                  state.fields
                )
              }
            }
          })
        }}
        onWillUnmount={() => {
          this.setState(state => {
            return { fields: L.remove([lensPath, 'rules'], state.fields) }
          })
        }}
        onBlur={() => {
          this.setState(state => {
            return { fields: L.set([lensPath, 'touched'], true, state.fields) }
          })
        }}
      />
    )
  }
  emitScopedChange = <A extends keyof T, U extends keyof T[A], S extends keyof T[A][U], K extends keyof T[A][U][S]>(
    event: FormEventType<T, A, U, S, K>
  ) => {
    // a hack to know if these are fed
    if (typeof event.value === 'object') {
      const newIndexes = getIndexesFor(event.value)
      /*
      const oldIndexes = getIndexesFor(L.get([event.for], this.state.fields))
      const oneDeepOld = oldIndexes.map((v: any) => v[0]).filter((a: any) => a.length === 1)
      const oneDeepNew = newIndexes.map((v: any) => v[0]).filter((a: any) => a.length === 1)
      if (JSON.stringify(oldIndexes.map((v: any) => v[0])) !== JSON.stringify(newIndexes.map((v: any) => v[0]))) {
        console.error(
          'Detected a change to datastructure, removing elements or changing array order leads to undefined behaviour'
        )
      }*/
      const value = newIndexes.reduce((acc: any, val: any) => {
        // remove undefined indices
        if (val[1] === undefined) {
          return L.remove([event.for, val[0]], acc)
        } else {
          return L.set([event.for, val[0]], val[1], acc)
        }
      }, this.props.value)
      this.props.onChange(value)
    } else {
      const value = L.set([event.for], event.value, this.props.value)
      this.props.onChange(value)
    }
  }
  valid = <A extends keyof T, U extends keyof T[A], S extends keyof T[A][U], K extends keyof T[A][U][S]>(
    path: LensPathType<T, A, U, S, K>
  ) => {
    return !this.getValidationForField(path)
    // a hack to know if these are fed
  }
  invalid = <A extends keyof T, U extends keyof T[A], S extends keyof T[A][U], K extends keyof T[A][U][S]>(
    path: LensPathType<T, A, U, S, K>
  ) => {
    return this.getValidationForField(path)
    // a hack to know if these are fed
  }
  touched = <A extends keyof T, U extends keyof T[A], S extends keyof T[A][U], K extends keyof T[A][U][S]>(
    path: LensPathType<T, A, U, S, K>
  ) => {
    return L.get([path, 'touched'], this.state.fields)
    // a hack to know if these are fed
  }
  untouched = <A extends keyof T, U extends keyof T[A], S extends keyof T[A][U], K extends keyof T[A][U][S]>(
    path: LensPathType<T, A, U, S, K>
  ) => {
    return !this.touched(path)
    // a hack to know if these are fed
  }
  dirty = <A extends keyof T, U extends keyof T[A], S extends keyof T[A][U], K extends keyof T[A][U][S]>(
    path: LensPathType<T, A, U, S, K>
  ) => {
    return L.get([path, 'dirty'], this.state.fields)
    // a hack to know if these are fed
  }
  pristine = <A extends keyof T, U extends keyof T[A], S extends keyof T[A][U], K extends keyof T[A][U][S]>(
    path: LensPathType<T, A, U, S, K>
  ) => {
    return !this.dirty(path)
    // a hack to know if these are fed
  }
  render() {
    const props = omit(this.props, ['value', 'onChange'])
    return (
      <form
        {...omit(props, ['value', 'allowUndefinedPaths']) as any}
        onSubmit={(e: any) => {
          e.preventDefault()
          e.stopPropagation()
          const invalidFieldsLens = L.compose(
            wrappedFields,
            L.when((wv: any) => {
              const validation = getValidationFromRules(
                wv.rules,
                wv.ref.current.type === 'number'
                  ? parseInt(wv.ref.current.value, 10)
                  : wv.ref.current.type === 'checkbox'
                    ? wv.ref.current.checked
                    : wv.ref.current.value
              )
              return wv.rules && Object.keys(validation).length > 0
            })
          )
          const invalidFields = L.collect(invalidFieldsLens, this.state)
          if (invalidFields.length > 0) {
            invalidFields[0].ref.current.focus()
            this.setState(state => {
              return L.set([invalidFieldsLens, 'touched'], true, state)
            })
          } else {
            if (this.props.onSubmit) this.props.onSubmit(e)
          }
        }}
      >
        <React.Fragment>
          {this.props.children(
            {
              Input: this.Input,
              TextArea: this.TextArea,
              Select: this.Select,
              InputFormGroup: this.InputFormGroup,
              TextAreaFormGroup: this.TextAreaFormGroup,
              SelectFormGroup: this.SelectFormGroup
            },
            {
              invalid: this.invalid,
              valid: this.valid,
              touched: this.touched,
              untouched: this.untouched,
              dirty: this.dirty,
              pristine: this.pristine
            },
            this.emitScopedChange
          )}
        </React.Fragment>
      </form>
    )
  }
}
