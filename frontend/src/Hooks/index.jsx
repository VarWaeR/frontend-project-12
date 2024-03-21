import { useContext } from 'react';

import AuthContext, { ApiContext } from '../Contexts/index.jsx';

const useAuth = () => useContext(AuthContext);
const useApi = () => useContext(ApiContext);

export { useApi };
export default useAuth;
