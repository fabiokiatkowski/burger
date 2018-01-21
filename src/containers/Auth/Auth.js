import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import Spinner from '../../components/UI/Spinner/Spinner';
import { updateObject, checkValidity } from '../../shared/utility';
import * as actions from '../../store/actions/index';

import classes from './Auth.css';

class Auth extends Component {
  state = { 
    controls: {
      email: {
        elementType: 'input',
        elementConfig: {
          type: 'email',
          placeholder: 'Mail Address'
        },
        value: '',
        validation: {
          required: true,
          isEmail: true
        },
        valid:  {
          value: false,
          errorMessage: null
        },
        touched: false
      },
      password: {
        elementType: 'input',
        elementConfig: {
          type: 'password',
          placeholder: 'Password'
        },
        value: '',
        validation: {
          required: true,
          minLength: 6
        },
        valid:  {
          value: false,
          errorMessage: null
        },
        touched: false
      }
    },
    isSignup: true
  }

  componentDidMount() {
    if (!this.props.building && this.props.authRedirectPath !== '/') {
      this.props.onSetAuthRedirectPath()
    }
  }

  inputChangedHandler = (event, controlName) => {
    const updateControls = updateObject(this.state.controls, {
      [controlName]: updateObject(this.state.controls[controlName],
        {
          value: event.target.value,
          valid: updateObject(this.state.controls[controlName].valid,
            {
              value: checkValidity(event.target.value, this.state.controls[controlName].validation)
            },
          ),
          touched: true
        }
      )
    });
    this.setState({ controls: updateControls });
  }

  swithAuthModeHandler = () => {
    this.setState(prevState => {
      return { isSignup: !prevState.isSignup }
    })
  }

  submitHandler = (event) => {
    event.preventDefault();
    this.props.onAuth(
      this.state.controls.email.value,
      this.state.controls.email.value,
      this.state.isSignup);
  }

  render() {
    const fromElementArray=[];
    for (let key in this.state.controls) {
      fromElementArray.push({
        id: key,
        config: this.state.controls[key]
      });
    }

    let form = fromElementArray.map(arr => (
      <Input 
        key={arr.id}
        elementType={arr.config.elementType}
        elementConfig={arr.config.elementConfig}
        value={arr.config.value}
        shouldValidate={arr.config.validation}
        invalid={!arr.config.valid.value}
        errorMessage={arr.config.valid.errorMessage}
        touched={arr.config.touched}
        changed={(event) => this.inputChangedHandler(event, arr.id)}
      />
    ));

    if (this.props.loading) {
      form = <Spinner />
    }

    let errorMessage = null;
    if(this.props.error) {
      errorMessage = (
        <p>{this.props.error.message}</p>
      )
    }

    let authRedirect = null
    if (this.props.isAuthenticated) {
      authRedirect = <Redirect to={this.props.authRedirectPath} />
    }

    return (
      <div className={classes.Auth}>
        {authRedirect}
        {errorMessage}
        <form onSubmit={this.submitHandler}>
          {form}
          <Button btnType="Success">Submit</Button>
        </form>
        <Button 
          btnType="Danger"
          clicked={this.swithAuthModeHandler}>
          Swith to {this.state.isSignup ? 'SignIn' : 'SignUp'}
        </Button>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    loading: state.auth.loading,
    error: state.auth.error,
    isAuthenticated: state.auth.token !== null,
    building: state.burgerBuilder.building,
    authRedirectPath: state.auth.authRedirectPath
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onAuth: (email, password, isSignup) => dispatch(actions.auth(email, password, isSignup)),
    onSetAuthRedirectPath: () => dispatch(actions.authRedirectPath('/'))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Auth);