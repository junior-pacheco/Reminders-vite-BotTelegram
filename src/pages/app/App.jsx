import { useState, useEffect } from 'react';
import ReminderForm from '../../components/reminderForm/index';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import Login from '../../components/login';

const isDateValid = (dateString) => {
  const regexDate = /^\d{4}-\d{2}-\d{2}$/;
  if (!regexDate.test(dateString)) {
    return false;
  }

  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

const App = () => {
  const [reminders, setReminders] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      checkAndSendNotifications();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const checkAndSendNotifications = async () => {
    try {
      const response = await axios.get('http://localhost:3000/reminders');
      const currentDate = new Date();

      const updatedReminders = await Promise.all(response.data.map(async (reminder) => {
        const reminderDate = new Date(reminder.date_time);

        if (
          currentDate.getDate() === reminderDate.getDate() &&
          currentDate.getMonth() === reminderDate.getMonth() &&
          currentDate.getFullYear() === reminderDate.getFullYear() &&
          !reminder.notifi  // Check if the reminder has not been notified
        ) {
          try {
            await axios.post(
              `https://api.telegram.org/bot6878488109:AAGfBsKSfj1TyU6zJnUv2ruBRD-tDAQhpjQ/sendMessage`,
              {
                chat_id: '5601244911',
                text: `¡Reminder! ${reminder.message}`,
              },
            );

            await axios.put(`http://localhost:3000/reminders/${reminder.id}/mark-notified`, {
              notifi: 1,
            });
          } catch (error) {
            console.error('Error al enviar la notificación a Telegram:', error.message);
            return reminder;
          }
        }

        return reminder;
      }));

      setReminders(updatedReminders);
    } catch (error) {
      console.error('Error al obtener los recordatorios:', error);
    }
  };

  const addReminder = async (newReminder) => {
    if (!isDateValid(newReminder.date)) {
      toast.error('La fecha proporcionada no es válida. Utilice el formato YYYY-MM-DD.');
      return;
    }

    const response = await axios.post('http://localhost:3000/reminders', {
      ...newReminder,
      notifi: false,
    });

    setReminders([...reminders, response.data]);

    toast.success(`Recordatorio agregado para ${newReminder.date} a las ${newReminder.time}`, {
      autoClose: 4000,
    });
  };

  return (
  <>
    <div className="bg-slate-800 text-white flex flex-col items-center h-screen">
      <ReminderForm addReminder={addReminder} />
      <ToastContainer theme='dark' autoClose={4000} />
    </div>
  </>
  );
}

export default App;
