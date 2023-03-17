let user;

// user is the same object used to sign jwts
export const initialState = {
  // user: 'signed out' || user,
  user: 'signed out',
  err: null
}

export function authReducer(initialState, action) {
  switch (action.type) {
    case 'loginSuccess':
      return {
        user: action.payload.user,
        err: action.payload.errMessage
      };
    case 'logout':
      return {
        ...initialState,
        user: 'signed out'
      };
    case 'loginFailure':
      return {
        user: false,
        err: action.payload.errMessage
      };
    case 'updateFav':
      return {
        ...initialState,
        user: action.payload.user
      }
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

