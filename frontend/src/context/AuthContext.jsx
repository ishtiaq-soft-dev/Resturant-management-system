import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { authService } from "../services/api/auth";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await authService.getCurrentUser();
        setUser(res.data);
      } catch (err) {
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkUser();
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await authService.login(email, password);
    const { user, token } = res.data;
    if (token) {
      localStorage.setItem("token", token);
    }
    setUser(user);
    return res.data;
  }, []);

  const register = useCallback(
    async (username, email, password, address, role = "customer") => {
      await authService.register({ username, email, password, address, role });
    },
    []
  );

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error("Logout error", err);
    }
    localStorage.removeItem("token");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
