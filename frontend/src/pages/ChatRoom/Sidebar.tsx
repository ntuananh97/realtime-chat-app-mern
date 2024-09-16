import { PlusOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Divider, List, Space } from "antd";
import Logout from "../../components/Logout";
import { useAuth } from "../../Contexts/AuthProvider";
import { QueryConstraint, where } from "firebase/firestore";
import { IRoomData } from "../../common/types";
import { usePaginatedFirestoreCollection } from "../../hooks/useFirebaseStoreCollection";
import { useMemo, useState } from "react";
import RoomModal from "../../components/Modals/RoomModal";
import useStore from "../../stores";

const Sidebar = () => {
  const { currentUser } = useAuth();
  const { setCurrentRoomInfo } = useStore()
  const [visibleRoomModal, setVisibleRoomModal] = useState(false)

  const conditions: QueryConstraint[] = useMemo(
    () => [where("members", "array-contains", currentUser?.uid || "")],
    [currentUser?.uid]
  );

  const { data: rooms } = usePaginatedFirestoreCollection<IRoomData>(
    "rooms",
    conditions
  );
  console.log("Sidebar ~ rooms:", rooms);

  return (
    <div className="sidebar" style={{ color: "white" }}>
      <Space className="sidebar__space c-b-flex">
        <div className="c-normal-flex" style={{ gap: "10px" }}>
          <Avatar
            src={currentUser?.photoURL}
            size={48}
            icon={<UserOutlined />}
          />
          <p>{currentUser?.displayName}</p>
        </div>
        <Logout />
      </Space>
      <Divider style={{ background: "white" }} />
      <Space className="sidebar__space">
        <List
          dataSource={rooms}
          className="room-list"
          footer={<Button onClick={() => setVisibleRoomModal(true)} icon={<PlusOutlined />}>Add room</Button>}
          renderItem={(item) => (
            <List.Item key={item.id}>
              <button className="room-list__title"
                onClick={() => setCurrentRoomInfo(item)}
              >{item.name}</button>
            </List.Item>
          )}
        />
      </Space>
      <RoomModal visible={visibleRoomModal} onCancel={() => setVisibleRoomModal(false)} />
    </div>
  );
};

export default Sidebar;
