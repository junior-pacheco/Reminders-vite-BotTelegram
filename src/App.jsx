import { useState } from 'react';
import ReminderForm from './components/reminderForm/index';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const isDateValid = (dateString) => {
  const regexDate = /^\d{4}-\d{2}-\d{2}$/;
  if (!regexDate.test(dateString)) {
    return false;
  }

  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

function App() {
  const [reminders, setReminders] = useState([]);

  const addReminder = async (newReminder) => {
    // Validar la fecha antes de agregar el recordatorio
    if (!isDateValid(newReminder.date)) {
      toast.error('La fecha proporcionada no es válida. Utilice el formato YYYY-MM-DD.');
      return;
    }

    // Verificar que la fecha sea válida antes de agregar el recordatorio
    if (!isDateValid(newReminder.date)) {
      toast.error('La fecha proporcionada no es válida. Utilice el formato YYYY-MM-DD.');
      return;
    }

    setReminders([...reminders, newReminder]);

    // Notificar al usuario
    toast.success(`Recordatorio agregado para ${newReminder.date} a las ${newReminder.time}`, {
      autoClose: 4000, // Cerrar automáticamente después de 4 segundos
    });

    // Enviar notificación al bot de Telegram
    try {
      const response = await axios.post(
        `https://api.telegram.org/bot6878488109:AAGfBsKSfj1TyU6zJnUv2ruBRD-tDAQhpjQ/sendMessage`,
        {
          chat_id: '5601244911',
          text: `Nuevo recordatorio: ${newReminder.message} el ${newReminder.date} a las ${newReminder.time}`,
        }
      );      
      console.log('Respuesta de Telegram:', response.data);
    } catch (error) {
      console.error('Error al enviar la notificación a Telegram:', error.message);
    }
  };

  return (
    <div className="bg-blue-300 flex flex-col items-center h-screen">
      <h1 className="text-4xl font-bold mb-4">My Reminders</h1>
      <ReminderForm addReminder={addReminder} />
      <ToastContainer theme='dark' autoClose={4000} />
    </div>
  );
}

export default App;
