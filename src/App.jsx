import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Layout from './components/Layout/Layout'
import Landing from './pages/Landing'
import Home from './pages/Home'
import SignUpLogin from './pages/SignUpLogin'
import CourtsList from './pages/CourtsList'
import CourtDetails from './pages/CourtDetails'
import CreateGame from './pages/CreateGame'
import UserProfile from './pages/UserProfile'
import MessagesList from './pages/MessagesList'
import ChatView from './pages/ChatView'

// Smart home: Landing for guests, Home for logged-in users
function SmartHome() {
  const { user, loading } = useAuth()
  if (loading) return (
    <div className="bg-background min-h-screen flex items-center justify-center">
      <span className="material-symbols-outlined text-primary animate-spin" style={{ fontSize: 40 }}>progress_activity</span>
    </div>
  )
  if (!user) return <Landing />
  return <Layout><Home /></Layout>
}

function ProtectedLayout() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <span className="material-symbols-outlined text-primary animate-spin" style={{ fontSize: 40 }}>
          progress_activity
        </span>
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />

  return (
    <Layout>
      <Outlet />
    </Layout>
  )
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<SignUpLogin />} />
      <Route path="/" element={<SmartHome />} />

      {/* Protected — redirect to /login if not authenticated */}
      <Route element={<ProtectedLayout />}>
        <Route path="/courts" element={<CourtsList />} />
        <Route path="/courts/:id" element={<CourtDetails />} />
        <Route path="/create-game" element={<CreateGame />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/messages" element={<MessagesList />} />
        <Route path="/messages/:id" element={<ChatView />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
