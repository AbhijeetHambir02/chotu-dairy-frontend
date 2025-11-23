import React, { useState, useEffect } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts";
import { getSaleByDateRange, getWeeklySalesGraph } from "../api";

export default function WeeklySales() {
    const [salesList, setSalesList] = useState([]);
    const [weeklyGraph, setWeeklyGraph] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentWeekStart, setCurrentWeekStart] = useState(new Date());

    // Convert IST date to YYYY-MM-DD
    const formatISTDate = (date) => {
        const istOffset = 5.5 * 60; // minutes
        const istTime = new Date(date.getTime() + istOffset * 60 * 1000);
        const year = istTime.getFullYear();
        const month = String(istTime.getMonth() + 1).padStart(2, "0");
        const day = String(istTime.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    // Get Sunday and Saturday for a given date (IST)
    const getWeekRange = (date) => {
        const day = date.getDay(); // 0 → 6
        const sunday = new Date(date);
        sunday.setDate(date.getDate() - day);
        const saturday = new Date(sunday);
        saturday.setDate(sunday.getDate() + 6);
        return { start: formatISTDate(sunday), end: formatISTDate(saturday) };
    };

    const fetchWeeklySales = async (date) => {
        setLoading(true);
        try {
            const { start, end } = getWeekRange(date);
            const res = await getSaleByDateRange(start, end);
            const graphRes = await getWeeklySalesGraph(start, end);
            setSalesList(res.data);
            setWeeklyGraph(graphRes.data);
        } catch (error) {
            console.error("Error fetching weekly sales:", error);
            setSalesList([]);
            setWeeklyGraph([]);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchWeeklySales(currentWeekStart);
    }, [currentWeekStart]);

    const totalWeeklySales = salesList.reduce((sum, day) => sum + day.total_price, 0);

    // Navigate week: +1 → next week, -1 → previous week
    const changeWeek = (weeks) => {
        const newWeek = new Date(currentWeekStart);
        newWeek.setDate(newWeek.getDate() + weeks * 7);
        setCurrentWeekStart(newWeek);
    };

    const { start, end } = getWeekRange(currentWeekStart);

    return (
        <div className="container py-4">
            <h3 className="fw-bold mb-4 text-center">
                This Week's Sale: ₹{totalWeeklySales.toLocaleString("en-IN")}
            </h3>

            {/* Week Slider */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <button className="btn btn-outline-primary" onClick={() => changeWeek(-1)}>
                <i class="bi bi-caret-left"></i>
                </button>
                <span className="fw-bold">{start} - {end}</span>
                <button className="btn btn-outline-primary" onClick={() => changeWeek(1)}>
                <i class="bi bi-caret-right"></i>
                </button>
            </div>

            {loading ? (
                <div className="text-center py-5">Loading weekly sales...</div>
            ) : (
                <div className="mb-5">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart
                            data={weeklyGraph.length > 0 ? weeklyGraph : [
                                { day: "Sun", total: 0 },
                                { day: "Mon", total: 0 },
                                { day: "Tue", total: 0 },
                                { day: "Wed", total: 0 },
                                { day: "Thu", total: 0 },
                                { day: "Fri", total: 0 },
                                { day: "Sat", total: 0 },
                            ]}
                            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="day" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="total" fill="#4e73df" label={{ position: 'top' }} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}

            {/* Table */}
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
                            salesList
                            .sort((a, b) => b.total_price - a.total_price)
                            .map((day, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{day.name}</td>
                                    <td>{day.price}</td>
                                    <td>{day.quantity}</td>
                                    <td>{day.total_price}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="text-center">No weekly sales data.</td>
                            </tr>
                        )}
                    </tbody>
                    {salesList.length > 0 && (
                        <tfoot>
                            <tr className="table-active">
                                <td colSpan={4} className="text-end fw-bold">Total Sales:</td>
                                <td className="fw-bold">₹{totalWeeklySales.toLocaleString("en-IN")}</td>
                            </tr>
                        </tfoot>
                    )}
                </table>
            </div>
            )};
        </div>
    );
}
