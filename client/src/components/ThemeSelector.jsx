import React from 'react'
import { useThemeStore } from '../../store/useThemeStore'
import { PaletteIcon } from 'lucide-react'
import { THEMES } from '../constants'

const ThemeSelector = () => {
    const {theme,setTheme}=useThemeStore()

  return (
    <div className='dropdown dropdown-end'>
        {/* Dropdown trigger */}
        <button tabIndex={0} className='btn btn-ghost btn-circle'>
            <PaletteIcon className='size-5'/>
        </button>
        <div tabIndex={0} className='w-56 p-1 mt-2 overflow-y-auto border shadow-2xl dropdown-content bg-base-200 backdrop-blur-lg rounded-2xl border-base-content/10 max-h-80'>
            <div className='space-y-1'>
                {THEMES.map((themeOption)=>{
                    return(
                        <button key={themeOption.name} className={`w-full px-4 py-3 rounded-xl flex items-center gap-3 transition-colors
                        ${
                            theme===themeOption.name?"bg-primary/10 text-primary":"hover:bg-base-content/5"
                        }`} onClick={()=>{setTheme(themeOption.name)}}>
                            <PaletteIcon className='size-4'/>
                            <span className='text-sm font-medium'>{themeOption.name}</span>
                            {/* theme colors */}
                            <div className='flex gap-1 ml-auto'>
                                {themeOption.colors.map((color,i)=>(<span className='rounded-full size-2' key={i} style={{backgroundColor:color}} ></span>))}
                            </div>
                        </button>
                    )
                })}
            </div>
        </div>
    </div>
  )
}

export default ThemeSelector
