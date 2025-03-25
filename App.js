import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Bubbles from './components/Bubbles';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

function MainAppComponent() {
  return (
    <Router>
      <Bubbles />
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </Router>
  );
}

export default MainAppComponent;
