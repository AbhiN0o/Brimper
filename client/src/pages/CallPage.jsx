import { useNavigate, useParams } from "react-router"
import { getStreamToken } from "../lib/api"
import { CallControls, CallingState, SpeakerLayout, StreamCall, StreamTheme, StreamVideo, StreamVideoClient, useCallStateHooks } from '@stream-io/video-react-sdk';

import { useEffect, useState } from "react" 
import { useQuery } from "@tanstack/react-query" 
import useAuthUser from "../hooks/useAuthUser"
import toast from "react-hot-toast";
import PageLoader from "../components/PageLoader";
import "@stream-io/video-react-sdk/dist/css/styles.css";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY

export default function CallPage () {
  const {id:callId}=useParams()
  const [client, setClient] = useState(null)
  const [call, setCall] = useState(null)
  const [isConnecting, setIsConnecting] = useState(true)

  const {authUser,isLoading} = useAuthUser()
  
  const {data:tokenData} = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser
  })
  useEffect(() => {
    const init = async () => {
      if(!tokenData?.token || !authUser || !callId) return
    try {
      console.log("Initializing Stream Video Client...")
      const user ={
        id: authUser._id,
        name: authUser.name,
        image: authUser.image,
      }
      const videoClient =new StreamVideoClient({
        apiKey: STREAM_API_KEY,
        user, 
        token: tokenData.token,
      })

      const callInstance = videoClient.call("default", callId)
      await callInstance.join({create: true})

      console.log("Call joined successfully")
      setClient(videoClient)
      setCall(callInstance)
    } catch (error) {
      console.error("Error joining call:", error)
      toast.error("Could not join call. Please try again.")
    }finally {
      setIsConnecting(false)
    }
    }
    init()
  }, [tokenData, authUser, callId])

  if(isLoading) return <PageLoader />

  return (
    <div className="h-screen w-full flex items-center justify-center">
      <div className="relative">
        {client && call ? (
          <StreamVideo client={client}>
            <StreamCall call={call}>
              <CallContent />
            </StreamCall>
          </StreamVideo>
        ):(
          <div className="flex items-center justify-center h-full">
          <p>Could not initialize call. Please refresh or try again later.</p>
          </div>
        )}
      </div>
    </div>
  )
}

const CallContent = () => {
  const {useCallCallingState} = useCallStateHooks()
  const callingState = useCallCallingState()

  const navigate = useNavigate()
  if(callingState === CallingState.LEFT) {
    return navigate("/")
  }
return(
  <StreamTheme>
    <SpeakerLayout/>
    <CallControls />
  </StreamTheme>
)
}