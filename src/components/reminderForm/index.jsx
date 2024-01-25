import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

Modal.setAppElement('#root');

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

const ReminderForm = ({ addReminder }) => {
  const [dateTime, setDateTime] = useState('');
  const [message, setMessage] = useState('');
  const [localReminders, setLocalReminders] = useState([]);
  const [editingReminder, setEditingReminder] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  console.log('localReminders', localReminders)
  const getUserId = () => {
    const user = auth.currentUser;
    return user ? user.uid : null;
  };

  useEffect(() => {
    getAllReminders();
  }, []);

  const getAllReminders = async () => {
    try {
      const userId = getUserId();

      if (!userId) {
        console.error('Usuario no autenticado');
        toast.error('Usuario no autenticado');
        return;
      }

      const response = await axios.get(`http://localhost:3000/reminders/${userId}`);
      setLocalReminders(response.data);
    } catch (error) {
      console.error('Error al obtener todos los recordatorios:', error);
      toast.error('Error al obtener todos los recordatorios');
    }
  };

  

  const saveChanges = async () => {
    try {
      const userId = getUserId();

      if (!userId) {
        console.error('Usuario no autenticado');
        toast.error('Usuario no autenticado');
        return;
      }

      const newReminder = {
        date_time: dateTime,
        message: message,
      };

      if (isEditing) {
        // Si está editando, realiza una solicitud PUT
        await axios.put(`http://localhost:3000/${userId}/${editingReminder.reminderid}`, newReminder);
        toast.success('Recordatorio actualizado con éxito');
      } else {
        // Si no está editando, realiza una solicitud POST para crear
        const response = await axios.post(`http://localhost:3000/${userId}`, newReminder);
        toast.success('Recordatorio creado con éxito');
        // Actualiza la lista de recordatorios después de la operación y agrega el nuevo recordatorio
        setLocalReminders([...localReminders, response.data]);
      }

      setIsModalOpen(false);
      clearForm();
    } catch (error) {
      console.error('Error al actualizar/crear el recordatorio:', error);
      toast.error('Error al actualizar/crear el recordatorio');
    }
  };
  
   const formatISODateTime = (isoDateTime) => {
    const date = new Date(isoDateTime);
    const year = date.getFullYear();
    const month = `0${date.getMonth() + 1}`.slice(-2);
    const day = `0${date.getDate()}`.slice(-2);
    const hours = `0${date.getHours()}`.slice(-2);
    const minutes = `0${date.getMinutes()}`.slice(-2);
    const seconds = `0${date.getSeconds()}`.slice(-2);
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  };

  const clearForm = () => {
    setDateTime('');
    setMessage('');
  };

  const handleEdit = (reminder) => {
    setEditingReminder(reminder);
    setDateTime(formatISODateTime(reminder.date_time));
    setMessage(reminder.message);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const cancelEdit = () => {
    setEditingReminder(null);
    clearForm();
    setIsEditing(false);
    setIsModalOpen(false);
  };
  const handleDelete = async (reminderId) => {
    const userId = getUserId();
    if (!userId) {
      console.error('Usuario no autenticado');
      toast.error('Usuario no autenticado');
      return;
    }
  
    try {
      await axios.delete(`http://localhost:3000/${userId}/${reminderId}`);
      setLocalReminders(localReminders.filter((reminder) => reminder.reminderid !== reminderId));
      toast.success('Recordatorio eliminado con éxito');
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error al eliminar el recordatorio:', error);
      toast.error('Error al eliminar el recordatorio');
    }
  };
  return (
    <div className="flex justify-center items-center w-full bg-slate-800 h-full">
      <div className="flex flex-col  w-full h-[100%]  justify-center items-center">
       <h1 className="text-4xl font-bold mb-4">Reminders</h1>
        <div className='flex justify-end w-[90%]'>
          <button
            onClick={() => {
              setIsEditing(false);
              setIsModalOpen(true);
              saveChanges();
            }}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Create
          </button>
        </div>


        <div className="bg-slate-700 p-4 rounded-lg h-[78%] w-[90%] overflow-y-auto">
          <table className="w-full table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2 w-1/3">Fecha</th>
                <th className="px-4 py-2 w-1/3">Mensaje</th>
                <th className="px-4 py-2 w-1/3">Acciones</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {localReminders.map((reminder, index) => (
                <tr key={index}>
                  <td className="px-4 py-2 overflow-hidden whitespace-nowrap overflow-ellipsis w-1/3">
                    {reminder.data_time}
                  </td>
                  <td className="px-4 py-2 overflow-hidden whitespace-nowrap overflow-ellipsis w-1/3">
                    {reminder.message}
                  </td>
                  <td className="px-4 py-2 w-1/3">
                    <div className='flex justify-center'>
                      <button
                        onClick={() => handleEdit(reminder)}
                        className="bg-yellow-500 text-white px-2 py-1 mr-2 rounded"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(reminder.reminderid)}
                        className="bg-red-500 text-white px-2 py-1 rounded"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Modal
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          className="modal"
        >
          <div className="w-full h-full mx-auto mt-10 p-6 bg-white rounded shadow-lg">
            <h2 className="text-2xl font-bold mb-4">
              {isEditing ? 'Editar Recordatorio' : 'Crear Recordatorio'}
            </h2>
            <div className="mb-4">
              <label htmlFor="modalDateTime" className="block text-sm font-medium text-gray-700">
                Fecha y Hora:
              </label>
              <input
                type="datetime-local"
                id="modalDateTime"
                value={dateTime}
                onChange={(e) => setDateTime(e.target.value)}
                required
                className="mt-1 p-2 text-black border rounded w-full"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="modalMessage" className="block text-sm font-medium text-gray-700">
                Mensaje:
              </label>
              <textarea
                id="modalMessage"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                className="mt-1 p-2 text-black border rounded w-full"
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => {
                  saveChanges();
                  setIsModalOpen(false);
                }}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
              >
                {isEditing ? 'Editar' : 'Crear'}
              </button>
              <button
                onClick={() => {
                  cancelEdit();
                  setIsModalOpen(false);
                }}
                className="ml-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 focus:outline-none focus:ring focus:border-gray-300"
              >
                Cancelar
              </button>
            </div>
          </div>
        </Modal>

      </div>
      <ToastContainer />
    </div>
  );
};

export default ReminderForm;
