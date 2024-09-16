import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login'
import ChatRoom from './pages/ChatRoom';
import { AuthProvider } from './Contexts/AuthProvider';
import routerUrls from './common/routers';


function App() {

  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path={routerUrls.login} element={<Login />} />
          <Route path={routerUrls.chatRoom} element={<ChatRoom />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
