import React from 'react';
import { api } from '../common/http-common';
import axios from 'axios';
import { Input, Select, Spin, Table, Button, Modal, Form, message } from 'antd';
import authHeader from '../services/auth-header';
const { Option } = Select;



const Cats = () => {
  const [loading, setLoading] = React.useState(false);
  const [editLoading, setEditLoading] = React.useState(false);
  const [cats, setCats] = React.useState(null);
  const [searchInput, setSearchInput] = React.useState('');
  const [filterOption, setFilterOption] = React.useState('all');
  const [modalVisible, setModalVisible] = React.useState(false);
  const [selectedCat, setSelectedCat] = React.useState(null);
  const [ageInput, setAgeInput] = React.useState('');
  const [locationInput, setLocationInput] = React.useState('');
  const [form] = Form.useForm();
  const [deleting, setDeleting] = React.useState(false);
  const [sortOrder, setSortOrder] = React.useState(null);
  const handleSearch = (event) => {
    setSearchInput(event.target.value);
  };

  const handleFilter = (value) => {
    setFilterOption(value);
  };
  const handleAdd = () => {
    setSelectedCat(null);
    form.resetFields();
    setModalVisible(true);
  };
  const handleEdit = (cat) => {
    setSelectedCat(cat);
    form.setFieldsValue(cat);
    setModalVisible(true);
  };
  const handleUploadImage = (cat) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = () => {
      const file = input.files[0];
      setEditLoading(true); // Set loading state to true
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64Data = reader.result.substr(reader.result.indexOf(',') + 1);

        const updatedImage = { imageUrl: base64Data };
        axios.put(`${api.uri}/uploadImage/${cat.id}`, updatedImage, { headers: authHeader() }).then(() => {
          // setCats([...cats, res.data]);
          // form.resetFields();
          message.success('Cats updated successfully!');
          window.location.reload(false);
        }).catch((err) => {
          console.log(err);
        }).finally(() => {
          setEditLoading(false); // Set loading state back to false
        });
      };
      reader.onerror = (error) => {
        console.log(error);
      };
    };
    input.click();
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
        axios.delete(`${api.uri}/cats/${id}`, { headers: authHeader() }).then(() => {
          let catID = id;
          setCats(cats.filter((cat) => cat.id !== id));
          setDeleting(false);
          setEditLoading(false);
          message.success(`Cat id ${catID} deleted successfully`);
        });
      },
    });
  };
  const handleModalOk = () => {
    form.submit();
  };

  const handleModalCancel = () => {
    setModalVisible(false);
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

  const handleFormSubmit = (values) => {
    const { id, ...data } = values;
    const method = id ? 'put' : 'post';
    const url = id ? `${api.uri}/cats/${id}` : `${api.uri}/cats`;
    form.validateFields().then(values => {
      const updatedCat = { ...setSelectedCat, ...values };
      setEditLoading(true); // Set loading state to true
      setModalVisible(false);
      axios[method](url, updatedCat, { headers: authHeader() }).then((res) => {
        // form.resetFields();
        // setCats([...cats, res.data]);
        message.success('Cats updated successfully!');
        window.location.reload(false);
      }).catch((err) => {
        console.log(err);
      }).finally(() => {
        setEditLoading(false); // Set loading state back to false
      });
    });
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
      title: 'Edit',
      key: 'edit',
      render: (text, record) => (
        <span>
          <Button type="link" onClick={() => handleEdit(record)}>
            Edit
          </Button>
        </span>
      ),
    },
    {
      title: 'UploadImage',
      key: 'uploadImage',
      render: (text, record) => (
        <span>
          <Button type="link" onClick={() => handleUploadImage(record)}>
            UploadImage
          </Button>
        </span>
      ),
    },
    {
      title: 'Delete',
      key: 'delete',
      render: (text, record) => (
        <span>
          <Button type="link" danger onClick={() => handleDelete(record.id)}>
            Delete
          </Button>
        </span>
      ),
    }
  ];

  React.useEffect(() => {
    setLoading(true);
    axios.get(`${api.uri}/cats`).then((res) => {
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
        <h1> Cats List </h1>
        <Button type="primary" style={{ marginLeft: 16 }} onClick={handleAdd}>
          Add
        </Button>
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

      <Modal
        title={selectedCat ? 'Edit Cat' : 'Add Cat'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      >
        <Form form={form} onFinish={handleFormSubmit} initialValues={selectedCat}>
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please input the name of the cat!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Alltext" name="alltext">
            <Input />
          </Form.Item>
          <Form.Item label="Age" name="age">
            <Input />
          </Form.Item>
          <Form.Item label="Location" name="location">
            <Input />
          </Form.Item>
          <Form.Item label="Gender" name="gender">
            <Select>
              <Option value="male">Male</Option>
              <Option value="female">Female</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

    </>

  );
};

export default Cats;