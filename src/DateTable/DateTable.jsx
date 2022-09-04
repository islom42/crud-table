import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table } from "antd";

const DateTable = () => {
  const [gridDate, setGridDate] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDate();
  }, []);

  const loadDate = async () => {
    setLoading(true);
    const response = await axios.get(
      "https://jsonplaceholder.typicode.com/comments"
    );
    setGridDate(response.data);
    console.log(response);
    setLoading(false);
  };

  return (
    <div>
      <h2>Crud Table using Ant Design</h2>
    </div>
  );
};

export default DateTable;
