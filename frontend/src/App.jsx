import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import React from 'react';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  const [currentRoom, setCurrentRoom] = useState(null);
  const messagesEndRef = useRef(null);
  const socket = useRef(null);

  useEffect(() => {
    socket.current = io();

    socket.current.on('connect', () => {
      console.log('Connected as:', socket.current.id);
    });

    socket.current.on('users', (userList) => {
      setUsers(userList.filter(([id]) => id !== socket.current.id));
    });

    socket.current.on('joinedRoom', (room) => {
      setCurrentRoom(room);
      setMessages([]);
    });

    socket.current.on('roomMessage', ({ from, message, room }) => {
      const myUsername = username || 'Anonymous'; // Use local username
      setMessages((prev) => [
        ...prev,
        { from, message, room, isSent: from === myUsername },
      ]);
    });

    return () => {
      socket.current.disconnect();
    };
  }, [username]); // Add username as dependency to update when it changes

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSetUsername = () => {
    if (username.trim()) {
      socket.current.emit('setUsername', username);
    }
  };

  const handleJoinRoom = () => {
    if (room.trim()) {
      socket.current.emit('joinRoom', room);
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (input.trim() && currentRoom) {
      socket.current.emit('roomMessage', {
        room: currentRoom,
        message: input,
      });
      setInput('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-2xl flex flex-col h-[900px] overflow-hidden border border-gray-700/50">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight">ChitChat</h1>
          <div className="text-sm">
            Room: <span className="font-semibold">{currentRoom || 'None'}</span>
          </div>
        </div>

        {/* Sidebar (Users) */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Your username"
              className="flex-1 p-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={handleSetUsername}
              className="px-4 py-2 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg hover:from-green-600 hover:to-teal-600 transition"
            >
              Set
            </button>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              placeholder="Room name"
              className="flex-1 p-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={handleJoinRoom}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg hover:from-blue-600 hover:to-indigo-600 transition"
            >
              Join
            </button>
          </div>
          <h3 className="text-lg font-semibold mt-4">Online Users</h3>
          <ul className="mt-2 max-h-32 overflow-y-auto">
            {users.map(([id, name]) => (
              <li
                key={id}
                className="p-2 text-gray-300 hover:bg-gray-700/50 rounded-lg transition"
              >
                {name} <span className="text-xs text-gray-500">({id.slice(0, 4)}...)</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto bg-gray-900/50">
          {messages.map((msg, idx) => (
            <div
              key={`${msg.message}-${idx}`}
              className={`mb-4 flex ${msg.isSent ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] break-words p-3 rounded-xl shadow-md transition-all ${
                  msg.isSent
                    ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                }`}
              >
                <p className="text-sm font-semibold">{msg.from}</p>
                <p>{msg.message}</p>
                <p className="text-xs text-gray-200 mt-1 opacity-75">
                  {msg.room} • {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={sendMessage} className="p-4 bg-gray-800/50 border-t border-gray-700 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 p-3 bg-gray-700/50 border border-gray-600 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            type="submit"
            className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full hover:from-purple-600 hover:to-pink-600 transition"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="white"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;