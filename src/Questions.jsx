import { useEffect, useState } from "react";
import axios from "axios";
import TextArea from "antd/es/input/TextArea";

function Questions() {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState({
    questionText: "",
    options: [],
    correctAnswer: ""
  });

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/questions`)
      .then(res => setQuestions(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post(`${import.meta.env.VITE_API_URL}/api/questions`, newQuestion);
    setNewQuestion({ questionText: "", options: [], correctAnswer: "" });
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/questions`);
    setQuestions(res.data);
  };

  return (
    <div className="p-6">
      <h1>🧠 Test Sualları</h1>

      <form onSubmit={handleSubmit}>
        <TextArea
          type="text"
          placeholder="Sual mətni"
          value={newQuestion.questionText}
          onChange={(e) => setNewQuestion({ ...newQuestion, questionText: e.target.value })}
        />
        <TextArea
          type="text"
          placeholder="Variantlar (vergüllə ayır)"
          onChange={(e) => setNewQuestion({ ...newQuestion, options: e.target.value.split("}") })}
        />
        <TextArea
          type="text"
          placeholder="Düzgün cavab"
          value={newQuestion.correctAnswer}
          onChange={(e) => setNewQuestion({ ...newQuestion, correctAnswer: e.target.value })}
        />
        <button type="submit">Əlavə et</button>
      </form>

      <hr />

      {questions.map((q, i) => (
        <div key={i} className="border p-4 my-3 rounded">
          <h2>{q.questionText}</h2>
          <ul>
            {q.options.map((opt, j) => (
              <li key={j}>{opt}</li>
            ))}
          </ul>
          <p>✅ Düzgün cavab: {q.correctAnswer}</p>
        </div>
      ))}
    </div>
  );
}

export default Questions;
