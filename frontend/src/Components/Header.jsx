import { Container, Navbar, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import useAuth from '../Hooks/index.jsx';

const Header = () => {
  const auth = useAuth();

  const handleLogOut = () => {
    auth.logOut();
  };

  return (
    <Navbar
      expand="lg"
      variant="light"
      className="shadow-sm bg-white"
    >
      <Container>
        <Navbar.Brand as={Link} to='/'>
          Hexlet Chat
        </Navbar.Brand>
        {auth.loggedIn && <Button type="primary" onClick={handleLogOut}>Выйти</Button>}
      </Container>
    </Navbar>
  );
};

export default Header;