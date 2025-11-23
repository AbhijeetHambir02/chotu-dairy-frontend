import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
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

    const totalSales = salesList.reduce((sum, sale) => sum + Number(sale.total_price), 0);

    const formattedSelectedDate = selectedDate.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });

    // Prepare top 5 sales for Pie Chart
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

            {/* Date Slider / Picker */}
            <h4 className="d-flex justify-content-between align-items-center mb-4">
                <button className="btn btn-outline-primary" onClick={() => changeDate(-1)}>
                    <i class="bi bi-caret-left"></i>
                </button>
                <DatePicker
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    dateFormat="dd MMM yyyy"
                    className="form-control text-center"
                />
                <button className="btn btn-outline-primary" onClick={() => changeDate(1)}>
                    <i class="bi bi-caret-right"></i>
                </button>
            </h4>

            {/* Pie Chart */}
            {topSalesData.length > 0 && (
                <div className="card shadow-sm mb-4">
                    <div className="card-body">
                        <div className="" style={{ height: 350 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={topSalesData}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={100}
                                        fill="#8884d8"
                                        label
                                    >
                                        {topSalesData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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

            {/* Table */}
            {loading ? (
                <div className="text-center py-5">Loading sales...</div>
            ) : (
                <div className="table-responsive mt-10">
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
                                            <td>{sale.price}</td>
                                            <td>{sale.quantity}</td>
                                            <td>{sale.total_price}</td>
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
                                    <td className="fw-bold">₹{totalSales.toLocaleString('en-IN')}</td>
                                </tr>
                            </tfoot>
                        )}
                    </table>
                </div>
            )}
        </div>
    );
}
