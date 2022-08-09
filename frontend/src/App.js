import './App.css';
import Header from "./components/header/Header"
import Footer from "./components/Footer"
import { LandingPage } from './components/landingPage/LandingPage';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Mynotes from './components/Mynotes/Mynotes';
import Login from './components/LoginScreen/Login';
import Register from './components/RegisterScreen/Register';
import CreateNote from './components/Mynotes/CreateNote';
import UpdateNote from './components/Mynotes/UpdateNote';
import ProfileScreen from './components/ProfileScreen/ProfileScreen';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>

        <Route path='/' element={<LandingPage />} exact />
        <Route path='/mynotes' element={<Mynotes exact />} />
        <Route path='/login' element={<Login />} exact />
        <Route path='/register' element={<Register />} exact />
        <Route path='/profile' element={<ProfileScreen />} exact />

        <Route path='/createnote' element={<CreateNote exact />} />
        <Route path='/note/:id' element={<UpdateNote/>} />

      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
