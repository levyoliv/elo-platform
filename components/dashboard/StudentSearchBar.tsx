"use client";

import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";

interface StudentSearchBarProps {
  onSearchChange?: (valor: string) => void;
  onTipoChange?: (valor: string) => void;
  onModalidadeChange?: (valor: string) => void;
}

export default function StudentSearchBar({
  onSearchChange,
  onTipoChange,
  onModalidadeChange,
}: StudentSearchBarProps) {
  const [busca, setBusca] = useState("");
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  return (
    <>
      <div className="mt-6 flex w-full items-center gap-3">
          {/* Campo de pesquisa */}
          <div className="flex h-12 min-w-0 flex-1 items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 transition focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-100">
            <Search
              size={19}
              strokeWidth={1.8}
              className="shrink-0 text-slate-400"
            />

            <input
              type="search"
              value={busca}
              onChange={(event) => {
                const valor = event.target.value;
                setBusca(valor);
                onSearchChange?.(valor);
              }}
              placeholder="Buscar oportunidades, organizações ou áreas..."
              aria-label="Buscar oportunidades"
              className="min-w-0 flex-1 bg-transparent text-[13px] text-[#1F2937] outline-none placeholder:text-slate-400"
            />
          </div>

          {/* Filtros: ativaremos com a listagem de oportunidades */}
          
          <button
            type="button"
            onClick={() => setMostrarFiltros(!mostrarFiltros)}
            aria-label="Mostrar ou ocultar filtros"
            aria-expanded={mostrarFiltros}
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border transition ${
              mostrarFiltros
                ? "border-[#0D9488] bg-teal-50 text-[#0D9488]"
                : "border-slate-200 bg-white text-slate-500 hover:border-teal-300"
            }`}
          >
            <SlidersHorizontal size={19} strokeWidth={1.8} />
          </button>
      </div>  

      {/* Painel de filtros */}
        {mostrarFiltros && (
          <div className="mt-3 grid grid-cols-1 gap-4 rounded-xl border border-slate-200 bg-white p-4 sm:grid-cols-2">
            {/* Tipo de oportunidade */}
            <div>
              <label
                htmlFor="filtro-tipo"
                className="mb-2 block text-[12px] font-semibold text-[#1F2937]"
              >
                Tipo de oportunidade
              </label>

              <select
                id="filtro-tipo"
                defaultValue="todas"
                onChange={(event) => onTipoChange?.(event.target.value)}
                className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-[12px] text-slate-700 outline-none focus:border-teal-500"
              >
                <option value="todas">Todas</option>
                <option value="remunerada">Remunerada</option>
                <option value="voluntariado">Voluntariado</option>
              </select>
            </div>

            {/* Modalidade */}
            <div>
              <label
                htmlFor="filtro-modalidade"
                className="mb-2 block text-[12px] font-semibold text-[#1F2937]"
              >
                Modalidade
              </label>

              <select
                id="filtro-modalidade"
                defaultValue="todas"
                onChange={(event) => onModalidadeChange?.(event.target.value)}
                className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-[12px] text-slate-700 outline-none focus:border-teal-500"
              >
                <option value="todas">Todas</option>
                <option value="presencial">Presencial</option>
                <option value="hibrido">Híbrido</option>
                <option value="remoto">Remoto</option>
              </select>
            </div>
          </div>
        )}
    </>
  );
}
