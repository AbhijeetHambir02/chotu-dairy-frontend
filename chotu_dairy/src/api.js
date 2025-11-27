import axios from "axios";

// const API_BASE = "http://127.0.0.1:8000/chotu-dairy";
const API_BASE = "https://chotu-dairy-backend.onrender.com/chotu-dairy";

// ------------------- Page Loader API -------------------
export const pageLoader = () => {
  return axios.get(`https://chotu-dairy-backend.onrender.com`);
};

// ------------------- Products API -------------------
export const getProducts = () => {
  return axios.get(`${API_BASE}/products`);
};

export const addProduct = (data) => {
  return axios.post(`${API_BASE}/products`, data);
};


// ------------------- Sales API -------------------
export const getSales = (date) => {
  return axios.get(`${API_BASE}/sales`, {
    params: { 'date': date }
  });
};

export const addSale = (data) => {
  return axios.post(`${API_BASE}/sales`, data);
};


// ------------------- Sales for Weekly & Monthly report -------------------
export const getSaleByDateRange = (sdate, edate) => {
  return axios.get(`${API_BASE}/sales/by-date-range`, {
    params: { 'start_date': sdate, 'end_date': edate }
  });
};


// ------------------- Weekly Graph API -------------------
export const getWeeklySalesGraph = (sdate, edate) => {
  return axios.get(`${API_BASE}/sales/graph/weekly`, {
    params: { 'start_date': sdate, 'end_date': edate }
  });
}

// ------------------- Monthly Graph API -------------------
export const getMonthlySalesGraph = (year, month) => {
  return axios.get(`${API_BASE}/sales/graph/monthly`, {
    params: { 'year': year, 'month': month }
  });
}

// ------------------- Yearly Sales API -------------------
export const getYearlySales = (year) => {
  return axios.get(`${API_BASE}/sales/by-year`, {
    params: { 'year': year}
  });
}

// ------------------- Yearly Graph API -------------------
export const getYearlySalesGraph = (year) => {
  return axios.get(`${API_BASE}/sales/graph/yearly`, {
    params: { 'year': year}
  });
}

// ------------------- API Total sales (today, current week, month, year) -------------------
export const getSalesSummary = () => {
  return axios.get(`${API_BASE}/sales/summary`);
}

// ------------------- Top 5 selling products -------------------
export const getTopProducts = () => {
  return axios.get(`${API_BASE}/sales/top-products`);
}

// ------------------- Delete Peoduct API -------------------
export const deleteProduct = (id) => {
  return axios.delete(`${API_BASE}/products/${id}`);
}
