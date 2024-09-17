import { CgNametag } from "react-icons/cg"
import { VscThreeBars } from "react-icons/vsc";
import { useState } from "react";

export const Nav = () => {
  
  const [showMenu, setShowMenu] = useState(false)
  
  function handleShowMenu(){
    setShowMenu(!showMenu)
  }

  return (
    <>
     <div className="bg-indigo-600">
     <div className=" flex items-center justify-between p-10 lg:flex-row">
        <div>
            <a href="#" className="text-white font-mono text-3x1 tracking-wider flex items-center"><CgNametag/>ALLAN PANCHI</a>
        </div>
        <div className="space-x-4">
          <div className="ssm: hidden lg:block space-x-2">
            <a href="#" className="text-white hover:bg-indigo-800 rounded-full px-5 py-2 text-x1">Home</a>
            <a href="#" className="text-white hover:bg-indigo-800 rounded-full px-5 py-2 text-x1">About Me</a>
            <a href="#" className="text-white hover:bg-indigo-800 rounded-full px-5 py-2 text-x1">Skills</a>
            <a href="#" className="text-white hover:bg-indigo-800 rounded-full px-5 py-2 text-x1">Curriculum</a>
            <a href="#" className="text-white hover:bg-indigo-800 rounded-full px-5 py-2 text-x1">Projects</a>
            <a href="#" className="text-white hover:bg-indigo-800 rounded-full px-5 py-2 text-x1">Contact Me</a>
          </div>
          <div className="ssm:block lg:hidden">
            <VscThreeBars size={30} className="text-white cursor-pointer" onClick={handleShowMenu}/>
          </div>
        </div>
      </div>
      <div className="ssm:block lg:hidden">
        {showMenu ? (<div className="flex justify-between ml-10">
          <ul>
            <li className="text-white hover:bg-indigo-800 rounded-full px-5 py-2 text-x1 cursor-pointer">Home</li>
            <li className="text-white hover:bg-indigo-800 rounded-full px-5 py-2 text-x1 cursor-pointer">About Me</li>
            <li className="text-white hover:bg-indigo-800 rounded-full px-5 py-2 text-x1 cursor-pointer">Skills</li>
            <li className="text-white hover:bg-indigo-800 rounded-full px-5 py-2 text-x1 cursor-pointer">Curriculum</li>
            <li className="text-white hover:bg-indigo-800 rounded-full px-5 py-2 text-x1 cursor-pointer">Projects</li>
            <li className="text-white hover:bg-indigo-800 rounded-full px-5 py-2 text-x1 cursor-pointer">Contact Me</li>
          </ul>
        </div>):(
          <></>
        )}
      </div>
     </div>
      
    </>
  )
}
