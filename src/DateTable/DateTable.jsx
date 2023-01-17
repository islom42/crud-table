import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Table, Popconfirm, Button, Space, Form, Input } from 'antd';
import { isEmpty } from 'lodash';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import {DndProvider, useDrag, useDrop} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";
import update from "immutability-helper";

const DateTable = () => {
  const [gridDate, setGridDate] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editRowKey, setEditRowKey] = useState('');
  const [sortedInfo, setSortedInfo] = useState({});
  const [searchText, setSearchText] = useState('');
  const [searchColText, setSearchColText] = useState('');
  const [searchedCol, setSearchedCol] = useState('');
  const [filteredInfo, setFilteredInfo] = useState({});

  let [filteredData] = useState();

  const [form] = Form.useForm();

  useEffect(() => {
    loadDate();
  }, []);

  const loadDate = async () => {
    setLoading(true);
    const response = await axios.get(
      'https://jsonplaceholder.typicode.com/comments'
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
    info: `My name is ${item.email.split("@")[0]} and I am ${item.age} years old`,
    key: item.id,
    message: isEmpty(body) ? item.message : body,
  }));

  const handleDelete = (value) => {
    const dataSource = [...modifiedDate];
    const filteredData = dataSource.filter((item) => item.id !== value.id);
    setGridDate(filteredData);
  };

  const isEditing = (record) => {
    return record.key === editRowKey;
  };
  const cancel = () => {
    setEditRowKey('');
  };
  const edit = (record) => {
    form.setFieldsValue({
      name: '',
      email: '',
      message: '',
      ...record,
    });
    setEditRowKey(record.key);
  };
  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...modifiedDate];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setGridDate(newData);
        setEditRowKey('');
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  const handleChange = (_, filter, sorter) => {
    const { order, field } = sorter;
    setFilteredInfo(filter)
    setSortedInfo({ columnKey: field, order });
  };

  const handleSearchCol = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchColText(selectedKeys[0]);
    setSearchedCol(dataIndex);
  };

  const handleResetCol = (clearFilters) => {
    clearFilters();
    setSearchColText('');
  };
  const filterDropDown = (
    { setSelectedKeys, selectedKeys, confirm, clearFilters },
    dataIndex
  ) => (
    <div style={{ padding: 5 }}>
      <Input
        placeholder={`Search ${dataIndex}`}
        value={selectedKeys[0]}
        onChange={(e) =>
          setSelectedKeys(e.target.value ? [e.target.value] : [])
        }
        onPressEnter={() => handleSearchCol(selectedKeys, confirm, dataIndex)}
        style={{ width: 188, marginBottom: 5, display: 'block' }}
      />
      <Space>
        <Button
          type='primary'
          onClick={() => handleSearchCol(selectedKeys, confirm, dataIndex)}
          icon={<SearchOutlined />}
          size='small'
          style={{ width: 90 }}
        >
          Search
        </Button>
        <Button
          onClick={() => handleResetCol(clearFilters)}
          size='small'
          style={{ width: 90 }}
        >
          Reset
        </Button>
      </Space>
    </div>
  );

  const getColumnSearchProps = (dataIndex) => ({
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : '',
    render: (text) =>
      searchedCol === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchColText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const columns = [
    {
      title: 'Id',
      dataIndex: 'id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      align: 'center',
      editTable: true,
      sorter: (a, b) => a.name.length - b.name.length,
      onFilter: (value, record) => record.name.includes(value),
      sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order,
      filterDropdown: (e) => filterDropDown(e, 'name'),
      ...getColumnSearchProps('name'),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      align: 'center',
      editTable: true,
      responsive: ['lg'],
      sorter: (a, b) => a.email.length - b.email.length,
      sortOrder: sortedInfo.columnKey === 'email' && sortedInfo.order,
      filterDropdown: (e) => filterDropDown(e, 'email'),
      ...getColumnSearchProps('email'),
    },
    {
      title: 'Age',
      dataIndex: 'age',
      align: 'center',
      editTable: false,
      responsive: ['lg'],
      sorter: (a, b) => a.age.length - b.age.length,
      sortOrder: sortedInfo.columnKey === 'age' && sortedInfo.order,
      filters: [
        {text: "20", value: "20"},
        {text: "21", value: "21"},
        {text: "22", value: "22"},
        {text: "23", value: "23"},
        {text: "24", value: "24"},
        {text: "25", value: "25"},
      ],
      filteredValue: filteredInfo.age || null,
      onFilter: (value, record) => String(record.age).includes(value)
    },
    {
      title: 'Message',
      dataIndex: 'message',
      align: 'center',
      editTable: true,
      responsive: ['lg'],
      sorter: (a, b) => a.message.length - b.message.length,
      sortOrder: sortedInfo.columnKey === 'message' && sortedInfo.order,
      filterDropdown: (e) => filterDropDown(e, 'message'),
      ...getColumnSearchProps('message'),
    },
    {
      title: 'Action',
      dataIndex: 'action',
      align: 'center',
      render: (_, record) => {
        const editable = isEditing(record);
        return modifiedDate.length >= 1 ? (
          <Space>
            <Popconfirm
              title='Are you sure want to delete ?'
              onConfirm={() => handleDelete(record)}
            >
              <Button danger type='primary' disabled={editable}>
                Delete
              </Button>
            </Popconfirm>
            {editable ? (
              <span>
                <Space size={'middle'}>
                  <Button onClick={() => save(record.key)} type='primary'>
                    Save
                  </Button>
                  <Popconfirm
                    title='Are you sure want to cancel ?'
                    onConfirm={cancel}
                  >
                    <Button>Cancel</Button>
                  </Popconfirm>
                </Space>
              </span>
            ) : (
              <Button type='primary' onClick={() => edit(record)}>
                Edit
              </Button>
            )}
          </Space>
        ) : null;
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editTable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const EditableCell = ({
    editing,
    dataIndex,
    title,
    record,
    children,
    ...restProps
  }) => {
    const input = <Input />;
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            style={{ marginBottom: 5 }}
            rules={[
              {
                required: true,
                message: `Please input some value in ${title} field`,
              },
            ]}
          >
            {input}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  const reset = () => {
    setSortedInfo({});
    setFilteredInfo({})
    setSearchText('');
    loadDate();
  };

  const handleInputSearch = ({ target: { value } }) => {
    setSearchText(value);
    if (value === '') {
      loadDate();
    }
  };

  const globalSearch = () => {
    filteredData = modifiedDate.filter(({ name, email, message }) => {
      return (
        name.toLowerCase().includes(searchText.toLowerCase()) ||
        email.toLowerCase().includes(searchText.toLowerCase()) ||
        message.toLowerCase().includes(searchText.toLowerCase())
      );
    });
    setGridDate(filteredData);
  };

  return (
    <div>
      <Space style={{ width: '100%', justifyContent: 'center' }}>
        <Input
          type={'text'}
          placeholder='Enter text'
          onChange={handleInputSearch}
          allowClear
          value={searchText}
        />
        <Button onClick={globalSearch} type='primary'>
          Search
        </Button>
        <Button style={{ margin: '5px 0' }} onClick={reset}>
          Reset
        </Button>
      </Space>
      <Form form={form} component={false}>
        <Table
          columns={mergedColumns}
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          loading={loading}
          dataSource={
            filteredData && filteredData.length ? filteredData : modifiedDate
          }
          expandable={{
            expandedRowRender: (record) => (
              <p style={{margin: 0}}>
                {record.info}
              </p>
            )
          }}
          bordered
          onChange={handleChange}
        />
      </Form>
    </div>
  );
};

export default DateTable;