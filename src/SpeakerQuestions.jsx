import React, { useState, useEffect } from "react";
import { Button, Input, Radio } from "antd";
import axios from "axios";
import { Avatar, List } from "antd";
import { useLocation } from "react-router-dom";
import Loader from "./components/Loader";
const style = {
  display: "flex",
  flexDirection: "column",
  gap: 8,
};


const SpeakerQuestions = () => {
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [user, setUser] = useState(null);

  const [isVisible, setShowResult] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filteredQuestions, setFilteredQuestions] = useState([]);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const userId = queryParams.get("id");

  useEffect(() => {
    console.log("nece defe girir");
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/questions`)
      .then((res) => setQuestions(res.data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (questions?.length) {
      axios
        .get(`${import.meta.env.VITE_API_URL}/api/users`)
        .then((res) => {
          const foundedUser = res?.data?.find((user) => user?._id === userId);
          setUser(foundedUser);
          const responseQuestions = questions.filter((q) =>
            foundedUser.questions.includes(q._id)
          );
          setFilteredQuestions(responseQuestions);
          setAnsweredQuestions(
            responseQuestions.map((question) => ({
              questionId: question._id,
              answer: "",
            }))
          );
          setLoading(false);
        })
        .catch((err) => console.error(err));
    }
  }, [questions]);

  const onChange = (e, correctAnswer, questionId) => {
    const value = e.target.value;

    const cleaned = value.trim().replace(/\s+/g, " ");
    const updatedAnswers = answeredQuestions.map((q) =>
      q.questionId === questionId ? { ...q, answer: cleaned } : q
    );

    setAnsweredQuestions(updatedAnswers);
  };

  console.log({ answeredQuestions });

  const checkQuestionAnswer = (item) => {
    const isValid =
      answeredQuestions.find((q) => q.questionId === item._id)?.answer ===
        item.correctAnswer && isVisible;
    return isValid;
  };

  const showResult = async () => {
    console.log("test bitir");
    setShowResult(true);

    await axios.post(`${import.meta.env.VITE_API_URL}/api/answeredQuestions`, {
      answerQuestions: answeredQuestions,
    });

    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/answeredQuestions/stats`
    );

    console.log({ res });
  };

  if (loading) return <Loader />;

  return (
    <div
      style={{
        width: "100%",
      }}
    >
      <List
        itemLayout="horizontal"
        loading={loading && Boolean(filteredQuestions?.length)}
        dataSource={filteredQuestions}
        renderItem={(item, index) => (
          <List.Item
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <List.Item.Meta
              style={{
                width: "100%",
              }}
              avatar={
                <Avatar
                  style={{ backgroundColor: "#f56a00" }}
                >{`${user?.name?.[0]} ${user?.surname?.[0]}`}</Avatar>
              }
              title={<a href="https://ant.design">{item.title}</a>}
              description={item.questionText}
            />

            <div style={{ width: "100%" }}>
              <Radio.Group
                style={style}
                onChange={(e) => onChange(e, item.correctAnswer, item._id)}
                options={item.options.map((o) => ({
                  value: o,
                  label: o,
                }))}
              />
            </div>

            <div
              style={{
                visibility: isVisible ? "visible" : "hidden",
              }}
            >
              {checkQuestionAnswer(item) ? (
                <p>✅ Düzgün cavab: {item.correctAnswer}</p>
              ) : (
                <p>
                  ❌ Yanlış cavab: Sualın düzgün cavabı {item.correctAnswer} ✅
                </p>
              )}
            </div>
          </List.Item>
        )}
      />

      <Button
        disabled={loading || answeredQuestions.some((a) => a.answer === "")}
        type="primary"
        onClick={showResult}
      >
        Testi bitir və nəticəni gör
      </Button>
    </div>
  );
};
export default SpeakerQuestions;
