import React, { useState, useEffect } from "react";
import { getSales } from "../api";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function DailySale() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [salesList, setSalesList] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchSalesList = async (date) => {
        setLoading(true);
        try {
            const istDate = new Date(date.getTime() + 5.5 * 60 * 60 * 1000);
            const formattedDate = istDate.toISOString().slice(0, 10);
            const res = await getSales(formattedDate);
            setSalesList(res.data);
        } catch (error) {
            console.error("Error fetching daily sales:", error);
            setSalesList([]);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchSalesList(selectedDate);
    }, [selectedDate]);

    const changeDate = (days) => {
        const newDate = new Date(selectedDate);
        newDate.setDate(selectedDate.getDate() + days);
        setSelectedDate(newDate);
    };

    const handleDateInputChange = (e) => {
        if (e.target.value) {
            setSelectedDate(new Date(e.target.value + "T00:00:00"));
        }
    };

    const formatDateForInput = (date) => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, "0");
        const d = String(date.getDate()).padStart(2, "0");
        return `${y}-${m}-${d}`;
    };

    const formatDateDisplay = (date) => {
        const options = { day: "2-digit", month: "short", year: "numeric" };
        return date.toLocaleDateString("en-GB", options);
    };

    const totalSales = salesList.reduce((sum, sale) => sum + Number(sale.total_price), 0);

    const topSalesData = [...salesList]
        .sort((a, b) => b.total_price - a.total_price)
        .slice(0, 5)
        .map((sale) => ({
            name: sale.name,
            value: sale.total_price,
        }));

    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A569BD"];

    return (
        <div className="container py-4">

            {/* DATE PICKER */}
            <div className="d-flex justify-content-center align-items-center mb-4 gap-2">
                <button
                    className="btn btn-outline-primary"
                    onClick={() => changeDate(-1)}
                    style={{ minWidth: "45px" }}
                >
                    <i className="bi bi-caret-left"></i>
                </button>

                <input
                    type="date"
                    className="form-control text-center"
                    value={formatDateForInput(selectedDate)}
                    onChange={handleDateInputChange}
                    style={{ minWidth: "200px", cursor: "pointer" }}
                />

                <button
                    className="btn btn-outline-primary"
                    onClick={() => changeDate(1)}
                    style={{ minWidth: "45px" }}
                >
                    <i className="bi bi-caret-right"></i>
                </button>
            </div>

            {/* Visible Date Text */}
            <div className="text-center mb-3">
                <h5 className="text-primary">{formatDateDisplay(selectedDate)}</h5>
            </div>

            {/* PIE CHART */}
            {topSalesData.length > 0 && (
                <div className="card shadow-sm mb-4">
                    <div className="card-body">
                        <h5 className="card-title text-center mb-3">Top 5 Products</h5>
                        <div style={{ height: 350 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={topSalesData}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={100}
                                        label
                                    >
                                        {topSalesData.map((entry, index) => (
                                            <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => `₹${value}`} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            )}

            {/* TABLE */}
            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary"></div>
                    <p className="mt-2">Loading sales...</p>
                </div>
            ) : (
                <div className="table-responsive mt-4">
                    <table className="table table-striped">
                        <thead className="table-dark">
                            <tr>
                                <th>#</th>
                                <th>Product</th>
                                <th>Price</th>
                                <th>Qty</th>
                                <th>Total</th>
                            </tr>
                        </thead>

                        <tbody>
                            {salesList.length > 0 ? (
                                salesList
                                    .sort((a, b) => b.total_price - a.total_price)
                                    .map((sale, index) => (
                                        <tr key={sale.id}>
                                            <td>{index + 1}</td>
                                            <td>{sale.name}</td>
                                            <td>₹{sale.price}</td>
                                            <td>{sale.quantity}</td>
                                            <td>₹{sale.total_price}</td>
                                        </tr>
                                    ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="text-center">
                                        No sales on selected date.
                                    </td>
                                </tr>
                            )}
                        </tbody>

                        {salesList.length > 0 && (
                            <tfoot>
                                <tr className="table-active">
                                    <td colSpan={4} className="text-end fw-bold">Total Sales:</td>
                                    <td className="fw-bold">₹{totalSales.toLocaleString("en-IN")}</td>
                                </tr>
                            </tfoot>
                        )}
                    </table>
                </div>
            )}
        </div>
    );
}
