import * as React from 'react'
const defaultLocale = 'en'

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
  cents() {
    return amountToCents(this.state.stringValue)
  }
  componentDidUpdate(
    prevProps: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
  ) {
    const splitter = centsToAmount(100, this.props.lang || defaultLocale).indexOf(',') !== -1 ? ',' : '.'
    if (prevProps.value !== this.props.value) {
      this.setState({
        stringValue:
          this.props.value !== 0
            ? this.props.value === amountToCents(this.state.stringValue)
              ? this.state.stringValue
              : centsToAmount(this.props.value as any, this.props.lang || defaultLocale)
            : this.state.stringValue === '0' || this.state.stringValue === '0' + splitter
              ? '0'
              : ''
      })
    }
  }
  render() {
    if (this.props.value == null) throw Error('Price field cannot be null or undefined')
    const splitter = centsToAmount(100, this.props.lang || defaultLocale).indexOf(',') !== -1 ? ',' : '.'
    return (
      <input
        {...this.props}
        type="text"
        value={this.state.stringValue}
        onChange={(e: any) => {
          const stringValue = e.target.value
            .split('')
            .filter((letter: string) => {
              return !isNaN(parseInt(letter, 10)) || letter === splitter
            })
            .reduce((acc: string, str: string) => {
              const splitted = acc.split(splitter)
              if (acc === '' && str === splitter) return acc
              else if (acc === '0' && str !== splitter) return acc
              else if (splitted.length < 2 && str === '0' && acc.length === 1 && acc.endsWith('0')) return acc
              else if (acc.endsWith(splitter) && str === splitter) return acc
              else if (splitted.length > 1 && splitted[1].length > 1) return acc
              return acc + str
            }, '')
          const { name, type, checked } = e.target
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
        }}
      />
    )
  }
}
