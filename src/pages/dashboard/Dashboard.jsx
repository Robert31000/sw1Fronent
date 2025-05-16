import React from 'react';
import Sidebar from '../../components/DashboardComponents/Sidebar';
import Header from '../../components/DashboardComponents/Header';
import QuickActions from '../../components/DashboardComponents/QuickActions';
import DesignSummaryCard from '../../components/DashboardComponents/DesignSummaryCard';
import BudgetCard from '../../components/DashboardComponents/BudgetCard';
import ChatBox from './ChatBox';


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
          <QuickActions />

          {/* Resumen de diseños */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DesignSummaryCard
              title="Diseño Reciente"
              description="Sala moderna generada con IA"
              date="14/05/2025"
            />
            <DesignSummaryCard
              title="Dormitorio Minimalista"
              description="Estilo nórdico con iluminación cálida"
              date="12/05/2025"
            />
            <DesignSummaryCard
              title="Oficina Ejecutiva"
              description="Optimización del espacio y estilo moderno"
              date="10/05/2025"
            />
          </div>

          {/* Presupuestos */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Presupuestos Recientes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <BudgetCard
                title="Sala Moderna"
                total={1240.99}
                items={6}
              />
              <BudgetCard
                title="Dormitorio Juvenil"
                total={978.50}
                items={5}
              />
              <BudgetCard
                title="Comedor Rústico"
                total={1450.75}
                items={8}
              />
            </div>
          </div>
          <ChatBox/>
        </main>
      </div>
    </div>
  );
}
