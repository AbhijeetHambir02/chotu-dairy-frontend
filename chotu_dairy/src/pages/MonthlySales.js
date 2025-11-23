import React, { useState, useEffect } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts";

import { getSaleByDateRange, getMonthlySalesGraph } from "../api";

export default function MonthlySales() {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [salesList, setSalesList] = useState([]);
    const [monthlyGraph, setMonthlyGraph] = useState([]);
    const [loading, setLoading] = useState(false);



    // Get start and end date of a month in IST
    const getMonthRange = (date) => {
        // Convert selected date to IST (+5:30)
        const istOffset = 5.5 * 60; // minutes
        const istTime = new Date(date.getTime() + istOffset * 60 * 1000);

        const year = istTime.getFullYear();
        const month = istTime.getMonth();

        // Start date: 1st of month
        const startDate = new Date(year, month, 1);

        // End date: last day of month
        const endDate = new Date(year, month + 1, 0);

        // Format YYYY-MM-DD
        const formatDate = (d) => {
            const yyyy = d.getFullYear();
            const mm = String(d.getMonth() + 1).padStart(2, "0");
            const dd = String(d.getDate()).padStart(2, "0");
            return `${yyyy}-${mm}-${dd}`;
        };

        return { start: formatDate(startDate), end: formatDate(endDate) };
    };

    const fetchMonthlySales = async (date) => {
        setLoading(true);
        try {
            const { start, end } = getMonthRange(date);
            const res = await getSaleByDateRange(start, end);
            const graphRes = await getMonthlySalesGraph(start.slice(0, 4), start.slice(5, 7));
            setSalesList(res.data);
            setMonthlyGraph(graphRes.data);
        } catch (error) {
            console.error("Error fetching weekly sales:", error);
            setSalesList([]);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchMonthlySales(currentMonth);
    }, [currentMonth]);

    const totalMonthlySales = salesList.reduce(
        (sum, sale) => sum + (sale.total_price || 0),
        0
    );

    // Change month slider
    const changeMonth = (dir) => {
        const newMonth = new Date(currentMonth);
        newMonth.setMonth(currentMonth.getMonth() + dir);
        setCurrentMonth(newMonth);
    };

    return (
        <div className="container py-4">
            <h3 className="fw-bold mb-4 text-center">
                {currentMonth.toLocaleString("default", { month: "long", year: "numeric" })}{" "}
                Sales: ₹{totalMonthlySales.toLocaleString("en-IN")}
            </h3>

            {/* Month Slider */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <button className="btn btn-outline-primary" onClick={() => changeMonth(-1)}>
                    <i class="bi bi-caret-left"></i>
                </button>
                <span className="fw-bold">
                    {currentMonth.toLocaleString("default", { month: "long", year: "numeric" })}
                </span>
                <button className="btn btn-outline-primary" onClick={() => changeMonth(1)}>
                    <i class="bi bi-caret-right"></i>
                </button>
            </div>

            {/* Line Chart */}
            {loading ? (
                <div className="text-center py-5">Loading monthly sales...</div>
            ) : (
            <div className="mb-5">
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={monthlyGraph} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="total" stroke="#36b9cc" strokeWidth={3} dot={{ r: 1 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            )}

            {/* Sales Table */}
            {loading ? (
                <div className="text-center py-5"></div>
            ) : (
            <div className="table-responsive">
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
                            salesList.map((sale, index) => (
                                <tr key={index}>
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
                                    No sales data for this month.
                                </td>
                            </tr>
                        )}
                    </tbody>
                    {salesList.length > 0 && (
                        <tfoot>
                            <tr className="table-active">
                                <td colSpan={4} className="text-end fw-bold">
                                    Total Sales:
                                </td>
                                <td className="fw-bold">
                                    ₹{totalMonthlySales.toLocaleString("en-IN")}
                                </td>
                            </tr>
                        </tfoot>
                    )}
                </table>
            </div>
            )}
        </div>
    );
}
