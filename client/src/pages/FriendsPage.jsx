import { useQuery } from "@tanstack/react-query"
import { getUserFriends } from "../lib/api"
import NoFriendsFound from "../components/NoFriendsFound"
import FriendCard from "../components/FriendCard"

const FriendsPage = () => {

    
  const {data:friends=[],isLoading:loadingFriends}=useQuery({
    queryKey:["friends"],
    queryFn:getUserFriends
  })

  return (
    <div className="p-4">
    {loadingFriends ? (
          <div className='flex justify-center py-12'>
            <span className='loading loading-spinner loading-lg'></span>
          </div>
        ):friends.length===0?(
          <NoFriendsFound />
        ):(
          <div className='grid gap-4 grid-cold-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' >
            {friends.map((friend)=>(
              <FriendCard key={friend._id} friend={friend}/>
            ))}
          </div>
        )}
</div>
  )
}

export default FriendsPage
