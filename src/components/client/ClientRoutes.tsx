import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from '../Layout';
import { ClientDashboard } from './ClientDashboard';
import { InvoicesPage } from './InvoicesPage';
import { ServicesPage } from './ServicesPage';

export function ClientRoutes() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<ClientDashboard />} />
        <Route path="/invoices" element={<InvoicesPage />} />
        <Route path="/services" element={<ServicesPage />} />
      </Routes>
    </Layout>
  );
}
