
"use client";

import { useState } from "react";

import StudentSidebar from "./StudentSidebar";
import StudentHeader from "./StudentHeader";
import StudentSearchBar from "./StudentSearchBar";
import StudentStats from "./StudentStats";
import StudentOpportunities from "./StudentOpportunities";

import type { Opportunity } from "@/types/opportunity";

interface StudentDashboardProps {
  nome: string;
  oportunidades?: Opportunity[];
}

export default function StudentDashboard({
  nome,
  oportunidades = [],
}: StudentDashboardProps) {
  const [busca, setBusca] = useState("");
  const [tipo, setTipo] = useState("todas");
  const [modalidade, setModalidade] = useState("todas");

  // Filtrar oportunidades pelo texto digitado
  const termo = busca.trim().toLocaleLowerCase("pt-BR");

  const oportunidadesFiltradas = oportunidades.filter((oportunidade) => {
    // Pesquisa por texto
    const correspondeBusca =
        oportunidade.titulo.toLocaleLowerCase("pt-BR").includes(termo) ||
        oportunidade.organizacao.toLocaleLowerCase("pt-BR").includes(termo) ||
        oportunidade.descricao.toLocaleLowerCase("pt-BR").includes(termo);

    // Filtro por tipo
    const correspondeTipo =
        tipo === "todas" || oportunidade.tipo === tipo;

    // Filtro por modalidade
    const correspondeModalidade =
        modalidade === "todas" ||
        oportunidade.modalidade === modalidade;

    // A oportunidade precisa atender aos três critérios
    return (
        correspondeBusca &&
        correspondeTipo &&
        correspondeModalidade
    );
  });

  return (
    <div className="flex min-h-screen bg-[#F3F4F6]">
      {/* Menu lateral */}
      <StudentSidebar nome={nome} />

      {/* Conteúdo principal */}
      <main className="min-w-0 flex-1 px-8 py-8">
        {/* Cabeçalho */}
        <StudentHeader nome={nome} />

        {/* Barra de pesquisa */}
        <StudentSearchBar
        onSearchChange={setBusca}
        onTipoChange={setTipo}
        onModalidadeChange={setModalidade}
        />

        {/* Indicadores */}
        <StudentStats />

        {/* Oportunidades em destaque */}
        <StudentOpportunities
          oportunidades={oportunidadesFiltradas}
          busca={busca}
          filtrosAtivos={tipo !== "todas" || modalidade !== "todas"}
        />
      </main>
    </div>
  );
}
