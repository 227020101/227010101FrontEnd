import { Buffer } from 'buffer';

export default function authHeader() {
  const userStr = localStorage.getItem("user");
  let user = null;
  if (userStr)
    user = JSON.parse(userStr);

  if (user && user.password) {
    const access_token = Buffer.from(`${user.username}:${user.password}`,'utf8').toString('base64'); 

    return { 'Authorization': `Basic ${access_token}`  }; // for Spring Boot back-end
    // return { 'x-access-token': user.accessToken };       // for Node.js Express back-end
  } else {
    return { Authorization: '' }; // for Spring Boot back-end

  }
}