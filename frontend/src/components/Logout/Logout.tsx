import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import { auth } from "../../firebase/firebase";
import routerUrls from "../../common/routers";
import useStore from "../../stores";
import { IRoomData } from "../../common/types";

const Logout: React.FC = () => {
  const navigate = useNavigate();
  const { setCurrentRoomInfo } = useStore();

  const handleLogout = async () => {
    try {
      await auth.signOut(); // Sign out the user
      navigate(routerUrls.login); // Redirect to the login page after logout
      setCurrentRoomInfo({} as IRoomData); // Reset the current room info
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <Button onClick={handleLogout}>
      Logout
    </Button>
  );
};

export default Logout;
