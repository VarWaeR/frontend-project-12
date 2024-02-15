import { useContext } from 'react';

import authContext from '../Contexts/index.jsx';

const useAuth = () => useContext(authContext);

export default useAuth;