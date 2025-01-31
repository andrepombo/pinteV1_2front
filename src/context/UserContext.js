import React, { useReducer, useContext } from "react";
import axiosInstance from '../axios';

var UserStateContext = React.createContext();
var UserDispatchContext = React.createContext();

function userReducer(state, action) {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return { ...state, isAuthenticated: true };
    case "SIGN_OUT_SUCCESS":
      return { ...state, isAuthenticated: false };
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function UserProvider({ children }) {
  var [state, dispatch] = useReducer(userReducer, {
    isAuthenticated: !!localStorage.getItem("refresh_token"),
  });

  return (
    <UserStateContext.Provider value={state}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserStateContext.Provider>
  );
}

function useUserState() {
  var context = useContext(UserStateContext);
  if (context === undefined) {
    throw new Error("useUserState must be used within a UserProvider");
  }
  return context;
}

function useUserDispatch() {
  var context = useContext(UserDispatchContext);
  if (context === undefined) {
    throw new Error("useUserDispatch must be used within a UserProvider");
  }
  return context;
}

function parseJwt(token) {
  if (!token) return;
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace('-', '+').replace('_', '/');
  return JSON.parse(window.atob(base64));
}

// Optimized login function using async/await
async function loginUser(dispatch, login, password, history, setIsLoading, setError) {
  try {
    setIsLoading(true);
    setError(false);
    
    const res = await axiosInstance.post('login/', {
      email: login,
      password: password,
    });

    // Store tokens and configure Axios headers
    localStorage.setItem('access_token', res.data.access);
    localStorage.setItem('refresh_token', res.data.refresh);
    axiosInstance.defaults.headers['Authorization'] = 'Bearer ' + res.data.access;

    // Parse JWT to get user info
    const userInfo = parseJwt(res.data.access);
    const is_staff = userInfo.is_staff;

    dispatch({ type: 'LOGIN_SUCCESS' });

    // Redirect based on user role
    if (is_staff) {
      history.push('/app/dashboard');
    } else {
      history.push('/app/tables');
    }

  } catch (error) {
    console.log(error.response);
    setError(true);
  } finally {
    setIsLoading(false);
  }
}

// Optimized signOut function
async function signOut(dispatch, history) {
  try {
    // Call API to blacklist the refresh token
    await axiosInstance.post('logout/blacklist/', {
      refresh_token: localStorage.getItem('refresh_token'),
    });

    // Clear all local storage and reset axios headers
    localStorage.clear();
    axiosInstance.defaults.headers['Authorization'] = null;

    // Dispatch the sign-out action
    dispatch({ type: "SIGN_OUT_SUCCESS" });

    // Redirect to login page
    history.push("/login");

  } catch (error) {
    console.log("Error during sign-out:", error);
  }
}

export { UserProvider, useUserState, useUserDispatch, loginUser, signOut, parseJwt };
