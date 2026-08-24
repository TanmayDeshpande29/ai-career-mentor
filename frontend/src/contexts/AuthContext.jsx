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


  const login = (payload) => {

    setUser({
      id: payload.id ?? "user",
      name: payload.name ?? payload.email?.split("@")[0] ?? "User",
      email: payload.email ?? "",
      role: payload.role ?? "User",
      avatar: payload.avatar ?? "U",
    });

    setAccessToken(payload.accessToken);
  };


const signup = (payload) => {
  localStorage.setItem(
    "ai-career-mentor-access-token",
    payload.access_token
  );

  localStorage.setItem(
    "ai-career-mentor-refresh-token",
    payload.refresh_token
  );

  setUser({
    id: payload.id,
    name: payload.full_name,
    email: payload.email,
    role: payload.role,
    avatar: payload.full_name
      ?.split(" ")
      .map((name) => name[0])
      .join("")
      .slice(0, 2)
      .toUpperCase(),
  });
};

  const logout = () => {

    setUser(null);
    setAccessToken(null);

  };


  const value = useMemo(
    () => ({
      user,
      accessToken,
      isAuthenticated: Boolean(user && accessToken),
      login,
      signup,
      logout,
    }),
    [user, accessToken]
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