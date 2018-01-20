import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

const INGREDIENT_PRICES = {
  salad: 0.5,
  cheese: 0.4,
  meat: 1.3,
  bacon: 0.7
}

const initialState = {
  ingredients: null,
  totalPrice: 4,
  error: false
}

const addIngredient = (state, action) => {
  const updateIngredient = { [action.ingredientName]: state.ingredients[action.ingredientName] + 1 };
  const updateIngredients = updateObject(state.ingredients, updateIngredient);      
  const updatedState = {
    ingredients: updateIngredients,
    totalPrice: state.totalPrice + INGREDIENT_PRICES[action.ingredientName]
  }
  return updateObject(state, updatedState);
}

const removeIngredient = (state, action) => {
  const updateIngredient = { [action.ingredientName]: state.ingredients[action.ingredientName] - 1 };
  const updateIngredients = updateObject(state.ingredients, updateIngredient);      
  const updatedState = {
    ingredients: updateIngredients,
    totalPrice: state.totalPrice + INGREDIENT_PRICES[action.ingredientName]
  }
  return updateObject(state, updatedState);
}

const setIngredients = (state, action) => {
  return updateObject(state, {
    ingredients: {
      salad: action.ingredients.salad,
      bacon: action.ingredients.bacon,
      cheese: action.ingredients.cheese,
      meat: action.ingredients.meat
    },
    error: false,
    totalPrice: 4
  });
}

const ingredientsFail = (state, action) => {
  return updateObject(state, { error: true });
}
const reducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case actionTypes.ADD_INGREDIENT: return addIngredient(state, action);
    case actionTypes.REMOVE_INGREDIENT: return removeIngredient(state, action);
    case actionTypes.SET_INGREDIENTS: return setIngredients(state, action);
    case actionTypes.FTECH_INGREDIENTS_FAILED: return ingredientsFail(state, action) ;
    default: return state;
  }
}

export default reducer;
