import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "./components/Loader";
import { Input, QRCode, Space, Select, Modal, Button, Progress } from "antd";

const redirectUrl = `${import.meta.env.VITE_BASE_URL}/speaker-questions`;
const SpeakerSelect = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = React.useState(null);
  const [url, setUrl] = React.useState(null);
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState([]);
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/users`)
      .then((res) => {
        setUsers(res.data);
        setUserId(res.data?.[0]?._id);
        setIsLoading(false);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleChange = (value) => {
    setUserId(value);
    setUrl("");
  };

  useEffect(() => {
    if (userId) {
      setUrl(`${redirectUrl}/?id=${userId}`);
    }
  }, [userId]);

  const showResult = async () => {
    setOpen(true);

    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/answeredQuestions/stats`
    );

    setLoading(false);

    setResults(res?.data);
  };
  if (isLoading) return <Loader />;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
        margin: "auto",
        width: "1300px",
        marginTop: "22%",
        color: "white",
      }}
    >

      <Select
        onChange={handleChange}
        style={{ width: "300px" }}
        value={userId}
        options={
          Array.isArray(users) && Boolean(users?.length)
            ? users.map((user) => ({
                value: user._id,
                label: `${user.name} ${user.surname}`,
              }))
            : []
        }
      />

      <Space
        style={{
          marginTop: "10px",
          backgroundColor: "white",
          position: "absolute",
          bottom: "8px",
          left: "41px",
        }}
        direction="vertical"
        align="center"
      >
        <QRCode style={{width:'477px', height:'405px'}} value={url || "-"} />
      </Space>

      <Button style={{ marginTop: "20px" }} type="primary" onClick={showResult}>
        Nəticələri göstər
      </Button>

      <Modal
        title={<p>Nəticələr</p>}
        className="result-modal"
        style={{width:'100%', height:'100vh'}}
        footer={null}
        loading={loading}
        open={open}
        onCancel={() => setOpen(false)}
      >
        {results.map((result, index) => (
          <div key={index}>
            <p>
              {Number(index + 1)}.{" "}
              <strong style={{ fontStyle: "italic" }}>
                "{result.questionText}"
              </strong>{" "}
              sualına toplamda{" "}
              <strong style={{ fontStyle: "italic" }}>
                {" "}
                {result.totalAnswered}
              </strong>{" "}
              dəfə cavab verilib. Düzgün cavablarin faiz nisbəti aşağıdakı
              kimidir.{" "}
            </p>
            {Number(result.correctPercent) === 0 ? (
              <Progress type="circle" percent={100} status="exception" />
            ) : (
              <Progress
                type="circle"
                percent={Number(result.correctPercent).toFixed(2)}
              />
            )}
          </div>
        ))}
      </Modal>
    </div>
  );
};
export default SpeakerSelect;
