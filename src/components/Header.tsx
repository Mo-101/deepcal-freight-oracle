import { NavLink } from "react-router-dom";
export default function Header(){
  const link = "px-3 py-2 rounded hover:bg-gray-200";
  return (
    <header className="border-b bg-white">
      <nav className="max-w-6xl mx-auto p-3 flex gap-2">
        <NavLink className={link} to="/">Dashboard</NavLink>
        <NavLink className={link} to="/ranking">Ranking</NavLink>
        <NavLink className={link} to="/chat">DeepTalk AI</NavLink>
        <NavLink className={link} to="/training">Training</NavLink>
      </nav>
    </header>
  );
}

