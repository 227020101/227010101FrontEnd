import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Col, Row } from 'antd';
import { api } from '../common/http-common';
import axios from 'axios';


const Cats = () => {
  const [loading, setLoading] = React.useState(true);
  const [cats, setCats] = React.useState(null);
  React.useEffect(() => {
    axios.get(`${api.uri}/cats`).then((res) => {
      // console.log(res.data)
      setCats(res.data)
    }).then(() => {
      setLoading(false);
    })
  }, [])
  if (loading) {
    return (<p>Loading...</p>)
  } else {
    if (!cats) {
      return (
        <div>There is no cat available now.</div>
      )
    } else {
      return (
        <Row justify="space-around" gutter={[24, 32]}>
          {
            cats &&
            cats.map(({ id, name, alltext }) => (
              <Col span={6} key={id}>
                <Card hoverable
                  title={name} style={{ width: 300 }} bordered={true}>
                  <p>{alltext}</p>
                  <p></p>
                  <Link to={`/a/${id}`}>Details</Link>
                </Card>
              </Col>))
          }
        </Row>
      );
    }
  }
}
export default Cats;