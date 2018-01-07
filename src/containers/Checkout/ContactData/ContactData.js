import React, { Component } from 'react';

import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import axios from '../../../axios-orders';
import classes from './ContactDate.css';

class ContactData extends Component {
  state = {
    name: '',
    email:'',
    address: {
      street:'',
      postCode:''
    },
    loading: false
   }

  orderHandler = (event) => {
    event.preventDefault();

    this.setState({ loading: true })
    const order = {
      ingredients: this.props.ingredients,
      price: this.props.price,
      customer: {
        name: 'Fabio Kiatkowski',
        address: {
          street: 'Sebastiao Pereira',
          zipCode: '89255074',
          contry: 'Brazil'
        },
        email: 'xolla@xolla.com.br'
      },
      deliveryMethod: 'fastest'
    }

    axios.post('/orders.json', order)
      .then(res => {
        this.setState({ loading: false });
        this.props.history.push('/');
      })
      .catch(err => this.setState({ loading: false }));
  }

  render() {
    let form = (
      <form action="">
        <input className={classes.Input} type="text" name="name" id="name" placeholder="Your Name"/>
        <input className={classes.Input} type="text" name="email" id="email" placeholder="Your Email"/>
        <input className={classes.Input} type="text" name="street" id="street" placeholder="Your Street"/>
        <input className={classes.Input} type="text" name="postal" id="postal" placeholder="Your Postal"/>
        <Button btnType="Success" clicked={this.orderHandler}>Order</Button>
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
