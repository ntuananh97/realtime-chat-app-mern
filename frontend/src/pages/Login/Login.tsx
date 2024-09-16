import { Typography, Button } from "antd";
import { getAdditionalUserInfo, signInWithPopup } from "firebase/auth";
import {
  auth,
  facebookProvider,
  googleProvider,
} from "../../firebase/firebase";
import { addDocument } from "../../firebase/services";
import { IUserData } from "./types";

const { Title } = Typography;


const Login = () => {

  const addNewUserToDb = (data: IUserData) => {
    addDocument('users', data)
  }

  const loginByGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const {user} = result;
      const additionalUserInfo = getAdditionalUserInfo(result)
      console.log("loginByGoogle ~ result:", {result, additionalUserInfo})
      
      const isNewUser = additionalUserInfo?.isNewUser;
      if (isNewUser) addNewUserToDb({
        displayName: user.displayName,
        email: user.email,
        uid: user.uid,
        photoURL: user.photoURL,
        providerId: user.providerId,
      })

      // return

      // if (user?.uid) navigate(routerUrls.chatRoom);
      // else alert("Please try logining again!")

    } catch (error) {
      console.error("Error logging in with Google:", error);
    }
  };

  // Handle Facebook Login
  const handleFacebookLogin = async () => {
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      console.log("Facebook user signed in:", result.user);
    } catch (error) {
      console.error("Error logging in with Facebook:", error);
    }
  };

  return (
    <div
      style={{ width: "500px", margin: "200px auto 0", textAlign: "center" }}
    >
      <Title>Login</Title>

      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <Button type="primary" onClick={loginByGoogle}>
          Đăng nhập bằng Google
        </Button>
        <Button type="primary" onClick={handleFacebookLogin}>
          Đăng nhập bằng Facebook
        </Button>
      </div>
    </div>
  );
};

export default Login;
