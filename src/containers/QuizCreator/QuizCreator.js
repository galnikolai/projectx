import React, {Component} from 'react'
import './QuizCreator.css'
import Button from '../../components/UI/Button/Button'
import Input from '../../components/UI/Input/Input'
import Select from '../../components/UI/Select/Select'
import {createControl, validate, validateFormControls} from '../../form/formFramework'
import Auxiliary from '../../hoc/Auxiliary/Auxiliary'
import {connect} from 'react-redux'
import {createQuizQuestion, finishCreateQuiz} from '../../store/actions/create'

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
class QuizCreator extends Component {
  state = {
    isFormValid: false,
    rightAnswerId: 1,
    formControls: createFormControl()
  }
  submitHandler = event => {
    event.preventDefault()
  }
  addQuestionHandler = event => {
    event.preventDefault()

    const {question, option1, option2, option3, option4 } = this.state.formControls
  
    const questionItem = {
      question: question.value,
      id: this.props.quiz.length + 1,
      rightAnswerId: this.state.rightAnswerId,
      answers: [
        {text: option1.value, id: option1.id},
        {text: option2.value, id: option2.id},
        {text: option3.value, id: option3.id},
        {text: option4.value, id: option4.id},
      ]
    }

    this.props.createQuizQuestion(questionItem)

    this.setState({
      isFormValid: false,
      rightAnswerId: 1,
      formControls: createFormControl()
    })
  }

  createQuizHandler = async event => {
    event.preventDefault()
    this.setState({
      isFormValid: false,
      rightAnswerId: 1,
      formControls: createFormControl()
    })
    this.props.finishCreateQuiz()
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
         <Button disabled={this.props.quiz.length === 0} type='success' onClick={this.createQuizHandler}>Create test</Button>
         </form>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    quiz: state.create.quiz,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    createQuizQuestion: item => dispatch(createQuizQuestion(item)),
    finishCreateQuiz: () => dispatch(finishCreateQuiz()),

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(QuizCreator)