import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import Home from './pages/Home'
import SignUpLogin from './pages/SignUpLogin'
import CourtsList from './pages/CourtsList'
import CourtDetails from './pages/CourtDetails'
import CreateGame from './pages/CreateGame'
import UserProfile from './pages/UserProfile'
import MessagesList from './pages/MessagesList'
import ChatView from './pages/ChatView'

function WithLayout() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth pages — no Layout Navbar */}
        <Route path="/login" element={<SignUpLogin />} />

        {/* App pages — wrapped in Layout */}
        <Route element={<WithLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/courts" element={<CourtsList />} />
          <Route path="/courts/:id" element={<CourtDetails />} />
          <Route path="/create-game" element={<CreateGame />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/messages" element={<MessagesList />} />
          <Route path="/messages/:id" element={<ChatView />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
