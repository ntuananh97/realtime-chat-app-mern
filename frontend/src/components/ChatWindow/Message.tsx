import { UserOutlined } from '@ant-design/icons'
import { Avatar } from 'antd'
import { IMessageData } from '../../common/types'
import dayjs from 'dayjs';
import { useAuth } from '../../Contexts/AuthProvider';

interface IMessageProps {
  data: IMessageData;
}

const Message: React.FC<IMessageProps> = ({data}) => {
  const { currentUser } = useAuth();

  return (
    <li className={`chat-message__item c-normal-flex ${data.user.uid === currentUser?.uid ? 'me' : ''}`} style={{gap: 15}}>
        <div>
            <Avatar size="default" icon={<UserOutlined />} />
        </div>
        <div>
            <div className='c-normal-flex' style={{marginBottom: 10, gap: '20px'}}>
                <h3 className='chat-message__item__title'>{data.user.displayName}</h3>
                <p className='chat-message__item__date'>{dayjs(data.createdAt?.toDate() || new Date()).format('DD/MM/YYYY HH:mm:ss')}</p>
            </div>

            <p className='chat-message__item__content'>{data.content}</p>
        </div>
    </li>
  )
}

export default Message