export const stats = [
  { label: "Users", value: 455 },
  { label: "Subscriptions", value: 128 },
  { label: "Experts", value: 34 },
  { label: "Courses", value: 76 },
  { label: "Lessons", value: 540 },
];

// Chart data and configurations
export const barData = {
  labels: ["January", "February", "March", "April", "May"],
  datasets: [
    {
      label: "Subscriptions",
      data: [12, 19, 10, 15, 22],
      backgroundColor: "rgba(75, 192, 192, 0.5)",
      borderColor: "rgba(75, 192, 192, 1)",
      borderWidth: 1,
    },
  ],
};

export const lineData = {
  labels: [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ],
  datasets: [
    {
      label: "Users",
      data: [30, 40, 35, 50, 45, 60, 55],
      backgroundColor: "rgba(255, 99, 132, 0.2)",
      borderColor: "rgba(255, 99, 132, 1)",
      borderWidth: 2,
    },
  ],
};

export const pieData = {
  labels: ["Free", "Basic", "Premium"],
  datasets: [
    {
      data: [300, 150, 50],
      backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
    },
  ],
};

export const doughnutData = {
  labels: ["Video Lessons", "Text Lessons", "Quizzes"],
  datasets: [
    {
      data: [400, 300, 100],
      backgroundColor: ["#4BC0C0", "#FF9F40", "#FF6384"],
    },
  ],
};
