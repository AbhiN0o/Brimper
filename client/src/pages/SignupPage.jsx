import { useState } from "react"
import {ShipWheelIcon} from "lucide-react"
import { Link } from "react-router"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { signup } from "../lib/api"

export default function SignupPage () {
  const [signupData,setSignupData]=useState({
    fullName:"",
    email:"",
    password:""
  })

  const queryClient = useQueryClient()

  const {mutate:signupMutation,isPending,error} =useMutation({
    mutationFn:signup,
    onSuccess :()=>{
      queryClient.invalidateQueries({queryKey:["authUser"]})
    }
  })
  
  const handleSignup = async (e)=>{
    e.preventDefault()
    signupMutation(signupData)
  }

  return (
    <div className="flex items-center justify-center h-screen p-4 sm:p-6 md:p-8" data-theme="forest">
      <div className="flex flex-col w-full max-w-5xl mx-auto overflow-hidden border shadow-lg border-primary/25 lg:flex-row bg-base-100 rounded-xl">
        {/* signup form */}
        <div className="flex flex-col w-full p-4 sm:p-8 lg:w-1/2">
          {/* logo */}
          <div className="flex items-center justify-start gap-2 mb-4">
            <ShipWheelIcon className="size-9 text-primary" />
            <span className="font-mono text-3xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Brimper</span>
          </div>

          {/* error message */}
          {error && (
            <div className="mb-4 alert alert-error">
              <span>{error.response.data.message}</span>
            </div>
          )}

          <div className="w-full"> 
            <form onSubmit={handleSignup}>
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold">Create An Account</h2>
                  <p className="text-sm opacity-70">Join Brimper and start your learning adventure!</p>
                </div>

                <div className="space-y-3">
                  <div className="w-full form-control">
                    <label htmlFor="" className="label">
                      <span className="label-text">Full Name</span>
                    </label>

                    <input type="text" 
                      placeholder="Enter Your Name" 
                      className="w-full input input-bordered" 
                      value={signupData.fullName} 
                      onChange={(e)=>{setSignupData(prevData=>({...prevData,fullName:e.target.value}))}}
                      required></input>
                  </div>
                  <div className="w-full form-control">
                    <label htmlFor="" className="label">
                      <span className="label-text">Email</span>
                    </label>

                    <input type="email" 
                      placeholder="email@gmail.com" 
                      className="w-full input input-bordered" 
                      value={signupData.email} 
                      onChange={(e)=>{setSignupData(prevData=>({...prevData,email:e.target.value}))}}
                      required></input>
                  </div>
                  {/* password */}
                  <div className="w-full form-control">
                    <label htmlFor="" className="label">
                      <span className="label-text">Password</span>
                    </label>

                    <input type="password" 
                      placeholder="*******" 
                      className="w-full input input-bordered" 
                      value={signupData.password} 
                      onChange={(e)=>{setSignupData(prevData=>({...prevData,password:e.target.value}))}}
                      required></input>
                    <p className="mt-1 text-xs opacity-70">Password must be atleast 6 characters</p>
                  </div>
                  <div className="form-control">
                    <label className="justify-start gap-2 cursor-pointer label">
                      <input type="checkbox" className="checkbox-sm" required/>
                      <span className="text-xs leading-tight">I agree to the {" "}
                        <span className="text-primary hover:underline">terms of service</span>and {" "}
                        <span className="text-primary hover:underline">privacy policy</span>
                      </span>
                    </label>
                  </div>
                </div>
                <button className="w-full btn btn-primary" type="submit">{isPending?(
                 <><span className="loading loading-spinner"></span>Loading...</>
                ):("Create Account")}</button>
                <div className="mt-4 text-center">
                  <p className="text-sm">
                    Already have an account?{" "}
                    <Link to="/login" className="text-primary hover:underline">
                      Sign in
                    </Link>
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="items-center hidden w-full lg:flex lg:w-1/2 bg-primary/20 justify-normal">
          <div className="max-w-md p-8">
            <div className="relative max-w-sm mx-auto aspect-square">
              <img src="/vid-icon.png" alt="language connection illustration" className="w-full h-full"></img>
            </div>

            <div className="mt-6 space-y-3 text-center">
              <h2 className="text-xl font-semibold">Connect with language partners worldwide</h2>
              <p className="opacity-70">
                Practice conversations, make friends , and improve your language skills together
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
