import React, {useEffect, useState} from "react";
import { Link } from "react-router-dom";

import { getSalesSummary, getTopProducts } from "../api";

export default function DashboardPage() {

  const [salesSummary, setSalesSummary] = useState({
    today: 0,
    week: 0,
    month: 0,
    year: 0,
  });
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const getchSalesSummary = async () => {
    try {
      const res = await getSalesSummary();
      setSalesSummary(res.data);
    } catch (error) {
      console.error("Error fetching sales summary:", error);
    }
  };

  const getTop5Products = async () => {
    try {
      setLoading(true);
      const res = await getTopProducts(5);
      setTopProducts(res.data);
    } catch (error) {
      console.error("Error fetching top products:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    getchSalesSummary();
    getTop5Products();
  }, []);

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4 text-center">Overall Dashboard</h2>

      <div className="d-flex flex-wrap justify-content-between gap-3 mb-4">
        <Link to="/sales/daily" className="text-decoration-none flex-grow-1">
          <div className="stat-card shadow-sm p-4 text-center hover-shadow">
            <h3 className="stat-value">₹{salesSummary.today}</h3>
            <p className="stat-label">Today's Sales </p>
          </div>
        </Link>

        <Link to="/sales/weekly" className="text-decoration-none flex-grow-1">
          <div className="stat-card shadow-sm p-4 text-center hover-shadow">
            <h3 className="stat-value">₹{salesSummary.week}</h3>
            <p className="stat-label">This Week Sales</p>
          </div>
        </Link>

        <Link to="/sales/monthly" className="text-decoration-none flex-grow-1">
          <div className="stat-card shadow-sm p-4 text-center hover-shadow">
            <h3 className="stat-value">₹{salesSummary.month}</h3>
            <p className="stat-label">This Month Sales</p>
          </div>
        </Link>

        <Link to="/sales/yearly" className="text-decoration-none flex-grow-1">
          <div className="stat-card shadow-sm p-4 text-center hover-shadow">
            <h3 className="stat-value">₹{salesSummary.year}</h3>
            <p className="stat-label">This Year Sales</p>
          </div>
        </Link>
      </div>


      <div className="card shadow-sm mt-4">
        <div className="card-body">
          <h4 className="fw-bold mb-3">Top Selling Products</h4>

          <ul className="list-group">
            {/* <li className="list-group-item d-flex justify-content-between">
              Milk <span className="fw-bold">1200 sales</span>
            </li> */}

            {loading ? (
              <div className="text-center py-3">Loading top products...</div>
            ) : topProducts.length > 0 ? (
              topProducts.map((product, index) => (
                <li key={index} className="list-group-item d-flex justify-content-between">
                  {product.product_name} <span className="fw-bold">{product.total_sales} sales</span>
                </li>
              ))
            ) : (
              <div className="text-center py-3">No top products data available.</div>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
