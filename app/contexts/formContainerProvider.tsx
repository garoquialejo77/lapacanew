import React, { PropsWithChildren, createContext, useEffect, useState } from "react"

export type GlobalContent = {
    formData: any[] | undefined
    setFormData:(c: any) => void 
    isSubmit: Boolean
    setIsSubmit:(c: any) => void 
  }

export const FormContainerContext = createContext<GlobalContent | null>({
    formData: [], // set a default value
    setFormData: () => {},
    isSubmit: false, // set a default value
    setIsSubmit: () => {},
    })

    

export const FormContainerProvider = ({ children }: PropsWithChildren) => {
    const [formData, setFormData] =  useState([])
    const [isSubmit, setIsSubmit] =  useState(false)

    useEffect(()=>{
        console.log("issubmiiiii", isSubmit)
      },[isSubmit])

    
    return (<FormContainerContext.Provider value={{formData, setFormData, isSubmit, setIsSubmit}}>{children}</FormContainerContext.Provider>)


}