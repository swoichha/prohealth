export const ROOT_URL = 'http://localhost:8000';

export const AuthUrls = {
    LOGIN: `${ROOT_URL}/api/login/`,
    USERS: `${ROOT_URL}/api/users/`,
    LOGOUT: `${ROOT_URL}/api/logout/`,
    UPDATE_PASSWORD: `${ROOT_URL}/api/update-password/`,
    USER_PROFILE: `${ROOT_URL}/api/user-profiles/`,
    DOCTOR_PROFILE: `${ROOT_URL}/api/doctor-profiles/`,
}

export const QueryUrls = {
    USER_QUERY: `${ROOT_URL}/api/user-query/`,
    APPOINTMENT: `${ROOT_URL}/api/appointment/`,
    PESCRIPTION: `${ROOT_URL}/api/pescribe/`,
}
