import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("ai-career-mentor-user"));
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("ai-career-mentor-user", JSON.stringify(user));
    } else {
      localStorage.removeItem("ai-career-mentor-user");
    }
  }, [user]);

  const login = (payload) => {
    setUser({
      id: payload.id ?? "guest",
      name: payload.name ?? "Ava Chen",
      email: payload.email ?? "ava@acme.dev",
      role: payload.role ?? "Product Designer",
      avatar: payload.avatar ?? "AC",
    });
  };

  const signup = (payload) => {
    setUser({
      id: payload.id ?? "new-user",
      name: payload.name ?? payload.email?.split("@")[0] ?? "New Member",
      email: payload.email ?? "new@example.com",
      role: payload.role ?? "Growth Engineer",
      avatar: payload.avatar ?? "NM",
    });
  };

  const logout = () => setUser(null);

  const value = useMemo(
    () => ({ user, isAuthenticated: Boolean(user), login, signup, logout }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
