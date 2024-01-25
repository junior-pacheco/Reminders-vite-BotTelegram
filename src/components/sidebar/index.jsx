import React, { useState,useEffect } from 'react'
import { Link, Route, Routes, useLocation } from 'react-router-dom'
import { FaChevronLeft,FaHouseUser,FaBell} from "react-icons/fa6";
import App from '../../pages/app/App';
import User from '../../pages/user/inder';
import 'firebase/auth';
import { initializeApp } from "firebase/app";
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';
import { FaSignInAlt } from "react-icons/fa";

const Sidebard = () => {
  const [open, setOpen] = useState(true)
  const location = useLocation()
  const rutaActual = location.pathname.substring(1)
  const [user, setUser] = useState(null);

  const firebaseConfig = {
    apiKey: "AIzaSyDeSlBHQPT0BoII2Nee59SehplpDAakYVE",
    authDomain: "login-173a1.firebaseapp.com",
    projectId: "login-173a1",
    storageBucket: "login-173a1.appspot.com",
    messagingSenderId: "780946775980",
    appId: "1:780946775980:web:60514be5b056e86699e409"
  };
  
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  useEffect(() => {
    // Observar cambios en el estado de autenticación
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    // Limpiar el listener al desmontar el componente
    return () => unsubscribe();
  }, [auth]);

  const handleLogout = async () => {
    try {
      // Cerrar sesión con Firebase
      await signOut(auth);
      history.push('/login'); // Redirigir a la página de inicio de sesión después de cerrar sesión
    } catch (error) {
      console.error('Error al cerrar sesión:', error.message);
    }
  };

  const Menus = [
    { title: 'Reminders', icon: <FaBell fontSize={24}/>, url: 'remidir' },
    { title: 'Users', icon: <FaHouseUser fontSize={24}/>, url: 'users' }
  ]


  return (
    <div className="flex">
      <div
        className={` ${
          open ? 'w-68' : 'w-32 '
        } bg-[#0069BE] h-screen p-5  pt-8 relative duration-300 `}
      >
        <div
          className={`absolute cursor-pointer -right-2 top-9 w-7 h-[2%]  border-dark-purple
          rounded-full  ${!open && 'rotate-180 top-12 '}`}
          onClick={() => setOpen(!open)}

        >
          <FaChevronLeft size={20} color={'white'} style={{ fontWeight: 'bold', fontSize: '2rem' }}/>
        </div>
        <div className="flex gap-x-4 justify-center ">
          { !open
            ? <h1
              className={`text-white origin-left  font-bold text-[26px] duration-200 ${
                !open && 'scale'
              }`}
            >
              @MS
            </h1>
            : <h1
              className={`text-white origin-left font-semibold text-[26px] duration-200 ${
                !open && 'scale'
              }`}
            >
            Reminder<span className='font-thin'>notifi</span>

            </h1>
          }
        </div>
        <div className=' h-4/5 flex flex-col justify-center  items-center' >

          <ul className=" flex flex-col gap-2 ">
            {Menus.map((Menu, index) => (
              <Link key={Menu.title} to={`/${Menu.url}`} >
                <li
                  className={`flex rounded-md p-2 cursor-pointer hover:bg-light-white text-gray-300 text-sm items-center gap-x-4 
                ${Menu.gap ? 'mt-9' : 'mt-2'} ${
                index === 0 && 'bg-light-white'
              } `}
                >
                  {Menu.icon}
                  <span className={`${!open && 'hidden'} ${rutaActual === Menu.url && 'font-extrabold'}  origin-left duration-200 text-[20px]  `}>
                    {Menu.title}
                  </span>
                </li>
                
              </Link>
            ))}
          </ul>
        </div>
        <button
            onClick={handleLogout}
            className="flex rounded-md p-2 cursor-pointer hover:bg-light-white text-gray-300 text-sm items-center gap-x-4 mt-9"
          >
            <FaSignInAlt fontSize={24} />
            <span className={`${!open && 'hidden'} origin-left duration-200 text-[20px]`}>
              Logout
            </span>
          </button>
      </div>
      <div className="h-screen w-screen">
        <Routes>
          <Route path='/' element={ <App/>} />
          <Route path='remidir' element={ <App/>} />
          <Route path='/users' element={ <User/>} />
        </Routes>
      </div>
    </div>
  )
}
export default Sidebard