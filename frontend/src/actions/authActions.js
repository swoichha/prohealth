import {AuthTypes} from '../constants/actionTypes';

import {AuthUrls} from '../constants/urls';

import {message} from 'antd';

import store from '../store/configureStore';

import {getUserToken} from '../utils/authUtils';

// states for login action
//
//
const requestLogin = creds => {
    return {
        type: AuthTypes.LOGIN_REQUEST,
        isFetching: true,
        isAuthenticated: false,
        creds,
    };
};

export const receiveLogin = user => {
    return {
        type: AuthTypes.LOGIN_SUCCESS,
        isFetching: false,
        isAuthenticated: true,
        token: user.token,
        is_doctor: user.is_doctor,
    };
};

const loginError = message => {
    return {
        type: AuthTypes.LOGIN_FAILURE,
        isFetching: false,
        isAuthenticated: false,
        message,
    };
};

//states for logout action
//
//
const requestLogout = creds => {
    return {
        type: AuthTypes.LOGOUT_REQUEST,
        isFetching: true,
        isAuthenticated: true,
    };
};

const receiveLogout = user => {
    return {
        type: AuthTypes.LOGOUT_SUCCESS,
        isFetching: false,
        isAuthenticated: false,
    };
};

// const logoutError = message => {
//     return {
//         type: AuthTypes.LOGOUT_FAILURE,
//         isFetching: false,
//         isAuthenticated: false,
//         message,
//     };
// };

const setUserProfile = payload => {
    return {
        type: AuthTypes.USER_PROFILE,
        payload: payload,
    };
};

// calls the API to get a token and dispatch the action
//
export function loginUser(creds, history) {
    let config = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(creds),
    };

    return dispatch => {
        // We dispatch requestLogin to kickoff the call to the API
        dispatch(requestLogin(creds));
        return fetch(AuthUrls.LOGIN, config)
            .then(response => {
                if (!response.ok) {
                    // If there was a problem, we want to
                    // dispatch the error condition
                    console.log(response);
                    switch (response.status) {
                        case 404:
                            dispatch(
                                loginError(
                                    'User with that email doesnot exists!',
                                ),
                            );
                            break;
                        case 400:
                            dispatch(
                                loginError(
                                    'The email or password you entered is incorrect! Please make sure your email or password is valid',
                                ),
                            );
                            break;
                        case 500:
                            dispatch(
                                loginError(
                                    'An error occured in the server. Please try again later.',
                                ),
                            );
                            break;
                        default:
                            dispatch(
                                loginError(
                                    'There was a error. Please try again later.',
                                ),
                            );
                    }
                    return Promise.reject();
                }
                return response.json();
            })
            .then(user => {
                // If login was successful, set the token in local storage
                localStorage.setItem('token', user.token);
                localStorage.setItem('user', JSON.stringify(user));
                localStorage.setItem('is_doctor', user.is_doctor);
                localStorage.setItem('user_id', user.id);

                // Dispatch the success action
                dispatch(receiveLogin(user));
                dispatch(setUserProfile(user));
                history.push('/');
            })
            .catch(err => console.log('Error: ', err));
    };
}

export function signupUser(creds, history) {
    let config = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(creds),
    };

    // We dispatch requestLogin to kickoff the call to the API
    return fetch(AuthUrls.USERS, config).then(response =>
        response.json().then(data => ({
            data,
            response,
        })),
    );
}

export function getUserProfile() {
    const token = getUserToken(store.getState());
    let config = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${token}`,
        },
    };

    return dispatch => {
        if (token) {
            fetch(AuthUrls.USER_PROFILE, config)
                .then(response => {
                    dispatch(setUserProfile(response.data));
                })
                .catch(error => {
                    // If request is bad...
                    // Show an error to the user
                    // console.log(error);
                    // TODO: send notification and redirect
                });
        }
    };
}

export function logoutUser(history) {
    let config = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${localStorage.getItem('token')}`,
        },
    };
    return dispatch => {
        dispatch(requestLogout());
        return fetch(AuthUrls.LOGOUT, config).then(response => {
            console.log(response);
            if (response.ok) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                localStorage.removeItem('is_doctor');
                localStorage.removeItem('user_id');
                history.push('/user/login/');
                dispatch(receiveLogout());
            } else {
                message.error('There was a problem logging out');
            }
        });
    };
}
