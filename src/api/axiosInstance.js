import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://kim11.shop',  // 로컬 서버를 가리키도록 baseURL 수정
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true  // 만약 쿠키를 포함한 요청이 필요 없으면 이 옵션을 제거하거나 false로 설정
});

export default axiosInstance;