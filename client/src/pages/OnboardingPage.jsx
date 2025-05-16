import { useState } from "react";
import useAuthUser from "../hooks/useAuthUser"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { completeOnboarding } from "../lib/api";
import toast from "react-hot-toast";
import { CameraIcon, Loader2Icon, MapPinIcon, ShipWheelIcon, Shuffle, ShuffleIcon } from "lucide-react";
import { LANGUAGES } from "../constants";

export default function OnboardingPage() {
  const queryClient=useQueryClient()
  const {authUser}= useAuthUser();
  const [formState,setFormState]=useState({
    fullName:authUser?.fullName || "",
    bio:authUser?.bio || "",
    nativeLanguage:authUser?.nativeLanguage || "",
    learningLanguage:authUser?.learningLanguage || "",
    location:authUser?.location || "",
    profilePic:authUser?.profilePic || ""
  })

  const {mutate:onBoardingMutation,isPending}=useMutation({
    mutationFn:completeOnboarding,
    onSuccess:()=>{
      toast.success("Profile Onboarded Succesfully!")
      queryClient.invalidateQueries({queryKey:["authUser"]})
    },
    onError:(error)=>{
      console.log(error)
      toast.error(error.response.data.message)
    }
  })

  const handleSubmit= (e)=>{
    e.preventDefault();
    onBoardingMutation(formState)
  }

  const handleRandomAvatar = ()=>{
    console.log(formState)
    const idx= Math.floor(Math.random()*100)+1;
    const randomAvatar= `https://avatar.iran.liara.run/public/${idx}.png`
    setFormState({...formState,profilePic:randomAvatar})
    toast.success("Random profile picture generate")
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-base-100">
      <div className="w-full max-w-3xl shadow-xl card bg-base-200">
        <div className="p-6 card-body sm:p-8">
          <h1 className="mb-6 text-2xl font-bold text-center sm:text-3xl">
            Complete Your Profile
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Pic container */}
            <div className="flex flex-col items-center justify-center space-y-4">
              {/* image preview */}
              <div className="overflow-hidden rounded-full size-32 bg-base-300">
                {formState.profilePic?(
                  <img 
                    src={formState.profilePic}
                    alt="Profile Preview"
                    className="object-cover w-full h-full"
                    />
                ):(
                  <div className="flex items-center justify-center h-full">
                    <CameraIcon className="size-12 text-base-content opacity-40"/>
                  </div>
                )}
              </div>

              {/* Generate random avatar */}
              <div className="flex items-center gap-2">
                <button  className="btn btn-accent" type="button" onClick={handleRandomAvatar}>
                  <ShuffleIcon className="mr-2 size-4" />
                  Generate Random Avatar
                </button>
              </div>
            </div>
            
              {/* full name */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Full Name</span>
                </label>
                <input 
                  type="text"
                  name="fullName"
                  value={formState.fullName}
                  onChange={(e)=>setFormState({...formState,fullName:e.target.value})}
                  className="w-full input input-bordered"
                  placeholder="Your Full Name"
                  />
              </div>

              {/* Bio */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Bio</span>
                </label>
                <textarea 
                  name="bio"
                  value={formState.bio}
                  onChange={(e)=>setFormState({...formState,bio:e.target.value})}
                  className="h-24 textarea textarea-bordered"
                  placeholder="Tell Others about yourself and your language learning goals!"
                  />
              </div>

              {/* Languages */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* native language */}
                <div className="form-control">
                  <label className="label">
                  <span className="label-text">Native Language</span>
                  </label>
                  <select name="nativeLanguage" value={formState.nativeLanguage} onChange={(e)=>{setFormState({...formState,nativeLanguage:e.target.value})}} className="w-full select select-bordered">
                    <option value={""}>Select Your Language</option>
                    {LANGUAGES.map((ele)=>{
                      return(
                        <option key={`native-${ele}`} value={ele.toLowerCase()}>
                          {ele}
                        </option>
                      )
                    })}
                  </select>
                </div>
                {/* learning language */}
                <div className="form-control">
                  <label className="label">
                  <span className="label-text">Learning Language</span>
                  </label>
                  <select name="learningLanguage" value={formState.learningLanguage} onChange={(e)=>{setFormState({...formState,learningLanguage:e.target.value})}} className="w-full select select-bordered">
                    <option value={""}>Select Your Language</option>
                    {LANGUAGES.map((ele)=>{
                      return(
                        <option key={`learning-${ele}`} value={ele.toLowerCase()}>
                          {ele}
                        </option>
                      )
                    })}
                  </select>
                </div>
              </div>

              {/* Location */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Location</span>
                </label>
                <div className="relative">
                  <MapPinIcon className="absolute transform -translate-y-1/2 top-1/2 left-3 size-5 text-base-content opacity-70" />
                  <input 
                    type="text"
                    name="location"
                    value={formState.location}
                    onChange={(e)=>setFormState({...formState,location:e.target.value})}
                    className="w-full pl-10 input input-bordered"
                    placeholder="City, Country"
                    />
                </div>
              </div>
              
              {/*Submit Button  */}
              <button className="w-full btn btn-primary" disabled={isPending} type="submit">
                {!isPending?(
                  <>
                    <ShipWheelIcon className="mr-2 size-5" />
                    Complete Onboarding
                  </>
                ):(
                  <>
                    <Loader2Icon className="mr-2 animate-spin size-5"/>
                    Onboarding....
                  </>
                )}
              </button>
          </form>
        </div>
      </div>
    </div>
  )
}

