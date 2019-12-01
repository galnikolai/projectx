import React from 'react';
import {NavLink} from 'react-router-dom'
import './FinishedQuiz.css';
import Button from '../UI/Button/Button'

const FinishedQuiz = props => {
    const successCount = Object.keys(props.results).reduce((total, key) => {
        if (props.results[key] === 'success') {
            total++
        }
        return total
    }, 0)
    return (
        <div className='FinishedQuiz'>
          <ul>
              {props.quiz.map((quizItem, index) => {
                return (
                    <li key={index}>
                       <strong>{index + 1}</strong>{' '}
                       {quizItem.question}{' '}
                       {props.results[quizItem.id] === 'error' ? <span className='error'>x</span> : <span className='success'>v</span>}
                    </li>
                )
              })}
          </ul>
            <p>Right {successCount} from {props.quiz.length}</p>
            <Button onClick={props.onRetry} type="primary">Repeat</Button>
            <NavLink type="success" to='/'>Go to list of tests</NavLink>
        </div>
    )
}

export default FinishedQuiz;