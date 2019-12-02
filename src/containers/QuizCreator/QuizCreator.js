import React, {Component} from 'react'
import './QuizCreator.css'
import Button from '../../components/UI/Button/Button'
import Input from '../../components/UI/Input/Input'
import Select from '../../components/UI/Select/Select'
import {createControl, validate, validateFormControls} from '../../form/formFramework'
import Auxiliary from '../../hoc/Auxiliary/Auxiliary'
import axios from '../../axios/axios-quiz'

function createOptionControl(number) {
  return createControl({
    label: `Вариант ${number}`,
    isFormValid: false,
    errorMessage: 'Значение не может быть пустым',
    id: number
  }, {required: true})
}
function createFormControl() {
  return {
      question: createControl({
        label: 'Введите вопрос',
        errorMessage: 'Вопрос не может быть пустым'
      }, {required: true}),
      option1: createOptionControl(1),
      option2: createOptionControl(2),
      option3: createOptionControl(3),
      option4: createOptionControl(4),
    }
}
export default class QuizCreator extends Component {
  state = {
    quiz: [],
    isFormValid: false,
    rightAnswerId: 1,
    formControls: createFormControl()
  }
  submitHandler = event => {
    event.preventDefault()
  }
  addQuestionHandler = event => {
    event.preventDefault()

    const quiz = this.state.quiz.concat()
    const index = quiz.length + 1

    const {question, option1, option2, option3, option4, option5, option6 } = this.state.formControls
  
    const questionItem = {
      question: question.value,
      id: index,
      rightAnswerId: this.state.rightAnswerId,
      answers: [
        {text: option1.value, id: option1.id},
        {text: option2.value, id: option2.id},
        {text: option3.value, id: option3.id},
        {text: option4.value, id: option4.id},
      ]
    }
    quiz.push(questionItem)

    this.setState({
      quiz,
      isFormValid: false,
      rightAnswerId: 1,
      formControls: createFormControl()
    })
  }

  createQuizHandler = async event => {
    event.preventDefault()
    try {
      await axios.post('/quizes.json', this.state.quiz)
      this.setState({
        quiz: [],
        isFormValid: false,
        rightAnswerId: 1,
        formControls: createFormControl()
      })
    } catch (e) {
      console.log(e)
    }
    console.log(this.state.quiz)
  }

  changeHandler = (value, controlName) => {
    const formControls = {...this.state.formControls}
    const control = {...formControls[controlName]}

    control.touched = true
    control.value = value
    control.valid = validate(control.value, control.validation)

    formControls[controlName] = control

    this.setState({
      formControls, 
      isFormValid: validateFormControls(formControls)
    })
  }
  renderInputs = () => {
    return Object.keys(this.state.formControls).map((controlName ,index) => {
      const control = this.state.formControls[controlName]
      return (
        <Auxiliary key={controlName + index}>
        <Input 
        label={control.label}
        value={control.value}
        valid={control.valid}
        shouldValidate={!!control.validation}
        touched={control.touched}
        errorMessage={control.errorMessage}
        onChange={event => this.changeHandler(event.target.value, controlName)}
        />
        {index === 0 && <hr />}
        </Auxiliary>
      )
    })
  }
  selectChangeHandler = event => {
        this.setState({
          rightAnswerId: +event.target.value
        })
  }
  render() {
    return (
      <div className='QuizCreator'>
        <div>
         <h1>Quiz Creator</h1>
         <form onSubmit={this.submitHandler}>
           {this.renderInputs()}
         <Select
         label='Выберите правильный ответ'
         value={this.state.rightAnswerId}
         onChange={this.selectChangeHandler}
         options={[
           {text: 1, value: 1},
           {text: 2, value: 2},
           {text: 3, value: 3},
           {text: 4, value: 4}
         ]}
         ></Select>
         <Button disabled={!this.state.isFormValid} type='primary' onClick={this.addQuestionHandler}> Add question</Button>
         <Button disabled={this.state.quiz.length === 0} type='success' onClick={this.createQuizHandler}>Create test</Button>
         </form>
        </div>
      </div>
    )
  }
}