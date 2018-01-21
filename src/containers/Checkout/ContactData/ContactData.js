import React, { Component } from 'react';
import { connect } from 'react-redux';

import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';
import axios from '../../../axios-orders';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../../store/actions/index';
import { updateObject, checkValidity } from '../../../shared/utility';

import classes from './ContactData.css';

class ContactData extends Component {
  state = {
    orderForm : {
      name: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Your Name'
        },
        value: '',
        validation: {
          required: true
        },
        valid:  {
          value: false,
          errorMessage: 'Please enter a valid name'
        },
        touched: false
      },
      street: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Your Street'
        },
        value: '',
        validation: {
          required: true
        },
        valid:  {
          value: false,
          errorMessage: 'Please enter a valid street'
        },
        touched: false
      },
      zipCode: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Your Zipcode'
        },
        value: '',
        validation: {
          required: true,
          minLength: 8,
          maxLength: 8
        },
        valid: {
          value: false,
          errorMessage: 'Please enter a valid zipcode'
        },
        touched: false
      },
      country: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Your Country'
        },
        value: '',
        validation: {
          required: true
        },
        valid:  {
          value: false,
          errorMessage: 'Please enter a valid country'
        },
        touched: false
      },
      email: {
        elementType: 'input',
        elementConfig: {
          type: 'email',
          placeholder: 'Your Email'
        },
        value: '',
        validation: {
          required: true,
          isEmail: true
        },
        valid:  {
          value: false,
          errorMessage: 'Please enter a valid email'
        },
        touched: false
      },
      deliveryMethod: {
        elementType: 'select',
        elementConfig: {
          options: [{
            value: 'fastest',
            displayValue: 'Fastest'
          },
          {
            value: 'chippest',
            displayValue: 'Chippest'
          }
        ]
        },
        value: 'fastest',
        validation: {},
        valid:  {
          value: true,
          errorMessage: ''
        }
      }
    },
    formIsValid: false
   }

  orderHandler = (event) => {
    event.preventDefault();
    const formData = {}
    for (let el in this.state.orderForm) {
      formData[el] = this.state.orderForm[el].value;
    }
    const order = {
      ingredients: this.props.ings,
      price: this.props.totalPrice,
      orderData: formData,
      userId: this.props.userId
    }
    this.props.onOrderBurger(order, this.props.tokenId);
  }

  inputChangedHandler = (event, inputIdentifier) => {
    const updateValidValue = updateObject(
      this.state.orderForm[inputIdentifier].valid, 
      {
        value: checkValidity(event.target.value, this.state.orderForm[inputIdentifier].validation)
      }
    );

    const elementData = updateObject(this.state.orderForm[inputIdentifier], {
      value: event.target.value,
      valid: updateValidValue,
      touched: true
    });
    const formData = updateObject(this.state.orderForm,
    {
      [inputIdentifier]: elementData
    })

    let formIsValid = true;
    for (let i in formData) {
      formIsValid = formData[i].valid.value && formIsValid
    }

    this.setState({orderForm: formData, formIsValid: formIsValid});
  }

  render() {
    const fromElementArray=[];
    for (let key in this.state.orderForm) {
      fromElementArray.push({
        id: key,
        config: this.state.orderForm[key]
      });
    }
    let form = (
      <form onSubmit={this.orderHandler}>
        {fromElementArray.map(arr => (
          <Input
            key={arr.id}
            elementType={arr.config.elementType}
            elementConfig={arr.config.elementConfig}
            value={arr.config.value}
            shouldValidate={arr.config.validation}
            invalid={!arr.config.valid.value}
            errorMessage={arr.config.valid.errorMessage}
            touched={arr.config.touched}
            changed={(event) => this.inputChangedHandler(event, arr.id)}/>
        ))}
        <Button btnType="Success" disabled={!this.state.formIsValid}>Order</Button>
      </form>
      );
    
    if (this.props.loading) {
      form = <Spinner />
    }
    return (
      <div className={classes.ContactData}>
        <h4>Enter your Contact Data</h4>
        {form}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    ings: state.burgerBuilder.ingredients,
    totalPrice: state.burgerBuilder.totalPrice,
    loading: state.order.loading,
    tokenId: state.auth.token,
    userId: state.auth.userId
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onOrderBurger: (order, tokenId) => dispatch(actions.purchaseBuger(order, tokenId))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(ContactData, axios));
