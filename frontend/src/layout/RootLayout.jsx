import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

function RootLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow">{children}</div>
      <Footer />
    </div>
  );
}

export default RootLayout;
