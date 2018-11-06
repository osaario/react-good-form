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
import { wrappedIso, wrappedValuesLens, getIndexesFor, wrappedValues } from './lenshelpers'

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

type ValidationRules = NumberInputRules | StringRules
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
  | { value: T[A][U][S][K]; for: [A, U, S, K] }
  | { value: T[A][U][S]; for: [A, U, S] }
  | { value: T[A][U]; for: [A, U] }
  | { value: T[A]; for: [A] }

export interface FormProps<T>
  extends _.Omit<React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>, 'onChange'> {
  value: T
  onChange: (data: T) => void
  optimized?: boolean
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
    value: T,
    onChange: <A extends keyof T, U extends keyof T[A], S extends keyof T[A][U], K extends keyof T[A][U][S]>(
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

export interface FormState<T> {
  value: T
  iteration: 0
}
const omitFromInputs = ['ref'].concat(_.keys(formRules)).concat(_.keys(numberRules))
export class Form<T> extends React.Component<FormProps<T>, FormState<T>> {
  state: FormState<T> = {
    // no pricings yet registered so lets just cast this
    value: L.get(wrappedIso, this.props.value),
    iteration: 0
  }
  getValidationForField(lens: any) {
    // field not touched
    const rules = L.get([lens, 'rules'], this.state.value)
    const touched = L.get([lens, 'touched'], this.state.value)
    if (touched && rules) {
      const value = L.get([lens, 'value'], this.state.value)
      const invalid = getValidationFromRules(rules, value)
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
    const lensPath = props.for
    const value = L.get([lensPath, 'value', L.optional], this.state.value)
    if (!value == null && props.value == null)
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
          this.onChange(event as any)
        }}
        value={value}
        _textArea={(props as any)._textArea}
        {..._.omit(props, omitFromInputs)}
        key={this.state.iteration + JSON.stringify(lensPath) + JSON.stringify(rules)}
        onDidMount={ref => {
          this.insertRule(lensPath as any, rules, ref)
        }}
        onWillUnmount={() => {
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
  onChange = <A extends keyof T, U extends keyof T[A], S extends keyof T[A][U], K extends keyof T[A][U][S]>(
    event: FormEventType<T, A, U, S, K>
  ) => {
    // a hack to know if these are fed
    if (_.isObject(event.value) || _.isArray(event.value)) {
      const oldIndexes = getIndexesFor(L.get([event.for, L.inverse(wrappedIso)], this.state.value))
      const newIndexes = getIndexesFor(event.value)
      if (JSON.stringify(oldIndexes.map((v: any) => v[0])) !== JSON.stringify(newIndexes.map((v: any) => v[0]))) {
        console.error(
          'Detected a change to datastructure, removing elements or changing array order leads to undefined behaviour'
        )
      }
      const value = newIndexes.reduce((acc: any, val: any) => {
        return L.set([event.for, val[0], wrappedValuesLens], val[1], acc)
      }, this.state.value)
      this.setState({ value })
    } else {
      const value = L.set([event.for, wrappedValuesLens], event.value, this.state.value)
      this.setState({ value })
    }
  }
  touchField = (lensPath: any) => {
    /* TODO Check that the path exists or else throw Error */
    if (!L.isDefined(lensPath)) {
      throw Error('Lens path does not exits in touchField: ' + lensPath.toString())
    }
    this.setState(state => {
      return { value: L.set([lensPath, 'touched'], true, state.value) }
    })
  }
  unTouchField = (lensPath: any) => {
    /* TODO Check that the path exists or else throw Error */
    if (!L.isDefined(lensPath)) {
      throw Error('Lens path does not exits in unTouchField: ' + lensPath.toString())
    }
    this.setState(state => {
      return { value: L.set([lensPath, 'touched'], false, state.value) }
    })
  }
  removeRule = (lensPath: any) => {
    /* TODO Check that the path exists or else throw Error */
    if (!L.isDefined(lensPath)) {
      throw Error('Lens path does not exits in removeRule: ' + lensPath.toString())
    }
    this.setState(state => {
      return { value: L.remove([lensPath, 'rules', L.optional], state.value) }
    })
  }
  insertRule = (lensPath: any, rule: ValidationRules, ref: React.RefObject<HTMLInputElement>) => {
    /* TODO Check that the path exists or else throw Error */
    if (!L.isDefined(lensPath)) {
      throw Error('Lens path does not exits in insertRule: ' + lensPath.toString())
    }
    this.setState(state => {
      return { value: L.set([lensPath, 'ref'], ref, L.set([lensPath, 'rules'], rule, state.value)) }
    })
  }
  componentDidUpdate(prevProps: any) {
    if (prevProps.value !== this.props.value && JSON.stringify(prevProps.value) !== JSON.stringify(this.props.value)) {
      // Do a JSON parse to check this
      this.setState((state: any) => {
        return {
          value: L.get(wrappedIso, this.props.value),
          iteration: state.iteration + 1
        }
      })
    }
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
            wrappedValues,
            L.when((wv: any) => {
              const validation = getValidationFromRules(wv.rules, wv.value)
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
            this.props.onChange(L.get(L.inverse(wrappedIso), this.state.value))
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
            L.get(L.inverse(wrappedIso), this.state.value),
            this.onChange
          )}
        </React.Fragment>
      </form>
    )
  }
}
