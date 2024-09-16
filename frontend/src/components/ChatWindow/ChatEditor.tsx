import { Button, Input } from "antd";
import { useState } from "react";
import { addDocument } from "../../firebase/services";
import collections from "../../common/collections";
import { useAuth } from "../../Contexts/AuthProvider";
import { IMessageData } from "../../common/types";
import useStore from "../../stores";

const { TextArea } = Input;

const ChatEditor = () => {
  const [text, setText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const { currentUser } = useAuth();
  const { currentRoomInfo } = useStore();
  

  const handleAddMessage = async () => {
    
    const payload: IMessageData = {
      content: text.trim(),
      user: {
        displayName: currentUser?.displayName as string,
        photoURL: currentUser?.photoURL as string,
        uid: currentUser?.uid as string,
      },
      roomID: currentRoomInfo.id,
    } as IMessageData
    
    setLoading(true)
    await addDocument(collections.messages, payload);
    setLoading(false);
    resetValue();
  }

  const resetValue = () => {
    setText('')
  }

  const handleChangeText = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value)
  }

  return (
    <div className="chatwindow__editor c-normal-flex">
      <TextArea value={text} placeholder="Type message..." autoSize onChange={handleChangeText} onPressEnter={handleAddMessage} />
      <Button loading={loading} type="primary" onClick={handleAddMessage}>Send</Button>
    </div>
  );
};

export default ChatEditor;
