export const userReducer = (state, action) => {
    switch (action.type) {
      case "NAME":
        return { ...state, userName: action.payload[0] };
      case "EMAIL":
        return { ...state, userEmail: action.payload[0] };
      case "TEL":
        return { ...state, userPhone: action.payload[0] };
      default:
        throw Error("reducer error");
    }
  };
  