import { Result } from "antd";
import useStore from "../../stores";
import ChatHeader from "./ChatHeader";
import ChatMain from "./ChatMain";

const ChatWindow = () => {
  const { currentRoomInfo } = useStore();

  return (
    <div className="chatwindow">
      {currentRoomInfo.id ? (
        <>
          <ChatHeader />
          <ChatMain />
        </>
      ) : (
        <Result status="warning" title="Select a room to start chatting." />
      )}
    </div>
  );
};

export default ChatWindow;
