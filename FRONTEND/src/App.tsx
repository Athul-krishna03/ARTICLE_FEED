import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import './App.css'
import Register  from "./pages/Register";
import Login from "./pages/Login";
import ArticleFeedPage from "./pages/Feed";
import { PublicRoute } from "./utils/protectors/PublicRoute";
import { ProtectedRoute } from "./utils/protectors/ProtectedRoute";
import MyArticlepage from "./pages/MyArticlepage";
import ProfileEdit from "./pages/Settings";

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
            <Route
              path='/signup'
              element={<PublicRoute element={ <Register/>}/>}
            />
            <Route
              path='/login'
              element={<PublicRoute element={<Login />} />}
            />
            <Route
              path='/articleFeed'
              element={<ProtectedRoute  element={<ArticleFeedPage/>}/>}
            />
            <Route
              path='/myArticles'
              element={<ProtectedRoute  element={<MyArticlepage/>}/>}
            />
            <Route
              path='/settings'
              element={<ProtectedRoute  element={<ProfileEdit/>}/>}
            />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
