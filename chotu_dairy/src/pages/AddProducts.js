import React, { useState, useEffect } from "react";
import { getProducts, addProduct, deleteProduct } from "../api";
import "bootstrap-icons/font/bootstrap-icons.css";


export default function AddProductPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);

  const fetchProductsList = async () => {
    setLoading(true);
    try {
      const res = await getProducts();
      const sortedProducts = res.data.sort((a, b) =>
        a.product_name.localeCompare(b.product_name)
      );
      setProducts(sortedProducts);
    } catch (error) {
      console.log("Error loading products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsList();
  }, []);

  const handleAddProduct = async () => {
    if (!productName || !price) {
      alert("Please enter product name and price.");
      return;
    }

    setAdding(true);
    try {
      const newProduct = {
        product_name: productName,
        price: parseFloat(price),
      };

      const res = await addProduct(newProduct);

      const updatedProducts = [...products, res.data].sort((a, b) =>
        a.product_name.localeCompare(b.product_name)
      );
      setProducts(updatedProducts);

      setProductName("");
      setPrice("");
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product");
    } finally {
      setAdding(false);
    }
  };

  // DELETE PRODUCT
  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await deleteProduct(id);

      if (res.status === 200) {
        // Remove product from table
        setProducts(products.filter((p) => p.id !== id));
        console.log("Product deleted successfully");
      }
      else if (res.status === 400) {
        alert("Cannot delete product. It is used in sales.");
      }
      else {
        console.log("Something went wrong while deleting.");
      }
    } catch (error) {
      console.error("Delete failed:", error);

      // Handle API returning 400 inside error.response
      if (error.response && error.response.status === 400) {
        alert("Cannot delete product. It is used in sales.");
      } else {
        alert("Failed to delete product");
      }
    }
  };


  return (
    <div className="container py-4">
      {/* Add Product Form */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h4 className="mb-3 fw-bold">Add New Product</h4>

          <input
            className="form-control mb-3"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="Product Name"
          />

          <input
            className="form-control mb-3"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Price"
            type="number"
          />

          <button
            className="btn btn-primary w-100"
            onClick={handleAddProduct}
            disabled={adding}
          >
            {adding ? "Adding..." : "Add Product"}
          </button>
        </div>
      </div>

      {/* Product Table */}
      <div className="mt-6">
        <h4 className="fw-bold mb-3">Product List</h4>

        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search product..."
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="table-responsive">
          {loading ? (
            <div>Loading products...</div>
          ) : (
            <table className="table custom-sale-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Product</th>
                  <th>Price (₹)</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {products
                  .filter((product) =>
                    product.product_name
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
                  )
                  .map((product, index) => (
                    <tr key={product.id}>
                      <td>{index + 1}</td>
                      <td>{product.product_name}</td>
                      <td>₹{product.price}</td>

                      {/* DELETE BUTTON */}
                      <td>
                        <i
                          className="bi bi-trash text-danger"
                          style={{ cursor: "pointer", fontSize: "1.2rem" }}
                          onClick={() => handleDeleteProduct(product.id)}
                        ></i>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
