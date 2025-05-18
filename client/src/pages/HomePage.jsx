import React, { useEffect, useState } from 'react'
import { useThemeStore } from '../../store/useThemeStore'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getOutgoindFriendReqs, getRecommendedFriends, getUserFriends, sendFriendRequest } from '../lib/api'
import { UsersIcon } from 'lucide-react'
import { Link } from 'react-router'
import FriendCard from '../components/FriendCard'
import NoFriendsFound from '../components/NoFriendsFound'

const HomePage = () => {
  const queryClient= useQueryClient(new Set())

  const [outgoingRequestsIds,setOutgoingRequestsIds]=useState([])

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
        outgoingIds.add(req.id)
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
      </div>
    </div>
  )
}

export default HomePage
