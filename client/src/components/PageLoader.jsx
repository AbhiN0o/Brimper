import { Loader2Icon } from 'lucide-react'
const PageLoader = () => {
  return (
    <div className='flex items-center justify-center min-h-screen'>
      <Loader2Icon className='size-10 animate-spin text-primary' />
    </div>
  )
}

export default PageLoader
