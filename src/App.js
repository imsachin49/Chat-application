import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import { ThemeProvider, createTheme } from '@mui/material/styles';


function App() {
  
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  const { currentUser } = useContext(AuthContext);
  
  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/login" />;
    }
    return children
  };

  return (
    <ThemeProvider theme={darkTheme}>
    <div className="App">
      <Router>
        <Routes>
          <Route path="/register" element={<Register/>} />
          <Route path="/login" element={<Login/>} />
          <Route index element={<ProtectedRoute><Home/></ProtectedRoute>}/>
        </Routes>
      </Router>
    </div>
    </ThemeProvider>
  );
}

export default App;
