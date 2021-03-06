import * as actionTypes from './actionTypes';

import axios from '../../axios-orders';

export const purchaseBugerSuccess = (id, orderData) => {
  return {
    type: actionTypes.PURCHASE_BURGER_SUCCESS,
    orderId: id,
    orderData: orderData
  };
};

export const purchaseBugerFail = (error) => {
  return {
    type: actionTypes.PURCHASE_BURGER_FAIL,
    error: error
  };
};

export const purchaseBugerStart = () => {
  return {
    type: actionTypes.PURCHASE_BURGER_START
  }
}

export const purchaseBuger = ( orderData, tokenId ) => {
  return dispatch => {
    dispatch(purchaseBugerStart());
    axios.post(`/orders.json?auth=${tokenId}`, orderData)
      .then(res => dispatch(purchaseBugerSuccess(res.data.name, orderData)))
      .catch(err => dispatch(purchaseBugerFail(err)));
  };
};

export const purchaseInit = () => {
  return {
    type: actionTypes.PURCHASE_INIT
  };
};

export const fetchOrdersSuccess = (orders) => {
  return {
    type: actionTypes.FETCH_ORDERS_SUCCESS,
    orders: orders
  };
};

export const fetchOrdersFail = (error) => {
  return {
    type: actionTypes.FETCH_ORDERS_FAIL,
    error: error
  };
};

export const fetchOrdersStart = () => {
  return {
    type: actionTypes.FETCH_ORDERS_START
  };
};


export const fetchOrders = (tokenId, userId) => {
  return dispatch => {
    dispatch(fetchOrdersStart());
    const queryParams = `?auth=${tokenId}&orderBy="userId"&equalTo="${userId}"`
    axios.get(`/orders.json${queryParams}`)
      .then(res => {
        const fetchedOrders = [];
        for (let key in res.data) {
          fetchedOrders.push({
            ...res.data[key],
            id: key
          });
        }
        dispatch(fetchOrdersSuccess(fetchedOrders));
      })
      .catch(err => {
        dispatch(fetchOrdersFail(err));
      });
  };
};