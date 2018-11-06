# React Good Form

React form with validation. Supports nested objects and static arrays.

## Installation

```
npm install react-good-form
```

## Simple Example

Good Form supports basic validations such as *email*, *minLength*, *maxLength* etc. out of the box.

```JSX
import React from "react"
import { Form } from "react-good-form"

const Login = () => (
  <Form
    value={{
      email: "",
      password: ""
    }}
    onChange={credentials => {
      alert(JSON.stringify(credentials))
    }}
  >
    {({ Input, Validation }) => (
      <div>
        <h1>Create account</h1>
        <Validation for="email">
          {validation => (
            <div style={{ color: validation ? "red" : undefined }}>
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
            <div style={{ color: validation ? "red" : undefined }}>
              <label>Password</label>
              <Input type="password" minLength={5} for="password" />
              {validation &&
                validation.minLength && (
                  <div>
                    <small>Password must be atleast {validation.minLength.ruleValue} characters long</small>
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
export default Login
```

## Extendable

You can create arbitary rules easily with *regular expressions* or just by writing your own rule functions.

```JSX
<Validation for="email">
    {validation => (
    <div style={{ color: validation ? "red" : undefined }}>
        <label>Email</label>
        <Input rule={email => email.endsWith("hotmail.com")} email={true} for="email" />
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
<Validation for="password">
    {validation => (
    <div style={{ color: validation ? "red" : undefined }}>
        <label>Password</label>
        <Input type="password" regExp={/(123456|password)/} for="password" />
        {validation &&
        validation.minLength && (
            <div>
            <small>Your password is too hard to remember</small>
            </div>
        )}
    </div>
    )}
</Validation>
```


## Known issues:

At the moment only supports static arrays.

## Acknowledgements

Library boilerplate starter: https://github.com/alexjoverm/typescript-library-starter

## Dependencies
