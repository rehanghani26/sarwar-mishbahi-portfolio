import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Layout Imports
import MainLayout from '../layout/MainLayout';

// Public Page Imports
import Home from '../pages/Home/pages/Home';
import About from '../pages/About/pages/About';
import ArticlesList from '../pages/Articles/pages/ArticlesList';
import ArticleDetail from '../pages/Articles/pages/ArticleDetail';
import FatwasList from '../pages/Fatwas/pages/FatwasList';
import FatwaDetail from '../pages/Fatwas/pages/FatwaDetail';
import AskQuestion from '../pages/AskQuestion/pages/AskQuestion';
import QAList from '../pages/QuestionsAnswers/pages/QAList';
import PublicationsList from '../pages/Publications/pages/PublicationsList';
import LecturesList from '../pages/Lectures/pages/LecturesList';
import EventsList from '../pages/Events/pages/EventsList';
import ContactPage from '../pages/Contact/pages/ContactPage';
import PageNotFound from '../pages/PageNotFound/pages/PageNotFound';

// Admin Page Imports
import Login from '../pages/Admin/pages/Login';
import Dashboard from '../pages/Admin/pages/Dashboard';
import ManageArticles from '../pages/Admin/pages/ManageArticles';
import ManageFatwas from '../pages/Admin/pages/ManageFatwas';
import ManageQuestions from '../pages/Admin/pages/ManageQuestions';
import ManagePublications from '../pages/Admin/pages/ManagePublications';
import ManageLectures from '../pages/Admin/pages/ManageLectures';
import ManageEvents from '../pages/Admin/pages/ManageEvents';
import ManageSettings from '../pages/Admin/pages/ManageSettings';

// Route Guard
import AdminRoute from '../components/AdminRoute';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Root Layout wrapper */}
      <Route path="/" element={<MainLayout />}>
        
        {/* Public Visitor Routes */}
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        
        <Route path="articles" element={<ArticlesList />} />
        <Route path="articles/:slug" element={<ArticleDetail />} />
        
        <Route path="fatwas" element={<FatwasList />} />
        <Route path="fatwas/:id" element={<FatwaDetail />} />
        
        <Route path="ask" element={<AskQuestion />} />
        <Route path="qa" element={<QAList />} />
        <Route path="publications" element={<PublicationsList />} />
        <Route path="lectures" element={<LecturesList />} />
        <Route path="events" element={<EventsList />} />
        <Route path="contact" element={<ContactPage />} />

        {/* Admin Login Route */}
        <Route path="admin/login" element={<Login />} />

        {/* Protected Admin Console Routes */}
        <Route element={<AdminRoute />}>
          <Route path="admin/dashboard" element={<Dashboard />} />
          <Route path="admin/articles" element={<ManageArticles />} />
          <Route path="admin/fatwas" element={<ManageFatwas />} />
          <Route path="admin/questions" element={<ManageQuestions />} />
          <Route path="admin/publications" element={<ManagePublications />} />
          <Route path="admin/lectures" element={<ManageLectures />} />
          <Route path="admin/events" element={<ManageEvents />} />
          <Route path="admin/settings" element={<ManageSettings />} />
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<PageNotFound />} />

      </Route>
    </Routes>
  );
}
