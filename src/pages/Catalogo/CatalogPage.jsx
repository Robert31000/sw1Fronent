import React from "react";
import CatalogPanel from "./CatalogPanel";

export default function CatalogPage() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Catálogo de Muebles</h2>
      <CatalogPanel onSelect={() => {}} />
    </div>
  );
}