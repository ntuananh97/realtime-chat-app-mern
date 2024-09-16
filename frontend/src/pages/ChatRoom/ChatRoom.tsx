import Sidebar from "./Sidebar"
import ChatWindow from "../../components/ChatWindow"

const ChatRoom = () => {



  return (
    <div className="chatroom">
      <div className="chatroom__col chatroom__sidebar">
        <Sidebar />
      </div>
      <div className="chatroom__col chatroom__chatwindow">
        <ChatWindow />
      </div>
    </div>
  )
}

export default ChatRoom