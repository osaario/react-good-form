[![Stable Release](https://img.shields.io/npm/v/react-good-form.svg)](https://npm.im/react-good-form)
[![license](https://badgen.now.sh/badge/license/MIT)](./LICENSE)
[![TypeScript](https://badges.frapsoft.com/typescript/code/typescript.svg?v=101)](https://github.com/ellerbrock/typescript-badges/)

# React Good Form

Good Form implementation for React. Easy drop-in validation. Supports arrays and nested structures. Helps to reduce boilerplate without being opinionated on style. Typescript support.

## Installation

```
npm install react-good-form
```

## Simple Example

**Good Form** supports basic validations such as `email`, `minLength`, `maxLength` etc. out of the box. It automatically emits `onChange` events and provides values for fields. `onSubmit` callback is only triggered when submitting a valid form. Otherwise form will focus to first invalid field.

```JSX
import { Form } from "react-good-form"

class EmailForm extends React.Component {
  state = {
    email: ""
  }
  render() {
    return (
      <Form
        value={this.state}
        onChange={person => {
          this.setState(person)
        }}
        onSubmit={() => {
          alert(this.state.email)
        }}
      >
        {({ Input }, { invalid, touched }) => (
          <div>
            <h1>Log in</h1>
            <div style={{ color: invalid("email") && touched("email") ? "red" : undefined }}>
              <label>Email</label>
              <Input email required for="email" />
            </div>
            <button>OK</button>
          </div>
        )}
      </Form>
    )
  }
}
```

## Extendable

You can create arbitary rules by providing a rule function.

```JSX
const rule = email => email.endsWith("hotmail.com")

<Input
  rule={rule}
  email={true}
  for="email"
/>
```

Or an regular expression.

```JSX
const regExp = /(123456|password)/

<Input
  type="password"
  regExp={regExp}
  for="password"
/>
```

## Supports nested structures

Provide paths to nested structures as arrays.

```JSX
<div style={{ color: invalid(["address", "street"]) && touched(["address", "street"]) && "red" }}>
  <label>Street</label>
  <Input for={["address", "street"]} minLength={5} maxLength={100} />
</div>
```

## Documentation

https://osaario.github.io/react-good-form/
