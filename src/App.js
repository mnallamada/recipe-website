import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RecipePage from './pages/RecipePage';
import AddRecipePage from './pages/AddRecipePage';
import EditRecipePage from './pages/EditRecipePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CategoriesPage from './pages/CategoriesPage';
import CategoryPage from './pages/CategoryPage';
import ThreadPage from './pages/ThreadPage';
import NewThreadPage from './pages/NewThreadPage';
import Footer from './components/Footer';

const App = () => {
    return (
        <>
            <Router>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/recipe/:id" element={<RecipePage />} />
                    <Route path="/add-recipe" element={<AddRecipePage />} />
                    <Route path="/edit-recipe/:id" element={<EditRecipePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/forum" element={<CategoriesPage />} />
                    <Route path="/forum/:categoryId" element={<CategoryPage />} />
                    <Route path="/forum/thread/:threadId" element={<ThreadPage />} />
                    <Route path="/forum/new-thread" element={<NewThreadPage />} />
                </Routes>
            </Router>
            <Footer />
        </>
    );
};

export default App;
