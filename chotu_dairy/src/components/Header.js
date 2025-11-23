import React from "react";
import { Link } from "react-router-dom";

export default function Header() {

  const closeMenu = () => {
    const nav = document.getElementById("navbarNav");
    if (nav && nav.classList.contains("show")) {
      nav.classList.remove("show");
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-3">
      <Link className="navbar-brand fw-bold d-flex align-items-center" to="/" onClick={closeMenu}>
        <img 
          src="/logo.png"
          alt="Chotu Dairy Logo"
          style={{ height: "50px", width: "50px", marginRight: "10px", borderRadius: "50%" }}
        />
        Chotu Dairy
      </Link>

      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ms-auto">

        <li className="nav-item">
            <Link className="nav-link" to="/" onClick={closeMenu}>Sales</Link>
          </li>

          <li className="nav-item">
            <Link className="nav-link" to="/product" onClick={closeMenu}>Products</Link>
          </li>

          <li className="nav-item">
            <Link className="nav-link" to="/dashboard" onClick={closeMenu}>Dashboard</Link>
          </li>

        </ul>
      </div>
    </nav>
  );
}
