  import React from 'react'
  import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
  import SpeakerSelect from "./SpeakerSelect";
  import SpeakerQuestions from "./SpeakerQuestions";
  import Questions from "./Questions";
  import Users from "./Users";
import Bet from './Bet';

  function App() {
    return (
      <Router>
        {/* <nav>
          <Link to="/">Home</Link> | 
          <Link to="/users">Users</Link> |
          <Link to="/speaker-select">Spikeri seçin</Link> |
          <Link to="/speaker-questions">Spiker Sualları</Link>
          <Link to={`/speaker-questions`}>Spiker Sualları</Link>
        </nav> */}

        <Routes>
          <Route path="/bet" element={<Bet />} />
          <Route path="/" element={<Bet />} />
          <Route path="/users" element={<Users />} />
          <Route path="/questions" element={<Questions />} />
          <Route path="/speaker-questions" element={<SpeakerQuestions />} />
        </Routes>
      </Router>
    );
  }

  export default App;
