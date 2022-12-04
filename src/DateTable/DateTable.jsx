import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Popconfirm, Button, Space, Form, Input} from "antd";
import {isEmpty} from "lodash"

const DateTable = () => {
  const [gridDate, setGridDate] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editRowKey, setEditRowKey] = useState("");
  const [sortedInfo, setSortedInfo] = useState({});

  const [form] = Form.useForm()

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
    message: isEmpty(body) ? item.message : body,
  }));

  const handleDelete = (value) => {
    const dataSource = [...modifiedDate];
    const filteredData = dataSource.filter((item) => item.id !== value.id);
    setGridDate(filteredData);
    console.log("done", gridDate)
  };

  const isEditing = (record) => {
    return record.key === editRowKey
  }
  const cancel = () => {
     setEditRowKey("")
  }
  const edit = (record) => {
    form.setFieldsValue({
      name: "",
      email: "",
      message: "",
      ...record,
    })
    setEditRowKey(record.key)
  }
  const save = async (key) => {
    try {
      const row = await form.validateFields()
      const newData = [...modifiedDate];
      const index = newData.findIndex((item) => key === item.key);
      if(index > -1) {
        const item = newData[index]
        newData.splice(index, 1, {...item, ...row});
        setGridDate(newData);
        setEditRowKey("")
      }
    } catch (error) {
      console.log("error", error);
    }
  }

  const handleChange = (...sorter) => {
    const {order, field} = sorter[2];
    setSortedInfo({columnKey: field, order})
  }
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
      sorter: (a, b) => a.name.length - b.name.length,
      sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order
    },
    {
      title: "Email",
      dataIndex: "email",
      align: "center",
      editTable: true,
      responsive: ["md"],
      sorter: (a, b) => a.email.length - b.email.length,
      sortOrder: sortedInfo.columnKey === 'email' && sortedInfo.order
    },
    {
      title: "Age",
      dataIndex: "age",
      align: "center",
      editTable: false,
      responsive: ["md"],
      sorter: (a, b) => a.age.length - b.age.length,
      sortOrder: sortedInfo.columnKey === 'age' && sortedInfo.order
    },
    {
      title: "Message",
      dataIndex: "message",
      align: "center",
      editTable: true,
      responsive: ["md"],
      sorter: (a, b) => a.message.length - b.message.length,
      sortOrder: sortedInfo.columnKey === 'message' && sortedInfo.order
    },
    {
      title: "Action",
      dataIndex: "action",
      align: "center",
      render: (_, record) => {
        const editable = isEditing(record)
        return modifiedDate.length >= 1 ? (
            <Space>
              <Popconfirm
              title="Are you sure want to delete ?"
              onConfirm={() => handleDelete(record)}
            >
              <Button danger type="primary" disabled={editable}>
                Delete
              </Button>
            </Popconfirm>
            {editable ? (
              <span>
                <Space size={"middle"}>
                  <Button onClick={() => save(record.key)} type="primary">Save</Button>
                  <Popconfirm title="Are you sure want to cancel ?" onConfirm={cancel}>
                    <Button>Cancel</Button>
                  </Popconfirm>
                </Space>
              </span>
            ) : (
              <Button type="primary" onClick={() => edit(record)}>
                Edit
              </Button>
            )}
            </Space>
          ) : null;
        }
      },
  ];

  const mergedColumns = columns.map((col) => {
    if(!col.editTable) {
      return col
    }
    return {
      ...col,
      onCell: (record) => (
        {
          record,
          dataIndex: col.dataIndex,
          title: col.title,
          editing : isEditing(record),
          
        }
      )
    }
  })

  const EditableCell = ({editing, dataIndex, title, record, children, ...restProps}) => {
    const input = <Input/>
    return (
      <td  {...restProps}>
        {editing ? (
          <Form.Item name={dataIndex} style={{marginBottom: 5}} rules={[{
            required: true,
            message: `Please input some value in ${title} field`
          }]}>
            {input}
          </Form.Item>
        ): (
          children
        )}
      </td>
    )
  }

  const reset = () => {
    setSortedInfo({})
    loadDate()
  }

  return (
    <div>
      <Space>
        <Button style={{margin: "5px 0"}} onClick={reset}>Reset</Button>
      </Space>
     <Form form={form} component={false}>
      <Table
          columns={mergedColumns}
          components={{
            body: {
              cell: EditableCell
            }
          }}
          loading={loading}
          dataSource={modifiedDate}
          bordered
          onChange={handleChange}
        />
     </Form>
    </div>
  );
};

export default DateTable;
