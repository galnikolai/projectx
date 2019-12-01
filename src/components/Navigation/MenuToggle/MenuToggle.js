import React from 'react'
import './MenuToggle.css'

const MenuToggle = props => {
    return (
       !props.isOpen ? <i className='MenuToggle' onClick={props.onToggle}>=</i> : <i className='MenuToggle open' onClick={props.onToggle}>x</i>
    )
}

export default MenuToggle;