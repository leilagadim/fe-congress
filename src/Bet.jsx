import React, { useState } from "react";
import { Select, Button } from "antd";
import { motion } from "framer-motion";

const TEAMS = [
  { id: "decl1", label: "Decl 1", color: "#e74c3c" },
  { id: "decl2", label: "Decl 2", color: "#3498db" },
  { id: "decl3", label: "Decl 3", color: "#27ae60" },
];

function cryptoRandomInt(max) {
  const array = new Uint32Array(1);
  window.crypto.getRandomValues(array);
  return Math.floor((array[0] / (0xffffffff + 1)) * max);
}

const Bet = () => {
  const [dayId, setDayId] = useState(null);
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [winner, setWinner] = useState(null);

  const handleChange = (value) => setDayId(value);

  const pickTeam = (day) => {
    if (day === 3) return TEAMS.find((t) => t.id === "decl1");
    let candidates = [...TEAMS];
    if (day === 2 || day === 4)
      candidates = candidates.filter((t) => t.id !== "decl1");
    return candidates[cryptoRandomInt(candidates.length)];
  };

  const showResult = () => {
    if (!dayId) return alert("Zəhmət olmasa əvvəlcə günü seçin.");

    const selected = pickTeam(dayId);
    const index = TEAMS.findIndex((t) => t.id === selected.id);
    const randomTurns = 5 + Math.random() * 3;
    const degreesPerTeam = 360 / TEAMS.length;
    const targetRotation =
      rotation +
      randomTurns * 360 +
      (360 - index * degreesPerTeam - degreesPerTeam / 2);

    setSpinning(true);
    setWinner(null);
    setRotation(targetRotation);

    setTimeout(() => {
      setWinner(selected);
      setSpinning(false);
    }, 4500);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(270deg, #1e3c72, #2a5298, #ff5f6d, #ffc371)",
        backgroundSize: "800% 800%",
        animation: "bgMove 20s ease infinite",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        textAlign: "center",
      }}
    >
      <style>
        {`
          @keyframes bgMove {
            0% {background-position: 0% 50%;}
            50% {background-position: 100% 50%;}
            100% {background-position: 0% 50%;}
          }
        `}
      </style>

      <h2 style={{ color: "#00eaff", fontWeight: 700, fontSize: "2rem" }}>
        🎡 Çərxi-Fələk Oyunu 🎉
      </h2>

      <Select
        onChange={handleChange}
        placeholder="Günü seçin"
        style={{
          width: "250px",
          marginTop: 20,
          backgroundColor: "#fff",
          borderRadius: "8px",
        }}
        options={[
          { value: 2, label: "2-ci gün" },
          { value: 3, label: "3-cü gün" },
          { value: 4, label: "4-cü gün" },
        ]}
      />

      <Button
        type="primary"
        style={{
          background: "#00eaff",
          borderColor: "#00eaff",
          marginTop: 20,
          fontWeight: 600,
          boxShadow: "0 0 10px #00eaff, 0 0 20px #00eaff66",
        }}
        onClick={showResult}
        disabled={spinning}
      >
        {spinning ? "Fırlanır..." : "Çərxi fələk!"}
      </Button>

      {/* Çərx */}
      <div
        style={{
          position: "relative",
          width: 340,
          height: 340,
          marginTop: 50,
        }}
      >
        {/* Ox */}
        <div
          style={{
            position: "absolute",
            top: "-25px",
            left: "50%",
            transform: "translateX(-50%)",
            width: 0,
            height: 0,
            borderLeft: "15px solid transparent",
            borderRight: "15px solid transparent",
            borderBottom: "25px solid #ff4757",
            zIndex: 10,
            filter: "drop-shadow(0 0 5px #fff)",
          }}
        ></div>

        {/* Çarx */}
        <motion.div
          animate={{ rotate: rotation }}
          transition={{ duration: 4, ease: "easeOut" }}
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            border: "8px solid #00eaff",
            overflow: "hidden",
            position: "relative",
            boxShadow: "0 0 25px #00eaff, 0 0 60px #00eaff88",
            background: "radial-gradient(circle, #042e5f 40%, #0a4b8a 100%)",
          }}
        >
          {TEAMS.map((t, i) => {
            const angle = (360 / TEAMS.length) * i;
            return (
              <div
                key={t.id}
                style={{
                  position: "absolute",
                  width: "50%",
                  height: "50%",
                  background: `linear-gradient(135deg, ${t.color}aa, ${t.color})`,
                  transformOrigin: "100% 100%",
                  transform: `rotate(${angle}deg) skewY(-30deg)`,
                  border: "1px solid rgba(255,255,255,0.3)",
                  boxShadow: "inset 0 0 10px rgba(0,0,0,0.3)",
                }}
              ></div>
            );
          })}

          {/* Dekorativ mərkəz */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 80,
              height: 80,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, #00eaff 20%, #004d99 80%, #002d66 100%)",
              boxShadow: "0 0 15px #00eaff, inset 0 0 10px #003366",
            }}
          ></div>
        </motion.div>
      </div>

      {/* Qalib */}
      {winner && (
        <div
          style={{
            marginTop: 40,
            fontSize: 22,
            fontWeight: "bold",
            color: winner.color,
            textShadow: "0 0 10px #fff, 0 0 20px " + winner.color,
          }}
        >
          🎉 Qalib komanda: {winner.label} 🎊
        </div>
      )}
    </div>
  );
};

export default Bet;
