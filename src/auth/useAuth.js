import { useContext } from "react";
import AuthContext from "./context";
//import authStorage from './storage'
import pb from "../api/pocketbase";
import { useNavigate } from "react-router-dom";

const useAuth = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);

  const logIn = (authToken) => {
    //const user = authToken;
    setUser(authToken);
    //authStorage.storeToken(authToken);
  };

  const logOut = () => {
    pb.authStore.clear();
    setUser(null);
    //authStorage.removeToken();
  };

  const isAuthenticated = () => {
    return pb.authStore.isValid;
  };

  const checkAuthentication = () => {
    if (!pb.authStore.isValid) {
      navigate("/auth");
    }
  };
  return { user, logOut, logIn, isAuthenticated, checkAuthentication, setUser };
};
export default useAuth;
