import React from "react";

export default function Footer() {
  return (
    <footer className="bg-primary text-white text-center py-3 mt-4">
      <div className="container">
        <p className="mb-0">
          © {new Date().getFullYear()} Chotu Dairy. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
