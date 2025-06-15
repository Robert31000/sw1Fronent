import React from 'react';
import Sidebar from '../../components/DashboardComponents/Sidebar';
import Header from '../../components/DashboardComponents/Header';
import QuickActions from '../../components/DashboardComponents/QuickActions';
import DesignSummaryCard from '../../components/DashboardComponents/DesignSummaryCard';
import BudgetCard from '../../components/DashboardComponents/BudgetCard';
import ChatBox from './ChatBox';
import CrearHabitacionForm from '../Habitacion/CrearHabitacionForm';
import { Outlet } from 'react-router-dom';


export default function Dashboard() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar/>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <Header />

        <main className="p-6 space-y-6">
          {/* Título */}
          <h1 className="text-2xl font-bold text-gray-800">Panel Principal</h1>

          {/* Quick Actions */}

        

         
          <ChatBox/>
          <Outlet/>
        </main>
      </div>
    </div>
  );
}
