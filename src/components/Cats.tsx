import React from 'react';
import { api } from '../common/http-common';
import axios from 'axios';
import { Card, Col, Input, Row, Select, Spin, Button, message } from 'antd';
import authHeader from '../services/auth-header';

const { Option } = Select;

const Cats = () => {
  const [loading, setLoading] = React.useState(false);
  const [cats, setCats] = React.useState(null);
  const [searchInput, setSearchInput] = React.useState('');
  const [filterOption, setFilterOption] = React.useState('all');
  const [editLoading, setEditLoading] = React.useState(false);
  const [ageInput, setAgeInput] = React.useState('');
  const [locationInput, setLocationInput] = React.useState('');

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
  const handleAdd = (id) => {
    const user = JSON.parse(localStorage.getItem("user"))
    const userid = user.id;
    const favouritesData = {
      catid: id,
      userid: userid
    }
    setEditLoading(true); // Set loading state to true
    axios.post(`${api.uri}/favourites`, favouritesData, { headers: authHeader() }).then(() => {
      message.success(`Cats ${id} added to favourites list successfully!`);
    }).catch((err) => {
      console.log(err);
    }).finally(() => {
      setEditLoading(false); // Set loading state back to false
    });
  };


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

  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <Spin size="large" />
      </div>
    );
  } else {
    return (
      <>
        <Spin spinning={editLoading}>
          <div style={{ marginBottom: 16 }}>
            <Input placeholder="Search cats" value={searchInput} onChange={handleSearch} style={{ marginLeft: 16 }} />
            <Input placeholder="Search age" value={ageInput} onChange={(e) => setAgeInput(e.target.value)} style={{ marginLeft: 16 }} />
            <Input placeholder="Search location" value={locationInput} onChange={(e) => setLocationInput(e.target.value)} style={{ marginLeft: 16 }} />
            <Select value={filterOption} onChange={handleFilter} style={{ marginLeft: 16, width: 120 }}>
              <Option value="all">All</Option>
              <Option value="male">Male</Option>
              <Option value="female">Female</Option>
            </Select>
          </div>
          <Row justify="space-around" gutter={[24, 32]}>
            {filteredCats && filteredCats.map(({ id, name, alltext, age, location, gender, imageurl }) => (
              <Col span={8} key={id}>
                <Card
                  hoverable
                  title={name}
                  style={{ width: 300 }}
                  bordered={true}
                  cover={<img alt={name} src={`data:image/jpeg;base64,${imageurl}`} />}
                >
                  <p>ID: {id}</p>
                  <p>{alltext}</p>
                  <p>Age: {age}</p>
                  <p>Location: {location}</p>
                  <p>Gender: {gender}</p>
                  <p>
                    <Button type="link" onClick={() => handleAdd(id)}>
                      Add to favourites
                    </Button></p>
                </Card>
              </Col>
            ))}
          </Row>
        </Spin>
      </>
    );
  }
};

export default Cats;