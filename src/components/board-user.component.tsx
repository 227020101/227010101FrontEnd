import React from 'react';
import { api } from '../common/http-common';
import axios from 'axios';
import { Input, Select, Spin, Table, Button, Modal, message } from 'antd';
import authHeader from '../services/auth-header';
const { Option } = Select;



const Cats = () => {
  const user = JSON.parse(localStorage.getItem("user"))
  const userid = user.id;
  const [loading, setLoading] = React.useState(false);
  const [editLoading, setEditLoading] = React.useState(false);
  const [cats, setCats] = React.useState(null);
  const [searchInput, setSearchInput] = React.useState('');
  const [filterOption, setFilterOption] = React.useState('all');
  const [selectedCat, setSelectedCat] = React.useState(null);
  const [ageInput, setAgeInput] = React.useState('');
  const [locationInput, setLocationInput] = React.useState('');
  const [deleting, setDeleting] = React.useState(false);
  const [sortOrder, setSortOrder] = React.useState(null);
  const handleSearch = (event) => {
    setSearchInput(event.target.value);
  };

  const handleFilter = (value) => {
    setFilterOption(value);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this cat?',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk() {
        setDeleting(true);
        setEditLoading(true);
        axios.delete(`${api.uri}/favourites/${id}`, { headers: authHeader() }).then(() => {
          let catID = id;
          setCats(cats.filter((cat) => cat.id !== id));
          setDeleting(false);
          setEditLoading(false);
          message.success(`Cat id ${catID} deleted successfully`);
          window.location.reload(false);
        });
      },
    });
  };

  const handleSort = (column) => {
    if (sortOrder && sortOrder.column === column) {
      // If we're already sorting by this column, reverse the order
      setSortOrder({
        column,
        order: sortOrder.order === 'ascend' ? 'descend' : 'ascend',
      });
    } else {
      // Otherwise, sort by this column in ascending order
      setSortOrder({
        column,
        order: 'ascend',
      });
    }
  };

  const columns = [
    {
      title: 'Image',
      dataIndex: 'imageurl',
      key: 'imageurl',
      render: (imageurl) => <img src={`data:image/png;base64,${imageurl}`} alt="Cat" style={{ height: '100px', width: '100px' }} />,
    },
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => a.id - b.id,
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'All Text',
      dataIndex: 'alltext',
      key: 'alltext',
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
      sorter: (a, b) => a.age.localeCompare(b.age),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
      sorter: (a, b) => a.location.localeCompare(b.location),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
      sorter: (a, b) => a.gender.localeCompare(b.gender),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Delete',
      key: 'delete',
      render: (text, record) => (
        <span>
          <Button type="link" danger onClick={() => handleDelete(record.fid)}>
            Delete
          </Button>
        </span>
      ),
    }
  ];

  React.useEffect(() => {
    setLoading(true);
    axios.get(`${api.uri}/favourites/${userid}`, { headers: authHeader() }).then((res) => {
      setCats(res.data);
      setLoading(false);
    });
  }, []);


  let filteredCats = cats;
  if (filteredCats) {
    if (filterOption !== 'all') {
      filteredCats = filteredCats.filter((cat) => cat.gender === filterOption);
    }
    if (searchInput !== '') {
      filteredCats = filteredCats.filter((cat) =>
        cat.name.toLowerCase().includes(searchInput.toLowerCase())
      );
    }
    if (ageInput !== '') {
      filteredCats = filteredCats.filter((cat) => cat.age.toString() === ageInput);
    }
    if (locationInput !== '') {
      filteredCats = filteredCats.filter((cat) =>
        cat.location.toLowerCase().includes(locationInput.toLowerCase())
      );
    }
  }

  const dataSource = filteredCats ? filteredCats.map((cat) => ({
    ...cat,
    key: cat.id,
  })) : [];

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <h1> Favourites List </h1>
        <Input placeholder="Search cats" value={searchInput} onChange={handleSearch} style={{ marginLeft: 16 }} />
        <Input placeholder="Search age" value={ageInput} onChange={(e) => setAgeInput(e.target.value)} style={{ marginLeft: 16 }} />
        <Input placeholder="Search location" value={locationInput} onChange={(e) => setLocationInput(e.target.value)} style={{ marginLeft: 16 }} />
        <Select value={filterOption} onChange={handleFilter} style={{ marginLeft: 16, width: 120 }}>
          <Option value="all">All</Option>
          <Option value="male">Male</Option>
          <Option value="female">Female</Option>
        </Select>
      </div>
      {loading ? (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <Spin size="large" />
        </div>
      ) : (
        <Spin spinning={editLoading}>
          <Table dataSource={dataSource} columns={columns} />
        </Spin>
      )}
    </>

  );
};

export default Cats;