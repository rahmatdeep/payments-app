import { useNavigate } from "react-router-dom"
import { Button } from "./Button"

export const Appbar = ({name}) => {
    const naviagte = useNavigate()
    
    return <div className="shadow h-14 flex justify-between">
        <div className="flex flex-col justify-center h-full ml-4">
            Payments App
        </div>
        <div className="flex">
            <div className="flex flex-col justify-center h-full mr-4">
                Hello {`${name[0].toUpperCase()}${name.slice(1)}`}
            </div>
            <div className="rounded-full h-12 w-20 bg-slate-200 flex justify-center mt-1 mr-2">
                <div className="flex flex-col justify-center h-full text-xl">
                    {name[0].toUpperCase()}
                </div>
            </div>
            <button className="rounded-full bg-red-200 text-xl h-12  self-center px-2 mr-2" onClick={()=>{
                localStorage.removeItem("token"),
                naviagte('/signin')
            }}>Sign out</button>
        </div>
    </div>
}