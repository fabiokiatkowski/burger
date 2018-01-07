import React from 'react';

import classes from './Input.css';

const input = (props) => {
  let inputElement = null;
  const inputClasses = [classes.InputElement]

  if (props.invalid && props.shouldValidate && props.touched) {
    inputClasses.push(classes.Invalid)
  }

  switch (props.elementType) {
    case ('input') :
      inputElement = <input
        className={inputClasses.join(' ')}
        onChange={props.changed}
        value={props.value}
        {...props.elementConfig}/>;
      break;
    case ('textarea'):
      inputElement = <textarea
        className={inputClasses.join(' ')}
        onChange={props.changed}
        value={props.value}
        {...props.elementConfig}/>;
      break;
    case ('select'):
      inputElement = (
        <select
          className={inputClasses.join(' ')}
          onChange={props.changed}
          value={props.value}>
          {props.elementConfig.options.map(o => (
            <option 
              key={o.value}
              value={o.value}>{o.displayValue}</option>
          ))}
        </select>
      );
      break;
    default:
      inputElement = <input
        className={inputClasses.join(' ')}
        onChange={props.changed}
        value={props.value}
        {...props.elementConfig}/>;
  }
  
  let validationError = null;
  if (props.invalid && props.touched) {
    validationError = <p className={classes.ValidationError}>{props.errorMessage}</p>
  }
  
  return (
    <div className={classes.Input}>
      <label className={classes.Label}>{props.label}</label>
      {inputElement}
      {validationError}
    </div>
  );
}

export default input;