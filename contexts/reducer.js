let user;

if (typeof window !== 'undefined') {
  user = JSON.parse(localStorage.getItem('currentUser'));
}

// user is the same object used to sign jwts
export const initialState = {
  user: '' || user,
  err: null
}

export function authReducer(initialState, action) {
  switch (action.type) {
    case 'loginSuccess':
      return {
        ...initialState,
        user: action.payload.user
      };
    case 'logout':
      return {
        ...initialState,
        user: ''
      };
    case 'loginFailure':
      return {
        ...initialState,
        err: action.payload.errMessage
      };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};