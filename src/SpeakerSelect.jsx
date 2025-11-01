import React, { useEffect, useState } from "react";
import axios from "axios";
import { Input, QRCode, Space, Select } from "antd";

const redirectUrl = `${import.meta.env.VITE_BASE_URL}/speaker-questions`;
const App = () => {
  const [userId, setUserId] = React.useState(null);
  const [url, setUrl] = React.useState(redirectUrl);
  const [users, setUsers] = useState([]);
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/users`)
      .then((res) => setUsers(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleChange = (value) => {
    console.log({ value });
    setUserId(value);
  };

  useEffect(() => {
    if (userId) {
      setUrl(`${url}/?id=${userId}`);
    }
  }, [userId]);
  return (
    <>
      <Select
        onChange={handleChange}
        style={{ width: "100%" }}
        options={users.map((user) => ({
          value: user._id,
          label: `${user.name} ${user.surname}`,
        }))}
      />

      <Space direction="vertical" align="center">
        <QRCode value={url || "-"} />
        {url}
      </Space>
    </>
  );
};
export default App;
