import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Popconfirm, Button, Space, Form, Input, } from "antd";
import {isEmpty} from "lodash"
import {SearchOutlined, StepForwardOutlined} from "@ant-design/icons";
import Highlighter from "react-highlight-words"

const DateTable = () => {
  const [gridDate, setGridDate] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editRowKey, setEditRowKey] = useState("");
  const [sortedInfo, setSortedInfo] = useState({});
  const [searchText, setSearchText] = useState("");
  const [searchColText, setSearchColText] = useState("");
  const [searchedCol, setSearchedCol] = useState("");
  let [filteredData] = useState();



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

  // const getColumnSearchProps = (dataIndex) => ({
  //   filterDropDown: ({
  //     setSelectedKeys,
  //     selectedKeys,
  //     confirm,
  //     clearFilters
  //   }) => (
  //     <div style={{padding: 0}}>
  //       <Highlighter/>
  //       <Input
  //       placeholder={`Search ${dataIndex}`}
  //       value={selectedKeys[0]}
  //       onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
  //       onPressEnter={() => handleSearchCol(selectedKeys, confirm, dataIndex)}
  //       style={{width: 188, marginBottom: 0, display: "block"}}
  //       />
  //       <Space>
  //         <Button onClick={() => handleSearchCol(selectedKeys, confirm, dataIndex)}
  //         icon={<SearchOutlined/>}
  //         size="small"
  //         style={{width: 90}}
  //         >
  //           Search
  //         </Button>
  //         <Button type="primary"
  //         onClick={() => handleRestCol(clearFilters)}
  //         size="small"
  //         style={{width: 90}}
  //         >
  //           Reset
  //         </Button>
  //       </Space>
  //     </div>
  //   ),
  //   filterIcon: (filtered) => (
  //     <SearchOutlined style={{color: filtered ? "#1890ff" : undefined}} />
  //   ),
  //   onFilter: (value, record) => record[dataIndex] ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()) : "",
  //   render: (text) => searchedCol === dataIndex ? (
  //     <Highlighter
  //       highlightStyle={{backgroundColor: "#ffc069", padding: 0}}
  //       searchWords={[searchColText]}
  //       autoEscape
  //       textToHighlight={text ? text.toString() : ""}
  //     />
  //   ) : (text)
  // })
  const getColumnSearchProps = (dataIndex) => ({
    filterDropDown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div>
        <Input
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearchCol(selectedKeys, confirm, dataIndex)}
          style={{width: 188, display: "block"}}
        />
        <Space>
          <Button
            type="primary"
            onClick={()=>handleSearchCol(selectedKeys, confirm, dataIndex)}
            icon={<StepForwardOutlined/>}
            size="small"
            style={{width: 99}}
          >
            Search
          </Button>
          <Button
            type="primary"
            onClick={()=>handleResetCol(clearFilters)}
            size="small"
            style={{width: 99}}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <StepForwardOutlined style={{ color: filtered ? "#1890ff" : undefined}} />
    ), 
    onFilter: (value, record) =>
      record[dataIndex] ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()) : "",
    render: (text) =>
      searchedCol === dataIndex ? (
        <Highlighter
          highlightStyle={{backgroundColor: "#ffc069", padding: 0}}
          searchWords={[searchColText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (text)
  })
    
  const handleSearchCol = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchColText(selectedKeys[0]);
    setSearchedCol(dataIndex)
  }

  const handleResetCol = (clearFilters) => {
    clearFilters();
    setSearchColText("")
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
      sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order,
      ...getColumnSearchProps("name"),
    },
    {
      title: "Email",
      dataIndex: "email",
      align: "center",
      editTable: true,
      responsive: ["md"],
      sorter: (a, b) => a.email.length - b.email.length,
      sortOrder: sortedInfo.columnKey === 'email' && sortedInfo.order,
      ...getColumnSearchProps("email"),
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
      sortOrder: sortedInfo.columnKey === 'message' && sortedInfo.order,
      ...getColumnSearchProps("message")

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
    setSearchText("")
    loadDate()
  }

  const handleInputSearch = ({target: {value}}) => {
    setSearchText(value)
    if(value === "") {
      loadDate()
    }
  }

  const globalSearch = () => {
    filteredData = modifiedDate.filter(({name, email, message}) => {
      return (
        name.toLowerCase().includes(searchText.toLowerCase()) || email.toLowerCase().includes(searchText.toLowerCase()) || message.toLowerCase().includes(searchText.toLowerCase())
      )
    })
    setGridDate(filteredData)
  }


  return (
    <div>
      <SearchOutlined />
      <StepForwardOutlined/>
      <Space style={{width: "100%", justifyContent: "center"}}>
        <Input type={"text"} placeholder="Enter text" onChange={handleInputSearch} allowClear value={searchText} />
        <Button  onClick={globalSearch} type="primary">Search</Button>
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
          dataSource={filteredData && filteredData.length ? filteredData : modifiedDate}
          bordered
          onChange={handleChange}
        />
     </Form>
    </div>
  );
};

export default DateTable;
