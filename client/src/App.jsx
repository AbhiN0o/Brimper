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
import PageLoader from "./components/PageLoader.jsx"
import useAuthUser from "./hooks/useAuthUser.js"
import Layout from "./components/Layout.jsx"
import { useThemeStore } from "../store/useThemeStore.js"
function App() {

  const {isLoading,authUser} =useAuthUser()

  const isAuthenticated=Boolean(authUser)
  const isOnboarded= authUser?.isOnboarded


  const {theme}=useThemeStore()
  
  if(isLoading) return(
    <PageLoader />
  )

  return (
    <div className="h-screen" data-theme={theme}>
      <Routes>
        <Route path="/" element={isAuthenticated?(isOnboarded?<Layout showSidebar={true} ><Homepage/></Layout >:<Navigate to={"/onboarding"}/>):<Navigate to={"/login"}/>}></Route>
        <Route path="/login" element={!isAuthenticated?<LoginPage />:(!isOnboarded?<Navigate to={"/onboarding"}/>:<Navigate to={"/"}/>)}></Route>
        <Route path="/signup" element={!isAuthenticated?<SignupPage />:<Navigate to={isOnboarded?"/":"/onboarding"}/>}></Route>
        <Route path="/notifications" element={isAuthenticated?(isOnboarded?(<Layout showSidebar={true}><NotificationsPage /></Layout>):<Navigate to={"/onboarding"}/>):<Navigate to={"/login"}/>}></Route>
        <Route path="/call" element={isAuthenticated?<CallPage />:<Navigate to={"/login"}/>}></Route>
        <Route path="/chat/:id" element={isAuthenticated?(isOnboarded?<Layout showSidebar={false}><ChatPage/></Layout>:<Navigate to={"/onboarding"}/>):<Navigate to={"/login"}/>}></Route>
        <Route path="/onboarding" element={isAuthenticated?(!isOnboarded?<OnboardingPage />:<Navigate to={"/"} />):<Navigate to={"/login"}/>}></Route>
      </Routes>
      <Toaster />
    </div>
  )
}

export default App
