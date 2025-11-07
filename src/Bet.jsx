import React, { useState } from "react";
import Loader from "./components/Loader";
import { Select, Button, Modal, Space } from "antd";

const TEAMS = [
  { id: "decl1", label: "Decl 1" },
  { id: "decl2", label: "Decl 2" },
  { id: "decl3", label: "Decl 3" },
  { id: "decl4", label: "Decl 4" },
];

// crypto-backed random integer in [0, max)
function cryptoRandomInt(max) {
  const array = new Uint32Array(1);
  window.crypto.getRandomValues(array);
  const fraction = array[0] / (0xffffffff + 1);
  return Math.floor(fraction * max);
}

const Bet = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [dayId, setDayId] = useState(null);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);

  const handleChange = (value) => {
    setDayId(value);
  };

  // Qaydalar:
  // - Gün 3 -> həmişə Decl 1 seçilir
  // - Gün 2 və 4 -> Decl 1 heç vaxt seçilmir
  // - Başqa hallar -> normal təsadüfi seçim
  const pickTeam = (day) => {
    // 3-cü gün: birbaşa Decl1
    if (day === 3) {
      return {
        chosen: TEAMS.find((t) => t.id === "decl1"),
        candidatesCount: TEAMS.length,
      };
    }

    // 2 və 4-cü günlər: Decl1-i çıxar
    let candidates = [...TEAMS];
    if (day === 2 || day === 4) {
      candidates = candidates.filter((t) => t.id !== "decl1");
    }

    // ehtiyat üçün
    if (candidates.length === 0) candidates = [...TEAMS];

    const idx = cryptoRandomInt(candidates.length);
    return { chosen: candidates[idx], candidatesCount: candidates.length };
  };

  const showResult = async () => {
    if (!dayId) {
      Modal.warning({
        title: "Gün seçin",
        content: "Zəhmət olmasa əvvəlcə günü seçin.",
      });
      return;
    }

    setIsLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 350));
      const { chosen, candidatesCount } = pickTeam(dayId);

      const entry = {
        time: new Date().toISOString(),
        dayId,
        chosenId: chosen.id,
        chosenLabel: chosen.label,
        candidatesCount,
      };
      setHistory((h) => [entry, ...h]);
      setResult(entry);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        margin: "auto",
        width: "800px",
        marginTop: "8%",
        color: "white",
      }}
    >
      <Select
        onChange={handleChange}
        placeholder="Günü seçin"
        style={{ width: "300px" }}
        options={[
          { value: 2, label: "2-ci gün" },
          { value: 3, label: "3-cü gün" },
          { value: 4, label: "4-cü gün" },
        ]}
      />

      <Button style={{ marginTop: "20px" }} type="primary" onClick={showResult}>
        Çərxi fələk
      </Button>

      {result && (
        <div style={{ marginTop: 20, textAlign: "center" }}>
          <h3>Nəticə</h3>
          <p>
            Vaxt: {result.time} — Gün: {result.dayId} — Seçilən:{" "}
            {result.chosenLabel} ({result.chosenId}) — Namizədlər:{" "}
            {result.candidatesCount}
          </p>
        </div>
      )}

      {history.length > 0 && (
        <div style={{ marginTop: 16, width: "100%" }}>
          <h4>Tarixçə (son nəticələr)</h4>
          <Space direction="vertical" style={{ width: "100%" }}>
            {history.slice(0, 10).map((h, i) => (
              <div
                key={i}
                style={{ background: "#111", padding: 8, borderRadius: 6 }}
              >
                <small>{h.time}</small>
                <div>
                  Gün: {h.dayId} — Seçilən: {h.chosenLabel} ({h.chosenId}) —
                  Namizədlər: {h.candidatesCount}
                </div>
              </div>
            ))}
          </Space>
        </div>
      )}
    </div>
  );
};

export default Bet;
