import React, { Component } from 'react';
import { connect } from 'react-redux';

import Aux from '../../hoc/Auxiliary/Auxiliary';
import Burger from "../../components/Burger/Burger";
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Modal from '../../components/UI/Modal/Modal';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHanlder from '../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../store/actions/index';

import axios from '../../axios-orders';

export class BurgerBuilder extends Component {
  state = {
    purchasing: false
  }

  componentDidMount() {
    this.props.onInitIngredients();
  }

  updatePurchaseState(ingredients) {
    const sum = Object.keys(ingredients)
      .map(igKey => {
        return ingredients[igKey]
      })
      .reduce((sum, el) => {
        return sum + el
      }, 0);
    return sum > 0;
  }

  purchaseHandler = () => {
    if (this.props.isAuthtenticated) {
      this.setState({ purchasing: true });
    } else {
      this.props.onSetAuthRedirectPath('/checkout');
      this.props.history.push("/auth");
    }
  }

  purchaseCancelHandler = () => {
    this.setState({ purchasing: false })
  }

  purchaseContinueHandler = () => {
    this.props.onInitPurchese();
    this.props.history.push('/checkout');
  }

  render() {
    const disabledInfo = {
      ...this.props.ings
    }
    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0;
    }
    let orderSummary = null
    let burger = this.props.error ? <p>Ingredients can't be loaded</p> : <Spinner />

    if (this.props.ings) {
      orderSummary = <OrderSummary 
        ingredients={this.props.ings}
        price={this.props.totalPrice}
        purchaseCancelled={this.purchaseCancelHandler}
        purchaseContinued={this.purchaseContinueHandler}
      />

      burger = (
        <Aux>
          <Burger ingredients={this.props.ings}/>
            <BuildControls 
              ingredientAdded = {this.props.onIngredientAdded}
              ingredientRemoved = {this.props.onIngredientRemoved}
              disabled={disabledInfo}
              price={this.props.totalPrice}
              purchasable={this.updatePurchaseState(this.props.ings)}
              ordered={this.purchaseHandler}
              isAuth={this.props.isAuthtenticated}
          />
        </Aux>
      )
    }
    
    return (
      <Aux>
        <Modal 
          show={this.state.purchasing}
          modalClosed={this.purchaseCancelHandler}>
          {orderSummary}
        </Modal>
        {burger}
      </Aux>
    );
  }
}

const mapStateToProps = state => {
  return {
    ings: state.burgerBuilder.ingredients,
    totalPrice: state.burgerBuilder.totalPrice,
    error: state.burgerBuilder.error,
    isAuthtenticated: state.auth.token !== null
  }
}

const mapDispatchToPropos = dispatch => {
  return {
    onIngredientAdded: (ingName) => dispatch(actions.addIngredient(ingName)),
    onIngredientRemoved: (ingName) => dispatch(actions.removeIngredient(ingName)),
    onInitIngredients: () => dispatch(actions.initIngredients()),
    onInitPurchese: () => dispatch(actions.purchaseInit()),
    onSetAuthRedirectPath: (path) => dispatch(actions.authRedirectPath(path))
  }
}

export default connect(mapStateToProps, mapDispatchToPropos)(withErrorHanlder(BurgerBuilder, axios));
