import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from '../Layout';
import { AgentDashboard } from './AgentDashboard';
import { AgentPerformancePage } from './AgentPerformancePage';

export function AgentRoutes() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<AgentDashboard />} />
        <Route path="/performance" element={<AgentPerformancePage />} />
      </Routes>
    </Layout>
  );
}
