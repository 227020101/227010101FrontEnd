import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Col, Input, Row, Select, Spin, Modal, Form, Button, Upload, DatePicker,message} from 'antd';
import { api } from '../common/http-common';
import axios from 'axios';
import authHeader from '../services/auth-header';
import { Buffer } from 'buffer';
import moment from 'moment';

const { Option } = Select;

const Cats = () => {
  const [loading, setLoading] = React.useState(false);
  const [cats, setCats] = React.useState(null);
  const [searchInput, setSearchInput] = React.useState('');
  const [filterOption, setFilterOption] = React.useState('all');
  const [modalVisible, setModalVisible] = React.useState(false);
  const [selectedCat, setSelectedCat] = React.useState(null);
  const [form] = Form.useForm();
  const [deleting, setDeleting] = React.useState(false); // new state variable for deleting

  React.useEffect(() => {
    setLoading(true);
    axios.get(`${api.uri}/cats`).then((res) => {
      setCats(res.data);
      setLoading(false);
    });
  }, []);

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

  const handleDelete = (id) => {
  Modal.confirm({
    title: 'Are you sure you want to delete this cat?',
    okText: 'Delete',
    okType: 'danger',
    cancelText: 'Cancel',
    onOk() {
      setDeleting(true);
      axios.delete(`${api.uri}/cats/${id}`, { headers: authHeader()}).then(() => {
        let catID = id;
        setCats(cats.filter((cat) => cat.id !== id));
        setDeleting(false);
        message.success(`Cat id ${catID} deleted successfully`);
        window.location.reload(false);
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

  const access_token = Buffer.from('admin:1234,utf8').toString('base64'); 

  const handleFormSubmit = (values) => {
    const { id, ...data } = values;
    const method = id ? 'put' : 'post';
    const url = id ? `${api.uri}/cats/${id}` : `${api.uri}/cats`;
    let formData = form.getFieldsValue();
    const data2 = new FormData();
    Object.keys(formData).forEach((key) => data2.append(key, formData[key]));
    axios[method](url, formData, { headers: authHeader()}).then((res) => {
      if (id) {
        setCats(cats.map((cat) => (cat.id === id ? res.data : cat)));
        message.success(`Cat id ${id} updated successfully`);
        window.location.reload(false);
      } else {
        setCats([...cats, res.data]);
        message.success('Cat created successfully');
        window.location.reload(false);
      }
      setModalVisible(false);
    });
  };

  let filteredCats = cats;
  if (filteredCats) {
    if (filterOption !== 'all') {
      filteredCats = cats.filter((cat) => cat.gender === filterOption);
    }
    if (searchInput !== '') {
      filteredCats = filteredCats.filter((cat) =>
        cat.name.toLowerCase().includes(searchInput.toLowerCase())
      );
    }
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <Spin size="large" />
      </div>
    );
  } else {
    return (
      <>
        <div style={{ marginBottom: 16 }}>
          <Input placeholder="Search cats" value={searchInput} onChange={handleSearch} />
          <Select value={filterOption} onChange={handleFilter} style={{ marginLeft: 16 }}>
            <Option value="all">All</Option>
            <Option value="male">Male</Option>
            <Option value="female">Female</Option>
          </Select>
          <Button type="primary" style={{ marginLeft: 16 }} onClick={handleAdd}>
            Add
          </Button>
        </div>
        <Row justify="space-around" gutter={[24, 32]}>
          {filteredCats &&
            filteredCats.map((cat) => (
              <Col span={8} key={cat.id}>
                <Card
                  hoverable
                  title={cat.name}
                  style={{ width: 300 }}
                  bordered={true}
                  cover={<img alt={cat.name} src={`data:image/jpeg;base64,${cat.imageurl}`}  />}
                >
                  <p>ID: {cat.id}</p>
                  <p>{cat.alltext}</p>
                  <p>Birthday: {moment(cat.birthday).format('YYYY-MM-DD')}</p>
                  <p>Microchip No: {cat.microchipno}</p>
                  <p>Gender: {cat.gender}</p>
                  <p></p>
                  <Link to={`/a/${cat.id}`}>Details</Link>
                  <Button type="link" onClick={() => handleEdit(cat)}>
                    Edit
                  </Button>
                  <Button type="link" danger onClick={() => handleDelete(cat.id)} loading={deleting}>
                    Delete
                  </Button>
                </Card>
              </Col>
            ))}
        </Row>
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
            <Form.Item label="Birthday(YYYY-MM-DD)" name="birthday" >
              <Input />
            </Form.Item>
            <Form.Item label="Microchip No" name="microchipno">
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
  }
};

export default Cats;