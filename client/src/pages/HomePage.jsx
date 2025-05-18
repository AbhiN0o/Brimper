import React from 'react'
import { useThemeStore } from '../../store/useThemeStore'

const HomePage = () => {
  const {theme}=useThemeStore()
  return (
    <div>
      Home
    </div>
  )
}

export default HomePage
