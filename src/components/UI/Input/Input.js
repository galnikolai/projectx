import React from 'react'
import './Input.css'

function isInValid({valid, touched, shouldValidate}) {
   return !valid && shouldValidate && touched
}

const Input = props => {
  const inputType = props.type || 'text'
  const htmlFor = `${inputType}-${Math.random()}`

  return (
    <div className={`Input ${isInValid(props) ? 'invalid' : ''}`}>
       <label htmlFor={htmlFor}>{props.label}</label>
       <input 
       type={inputType}
       id={htmlFor}
       value={props.value}
       onChange={props.onChange}
       ></input>
       {isInValid(props) ? <span>{props.errorMessage || 'Введите верное значение'}</span> : null}
    </div>
  )
}

export default Input