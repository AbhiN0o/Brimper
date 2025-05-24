import React, { useEffect, useState } from 'react'
import { useThemeStore } from '../../store/useThemeStore'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getOutgoindFriendReqs, getRecommendedFriends, getUserFriends, sendFriendRequest } from '../lib/api'
import { CheckCircleIcon, MapPinIcon, UserPlusIcon, UsersIcon } from 'lucide-react'
import { Link } from 'react-router'
import FriendCard, { getLanguageFlag } from '../components/FriendCard'
import NoFriendsFound from '../components/NoFriendsFound'
import { capitalize } from '../../../server/src/lib/utils'

const HomePage = () => {
  const queryClient= useQueryClient()

  const [outgoingRequestsIds,setOutgoingRequestsIds]=useState(new Set())

  const {data:friends=[],isLoading:loadingFriends}=useQuery({
    queryKey:["friends"],
    queryFn:getUserFriends
  })

  const {data:recommendedUsers=[],isLoading:loadingUsers}=useQuery({
    queryKey:["users"],
    queryFn:getRecommendedFriends
  })

  const {data:outgoingFriendReqs}=useQuery({
    queryKey:["outgoingFriendReqs"],
    queryFn:getOutgoindFriendReqs,
  });
  console.log(recommendedUsers)
  const {mutate:sendRequestMutation,isPending} = useMutation({
    mutationFn:sendFriendRequest,
    onSuccess:()=>{
      queryClient.invalidateQueries({queryKey:["outgoingFriendReqs"]})
    }
  })

  useEffect(()=>{
    const outgoingIds=new Set();
    if(outgoingFriendReqs && outgoingFriendReqs.length>0){
      outgoingFriendReqs.forEach((req) => {
        outgoingIds.add(req.recipient._id)
      });
      setOutgoingRequestsIds(outgoingIds)
    }
  },[outgoingFriendReqs])

  return (
    <div className='p-4 sm:p-6 lg:p-8'>
      <div className='container mx-auto space-y-10'>
        <div className='flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
          <h2 className='text-2xl font-bold tracking-tight sm:text-3xl'>
            Your Friends
          </h2>
          <Link to={"/notifications"} className="btn btn-outline btn-sm">
          <UsersIcon className='mr-2 size-4'/>
          Friend Request
          </Link>
        </div> 
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

        <section>
          <div className='mb-6 sm:mb-8'>
            <div className='flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
              <div>
                <h2 className='text-2xl font-bold tracking-tight sm:text-3xl'>Meet New Learners</h2>
                <p className='opacity-70'>Discover perfect language exchange partners based on your profile</p>
              </div>
            </div>
          </div>

          {loadingUsers?(
            <div className='flex justify-center py-12'>
              <span className='loading loading-spinner loading-lg'></span>
            </div>
          ):(
            recommendedUsers.length===0?(
              <div className="p-6 text-center card bg-base-200">
                <h3 className="mb-2 text-lg font-semibold">No recommendations available</h3>
                <p className="text-base-content opacity-70">
                  Check back later for new language partners!
                </p>
              </div>
            ):(
              <div className='grid gap-4 grid-cold-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                {recommendedUsers.map((user)=>{
                  const hasRequestBeenSent=outgoingRequestsIds.has(user._id.toString())
                  return(
                    <div key={user._id} className='transition-all duration-300 card bg-base-200 hover:shadow-lg'>
                      <div className='p-5 space-y-4 card-body'>
                      <div className='flex items-center gap-3'>
                        <div className='rounded-full avatar size-16'>
                          <img src={user.profilePic} alt={user.fullName}/>
                        </div>

                        <div>
                          <h3 className='text-lg font-semibold'>{user.fullName}</h3>
                          {user.location && (
                            <div className='flex items-center mt-1 text-xs opacity-70'>
                              <MapPinIcon className='mr-1 size-3'/>
                              {user.location} 
                            </div>
                          )}
                        </div>
                      </div>

                      {/* language with flags */}
                      <div className='flex flex-wrap gap-1.5'>
                          <span className='badge-secondary badge'>
                            {getLanguageFlag(user.nativeLanguage)}
                            Native: {capitalize(user.nativeLanguage)}
                          </span>
                          <span className='badge badge-outline'>
                            {getLanguageFlag(user.learningLanguage)}
                            Learning: {capitalize(user.learningLanguage)}
                          </span>
                      </div>
                      {user.bio && <p className='text-sm opacity-70'>{user.bio}</p>}

                        {/* button for friend req */}
                        <button className={`btn w-full mt-2 ${
                          hasRequestBeenSent?"btn-disabled":"btn-primary"
                        }`} 
                          onClick={()=>{sendRequestMutation(user._id)}} 
                          disabled={hasRequestBeenSent || isPending}>
                          {hasRequestBeenSent?(
                            <>
                            <CheckCircleIcon className='mr-2 size-4'/>
                            Request Sent
                            </>
                          ):(
                            <>
                            <UserPlusIcon className='mr-2 size-4'/>
                            Send friend Request
                            </>
                          )}
                        </button>
                      
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          )}
          
        </section>
        
        
      </div>
    </div>
  )
}

export default HomePage


