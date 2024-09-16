import { AntDesignOutlined, UserAddOutlined } from "@ant-design/icons";
import { Avatar, Button } from "antd";
import useStore from "../../stores";
import { QueryConstraint, where } from "firebase/firestore";
import { useMemo, useState } from "react";
import { usePaginatedFirestoreCollection } from "../../hooks/useFirebaseStoreCollection";
import { IUserData } from "../../pages/Login/types";
import collections from "../../common/collections";
import { useAuth } from "../../Contexts/AuthProvider";
import InviteUserModal from "../Modals/InviteUserModal";

const ChatHeader = () => {
  const { currentRoomInfo } = useStore();
  const { currentUser } = useAuth();
  const [visibleInviteModal, setVisibleInviteModal] = useState(false);

  const conditions: QueryConstraint[] = useMemo(() => {

    return [where("uid", "in", currentRoomInfo.members)];
  }, [currentRoomInfo.members]);

  const { data: members, fetchInitData } = usePaginatedFirestoreCollection<IUserData>(
    collections.users,
    conditions
  );

  const membersNotCurrentUser = members.filter(
    (member) => member.uid !== currentUser?.uid
  );

  return (
    <div className="chatwindow__header">
      <div className="chatwindow__header-container c-b-flex">
        <div>
          <h2 style={{ fontWeight: 700, marginBottom: 15, fontSize: 18 }}>
            {currentRoomInfo.name}
          </h2>
          <p>{currentRoomInfo.description}</p>
        </div>
        <div>
          <Button
            style={{ marginRight: 10 }}
            icon={<UserAddOutlined />}
            type="text"
            onClick={() => setVisibleInviteModal(true)}
          >
            Invite
          </Button>
          {membersNotCurrentUser.length > 0 && (
            <Avatar.Group
              max={{
                count: 2,
                style: { color: "#f56a00", backgroundColor: "#fde3cf" },
              }}
            >
              {membersNotCurrentUser.map((member) => (
                <Avatar
                  icon={<AntDesignOutlined />}
                  src={member.photoURL}
                  key={member.uid}
                ></Avatar>
              ))}
            </Avatar.Group>
          )}
        </div>
      </div>


      <InviteUserModal
        visible={visibleInviteModal}
        onCancel={() => setVisibleInviteModal(false)}
        onFetchNewData={fetchInitData}
      />
    </div>
  );
};

export default ChatHeader;
