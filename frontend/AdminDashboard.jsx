import axios from "axios";
import { useEffect, useState } from "react";

const AdminDashboard = () => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/api/admin/dashboard", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
    .then(res => {
      setMessage(res.data.message);
    })
    .catch(err => {
      alert("Access denied or login again");
    });
  }, []);

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <p>{message}</p>
    </div>
  );
};

export default AdminDashboard;
