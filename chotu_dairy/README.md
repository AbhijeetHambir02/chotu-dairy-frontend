
## 📊 Sales Dashboard – React, Bootstrap, Recharts

This project is a fully interactive **Sales Analytics Dashboard** built using **React**, **Bootstrap 5**, and **Recharts**. It provides a user-friendly interface to visualize sales data across different time periods such as **daily, weekly, and yearly**. The dashboard focuses on clean design, smooth interactions, and intuitive data exploration.

### 🔹 Daily Sales View

The daily sales page allows users to select any date using a slider. Once a date is selected, the page displays the total sales for that day along with a table of individual sale entries. A pie chart highlights the **top 5 selling items**, offering a quick overview of product performance. If no data is available for the chosen date, the page gracefully hides the total section and informs the user.

### 🔹 Weekly Sales View

The weekly sales page automatically determines the current week using **Indian Standard Time (IST)** and displays sales trends from **Monday to Sunday**. A bar chart visualizes each day’s sales, helping users compare day-to-day performance. Static JSON data is used to simulate weekly trends, making this mode ideal for demonstration or testing.

### 🔹 Yearly Sales View

The yearly sales page includes a year slider allowing users to switch between different years. It displays a smooth line chart presenting sales for all 12 months without data point markers, giving a clean professional look. Mock JSON data powers the chart, illustrating how yearly sales fluctuate over time.

### 🎨 Design & Technology

The dashboard uses Bootstrap for layout and styling, ensuring a clean, responsive design. Recharts powers all graphs, while React manages the component structure and UI logic. The project includes helper utilities for date calculations, especially for generating IST-based week ranges and monthly boundaries.

