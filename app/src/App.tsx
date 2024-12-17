// import { invoke } from "@tauri-apps/api/core";
// async function greet() {
  // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
  // setGreetMsg(await invoke("greet", { name }));
// }

import { useEffect, useState } from "react";


function App() {
  const [time, setTime] = useState(new Date)
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date), 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <main className="bg-[#272525] w-full h-[100vh] flex justify-center items-center text-white">
      {displayTime(time)}
    </main>
  );
}

function displayTime(time: Date): string {
  const hour = time.getHours();
  const minute = time.getMinutes()
  const seconds = time.getSeconds()
  return `${hour}:${minute}:${seconds >= 10 ? seconds : "0" + seconds}`
}

export default App;
