import { Link, NavLink, useLocation } from "react-router"
import useAuthUser from "../hooks/useAuthUser"
import { BellIcon, HomeIcon, ShipWheel, ShipWheelIcon, UsersIcon } from "lucide-react"

const Sidebar = () => {
  const {authUser}=useAuthUser()
  const location = useLocation()
  const currentPath= location.pathname

  return (
    <aside className="sticky flex-col hidden w-64 h-screen border-r bg-base-200 border-base-300 lg:flex">
      <div className="p-5 border-b border-base-300">
        <Link to={"/"} className="flex items-center gap-2.5">
        <ShipWheelIcon className="szie-9 text-primary"/>
        <span className="font-mono text-3xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Brimper</span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-4">
        <Link to={"/"} className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${currentPath==="/"?"btn-active":""}`}
        >
          <HomeIcon className="size-5 text-base-content opacity-70"/>
          <span>Home</span>
        </Link>

        <NavLink to={"/friends"} className={({isActive})=>`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${isActive? "btn-active":""}`}>
          <UsersIcon className="text-base-content opacity-70 size-5"/>
          <span>Friends</span>
        </NavLink>

        <NavLink to={"/notifications"} className={({isActive})=>`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${isActive? "btn-active":""}`}>
          <BellIcon className="text-base-content opacity-70 size-5"/>
          <span>Notifications</span>
        </NavLink>
      </nav>

      {/* user prfoile section */}
      <div className="p-4 mt-auto border-t border-base-300">
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="w-10 rounded-full">
              <img src={authUser?.profilePic} alt="User avatar"/>
            </div>
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold">{authUser?.fullName}</p>
            <p className="flex items-center gap-1 text-xs text-success">
              <span className="inline-block rounded-full size-2 bg-success"></span>
              Online
            </p>
          </div>
        </div>
      </div>

      
    </aside>
  )
}

export default Sidebar
