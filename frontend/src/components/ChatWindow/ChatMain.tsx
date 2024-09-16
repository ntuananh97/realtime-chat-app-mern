
import ChatEditor from "./ChatEditor"
import MesageContainer from "./MesageContainer"

const ChatMain = () => {
  return (
    <div className="chatwindow__main">
      <MesageContainer />
      <ChatEditor />
    </div>
  )
}

export default ChatMain