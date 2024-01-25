import { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';

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
const db = getFirestore(app);

const User = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '' });
  const [editingUserId, setEditingUserId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState('create');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, 'users');
        const querySnapshot = await getDocs(usersCollection);
        const userData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUsers(userData);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [db]);

  const openModal = (action, user) => {
    console.log('Opening modal');
    setIsModalOpen(true);
    setModalAction(action);
    if (action === 'edit') {
      setEditingUserId(user.id);
      setNewUser({ ...user });
    } else {
      setEditingUserId(null);
      setNewUser({ name: '', email: '', password: '' });
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalAction('create');
    setEditingUserId(null);
    setNewUser({ name: '', email: '', password: '' });
  }

  const handleUserAction = async () => {
    try {
      if (modalAction === 'create') {
        // Código para crear usuario
        const email = newUser.email;
        const password = newUser.password;

        // Crear usuario en Firebase Authentication
        const result = await createUserWithEmailAndPassword(auth, email, password);
        const user = result.user;

        // Actualizar perfil con nombre
        await updateProfile(user, { displayName: newUser.name });

        // Agregar usuario a Firestore con información de bot de Telegram
        const usersCollection = collection(db, 'users');
        const newUserDoc = await addDoc(usersCollection, {
          name: newUser.name,
          email: newUser.email,
          botToken: newUser.botToken, // Agrega este campo
          chatId: newUser.chatId,     // Agrega este campo
        });

        const createdUserInFirestore = { id: newUserDoc.id, ...newUser };
        setUsers((prevUsers) => [...prevUsers, createdUserInFirestore]);
        setNewUser({ name: '', email: '', password: '', botToken: '', chatId: '' });
        setIsModalOpen(false);
      } else if (modalAction === 'edit') {
        // Código para editar usuario
        const userDoc = doc(db, 'users', editingUserId);
        await updateDoc(userDoc, {
          name: newUser.name,
          email: newUser.email,
          botToken: newUser.botToken, // Actualiza este campo
          chatId: newUser.chatId,     // Actualiza este campo
        });

        setUsers((prevUsers) => prevUsers.map((user) => (user.id === editingUserId ? { ...user, name: newUser.name, email: newUser.email, botToken: newUser.botToken, chatId: newUser.chatId } : user)));
        setEditingUserId(null);
        setNewUser({ name: '', email: '', password: '', botToken: '', chatId: '' });
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error('Error handling user action:', error);
    }
  }


  const handleDeleteUser = async (userId) => {
    try {
      const userDoc = doc(db, 'users', userId);
      await deleteDoc(userDoc);
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleEditClick = (user) => {
    openModal('edit', user);
  };


  return (
    <div className="bg-slate-800 text-white h-screen flex flex-col items-center overflow-hidden">
      <h1 className="text-4xl font-bold mb-4">User</h1>

      <div className="flex w-[90%] justify-end">
        <button
          onClick={() => openModal('create')}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Create
        </button>
      </div>
      <div className="bg-slate-700 rounded-s-xl w-[90%] h-[80%] overflow-auto">
        <table className="table-auto w-full">
          <thead>
            <tr>
              <th className=" px-4 py-2 w-1/3">Name</th>
              <th className=" px-4 py-2 w-1/3">Email</th>
              <th className=" px-4 py-2 w-1/3">Actions</th>
            </tr>
          </thead>
          <tbody className="table-body">
            {users.map((user) => (
              <tr key={user.id}>
                <td className=" px-4 py-2 w-1/3 overflow-hidden whitespace-nowrap overflow-ellipsis">
                  {user.name}
                </td>
                <td className="px-4 py-2 w-1/3 overflow-hidden whitespace-nowrap overflow-ellipsis">
                  {user.email}
                </td>
                <td className="px-4 py-2 w-1/3">
                  <div className='flex justify-center'>
                    <button
                      onClick={() => handleEditClick(user)}
                      className="bg-yellow-500 text-white px-2 py-1 mr-2 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Delete
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
        onRequestClose={closeModal}
        className="modal"


      >
        <div className="flex flex-col w-96 overscroll-y-contain mx-auto mt-10 p-6 bg-white rounded shadow-lg">
          <h2 className="text-2xl font-bold mb-4">
            {modalAction === 'create' ? 'Create User' : 'Edit User'}
          </h2>
          <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Bot Token:</label>
          <input
            type="text"
            value={newUser.botToken}
            onChange={(e) => setNewUser({ ...newUser, botToken: e.target.value })}
            className="w-full border p-2 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Chat ID:</label>
          <input
            type="text"
            value={newUser.chatId}
            onChange={(e) => setNewUser({ ...newUser, chatId: e.target.value })}
            className="w-full border p-2 rounded"
          />
        </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Name:</label>
            <input
              type="text"
              value={newUser.name}
              onChange={(e) =>
                setNewUser({ ...newUser, name: e.target.value })
              }
              className="w-full border p-2 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Email:</label>
            <input
              type="text"
              value={newUser.email}
              onChange={(e) =>
                setNewUser({ ...newUser, email: e.target.value })
              }
              className="w-full border p-2 rounded"
            />
          </div>
          {modalAction === 'create' && (
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Password:</label>
              <input
                type="password"
                value={newUser.password}
                onChange={(e) =>
                  setNewUser({ ...newUser, password: e.target.value })
                }
                className="w-full border p-2 rounded"
              />
            </div>
          )}
          <div className="flex justify-end">
            <button
              onClick={closeModal}
              className="bg-red-500 text-white px-4 py-2 mr-2 rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleUserAction}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              {modalAction === 'create' ? 'Create' : 'Save'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default User;
