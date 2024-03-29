import { useContext } from 'react';

import AuthContext, { FilterContext } from '../Contexts/index.jsx';

const useAuth = () => useContext(AuthContext);
const useFilter = () => useContext(FilterContext);

export { useFilter };
export default useAuth;
