import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const AuthContext = createContext(null);

const USER_STORAGE_KEY = "ai-career-mentor-user";
const ACCESS_TOKEN_KEY = "ai-career-mentor-access-token";
const REFRESH_TOKEN_KEY = "ai-career-mentor-refresh-token";


export function AuthProvider({ children }) {

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem(USER_STORAGE_KEY)
      );
    } catch {
      return null;
    }
  });


  const [accessToken, setAccessToken] = useState(
    () => localStorage.getItem(ACCESS_TOKEN_KEY)
  );


  const [refreshToken, setRefreshToken] = useState(
    () => localStorage.getItem(REFRESH_TOKEN_KEY)
  );


  // Store user
  useEffect(() => {

    if (user) {
      localStorage.setItem(
        USER_STORAGE_KEY,
        JSON.stringify(user)
      );
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }

  }, [user]);


  // Store access token
  useEffect(() => {

    if (accessToken) {
      localStorage.setItem(
        ACCESS_TOKEN_KEY,
        accessToken
      );
    } else {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
    }

  }, [accessToken]);


  // Store refresh token
  useEffect(() => {

    if (refreshToken) {
      localStorage.setItem(
        REFRESH_TOKEN_KEY,
        refreshToken
      );
    } else {
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    }

  }, [refreshToken]);


  // LOGIN
  const login = (payload) => {

    const backendUser = payload.user;

    setUser({
      id: backendUser.id,
      name: backendUser.full_name,
      email: backendUser.email,
      role: backendUser.role,
      avatar:
        backendUser.full_name
          ?.split(" ")
          .map((name) => name[0])
          .join("")
          .slice(0, 2)
          .toUpperCase() || "U",
    });

    setAccessToken(payload.access_token);
    setRefreshToken(payload.refresh_token);
  };


  // SIGNUP
  // Signup only creates the account.
  // It does NOT authenticate the user.
  const signup = (userData) => {
    return userData;
  };


  // LOGOUT
  const logout = () => {

    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);

  };


  const value = useMemo(
    () => ({
      user,
      accessToken,
      refreshToken,
      isAuthenticated: Boolean(
        user && accessToken
      ),
      login,
      signup,
      logout,
    }),
    [
      user,
      accessToken,
      refreshToken,
    ]
  );


  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}


export function useAuth() {

  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used within an AuthProvider"
    );
  }

  return context;
}