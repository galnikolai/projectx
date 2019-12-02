import React, {Component} from 'react'
import './Auth.css'
import Button from '../../components/UI/Button/Button'
import Input from '../../components/UI/Input/Input'
import axios from 'axios'

function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

export default class Auth extends Component {
  state ={
    isFormValid: false,
    formControls: {
      email: {
        value: '',
        type: 'email',
        label: 'Email',
        errorMessage: 'Введите корректный email',
        valid: false,
        touched: false,
        validation: {
          required: true,
          email: true
        }
      },
      password: {
        value: '',
        type: 'password',
        label: 'Пароль',
        errorMessage: 'Введите корректный пароль',
        valid: false,
        touched: false,
        validation: {
          required: true,
          minlength: 6
        }
      },
    }
  }

  loginHandler = async () => {
    const authData = {
      email: this.state.formControls.email.value,
      password: this.state.formControls.password.value,
      returnSecureToken: true
    }
    try  {
      const response = await axios.post('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDtmnhlewWbLTJQTmBhGdIAwhOsUJ3HkOY', authData)
      console.log(response.data)
    } catch(e) {
      console.log(e)
    }
  }
  registerHandler = async () => {
    const authData = {
      email: this.state.formControls.email.value,
      password: this.state.formControls.password.value,
      returnSecureToken: true 
    }
    try  {
      const response = await axios.post('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDtmnhlewWbLTJQTmBhGdIAwhOsUJ3HkOY', authData)
      console.log(response.data)
    } catch(e) {
      console.log(e)
    }
  }
  submitHandler = event => {
    event.preventDefault()
  }

  validateControl(value, validation){
    if (!validation) {
      return true
    }
    let isValid = true

    if (validation.required) {
      isValid = value.trim() !== '' && isValid
    } 
    if (validation.email) {
      isValid = validateEmail(value) && isValid
    } 
    if (validation.minlength) {
      isValid = value.trim().length >= validation.minlength && isValid
    }
    
    return isValid
  }  
 onChangeHandler = (event, controlName) => {
    const formControls = {...this.state.formControls}
    const control = {...formControls[controlName]}

    control.value = event.target.value
    control.touched = true
    control.valid = this.validateControl(control.value, control.validation)

    formControls[controlName] = control

    let isFormValid = true
    Object.keys(formControls).forEach(name => {
      isFormValid = formControls[name].valid && isFormValid
    })
    this.setState({
      formControls,
      isFormValid
    })
  }
  renderInputs() {
    return Object.keys(this.state.formControls).map((controlName, index) => {
       const control = this.state.formControls[controlName]
       return (
        <Input
        key={controlName + index}
        type={control.type}
        value={control.value}
        valid={control.valid}
        touched={control.touched}
        label={control.label}
        errorMessage={control.errorMessage}
        shouldValidate={!!control.validation}
        onChange={event => this.onChangeHandler(event, controlName)}
        />
      )
    })
  }
  render() {
    return (
      <div className='Auth'>
        <div>
        <h1>Authorization</h1>

        <form className='AuthForm' onSubmit={this.submitHandler}>
          { this.renderInputs() }
          <Button 
          type='success'
          onClick={this.loginHandler}
          disabled={!this.state.isFormValid}
          >
            Войти
          </Button>
          <Button 
          type='primary'
          onClick={this.registerHandler}
          disabled={!this.state.isFormValid}
          >
            Зарегистрироваться
          </Button>
        </form>
        </div>
      </div>
    )
  }
}