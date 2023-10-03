const initialState = {
  user: {
    email: "",
    username: "",
    display_picture: "",
  },
};
const errorReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_USER":
      const newUser = { ...state.user };
      for (let key in action.payload) {
        newUser[key] = action.payload[key];
      }
      return {
        ...state,
        user: newUser,
      };
    default:
      return state;
  }
};

export default errorReducer;
