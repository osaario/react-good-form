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
        {({ Input, Validation }) => (
          <div>
            <h1>Log in</h1>
            <Validation for="email">
              {({ touched, invalid }) => (
                <div style={{ color: invalid && touched ? "red" : undefined }}>
                  <label>Email</label>
                  <Input email notEmpty for="email" />
                </div>
              )}
            </Validation>
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
class Person extends React.Component {
  state = {
    name: "",
    address: {
      street: ""
    }
  }
  render() {
    return (
      <Form
        value={this.state}
        onChange={person => {
          this.setState(person)
        }}
        onSubmit={() => {
          alert("Person: " + JSON.stringify(this.state))
        }}
      >
        {({ Input, Validation, NumberInput }) => (
          <div>
            <div>
              <label>Name</label>
              <Input for="name" />
            </div>
            <Validation for={["address", "street"]}>
              {({ invalid, touched }) => (
                <div style={{ color: invalid && touched && "red" }}>
                  <label>Street</label>
                  <Input for={["address", "street"]} minLength={5} maxLength={100} />
                </div>
              )}
            </Validation>
            <button>Log in</button>
          </div>
        )}
      </Form>
    )
  }
}
```

## Dynamic rules

```JSX
import { Form, minLength, email } from "react-good-form"

class Person extends React.Component {
  state = {
    name: "",
    email: "",
    phone: ""
  }
  render() {
    return (
      <Form
        value={this.state}
        onChange={person => {
          this.setState(person)
        }}
        onSubmit={() => {
          alert("Person: " + JSON.stringify(this.state))
        }}
      >
        {({ Input, Validation, NumberInput }) => (
          <div>
            <div>
              <label>Name</label>
              <Input for="name" />
            </div>
            <Validation for="phone">
              {phoneValidation => (
                <Validation for="email">
                  {emailValidation => (
                    <Fragment>
                      <div style={{ color: emailValidation.invalid && emailValidation.touched ? "red" : undefined }}>
                        <label>Email</label>
                        <Input for="email" email={!!minLength(this.state.phone, 8)} />
                      </div>
                      <div style={{ color: phoneValidation.invalid && phoneValidation.touched ? "red" : undefined }}>
                        <label>Phone</label>
                        <Input for="phone" minLength={!!email(this.state.email, true) ? 8 : 0} />
                      </div>
                      {(phoneValidation.invalid || emailValidation.invalid) && (
                        <div>
                          <small>Please provide email or phone</small>
                        </div>
                      )}
                      <div />
                    </Fragment>
                  )}
                </Validation>
              )}
            </Validation>
            <button>Create account</button>
          </div>
        )}
      </Form>
    )
  }
}
```

## Known issues:

At the moment only supports static arrays.

## Acknowledgements

Library boilerplate starter: https://github.com/alexjoverm/typescript-library-starter

## Dependencies
