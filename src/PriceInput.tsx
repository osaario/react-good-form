import * as React from 'react'
const defaultLocale = 'en'

function isInvalidPrice(value: string | number | string[] | undefined) {
  if (!value) return false
  if (typeof value !== 'string') throw Error('Value not a string in price field')
  const priceRegex = /^(0{1}|[1-9]{1}[0-9]*)(\s[0-9]{3})*((\.|\,)[0-9]{1,2})?$/
  if (value.match(priceRegex)) return false
  return true
}

function toAmount(sum: number, lang: string) {
  return sum.toLocaleString(lang, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function centsToAmount(sum: number, lang: string) {
  return toAmount(sum / 100, lang)
}

function amountToCents(amount: string) {
  return Math.round(fromAmount(amount) * 100)
}

function fromAmount(sum: string) {
  return parseFloat(sum.replace(',', '.').replace(/\s/g, ''))
}

export default class PriceInput extends React.Component<
  React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
  { stringValue: string }
> {
  state: { stringValue: string } = {
    stringValue: this.props.value !== '' ? centsToAmount(this.props.value as any, this.props.lang || defaultLocale) : ''
  }
  componentDidUpdate(
    prevProps: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
  ) {
    if (prevProps.value !== this.props.value) {
      this.setState({
        stringValue:
          this.props.value !== 0
            ? this.props.value === amountToCents(this.state.stringValue)
              ? this.state.stringValue
              : centsToAmount(this.props.value as any, this.props.lang || defaultLocale)
            : this.state.stringValue === '0'
              ? '0'
              : ''
      })
    }
  }
  render() {
    if (this.props.value == null) throw Error('Price field cannot be null or undefined')
    return (
      <input
        {...this.props}
        type="text"
        value={this.state.stringValue}
        placeholder={centsToAmount(0, this.props.lang || defaultLocale)}
        onChange={(e: any) => {
          const stringValue = e.target.value
            .split('')
            .filter((letter: string) => {
              return !isNaN(parseInt(letter, 10)) || letter === ','
            })
            .reduce((acc: string, str: string) => {
              const splitted = acc.split(',')
              if (acc === '' && str === ',') return acc
              else if (acc === '0' && str !== ',') return acc
              else if (splitted.length < 2 && str === '0' && acc.length === 1 && acc.endsWith('0')) return acc
              else if (acc.endsWith(',') && str === ',') return acc
              else if (splitted.length > 1 && splitted[1].length > 1) return acc
              return acc + str
            }, '')
          console.log(stringValue)
          const { name, type, checked } = e.target
          const isValid = !isInvalidPrice(stringValue)
          console.log(isValid, e.target.value)
          if (isValid) {
            this.setState(
              {
                stringValue
              },
              () => {
                if (this.props.onChange) {
                  this.props.onChange({
                    target: {
                      name,
                      type,
                      checked,
                      value: stringValue === '' ? 0 : amountToCents(stringValue)
                    }
                  } as any)
                }
              }
            )
          } else {
            this.setState({ stringValue })
          }
        }}
      />
    )
  }
}
