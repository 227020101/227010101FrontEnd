import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Table, Button, Modal, Form, Input, Select, message, Spin } from 'antd';
import { api } from '../common/http-common';
import axios from 'axios';
import authHeader from '../services/auth-header';

const { Option } = Select;

const userRoleList = ['User', 'Moderator', 'Admin'];

const Users = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [filteredRole, setFilteredRole] = useState('');

  useEffect(() => {
    axios.get(`${api.uri}/Users`, { headers: authHeader() }).then((res) => {
      console.log(res.data);
      setUsers(res.data);
      setLoading(false);
    }).catch((err) => {
      console.log(err);
    });
  }, []);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => a.id - b.id,
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
      sorter: (a, b) => a.username.localeCompare(b.username),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'FirstName',
      dataIndex: 'firstname',
      key: 'firstname',
      sorter: (a, b) => a.firstname.localeCompare(b.firstname),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Last Name',
      dataIndex: 'lastname',
      key: 'lastname',
      sorter: (a, b) => a.lastname.localeCompare(b.lastname),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: (a, b) => a.email.localeCompare(b.email),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'User Role',
      dataIndex: 'userrole',
      key: 'userrole',
      filters: userRoleList.map(role => ({ text: role, value: role })),
      onFilter: (value, record) => record.userrole === value,
      filteredValue: filteredRole ? [filteredRole] : null,
    },
    {
      title: 'Edit',
      key: 'edit',
      render: (text, record) => (
        <span>
          <Button type="primary" onClick={() => handleEdit(record)}>Edit</Button>
        </span>
      ),
    },
    {
      title: 'Delete',
      key: 'delete',
      render: (text, record) => (
        <span>
          <Button type="danger" onClick={() => handleDelete(record)}>Delete</Button>
        </span>
      ),
    },
  ];

  const handleEdit = (user) => {
    setEditingUser(user);
    form.setFieldsValue(user);
  };

  const handleDelete = (user) => {
    setDeletingUser(user);
  };

  // Add these two state variables
  const [editLoading, setEditLoading] = useState(false);

  const handleUpdate = () => {
    form.validateFields().then(values => {
      const updatedUser = { ...editingUser, ...values };
      setEditLoading(true); // Set loading state to true
      axios.put(`${api.uri}/Users/${updatedUser.id}`, updatedUser, { headers: authHeader() }).then((res) => {
        setUsers(users.map(user => user.id === updatedUser.id ? updatedUser : user));
        form.resetFields();
        setEditingUser(null);
        message.success('User updated successfully!');
      }).catch((err) => {
        console.log(err);
      }).finally(() => {
        setEditLoading(false); // Set loading state back to false
      });
    });
  };

  const handleDeleteConfirm = () => {
    setEditLoading(true); // Set loading state to true
    axios.delete(`${api.uri}/Users/${deletingUser.id}`, { headers: authHeader() }).then((res) => {
      setUsers(users.filter(user => user.id !== deletingUser.id));
      setDeletingUser(null);
      message.success('User deleted successfully!');
    }).catch((err) => {
      console.log(err);
    }).finally(() => {
      setEditLoading(false); // Set loading state back to false
    });
  };


  const handleCancelUpdate = () => {
    setEditingUser(null);
    form.resetFields();
  };

  const handleCancelDelete = () => {
    setDeletingUser(null);
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const handleFilter = (value) => {
    setFilteredRole(value);
  };

  const filteredUsers = users ? users.filter(user => (user.username.toLowerCase().includes(searchText.toLowerCase()) || user.email.toLowerCase().includes(searchText.toLowerCase())) && (filteredRole ? user.userrole === filteredRole : true)) : [];

  return (
    <div className="container">
      <div style={{ marginBottom: '16px' }}>
        <h1> User List </h1>
        <Input.Search placeholder="Search by username or email" allowClear onChange={handleSearch} style={{ width: '300px', marginRight: '16px' }} />
        <Select placeholder="Filter by user role" allowClear onChange={handleFilter} style={{ width: '200px' }}>
          {userRoleList.map((role) => (
            <Option value={role} key={role}>{role}</Option>
          ))}
        </Select>
      </div>
      <Table
        dataSource={filteredUsers}
        columns={columns}
        loading={loading}
        rowKey={record => record.id}
      />
      <Spin spinning={editLoading}>
        <Modal visible={editingUser !== null}
          onCancel={() => setEditingUser(null)}
          onOk={handleUpdate}>
          <Form form={form}>
            <Form.Item name="username" label="Username" rules={[{ required: true, message: 'Please input the username!' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="firstname" label="First Name" rules={[{ required: true, message: 'Please input the First Name!' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="lastname" label="Last Name" rules={[{ required: true, message: 'Please input the Last Name!' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Please input the email!' }, { type: 'email', message: 'Please input a valid email!' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="userrole" label="User Role" rules={[{ required: true, message: 'Please select the user role!' }]}>
              <Select>
                {userRoleList.map((role) => (
                  <Option value={role} key={role}>{role}</Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </Modal>
        <Modal visible={deletingUser !== null} title="Delete User" onOk={handleDeleteConfirm} onCancel={handleCancelDelete}>
          <p>Are you sure you want to delete the user {deletingUser && deletingUser.username}?</p>
        </Modal>
      </Spin>
    </div >
  );
};

export default Users;