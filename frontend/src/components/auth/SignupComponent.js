import React, {Component} from 'react';
import {withRouter} from 'react-router';
import _ from 'lodash';
import {AuthUrls} from '../../constants/urls';
import {signupUser} from '../../actions/authActions';
import {
    Form,
    message,
    Icon,
    Input,
    Button,
    DatePicker,
    Select,
    Alert,
    Checkbox,
} from 'antd';
// import validate from '../../utils/validate';

const FormItem = Form.Item;
const Option = Select.Option;

class SignupComponent extends Component {
    // constructor and state initialization

    constructor(props) {
        super(props);

        this.state = {
            first_name: '',
            last_name: '',
            email: '',
            password: '',
            password2: '',
            is_doctor: false,
            date_of_birth: '',
            gender: '',

            formErrors: {},
            nonFieldErrors: '',
            emailValid: false,
            passwordValid: false,
            formValid: true,
        };
    }

    // state change and management
    //

    handleChange = e => {
        let name = e.target.name;
        let value = e.target.value;
        this.setState({[name]: value}, () => {
            this.validateField(name, value);
        });
    };

    // form fields validation
    //
    handleCheckbox = e => {
        console.log(e);
        this.setState({'is_doctor': e.target.checked});
    };

    handleSelectChange = value => {
        this.setState({gender: value});
    };

    onDateChange = (date, dateString) => {
        this.setState({date_of_birth: dateString});
    };

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
            case 'password2':
                passwordValid = value === this.state.password;
                fieldValidationErrors.password = passwordValid
                    ? ''
                    : 'passwords do not match';
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
        const form_data = _.pick(this.state, [
            'first_name',
            'last_name',
            'email',
            'password',
            'is_doctor',
            'gender',
            'date_of_birth',
        ]);

        this.props.dispatch(signupUser(form_data, this.props.history));
    };

    render() {
        return (
            <div>
                <h1 className="heading-primary u-margin-top-small">Signup</h1>
                {this.state.nonFieldErrors && (
                    <div className="u-margin-bottom-small">
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
                        <FormItem>
                            <label>First Name</label>
                            <Input
                                prefix={<Icon type="user" />}
                                placeholder="First Name"
                                type="text"
                                name="first_name"
                                onChange={this.handleChange}
                            />
                        </FormItem>
                        <FormItem>
                            <label>Last Name</label>
                            <Input
                                prefix={<Icon type="user" />}
                                placeholder="Last Name"
                                type="text"
                                name="last_name"
                                onChange={this.handleChange}
                            />
                        </FormItem>
                        <FormItem
                            validateStatus={
                                !this.state.formErrors.email
                                    ? 'success'
                                    : 'error'
                            }>
                            <label>email</label>
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
                            <label>password</label>
                            <Input
                                prefix={<Icon type="lock" />}
                                placeholder="password"
                                type="password"
                                name="password"
                                onChange={this.handleChange}
                            />
                        </FormItem>
                        <FormItem
                            validateStatus={
                                !this.state.formErrors.password
                                    ? 'success'
                                    : 'error'
                            }>
                            <label>Confirm password</label>
                            <Input
                                prefix={<Icon type="lock" />}
                                placeholder="Confirm password"
                                type="password"
                                name="password2"
                                onChange={this.handleChange}
                            />
                        </FormItem>

                        <FormItem>
                            <label>Date Of Birth</label>
                            <br />
                            <DatePicker onChange={this.onDateChange} />
                        </FormItem>

                        <FormItem>
                            <label>Gender</label>
                            <br />
                            <Select
                                showSearch
                                style={{width: 200}}
                                placeholder="Gender"
                                name="gender"
                                onChange={this.handleSelectChange}>
                                <Option value="M">Male</Option>
                                <Option value="F">Female</Option>
                            </Select>
                        </FormItem>

                        <FormItem>
                            <Checkbox
                                onChange={this.handleCheckbox}
                                name="is_doctor"
                            />
                            <span>Signup as a Doctor</span>
                            <p>Select this option if you are a Doctor.</p>
                        </FormItem>
                        <Button
                            type="primary"
                            htmlType="submit"
                            disabled={!this.state.formValid}
                            className="login-form-button">
                            Signup
                        </Button>
                    </Form>
                </div>
            </div>
        );
    }
}

export default withRouter(SignupComponent);
