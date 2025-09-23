import { Routes, Route, Link } from "react-router-dom";
import ockLogo from "./assets/ock-logo.webp";


function Home() {
  return (
    <div className="page">
      <h1><img src={ockLogo} alt="OneClickKill Logo" /></h1>
      <>
        <p>
          Released in 1999, <em>Quake III Arena</em> set the standard for pure
          deathmatch. It remains a benchmark in speed, precision, and chaos
          nearly three decades later.
        </p>
        <p>
          <strong>one[click]kill</strong> brings that legacy back with a true
          Instagib Rail experience: raw reflex, razor aim, one shot, one frag.
        </p>
        <p>
          Welcome to <strong>one[click]kill.</strong>
        </p>
        <p>Contact <a href="mailto:devohart@gmail.com">d2</a>.</p>
      </>
    </div>
  );
}

function About() {
  return (
    <div className="page">
      <h1>About</h1>
      <p>This is a placeholder page. More coming soon!</p>
    </div>
  );
}

export default function App() {
  return (
    <div>
      <nav>
        {/* <Link to="/">Home</Link> | <Link to="/about">About</Link> */}

      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </div>
  );
}
