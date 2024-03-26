import { useContext } from 'react';

import AuthContext from '../Contexts/index.jsx';

const useAuth = () => useContext(AuthContext);

export default useAuth;
