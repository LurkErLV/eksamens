import "./App.css";
import { useState, useRef } from "react";
import Todo from "./components/Todo";

// Kartes, kas atbilst katram taustiņam un tā iespējamiem simboliem
const keypadMap: { [key: string]: string[] } = {
  "1": ["."],
  "2": ["A", "B", "C"],
  "3": ["D", "E", "F"],
  "4": ["G", "H", "I"],
  "5": ["J", "K", "L"],
  "6": ["M", "N", "O"],
  "7": ["P", "Q", "R", "S"],
  "8": ["T", "U", "V"],
  "9": ["W", "X", "Y", "Z"],
  "0": [" "],
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [input, setInput] = useState("");
  const [tasks, setTasks] = useState<string[]>([]);

  const [lastKey, setLastKey] = useState<string | null>(null);
  const [pressCount, setPressCount] = useState<number>(0);
  const lastPressTime = useRef<number>(0);

  // Funkcija, kas apstrādā taustiņa klikšķi
  const handleKeyClick = (key: string) => {
    const now = Date.now();
    const chars = keypadMap[key];
    const timeDiff = now - lastPressTime.current;

    if (key === lastKey && timeDiff < 1000) {
      // Aizvietot pēdējo simbolu, ja tas ir tas pats taustiņš un laiks nav pārsniedzis 1 sekundi

      if (!chars) return; // Ja nav simbolu, neko nedarīt

      const nextIndex = (pressCount + 1) % chars.length;
      const newChar = chars[nextIndex];

      setInput((prev) => prev.slice(0, -1) + newChar);
      setPressCount(nextIndex);
    } else {
      // Ja taustiņš ir cits vai pagājusi vairāk nekā 1 sekunde, pievienot jaunu simbolu
      const newChar = chars[0];
      setInput((prev) => prev + newChar);
      setPressCount(0);
    }

    setLastKey(key);
    lastPressTime.current = now;
  };

  // Funkcija, lai pievienotu jaunu uzdevumu
  const handleAddTask = () => {
    if (input.trim()) {
      setTasks([...tasks, input]);
      setInput("");
      setLastKey(null);
      setPressCount(0);
    }
  };

  // Funkcija, lai noņemtu uzdevumu pēc indeksa
  const handleRemoveTask = (index: number) => {
    setTasks((prevTasks) => prevTasks.filter((_, i) => i !== index));
  };

  // Funkcija, lai dzēstu pēdējo simbolu no ievades
  const deleteLastCharacter = () => {
    setInput((prev) => prev.slice(0, -1));
    setLastKey(null);
  };

  if (!isLoggedIn) {
    // Ja lietotājs nav pieteicies, rādīt pieteikšanās formu
    return (
      <>
        <div className="min-w-screen min-h-screen w-full h-full flex items-center justify-center">
          <div className="flex flex-col items-center justify-center gap-4 border p-5 rounded-2xl">
            <input
              type="text"
              placeholder="Login"
              className="text-white border border-gray-500 p-1 rounded"
              onChange={(e) => setLogin(e.target.value)}
              value={login}
            />
            <input
              type="password"
              placeholder="Password"
              className="text-white border border-gray-500 p-1 rounded"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
            <button onClick={() => (login ? setIsLoggedIn(true) : null)}>
              Login
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex flex-col items-center min-h-screen min-w-screen w-full p-5">
        <div className="flex flex-col items-center gap-2">
          {/* Ievades lauks */}
          <p className="text-2xl border p-4 rounded-2xl min-w-[50px] min-h-[65px]">
            {input}
          </p>

          {/* Taustiņš lai izveidotu uzdevumu */}
          <button onClick={handleAddTask}>+ Create Task</button>
        </div>
        <div className="flex min-w-full justify-between">
          <div className="max-w-[277px] grid grid-cols-3 gap-2 p-4">
            {/* Taustiņu izkārtojums */}
            {Object.entries(keypadMap).map(([key, chars]) => {
              const isActive = key === lastKey;
              const currentChar = isActive ? chars[pressCount] : chars[0];

              return (
                <button
                  key={key}
                  onClick={() => handleKeyClick(key)}
                  className="p-3 bg-gray-200 rounded hover:bg-gray-300 text-lg flex flex-col items-center"
                >
                  <span>{key}</span>
                  <span className="text-xs">{currentChar}</span>
                </button>
              );
            })}

            {/* Taustiņš lai dzēstu pēdējo simbolu */}
            <button
              onClick={() => deleteLastCharacter()}
              className="p-3 bg-gray-200 rounded hover:bg-gray-300 text-lg flex flex-col items-center"
            >
              <span>Delete</span>
            </button>
          </div>

          {/* Uzdevumu izvade */}
          <div className="flex flex-col items-center gap-5 max-h-[500px] overflow-y-auto">
            <h1 className="text-md font-bold mb-4">Tasks</h1>
            {tasks.map((task, index) => (
              <Todo
                key={index}
                todo={task}
                index={index}
                handleRemovetask={handleRemoveTask}
              />
            ))}
          </div>
        </div>
        <p>Logged in as <strong>{login}</strong></p>
      </div>
    </>
  );
}

export default App;
