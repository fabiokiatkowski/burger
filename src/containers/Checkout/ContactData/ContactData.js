import React, { Component } from 'react';

import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';
import axios from '../../../axios-orders';

import classes from './ContactDate.css';

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
        valid: false,
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
        valid: false,
        touched: false
      },
      zipCode: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Your Code'
        },
        value: '',
        validation: {
          required: true,
          minLength: 8,
          maxLength: 8
        },
        valid: false,
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
        valid: false,
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
          required: true
        },
        valid: false,
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
        value: ''
      }
    },
    loading: false
   }

  orderHandler = (event) => {
    event.preventDefault();
    this.setState({ loading: true })
    const formData = {}
    for (let el in this.state.orderForm) {
      formData[el] = this.state.orderForm[el].value;
    }
    const order = {
      ingredients: this.props.ingredients,
      price: this.props.price,
      orderData: formData
    }

    axios.post('/orders.json', order)
      .then(res => {
        this.setState({ loading: false });
        this.props.history.push('/');
      })
      .catch(err => this.setState({ loading: false }));
  }

  checkValidity(value, rules) {
    let isValid = true;
    if (rules.required) {
      isValid = value.trim() !== '' && isValid;
    }
    if (rules.minLength) {
      isValid = value.length >= rules.minLength && isValid
    }
    if (rules.maxLength) {
      isValid = value.length <= rules.maxLength && isValid
    }

    return isValid;
  }

  inputChangedHandler = (event, inputIdentifier) => {
    const formData = {
      ...this.state.orderForm
    }
    const elementData = {
      ...formData[inputIdentifier]
    }
    elementData.value = event.target.value;
    elementData.valid = this.checkValidity(elementData.value, elementData.validation)
    elementData.touched = true;
    formData[inputIdentifier]=elementData;
    console.log(elementData);
    this.setState({orderForm: formData});
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
            invalid={!arr.config.valid}
            touched={arr.config.touched}
            changed={(event) => this.inputChangedHandler(event, arr.id)}/>
        ))}
        <Button btnType="Success">Order</Button>
      </form>
      );
    
    if (this.state.loading) {
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

export default ContactData;
