import { useState } from "react"
import {useMutation, useQueryClient} from "@tanstack/react-query"
import { login } from "../lib/api"
import {  ShipWheelIcon } from "lucide-react"
import { Link } from "react-router"

const LoginPage = () => {
  const [loginData,setLoginData]=useState({
    email:"",
    password:""
  })

  const queryClient=useQueryClient()

  const {mutate:loginMutation,isPending,error} = useMutation({
    mutationFn:login,
    onSuccess:()=>{
      queryClient.invalidateQueries({queryKey:['authUser']})
    }
  })

  const handleLogin =(e)=>{
    e.preventDefault();
    loginMutation(loginData)
  }

  return (
    <div className="flex items-center justify-center h-screen p-4 sm:p-6 md:pd-8" data-theme="forest">
      <div className="flex flex-col w-full max-w-5xl mx-auto overflow-hidden border shadow-lg border-primary/25 lg:flex-row bg-base-100 rounded-xl">
        {/* login form  section*/}
        <div className="flex flex-col w-full p-4 lg:w-1/2 sm:p-8">
          <div className="flex items-center justify-start gap-2 mb-4">
            <ShipWheelIcon className="text-primary size-9" />
            <span className="text-3xl font-bold tracking-wide text-transparent bg-gradient-to-r from-primary to-secondary bg-clip-text">Brimper</span>
            </div>
            {/* Eroor handling */}
            {error && (
              <div className="mb-4 alert alert-error">
                <span>{error.response.data.message}</span>
              </div>
            )}
            
            <div className="w-full">
              <form onSubmit={handleLogin}>
                <div className="space-y-4 ">
                  <div>
                    <h2 className="text-xl font-semibold">Welcome Back</h2>
                    <p className="text-sm opacity-70">
                      Sign in to your account to continue your language journey
                    </p>
                  </div>
                  
                  <div className="flex flex-col gap-3">
                    <div className="w-full space-y-2 form-control">
                      <label className="label">
                        <span className="label-text">Email</span>
                      </label>
                      <input 
                        type="email"
                        placeholder="temp@example.com"
                        className="w-full input input-bordered"
                        value={loginData.email}
                        onChange={(e)=>setLoginData({...loginData,email:e.target.value})}
                        required
                        />
                    </div>

                    <div className="w-full space-y-2 form-control">
                      <label className="label">
                        <span className="label-text">Password</span>
                      </label>
                      <input 
                        type="password"
                        placeholder="********"
                        className="w-full input input-bordered"
                        value={loginData.password}
                        onChange={(e)=>setLoginData({...loginData,password:e.target.value})}
                        required
                        />
                    </div>


                    <button type="submit" className="w-full btn btn-primary" disabled={isPending}>
                      {isPending?(
                        <>
                          <span className="loading loading-spinner loading-xs"></span>
                          Signing in...
                        </>
                      ):(
                        "Sign In"
                      )}
                    </button>
                    <div className="mt-4 text-center">
                      <p className="text-sm">
                        Don't have an account?{" "}
                        <Link to={"/signup"} className="text-primary hover:underline"
                        >
                          Create One
                        </Link>
                      </p>
                    </div>
                  </div>

                </div>
              </form>
          </div>
        </div>
        <div className="items-center justify-center hidden w-full lg:flex lg:w-1/2 bg-primary/10">
          <div className="max-w-md p-8">
            <div className="relative max-w-sm aspect-square max-auto">
              <img src="/vid-icon.png" className="w-full h-full" alt="language connection illustration"
              />
            </div>
            <div className="mt-6 space-y-3 text-center">
              <h2 className="text-xl font-semibold">Connect with language partners worldwide</h2>
              <p className="opacity-70">
                Practice conversations, make friends, and improve you language skills together
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
