import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Login } from '@/pages/Login';
import { Dashboard } from '@/pages/Dashboard';
import { Customers } from '@/pages/Customers';
import { CustomerDetail } from '@/pages/CustomerDetail';
import { Devices } from '@/pages/Devices';
import { Transactions } from '@/pages/Transactions';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<DashboardLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="customers" element={<Customers />} />
                <Route path="customers/:id" element={<CustomerDetail />} />
                <Route path="devices" element={<Devices />} />
                <Route path="transactions" element={<Transactions />} />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
