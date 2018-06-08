import React, {Component} from 'react';
import _ from 'lodash';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';

import store from '../../store/configureStore';
import {loginAction} from '../../actions/authActions';
import {AuthUrls} from '../../constants/urls';
// import store from '../../store/configureStore';
import {Form, Icon, Input, Button, Alert} from 'antd';
const FormItem = Form.Item;

class LoginComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',

            formErrors: {},
            emailValid: false,
            passwordValid: false,
            formValid: false,
            nonFieldErrors: '',
        };
    }

    handleChange = e => {
        let name = e.target.name;
        let value = e.target.value;
        this.setState({[name]: value}, () => {
            this.validateField(name, value);
        });
    };

    // form fields validation

    validateField = (fieldName, value) => {
        let fieldValidationErrors = this.state.formErrors;
        let emailValid = this.state.emailValid;
        let passwordValid = this.state.passwordValid;

        switch (fieldName) {
            case 'email':
                emailValid = value.match(
                    /^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i,
                );
                fieldValidationErrors.email = emailValid ? '' : ' is invalid';
                break;
            case 'password':
                passwordValid = value.length >= 6;
                fieldValidationErrors.password = passwordValid
                    ? ''
                    : ' is too short';
                break;
            default:
                break;
        }
        this.setState(
            {
                formErrors: fieldValidationErrors,
                emailValid: emailValid,
                passwordValid: passwordValid,
            },
            this.validateForm,
        );
    };

    validateForm = () => {
        this.setState({
            formValid: this.state.emailValid && this.state.passwordValid,
        });
    };

    // form submittion

    handleSubmit = event => {
        event.preventDefault();
        const form_data = _.pick(this.state, ['email', 'password']);
        fetch(AuthUrls.LOGIN, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(form_data),
        })
            //.then(response => this.handleErrors(response))
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw Error(
                    'Some thing went wrong! Please make sure the credentials are valid',
                );
            })
            .then(data => {
                this.setState({nonFieldErrors: ''});
                localStorage.setItem('authentication', data['key']);
                localStorage.setItem('authenticated', true);
                store.dispatch(loginAction(data['key']));
                this.props.history.push('/');
            })
            .catch(error => {
                this.setState({nonFieldErrors: error.message});
            });
    };

    render() {
        return (
            <div>
                <h1 className="heading-primary u-margin-top-small">Login</h1>
                {this.state.nonFieldErrors && (
                    <div className="section section--form">
                        <Alert
                            message="error"
                            type="error"
                            showIcon
                            description={this.state.nonFieldErrors}
                        />
                    </div>
                )}
                <div>
                    <Form className="login-form" onSubmit={this.handleSubmit}>
                        <FormItem
                            validateStatus={
                                !this.state.formErrors.email
                                    ? 'success'
                                    : 'error'
                            }>
                            <label htmlFor="email">email</label>
                            <Input
                                prefix={<Icon type="user" />}
                                placeholder="email"
                                type="email"
                                name="email"
                                onChange={this.handleChange}
                            />
                        </FormItem>
                        <FormItem
                            validateStatus={
                                !this.state.formErrors.password
                                    ? 'success'
                                    : 'error'
                            }>
                            <label htmlFor="password">password</label>
                            <Input
                                prefix={<Icon type="lock" />}
                                placeholder="password"
                                type="password"
                                name="password"
                                onChange={this.handleChange}
                            />
                        </FormItem>
                        <FormItem>
                            <Button
                                type="primary"
                                htmlType="submit"
                                disabled={!this.state.formValid}
                                className="login-form-button u-margin-bottom-small">
                                Log In
                            </Button>
                            <div>
                                Or <Link to="/signup"> register now!</Link>
                                <p>
                                    <Link
                                        to="/reset-password">
                                        Forgot password
                                    </Link>
                                </p>
                            </div>
                        </FormItem>
                    </Form>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        authenticated: state.auth.authenticated,
    };
};

export default connect(mapStateToProps)(LoginComponent);
