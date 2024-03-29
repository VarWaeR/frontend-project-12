import { createContext } from 'react';

const AuthContext = createContext({});
const ApiContext = createContext({});
const FilterContext = createContext(null);

export { ApiContext, FilterContext };
export default AuthContext;
