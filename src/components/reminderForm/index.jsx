import {useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ReminderForm = ({ addReminder }) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [message, setMessage] = useState('');
  const [createdReminders, setCreatedReminders] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newReminder = { date, time, message };
    addReminder(newReminder);

    toast.success('Recordatorio creado con éxito');

    setCreatedReminders([...createdReminders, newReminder]);

    setDate('');
    setTime('');
    setMessage('');
  };

  return (
    <div className="flex justify-center items-center w-full bg-slate-800 h-full">
      <div className="flex flex-col lg:flex-row w-full lg:w-3/4 justify-center lg:justify-between items-center">
        <div className="bg-gray-200 p-8 rounded-lg shadow-md mb-8 lg:mb-0">
          <h2 className="text-2xl font-bold mb-4 text-slate-800">Create Reminders</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                Fecha:
              </label>
              <input
                type="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="mt-1 p-2 border rounded w-full"
              />
            </div>
            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                Hora:
              </label>
              <input
                type="time"
                id="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
                className="mt-1 p-2 border rounded w-full"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                Mensaje:
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                className="mt-1 p-2 border rounded w-full"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
            >
              Generate
            </button>
          </form>
        </div>

        {createdReminders.length > 0 && (
          <div className="bg-blue-300 p-4 rounded-lg lg:w-96 overflow-y-auto max-h-96">
            <h2 className="text-2xl font-bold mb-4 text-white">Reminders</h2>
            {createdReminders.map((reminder, index) => (
              <div key={index} className="bg-white p-4 mb-2 rounded-lg">
                <p className="text-gray-800"><strong>Date:</strong> {reminder.date}</p>
                <p className="text-gray-800"><strong>Hour:</strong> {reminder.time}</p>
                <p className="text-gray-800"><strong>Message:</strong> {reminder.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <ToastContainer />
    </div>
  );
};

export default ReminderForm;
