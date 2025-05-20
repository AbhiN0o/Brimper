import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "../lib/api";
import { BellIcon, LogOutIcon, ShipWheel, ShipWheelIcon } from "lucide-react";
import ThemeSelector from "./ThemeSelector";
const Navbar = () => {
  const {authUser}=useAuthUser();
  const location=useLocation()
  const isChatPage=location.pathname?.startsWith("/chat")

  const queryClient = useQueryClient()

  const {mutate:logoutMutation}=useMutation({
    mutationFn:logout,
    onSuccess:()=>{
      queryClient.invalidateQueries({queryKey:['authUser']})
    }
  })

  return (
    <nav className="sticky top-0 z-30 flex items-center h-16 border-b bg-base-200 border-base-300">
      <div className="container px-4 mx-auto sm:px-6 lg:px-8">
        <div className="flex items-center justify-end w-full">
          {/* logo if we are in chat page */}
          {isChatPage && (
            <div className="pl-5">
            <Link to={"/"} className="flex items-center gap-2.5">
            <ShipWheelIcon className="size-9 text-primary"/>
            <span className="font-mono text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Brimper
            </span>
            </Link>
            </div>
          )}
          <div className="flex items-center gap-3 ml-auto sm:gap-4">
            <Link to={"/notifications"}>
              <button className="btn btn-ghost btn-circle">
                <BellIcon className="w-6 h-6 text-base-content opacity-70"/>
              </button>
            </Link>
          </div>
          {/* todo */}
          <ThemeSelector />
          <div className="avatar">
            <div className="rounded-full w-9 h-9">
              <img src={authUser?.profilePic} alt="User Avatar" />
            </div>
          </div>

          {/* logout buttob */}
          <button className="btn btn-ghost btn-circle" onClick={logoutMutation}>
            <LogOutIcon className="w-6 h-6 text-base-content opacity-70"></LogOutIcon>
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
