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
    setLoading(false);
  };
  const dataWithAge = gridDate.map((item) => ({
    ...item,
    age: Math.floor(Math.random() * 6) + 20,
  }));
  const modifiedDate = dataWithAge.map(({ body, ...item }) => ({
    ...item,
    key: item.id,
    message: body,
  }));

  const columns = [
    {
      title: "Id",
      dataIndex: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
      align: "center",
      editTable: true,
    },
    {
      title: "Email",
      dataIndex: "email",
      align: "center",
      editTable: true,
    },
    {
      title: "Age",
      dataIndex: "age",
      align: "center",
      editTable: false,
    },
    {
      title: "Message",
      dataIndex: "message",
      align: "center",
      editTable: true,
    },
    {
      title: "Action",
      dataIndex: "action",
      align: "center",
    },
  ];

  return (
    <div>
      <Table
        columns={columns}
        loading={loading}
        dataSource={modifiedDate}
        bordered
      />
    </div>
  );
};

export default DateTable;
