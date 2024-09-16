import {  Modal, Form } from "antd";
import { updateDocument } from "../../../firebase/services";
import collections from "../../../common/collections";
import { useState } from "react";
import UserMultipleSelect, { IUserValueSelect } from "../../Selects/UserMultipleSelect";
import { arrayUnion } from "firebase/firestore";
import useStore from "../../../stores";

type FieldType = {
  users: IUserValueSelect[];
};

type TInviteUserModalModal = {
    visible: boolean,
    onCancel: () => void
    onFetchNewData?: () => void
}

const InviteUserModal: React.FC<TInviteUserModalModal> = ({visible, onCancel, onFetchNewData}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { currentRoomInfo, updateMembersInCurrentRoom } = useStore();


  const createRoom = async (values: FieldType) => {
    console.log("Received values of form: ", values);
    const {users} = values;
    const newUsers = users.map(user => user.value);
    const payload = {
      members: arrayUnion(...newUsers),
    };

    setLoading(true)
    await updateDocument(collections.rooms, payload, currentRoomInfo.id);
    setLoading(false)
    handleCancel();
    onFetchNewData?.()
    updateMembersInCurrentRoom(newUsers)
  };

  const handleCancel = () => {
    onCancel?.();
    form.resetFields()
  }

  const filterUsersIsNotCurrentUser = (users: IUserValueSelect[]) => {
    return users.filter(user => !currentRoomInfo.members.includes(user.value))
  }

  return (
    <Modal
      title="Invite User"
      open={visible}
      onCancel={handleCancel}
      okText="Invite"
      loading={loading}
      okButtonProps={{ autoFocus: true, htmlType: 'submit' }}
      modalRender={(dom) => (
        <Form
          layout="vertical"
          form={form}
          clearOnDestroy
          onFinish={(values) => createRoom(values)}
          initialValues={{ users: [] }}
        >
          {dom}
        </Form>
      )}
    >
      <Form.Item<FieldType>
        label="Users"
        name="users"
        rules={[{ required: true }]}
      >
        <UserMultipleSelect filterCondition={filterUsersIsNotCurrentUser} />
      </Form.Item>

      
    </Modal>
  );
};

export default InviteUserModal;
