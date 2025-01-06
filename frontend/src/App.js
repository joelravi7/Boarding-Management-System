import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";


import UpdateCustomer from "./Componets/UpdateCustomer.js";
import Dashborad from "./Componets/dashboard.js";
import Homepage from "./Componets/Homepage.js";
import Login from "./Componets/CustomerLogin.js";
import AddRoom from './Componets/AddRoom.js';
import RoomList from './Componets/DisplayRoom.js';
import Bookroom from './Componets/Bookroom.js';
import Register from "./Componets/CustomerRegister.js";
import Profilepage from './Componets/Profile.js';

import AdminLogin from './Componets/AdminLogin.js';
import AdminRegister from './Componets/AdminRegister.js';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Homepage />} />     
          <Route path="/dash" element={<Dashborad />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/update-customer/:id" element={<UpdateCustomer />} /> 
          <Route path="/Profile" element={<Profilepage />} /> 
          <Route path='/AddRoom' element={<AddRoom />} />
          <Route path='/RoomList' element={<RoomList />} />
          <Route path='/Bookroom' element={<Bookroom />} />
          

          <Route path="/AdminLogin" element={<AdminLogin />} />
          <Route path="/AdminRegister" element={<AdminRegister />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
