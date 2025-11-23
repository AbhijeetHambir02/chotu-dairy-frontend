import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import AddProduct from "./pages/AddProducts";
import AddSale from "./pages/AddSale";
import Dashboard from "./pages/Dashboard";
import Footer from "./components/Footer";
import DailySale from "./pages/DailySale";
import WeeklySales from "./pages/WeeklySales";
import MonthlySales from "./pages/MonthlySales";
import YearlySales from "./pages/YearlySales";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <div style={{ padding: 20 }}>
        <Routes>
          <Route path="/" element={<AddSale />} />
          <Route path="/product" element={<AddProduct />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/sales/daily" element={<DailySale />} />
          <Route path="/sales/weekly" element={<WeeklySales />} />
          <Route path="/sales/monthly" element={<MonthlySales />} />
          <Route path="/sales/yearly" element={<YearlySales />} />
        </Routes>
      </div>
      <Footer />
    </BrowserRouter>
  );
}
