import { useState,useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import Sidebard from '../sidebar'
import 'firebase/auth';
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword,onAuthStateChanged } from 'firebase/auth';

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

const Login = () => {
  const { handleSubmit, control, reset } = useForm()
  const [logged, setLogged] = useState(false)

  useEffect(() => {
    // Escuchar cambios en el estado de autenticación
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLogged(true);
      } else {
        setLogged(false);
      }
    });

    // Limpiar el listener al desmontar el componente
    return () => unsubscribe();
  }, [auth]);

  const onSubmit = async ({ email, password }) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Error en la autenticación:', error.message);
    }

    reset();
  };

  return (
    <>
      {!logged
        ? (
          <div className=' h-screen w-screen flex'>

            <picture className='bg-red-400 h-full w-[60%]'>
              <img style={{ width: '100%', height: '100%' }} src="https://www.conteudoinboundmarketing.com.br/wp-content/uploads/2018/02/As-5-estrat%C3%A9gias-de-Marketing-que-mais-geram-resultados-1024x1024.png" alt="" />
            </picture>

            <div className=' h-full bg-slate-900 text-white w-[45%] flex flex-col items-center'>
              <div className='h-[20%] w-[75%] flex items-center' >
                <h1 className='font-bold text-lg text-[26px]' >Reminder<span className='font-normal'>notifi</span> </h1>
              </div>
              <form onSubmit={handleSubmit(onSubmit)} className='  flex flex-col w-[75%] h-[50%] gap-6' >
                <div>
                  <h1 className='font-bold  text-xl tracking-wide text-[28px] ' >Iniciar sesión en su cuenta</h1>
                  <p className='tracking-wide text-[22px] ' >Ingresa tus credenciales</p>
                </div>
                <div className='flex flex-col gap-3'>
                  <div className='flex flex-col'>
                    <Controller
                      name={'email'}
                      defaultValue=''
                      control={control}
                      rules={{
                        required: true,
                        pattern: {
                          message: 'Password is requerid.',
                          value: /(.*)/
                        }
                      }}
                      render={({ field: { onChange, value }, fieldState: { invalid, error } }) =>  (
                        <>
                          <label>
                            <p className='text-[22px]' >Email</p>
                          </label>
                          <input onChange={onChange} value={value} type="text" className=' text-[22px]  text-black p-2  h-[54px] w-[400px] border-2 border-gray-400/30 rounded-lg ' />
                        </>
                      )}
                    />

                  </div>
                  <div className='flex flex-col' >
                    <Controller
                      name={'password'}
                      defaultValue=''
                      control={control}
                      rules={{
                        required: true,
                        pattern: {
                          message: 'Password is requerid.',
                          value: /(.*)/
                        }
                      }}
                      render={({ field: { onChange, value }, fieldState: { invalid, error } }) => (
                        <>
                          <label>
                            <p className='text-[22px]' >Password</p>
                          </label>
                          <input value={value} type="password" className='text-[22px] p-2 h-[54px] text-black w-[400px] border-2 border-gray-400/30  rounded-lg' onChange={onChange} />
                        </>
                      )}
                    />

                  </div>
                </div>
                <div className='flex flex-col gap-3' >
                  <button className=' bg-[#0069BE]  font-bold text-[24px] h-[54px] w-[400px] text-white rounded-lg tracking-wider ' >Iniciar Sesión</button>
                </div>
              </form>
            </div>
          </div>
        )
        : <Sidebard/>
      }
    </>

  )
}

export default Login