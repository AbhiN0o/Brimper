import { Navigate, Route, Routes } from "react-router"
import Homepage from "./pages/HomePage.jsx"
import LoginPage from "./pages/LoginPage.jsx"
import SignupPage from "./pages/SignupPage.jsx"
import NotificationsPage from "./pages/NotificationsPage.jsx"
import CallPage from "./pages/CallPage.jsx"
import ChatPage from "./pages/ChatPage.jsx"
import OnboardingPage from "./pages/OnboardingPage.jsx"
import toast, {Toaster} from "react-hot-toast"
import {useQuery} from "@tanstack/react-query"
import {axiosInstance} from "./lib/axios.js"
function App() {

  const {data:authData,isLoading,error}=useQuery({
    queryKey:['authUser'],
    queryFn:async()=>{
      const res= await axiosInstance.get("/auth/me")
      return res.data;
    },
    retry:false,
  })

  const authUser= authData?.user

  return (
    <div className="h-screen">
      <Routes>
        <Route path="/" element={authUser?<Homepage />:<Navigate to={"/login"} />}></Route>
        <Route path="/login" element={!authUser?<LoginPage />:<Navigate to={"/"}/>}></Route>
        <Route path="/signup" element={!authUser?<SignupPage />:<Navigate to={"/"}/>}></Route>
        <Route path="/notifications" element={authUser?<NotificationsPage />:<Navigate to={"/login"}/>}></Route>
        <Route path="/call" element={authUser?<CallPage />:<Navigate to={"/login"}/>}></Route>
        <Route path="/chat" element={authUser?<ChatPage />:<Navigate to={"/login"}/>}></Route>
        <Route path="/onboarding" element={authUser?<OnboardingPage />:<Navigate to={"/login"}/>}></Route>
      </Routes>
      <Toaster />
    </div>
  )
}

export default App
