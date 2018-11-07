import * as React from 'react'
import * as _ from 'lodash'
import {
  ValidationRuleType,
  Validation,
  notEmpty,
  minLength,
  min,
  max,
  maxLength,
  numberRule,
  rule,
  email,
  regExp,
  StringFunctionRule,
  NumberFunctionRule
} from './formrules'
const L: any = require('partial.lenses')
import { getIndexesFor, wrappedFields, wrappedTypeName } from './lenshelpers'
const uuid = require('uuid')

const formRules = { notEmpty, minLength, maxLength, email, regExp, rule }
const numberRules = { min, max, rule: numberRule }

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

export type ValidationGroup = { [K in keyof typeof formRules]?: Validation }

export type ValidationProps<
  T,
  A extends keyof T,
  U extends keyof T[A],
  S extends keyof T[A][U],
  K extends keyof T[A][U][S]
> = {
  for: LensPathType<T, A, U, S, K>
  children: (validation: ValidationGroup | null) => JSX.Element
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
export type NumberInputProps<
  T,
  A extends keyof T,
  U extends keyof T[A],
  S extends keyof T[A][U],
  K extends keyof T[A][U][S]
> = _.Omit<React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, 'ref'> &
  NumberInputRules & {
    for: LensPathType<T, A, U, S, K>
    value?: number | string | boolean
  }
export type InputProps<
  T,
  A extends keyof T,
  U extends keyof T[A],
  S extends keyof T[A][U],
  K extends keyof T[A][U][S]
> = _.Omit<React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, 'ref'> &
  StringRules & {
    for: LensPathType<T, A, U, S, K>
    value?: number | string | boolean
  }

type LensPathType<
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

type FormEventType<T, A extends keyof T, U extends keyof T[A], S extends keyof T[A][U], K extends keyof T[A][U][S]> =
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
      Input: <A extends keyof T, U extends keyof T[A], S extends keyof T[A][U], K extends keyof T[A][U][S]>(
        props: InputProps<T, A, U, S, K>
      ) => JSX.Element
      NumberInput: <A extends keyof T, U extends keyof T[A], S extends keyof T[A][U], K extends keyof T[A][U][S]>(
        props: NumberInputProps<T, A, U, S, K>
      ) => JSX.Element
      TextArea: <A extends keyof T, U extends keyof T[A], S extends keyof T[A][U], K extends keyof T[A][U][S]>(
        props: TextAreaProps<T, A, U, S, K>
      ) => JSX.Element
      Validation: <A extends keyof T, U extends keyof T[A], S extends keyof T[A][U], K extends keyof T[A][U][S]>(
        props: ValidationProps<T, A, U, S, K>
      ) => JSX.Element
    },
    emitScopedChange: <A extends keyof T, U extends keyof T[A], S extends keyof T[A][U], K extends keyof T[A][U][S]>(
      event: FormEventType<T, A, U, S, K>
    ) => void
  ) => JSX.Element | null
}

class InputInner extends React.Component<
  React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>,
    HTMLInputElement | HTMLTextAreaElement
  > & {
    onDidMount: (ref: React.RefObject<any>) => void
    onWillUnmount: () => void
    _textArea: boolean
  }
> {
  ref = React.createRef<any>()
  render() {
    if (this.props._textArea) {
      return (
        <textarea ref={this.ref as any} {..._.omit(this.props, ['onDidMount', 'onWillUnmount', '_textArea', 'for'])} />
      )
    } else {
      return (
        <input ref={this.ref as any} {..._.omit(this.props, ['onDidMount', 'onWillUnmount', '_textArea', 'for'])} />
      )
    }
  }
  componentDidMount() {
    this.props.onDidMount(this.ref)
  }

  componentWillUnmount() {
    this.props.onWillUnmount()
  }
}

function getValidationFromRules(rules: any, value: any): ValidationGroup {
  // _.keys is untyped!!
  const { ref, ...withoutRef } = rules
  const validationsForField = Object.keys(withoutRef)
    .map(key => {
      const ruleValue = withoutRef[key]
      const validation = ({ ...formRules, ...numberRules } as any)[key as any](value, ruleValue as any)
      return { validation, key }
    })
    .filter(v => !!v.validation)
    .reduce((agg, { validation, key }) => {
      return {
        ...agg,
        [key]: validation
      }
    }, {})

  return validationsForField as ValidationGroup
}

export interface FormState {
  fields: any
}
const omitFromInputs = ['ref'].concat(_.keys(formRules)).concat(_.keys(numberRules))
export class Form<T> extends React.Component<FormProps<T>, FormState> {
  state: FormState = {
    // no pricings yet registered so lets just cast this
    fields: {}
  }
  getValidationForField(lens: any) {
    // field not touched
    const rules = L.get([lens, 'rules'], this.state.fields)
    const touched = L.get([lens, 'touched'], this.state.fields)
    if (touched && rules) {
      const ref = L.get([lens, 'ref'], this.state.fields)
      const invalid = getValidationFromRules(rules, ref.current.value)
      return Object.keys(invalid).length === 0 ? null : invalid
    }
    return null
  }
  Validation = <A extends keyof T, U extends keyof T[A], S extends keyof T[A][U], K extends keyof T[A][U][S]>(
    props: ValidationProps<T, A, U, S, K>
  ) => {
    const validation = this.getValidationForField(props.for)
    return props.children(validation)
  }
  TextArea = <A extends keyof T, U extends keyof T[A], S extends keyof T[A][U], K extends keyof T[A][U][S]>(
    props: TextAreaProps<T, A, U, S, K>
  ) => {
    return this.Input({ ...props, _textArea: true } as any)
  }
  NumberInput = <A extends keyof T, U extends keyof T[A], S extends keyof T[A][U], K extends keyof T[A][U][S]>(
    props: NumberInputProps<T, A, U, S, K>
  ) => {
    return this.Input({ ...props, type: 'number' } as any)
  }
  Input = <A extends keyof T, U extends keyof T[A], S extends keyof T[A][U], K extends keyof T[A][U][S]>(
    props: InputProps<T, A, U, S, K>
  ) => {
    let rules = _.pick(props, _.keys(formRules)) as StringRules
    if (props.type === 'number') {
      rules = _.pick(props, _.keys(numberRules)) as any
    }
    console.log('input', { for: props.for })
    const lensPath = props.for
    console.log({ lensPath })
    const value = L.get([lensPath], this.props.value)
    const key = L.get([lensPath, 'uuid'], this.state.fields) || uuid.v4()
    if (value === null && props.value == null)
      throw Error('Input needs to have value in Form state or provided one in props')
    if (!_.isEmpty(rules) && (props.disabled || props.readOnly))
      throw Error('Cant have rules on a non modifiable field')
    return (
      <InputInner
        onChange={(e: any) => {
          const event = {
            for: props.for,
            value: props.type === 'number' ? parseInt(e.target.value, 10) : e.target.value
          }
          this.emitScopedChange(event as any)
        }}
        _textArea={(props as any)._textArea}
        {..._.omit(props, omitFromInputs)}
        value={value == null ? props.value : value}
        key={key}
        onDidMount={ref => {
          console.log('didmount', key)
          if (props.value === null) {
            throw Error('A value must be provided for mounting input: ' + lensPath.toString())
          }
          this.setState(state => {
            return {
              fields: L.set(
                lensPath,
                {
                  rules,
                  ref,
                  uuid: key,
                  touched: false,
                  type: wrappedTypeName
                },
                state.fields
              )
            }
          })
        }}
        onWillUnmount={() => {
          console.log('willunmount', uuid)
          this.removeRule(lensPath as any)
        }}
        onBlur={() => {
          // touch non number fields on blur
          this.touchField(lensPath as any)
        }}
        onFocus={() => {
          /*
          if (props.type === "number") {
            this.props.touchField(lensPath)
          } else {
            // untouch all but number fields on focus
            this.props.unTouchField(lensPath)
            })
        } */
        }}
      />
    )
  }
  emitScopedChange = <A extends keyof T, U extends keyof T[A], S extends keyof T[A][U], K extends keyof T[A][U][S]>(
    event: FormEventType<T, A, U, S, K>
  ) => {
    // a hack to know if these are fed
    if (_.isObject(event.value) || _.isArray(event.value)) {
      const newIndexes = getIndexesFor(event.value)
      /*
      const oldIndexes = getIndexesFor(L.get([event.for], this.state.fields))
      const oneDeepOld = oldIndexes.map((v: any) => v[0]).filter((a: any) => a.length === 1)
      const oneDeepNew = newIndexes.map((v: any) => v[0]).filter((a: any) => a.length === 1)
      console.log({ oldIndexes, newIndexes, oneDeepOld, oneDeepNew })
      if (JSON.stringify(oldIndexes.map((v: any) => v[0])) !== JSON.stringify(newIndexes.map((v: any) => v[0]))) {
        console.error(
          'Detected a change to datastructure, removing elements or changing array order leads to undefined behaviour'
        )
      }*/
      const value = newIndexes.reduce((acc: any, val: any) => {
        // remove undefined indices
        if (val[1] === undefined) {
          console.log('remove', val[0])
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
  touchField = (lensPath: any) => {
    /* TODO Check that the path exists or else throw Error */
    if (!L.isDefined([lensPath, 'touched'])) {
      throw Error('Lens path does not exits in touchField: ' + lensPath.toString())
    }
    this.setState(state => {
      return { fields: L.set([lensPath, 'touched', L.optional], true, state.fields) }
    })
  }
  unTouchField = (lensPath: any) => {
    /* TODO Check that the path exists or else throw Error */
    if (!L.isDefined([lensPath, 'touched'])) {
      throw Error('Lens path does not exits in unTouchField: ' + lensPath.toString())
    }
    this.setState(state => {
      return { fields: L.set([lensPath, L.optional, 'touched', L.optional], false, state.fields) }
    })
  }
  removeRule = (lensPath: any) => {
    /* TODO Check that the path exists or else throw Error */
    if (!L.isDefined([lensPath, 'rules'])) {
      throw Error('Lens path does not exits in removeRule: ' + lensPath.toString())
    }
    this.setState(state => {
      return { fields: L.remove([lensPath, L.optional, 'rules', L.optional], state.fields) }
    })
  }
  render() {
    const props = _.omit(this.props, ['value', 'onChange'])
    return (
      <form
        {..._.omit(props, ['value', 'allowUndefinedPaths']) as any}
        onSubmit={(e: any) => {
          e.preventDefault()
          e.stopPropagation()
          const invalidFieldsLens = L.compose(
            wrappedFields,
            L.when((wv: any) => {
              const validation = getValidationFromRules(wv.rules, wv.ref.current.value)
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
              NumberInput: this.NumberInput,
              TextArea: this.TextArea,
              Validation: this.Validation
            },
            this.emitScopedChange
          )}
        </React.Fragment>
      </form>
    )
  }
}
