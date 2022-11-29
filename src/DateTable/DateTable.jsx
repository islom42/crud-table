import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Popconfirm, Button } from "antd";

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

  const handleDelete = (value) => {
    const dataSource = [...modifiedDate];
    const filteredData = dataSource.filter((item) => item.id !== value);
    gridDate(filteredData);
  };
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
      responsive: ["md"]
    },
    {
      title: "Age",
      dataIndex: "age",
      align: "center",
      editTable: false,
      responsive: ["md"]

    },
    {
      title: "Message",
      dataIndex: "message",
      align: "center",
      editTable: true,
      responsive: ["md"]

    },
    {
      title: "Action",
      dataIndex: "action",
      align: "center",
      render: (_, record) =>
        modifiedDate.length >= 1 ? (
          <Popconfirm
            title="Are you sure want to delete ?"
            onConfirm={() => handleDelete(record)}
          >
            <Button danger type="primary">
              Delete
            </Button>
          </Popconfirm>
        ) : null,
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
