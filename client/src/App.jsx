import { Route, Routes } from "react-router"
import Homepage from "./pages/HomePage.jsx"
import LoginPage from "./pages/LoginPage.jsx"
import SignupPage from "./pages/SignupPage.jsx"
import NotificationsPage from "./pages/NotificationsPage.jsx"
import CallPage from "./pages/CallPage.jsx"
import ChatPage from "./pages/ChatPage.jsx"
import OnboardingPage from "./pages/OnboardingPage.jsx"
import toast, {Toaster} from "react-hot-toast"
import {useQuery} from "@tanstack/react-query"

function App() {

  const {data} = useQuery()


  return (
    <div className="h-screen">
      <Routes>
        <Route path="/" element={<Homepage />}></Route>
        <Route path="/login" element={<LoginPage />}></Route>
        <Route path="/signup" element={<SignupPage />}></Route>
        <Route path="/notifications" element={<NotificationsPage />}></Route>
        <Route path="/call" element={<CallPage />}></Route>
        <Route path="/chat" element={<ChatPage />}></Route>
        <Route path="/onboarding" element={<OnboardingPage />}></Route>
      </Routes>
      <Toaster />
    </div>
  )
}

export default App
