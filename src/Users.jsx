import { useEffect, useState } from "react";
import { Select } from 'antd';
import axios from "axios";
const OPTIONS = ['Apples', 'Nails', 'Bananas', 'Helicopters'];
function Users() {
  const [questions, setQuestions] = useState([]);
  const [users, setUsers] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
     const filteredOptions = OPTIONS.filter(o => !selectedItems.includes(o));
  const [newUser, setNewUser] = useState({
    name: "",
    surname: "",
    questions: [],
  });

  // Questions-u backend-dən çəkirik
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/api/questions`)
      .then((res) => setQuestions(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Users-u backend-dən çəkirik
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/api/users`)
      .then((res) => setUsers(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Submit funksiyası
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/api/users`, {...newUser, questions:selectedItems});
      setNewUser({ name: "", surname: "", questions: [] });
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/users`);
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };
  console.log({selectedItems})

  // Multi-select handle
  const handleQuestionsChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions)?.map(
      (opt) => opt.value
    );
    setNewUser({ ...newUser, questions: selectedOptions });
  };

  return (
    <div className="p-6">
      <h1>🧠 Userlər</h1>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="Ad"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          className="border p-2 rounded w-full"
        />

        <input
          type="text"
          placeholder="Soyad"
          value={newUser.surname}
          onChange={(e) => setNewUser({ ...newUser, surname: e.target.value })}
          className="border p-2 rounded w-full"
        />

        <Select
          mode="multiple"
          placeholder="Inserted are removed"
          value={selectedItems}
          onChange={setSelectedItems}
          style={{ width: "100%" }}
          options={questions?.map((item) => ({
            value: item._id,
            label: item.questionText,
          }))}
        />

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Əlavə et
        </button>
      </form>

      <hr className="my-6" />
    </div>
  );
}

export default Users;
