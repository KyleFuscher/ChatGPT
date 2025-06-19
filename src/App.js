import React, { useState, useEffect } from 'react';
import './App.css';
import gptLogo from './assets/chatgpt.svg';
import userIcon from './assets/user-icon.png';
import gptImgLogo from './assets/chatgptLogo.svg';
import addIcon from './assets/add-30.png';
import messageIcon from './assets/message.svg';
import homeIcon from './assets/home.svg';
import bookmarkIcon from './assets/bookmark.svg';
import rocketIcon from './assets/rocket.svg';

function App() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { text: "Hi, I'm ChatGPT! Ask me anything.", isBot: true },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    document.body.className = isDarkTheme ? 'dark-theme' : 'light-theme';
  }, [isDarkTheme]);

  const toggleTheme = () => setIsDarkTheme(prev => !prev);
  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { text: input, isBot: false };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { text: data.reply, isBot: true }]);
    } catch (err) {
      setMessages(prev => [...prev, { text: "⚠️ Error contacting server.", isBot: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`App ${isSidebarOpen ? 'sidebar-open' : 'sidebar-collapsed'}`}>
      <div className="sideBar">
        <div className="upperSide">
          <div className="upperSideTop">
            <img src={gptLogo} alt="Logo" className="logo" />
            <span className="brand">ChatGPT</span>
          </div>
          <button className="newChatBtn">
            <img src={addIcon} alt="new chat" />
            {isSidebarOpen && 'New Chat'}
          </button>
          <div className="queryList">
            <button className="queryBtn">
              <img src={messageIcon} alt="query" />
              {isSidebarOpen && 'What is Programming?'}
            </button>
            <button className="queryBtn">
              <img src={messageIcon} alt="query" />
              {isSidebarOpen && 'How to use API?'}
            </button>
            <button className="queryBtn">
              <img src={messageIcon} alt="query" />
              {isSidebarOpen && 'Why is the sky blue?'}
            </button>
          </div>
        </div>
        <div className="bottomSideBar">
          <div className="navItem">
            <img src={homeIcon} alt="home" />
            {isSidebarOpen && <p>Home</p>}
          </div>
          <div className="navItem">
            <img src={bookmarkIcon} alt="saved" />
            {isSidebarOpen && <p>Saved</p>}
          </div>
          <div className="navItem">
            <img src={rocketIcon} alt="upgrade" />
            {isSidebarOpen && <p>Upgrade to Pro</p>}
          </div>
        </div>
      </div>

      <div className="main">
        <div className="chats">
          {messages.map((msg, i) => (
            <div key={i} className={msg.isBot ? 'chat bot' : 'chat'}>
              <img src={msg.isBot ? gptImgLogo : userIcon} className="chatImg" alt="avatar" />
              <p className="txt">{msg.text}</p>
            </div>
          ))}
        </div>

        <div className="chatFooter">
          <div className="inp">
            <input
              type="text"
              placeholder="Send a message"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              disabled={isLoading}
            />
            <button className="send" onClick={handleSend} disabled={isLoading}>
              {isLoading ? 'Sending...' : 'Send'}
            </button>
          </div>
          <p>ChatGPT may produce inaccurate information about people, places, or facts.</p>
        </div>
      </div>
    </div>
  );
}

export default App;