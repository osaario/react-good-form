# React Good Form

React form with validation. Supports nested structures with objects and arrays.

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
              <Input email notEmpty for="email" />
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
<Input
  rule={email => email.endsWith("hotmail.com")}
  email={true}
  for="email"
/>
```
Or an regular expression.

```JSX
<Input
  type="password"
  regExp={/(123456|password)/}
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

## Known issues:

At the moment only supports static arrays.

## Acknowledgements

Library boilerplate starter: https://github.com/alexjoverm/typescript-library-starter

## Dependencies
