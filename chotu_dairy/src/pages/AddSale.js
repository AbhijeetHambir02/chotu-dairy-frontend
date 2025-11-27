import React, { useState, useEffect } from "react";
import Select from "react-select";

import { getProducts, getSales, addSale, pageLoader } from "../api";

export default function AddSale() {
  const [searchTerm, setSearchTerm] = useState("");

  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState("");

  const [salesList, setSalesList] = useState([]);

  const [loadingSales, setLoadingSales] = useState(true); // for sales table
  const [submitting, setSubmitting] = useState(false);   // for add sale button
  const [fullPageLoading, setFullPageLoading] = useState(true); // for full page loader



  // Load products on mount
  const fetchProductsList = async () => {
    try {
      const res = await getProducts();
      setProducts(res.data);
    } catch (error) {
      console.log("Error loading products:", error);
    }
  };


  // fetch sales data
  const fetchSalesList = async () => {
    try {
      setLoadingSales(true);
      // const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
      const today = new Date().toLocaleString("en-CA", { timeZone: "Asia/Kolkata" }).split(",")[0];
      const res = await getSales(today);
      setSalesList(res.data);
    } catch (error) {
      console.log("Error loading sales:", error);
    } finally {
      setLoadingSales(false);
    }
  };

  useEffect(() => {
    fetchProductsList();
    fetchSalesList();
    setPageLoader();
  }, []);

  // convert products to react-select format
  const productOptions = products
    .sort((a, b) => a.product_name.localeCompare(b.product_name)) // A → Z
    .map((p) => ({
      value: p.id,
      label: p.product_name,
      price: p.price,
    }));



  const handleSaleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedProduct || !quantity) {
      alert("Please select product and quantity.");
      return;
    }

    try {
      setSubmitting(true);

      const saleData = {
        name: selectedProduct.label,         // product name
        product_id: selectedProduct.value,   // product id
        quantity: parseInt(quantity),
        total_price: selectedProduct.price * parseInt(quantity),
        date: new Date().toLocaleString("en-CA", { timeZone: "Asia/Kolkata" }).split(",")[0]
      };


      // Call POST API
      const res = await addSale(saleData);

      // Clear inputs
      setSelectedProduct("");
      setQuantity("");
      // Refresh sales list
      fetchSalesList();

    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product");
    } finally {
      setSubmitting(false);
    }

  };

  // Calculate today's total sales
  const todayTotal = salesList.reduce((sum, sale) => sum + Number(sale.total_price), 0);


   // ---------------- LOADER COMPONENT ---------------- //
  const FullPageLoader = () => (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(255,255,255,0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <div
        className="spinner-border text-primary"
        style={{ width: "3rem", height: "3rem" }}
      ></div>
    </div>
  );

  const setPageLoader = () => {
    setFullPageLoading(true);
    try {
      const res = pageLoader();
    } catch (error) {
      console.log("Page loader error:", error);
    }
    finally {
      setFullPageLoading(false);
    }
  };




  return (
    <div className="container py-4">
      {fullPageLoading && <FullPageLoader />}

      {/* --------- Card: Add Sale Form --------- */}
      <div className="card shadow-sm mb-4 p-3">
        <div className="card-body">
          <h4 className="fw-bold mb-3">Add New Sale</h4>

          <form onSubmit={handleSaleSubmit}>
            <div className="mb-3">
              <label className="form-label">Select Product</label>

              <Select
                options={productOptions}
                value={selectedProduct}
                onChange={(option) => setSelectedProduct(option)}
                placeholder="Search product..."
                isSearchable
                formatOptionLabel={(option) => (
                  <div className="d-flex justify-content-between">
                    <span>{option.label}</span>
                    <span>₹{option.price}</span>
                  </div>
                )}
              />
            </div>


            <div className="mb-3">
              <label className="form-label">Quantity</label>
              <input
                type="number"
                className="form-control"
                placeholder="Enter quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>

            <button
              className="btn btn-primary w-100"
              type="submit"
              disabled={submitting}
            >
              {submitting ? "Adding..." : "Add Sale"}
            </button>
          </form>
        </div>
      </div>

      {/* --------- Sale Table with Search --------- */}
      <div className="mt-6">
        <h4 className="fw-bold mb-3 d-flex justify-content-between">
          <span>Today's Sales</span>
          <span> ₹{todayTotal}</span>
        </h4>


        {/* Search Bar */}
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search product..."
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="table-responsive">
          <table className="table custom-sale-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Product</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {loadingSales ? (
                <tr>
                  <td colSpan="5" className="text-center">Loading sales...</td>
                </tr>
              ) : (
                salesList
                  .sort((a, b) => b.id - a.id)
                  .filter((sale) =>
                    sale.name.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((sale, index) => (
                    <tr key={sale.id}>
                      <td>{salesList.length - index}</td>
                      <td>{sale.name}</td>
                      <td>{sale.price}</td>
                      <td>{sale.quantity}</td>
                      <td>{sale.total_price}</td>
                    </tr>
                  ))
              )}
            </tbody>
            <tfoot>
              <tr className="table-active">
                <td colSpan={4} className="text-end fw-bold">Total Sales:</td>
                <td className="fw-bold">₹{todayTotal.toLocaleString('en-IN')}</td>
              </tr>
            </tfoot>

          </table>
        </div>
      </div>



    </div>
  );
}
