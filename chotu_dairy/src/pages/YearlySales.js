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

import { getYearlySales, getYearlySalesGraph } from "../api";


export default function YearlySales() {
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [salesList, setSalesList] = useState([]);
    const [yearlyGraph, setYearlyGraph] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchYearlySales = async(year) => {
        setLoading(true);
        try {
            const res = await getYearlySales(year);
            const graphRes = await getYearlySalesGraph(year);
            setSalesList(res.data);
            setYearlyGraph(graphRes.data);
        } catch (error) {
            console.error("Error fetching yearly sales:", error);
            setSalesList([]);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchYearlySales(currentYear);
    }, [currentYear]);

    const totalYearlySales = salesList.reduce((sum, month) => sum + month.total_price, 0);

    // Slider to change year
    const changeYear = (dir) => {
        setCurrentYear(currentYear + dir);
    };

    return (
        <div className="container py-4">
            <h3 className="fw-bold mb-4 text-center">
                {currentYear} Sales: ₹{totalYearlySales.toLocaleString("en-IN")}
            </h3>

            {/* Year Slider */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <button
                    className="btn btn-outline-primary"
                    onClick={() => changeYear(-1)}
                >
                    <i class="bi bi-caret-left"></i>
                </button>
                <span className="fw-bold">{currentYear}</span>
                <button
                    className="btn btn-outline-primary"
                    onClick={() => changeYear(1)}
                >
                    <i class="bi bi-caret-right"></i>
                </button>
            </div>

            {/* Line Chart */}
            {loading ? (
                <div className="text-center py-5">Loading yearly sales...</div>
            ) : (
                <div className="mb-5">
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart
                            data={yearlyGraph.length > 0 ? yearlyGraph : []}
                            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Line
                                type="monotone"
                                dataKey="total"
                                stroke="#36b9cc"
                                strokeWidth={3}
                                dot={{r:3}} 
                            />
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
                            salesList
                            .sort((a, b) => b.total_price - a.total_price)
                            .map((sale, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{sale.name}</td>
                                    <td>{sale.price}</td>
                                    <td>{sale.quantity}</td>
                                    <td>{sale.total_price.toLocaleString("en-IN")}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="text-center">
                                    No sales data for this year.
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
                                    ₹{totalYearlySales.toLocaleString("en-IN")}
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
