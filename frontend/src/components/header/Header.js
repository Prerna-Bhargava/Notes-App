import React,{useState,useEffect} from 'react'
import { Container, Navbar, NavDropdown, Form, FormControl, Nav } from 'react-bootstrap'
import { Link,useNavigate } from 'react-router-dom'
export default function Header() {
  const history = useNavigate();
  const [userInfo, setUserInfo] = useState('');
  useEffect(() => {
    if(JSON.parse(localStorage.getItem("userInfo"))){
    const token = JSON.parse(localStorage.getItem("userInfo")).token
    setUserInfo(JSON.parse(localStorage.getItem("userInfo")).name);
    }
  }, [history])
  
  return (
    <Navbar bg="primary" expand="lg" variant='dark'>
      <Container>
        <Navbar.Brand as={Link} to="/" >
          Notes APP
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav className='m-auto'>
            <Form className="d-flex">
              <FormControl
                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
              />
            </Form>
          </Nav>

          {userInfo!=''?
          <Nav
            className="my-2 my-lg-0"
            style={{ maxHeight: '100px' }}
            navbarScroll
          >
            <Nav.Link as={Link} to="/mynotes" >
              My Notes
            </Nav.Link>
            <NavDropdown title={userInfo} id="navbarScrollingDropdown">
              <NavDropdown.Item href="/profile">My Profile</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="/" onClick={() => {
                localStorage.removeItem("userInfo");
                history("/")
              }}>
                Log Out
              </NavDropdown.Item>
            </NavDropdown>

          </Nav>:<Nav></Nav>}

        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
