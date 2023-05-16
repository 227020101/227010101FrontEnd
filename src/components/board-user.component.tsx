import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Col, Input, Row, Select, Spin } from 'antd';
import { api } from '../common/http-common';
import axios from 'axios';
import moment from 'moment';
import dayjs from 'dayjs';

const { Option } = Select;

const Cats = () => {
  const [loading, setLoading] = React.useState(false);
  const [cats, setCats] = React.useState(null);
  const [searchInput, setSearchInput] = React.useState('');
  const [filterOption, setFilterOption] = React.useState('all');

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
        </div>
        <Row justify="space-around" gutter={[24, 32]}>
          {filteredCats && filteredCats.map(({ id, name, alltext, birthday, microchipno, gender, imageurl }) => (
            <Col span={8} key={id}>
              <Card
                hoverable
                title={name}
                style={{ width: 300 }}
                bordered={true}
                cover={<img alt={name} src={imageurl} />}
              >
                <p>{alltext}</p>
                <p>Birthday: {moment(birthday).format('YYYY-MM-DD')}</p>
                <p>Microchip No: {microchipno}</p>
                <p>Gender: {gender}</p>
                <p></p>
                <Link to={`/a/${id}`}>Details</Link>
              </Card>
            </Col>
          ))}
        </Row>
      </>
    );
  }
};

export default Cats;