import "../style/Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">
        For You <span>♥</span>
      </div>
      <div className="nav-links">
        <a href="#home">Home</a>
        <a href="#memories">Memories</a>
        <a href="#message">Message</a>
        <a href="#surprise">Surprise</a>
      </div>
    </nav>
  )
}

export default Navbar