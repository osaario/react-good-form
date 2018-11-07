# React Good Form

React form with validation. Supports nested structures with objects and arrays.

## Installation

```
npm install react-good-form
```

## Simple Example

**Good Form** supports basic validations such as `email`, `minLength`, `maxLength` etc. out of the box. It automatically emits `onChange` events and provides values for fields.

```JSX
import React from "react"
import { Form } from "react-good-form"

class Login extends React.Component {
  state = {
    email: "",
    password: ""
  }
  render() {
    return (
      <Form
        value={this.state}
        onChange={person => {
          this.setState(person)
        }}
        onSubmit={() => {
          alert("Login with credentials: " + JSON.stringify(this.state))
        }}
      >
        {({ Input, Validation }) => (
          <div>
            <h1>Log in</h1>
            <Validation for="email">
              {validation => (
                <div style={{ color: validation && "red" }}>
                  <label>Email</label>
                  <Input email={true} for="email" />
                  {validation && (
                    <div>
                      <small>Invalid email</small>
                    </div>
                  )}
                </div>
              )}
            </Validation>
            <Validation for="password">
              {validation => (
                <div style={{ color: validation && "red" }}>
                  <label>Password</label>
                  <Input type="password" for="password" minLength={5} />
                  {validation &&
                    validation.minLength && (
                      <div>
                        <small>Password must be atleast {validation.minLength.ruleValue} characters.</small>
                      </div>
                    )}
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
export default Login
```

## Extendable

You can create arbitary rules easily with *regular expressions* or just by writing your own rule functions.

```JSX
<Validation for="email">
  {validation => (
    <div style={{ color: validation ? "red" : undefined }}>
      <label>Email</label>
      <Input
        rule={email => email.endsWith("hotmail.com")}
        onChange={e => {
          this.setState({
            email: e.target.value
          })
        }}
        email={true}
        value={this.state.email}
        for="email"
      />
      {validation &&
        (validation.email ? (
          <div>
            <small>Invalid email</small>
          </div>
        ) : (
          <div>
            <small>Needs to be hotmail address for some reason</small>
          </div>
        ))}
    </div>
  )}
</Validation>
```

```JSX
<Validation for="password">
  {validation => (
    <div style={{ color: validation ? "red" : undefined }}>
      <label>Password</label>
      <Input
        onChange={e => {
          this.setState({
            password: e.target.value
          })
        }}
        type="password"
        value={this.state.password}
        regExp={/(123456|password)/}
        for="password"
      />
      {validation &&
        validation.regExp && (
          <div>
            <small>Your password is too hard to remember</small>
          </div>
        )}
    </div>
  )}
</Validation>
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
              {validation => (
                <div style={{ color: validation && "red" }}>
                  <label>Street</label>
                  <Input for={["address", "street"]} minLength={5} maxLength={100} />
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

## Known issues:

At the moment only supports static arrays.

## Acknowledgements

Library boilerplate starter: https://github.com/alexjoverm/typescript-library-starter

## Dependencies
