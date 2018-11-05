# React Good Form

React form with validation. Supports nested objects and static arrays.

## Installation

```
npm install react-good-form
```

## Usage

Good form supports common rules (`minLength`, `notEmpty`, `email`...). You can also define any arbitary rule as regular expression, using the `regExp` rule. Good Form also supports nested scopes inside the same form. Good Form will autofocus on the first invalid field when submit button is pressed.

```JSX
import React, { Fragment } from "react"
import { Form } from "react-good-form"

const initialPerson = {
  name: "",
  email: "",
  favoriteHockeyTeam: "",
  age: null,
  address: {
    street: "",
    city: "",
    postalCode: ""
  },
  pets: [
    {
      nickName: "Rufus"
    },
    { nickName: "Bjerker" }
  ]
}
const App = () => (
  <Form
    value={initialPerson}
    onChange={person => {
      alert(JSON.stringify(person))
    }}
  >
    {({ Root }) => (
      <Fragment>
        <h1>Person</h1>
        <Root>
          {({ Input, Validation, Sub }, person, onChange) => (
            <Fragment>
              <Validation for="name">
                {validation => (
                  <div style={{ color: validation ? "red" : undefined }}>
                    <label>Name</label>
                    <Input minLength={3} maxLength={50} name="name" />
                  </div>
                )}
              </Validation>
              <Validation for="email">
                {validation => (
                  <div style={{ color: validation ? "red" : undefined }}>
                    <label>Email</label>
                    <Input email={true} name="email" />
                  </div>
                )}
              </Validation>
              <Validation for="favoriteHockeyTeam">
                {validation => (
                  <div style={{ color: validation ? "red" : undefined }}>
                    <label>Hockey team</label>
                    <Input regExp={/TPS|Tappara/} name="favoriteHockeyTeam" />
                    {validation && (
                      <div>
                        <small>Favorite hockey team can only be TPS or Tappara</small>
                      </div>
                    )}
                  </div>
                )}
              </Validation>
              <Validation for="age">
                {validation => (
                  <div style={{ color: validation ? "red" : undefined }}>
                    <label>Age</label>
                    <Input
                      min={18}
                      max={200}
                      onChange={(e: any) => {
                        onChange({ age: parseInt(e.target.value, 10) })
                      }}
                      type="number"
                      name="age"
                    />
                    {validation &&
                      validation.min && (
                        <div>
                          <small>Age must be atleast {validation.min.ruleValue}</small>
                        </div>
                      )}
                  </div>
                )}
              </Validation>
              <h3>Address</h3>
              <ul>
                <Sub scope="address">
                  {({ Input, Validation }) => (
                    <Fragment>
                      <Validation for="street">
                        {validation => (
                          <li style={{ color: validation ? "red" : undefined }}>
                            <label>Street</label>
                            <Input minLength={3} maxLength={100} name="street" />
                          </li>
                        )}
                      </Validation>
                      <Validation for="city">
                        {validation => (
                          <li style={{ color: validation ? "red" : undefined }}>
                            <label>City</label>
                            <Input notEmpty={true} name="city" />
                          </li>
                        )}
                      </Validation>
                    </Fragment>
                  )}
                </Sub>
              </ul>
              <h3>Pets</h3>
              <ul>
                <Sub scope="pets">
                  {({ Input, Validation, Sub }, pets, onChange) => (
                    <Fragment>
                      {pets.map((pet, idx) => (
                        <Sub scope={idx}>
                          {({ Input, Validation }) => (
                            <Validation for="nickName">
                              {validation => (
                                <li style={{ color: validation ? "red" : undefined }}>
                                  <label>Nickname</label>
                                  <Input minLength={2} maxLength={50} name="nickName" />
                                </li>
                              )}
                            </Validation>
                          )}
                        </Sub>
                      ))}
                    </Fragment>
                  )}
                </Sub>
              </ul>
            </Fragment>
          )}
        </Root>
        <br />
        <button type="submit">Save person</button>
      </Fragment>
    )}
  </Form>
)
```

## Know issues:

At the moment only supports static arrays.

## Acknowledgements

Library boilerplate starter: https://github.com/alexjoverm/typescript-library-starter

## Dependencies
