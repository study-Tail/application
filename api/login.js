
// 登录方法
function login(username, password) {
  const data = {
    username,
    password,
  }
  return uni.$u.post('/login', data);
}




export default {
  login
}
