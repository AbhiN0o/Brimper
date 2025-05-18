import {create} from "zustand"

export const useThemeStore = create((set)=>({
    theme:JSON.parse(localStorage.getItem("brimperTheme")) || "forest",
    setTheme:(theme)=>{
        localStorage.setItem("brimperTheme",JSON.stringify(theme))
        set({theme})
    }
}))

