import {  Modal, Form, Input } from "antd";
import { addDocument } from "../../../firebase/services";
import collections from "../../../common/collections";
import { useState } from "react";
import { useAuth } from "../../../Contexts/AuthProvider";

type FieldType = {
  name: string;
  description?: string;
};

type TRoomModal = {
    visible: boolean,
    onCancel: () => void
}

const RoomModal: React.FC<TRoomModal> = ({visible, onCancel}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const {currentUser} = useAuth()

  const createRoom = async (values: FieldType) => {
    console.log("Received values of form: ", values);
    const payload = {
        ...values,
        members: [currentUser?.uid || '']
    };
    setLoading(true)
    await addDocument(collections.rooms, payload);
    setLoading(false)
    handleCancel()
  };

  const handleCancel = () => {
    console.log("handleCancel ~ form:", form)

    onCancel?.();
    form.resetFields()
  }

  return (
    <Modal
      title="Add Room"
      open={visible}
      onCancel={handleCancel}
      okText="Create"
      loading={loading}
      okButtonProps={{ autoFocus: true, htmlType: 'submit' }}
      modalRender={(dom) => (
        <Form
          layout="vertical"
          form={form}
          clearOnDestroy
          onFinish={(values) => createRoom(values)}
        >
          {dom}
        </Form>
      )}
    >
      <Form.Item<FieldType>
        label="Name"
        name="name"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>

      <Form.Item<FieldType> label="Description" name="description"
        rules={[{ required: true }]}
        
        >
        <Input />
      </Form.Item>
    </Modal>
  );
};

export default RoomModal;
