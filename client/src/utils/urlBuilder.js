const { BASE_URL } = process.env;
export default path => `${BASE_URL}${path.charAt(0) === '/' ? '' : '/'}${path}`;
