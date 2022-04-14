import './styles/App.scss';
import MainMint from './MainMint.jsx';
import Navbar from './Navbar.jsx';

import { useState } from "react";

export default function App() {

  const [accounts, setAccounts] = useState([]);

  return (
    <main className="overlay">
      <section className="App">
        <Navbar accounts={accounts} setAccounts={setAccounts} />
        <MainMint accounts={accounts} setAccounts={setAccounts} />
      </section>
      <div className="movingBackground"></div>
    </main>
  );
}