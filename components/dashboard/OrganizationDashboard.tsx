import { Plus, BriefcaseBusiness, Pencil } from "lucide-react";
import OrganizationSidebar from "./OrganizationSidebar";
import Link from "next/link";
import PublishOpportunityButton from "./PublishOpportunityButton";
import CloseOpportunityButton from "./CloseOpportunityButton";
import DeleteOpportunityButton from "./DeleteOpportunityButton";

interface OrganizationOpportunity {
  id: string;
  titulo: string;
  status: "rascunho" | "publicada" | "encerrada";
  created_at: string;
  candidaturas?: number;
}

interface OrganizationDashboardProps {
  nome: string;
  oportunidades: OrganizationOpportunity[];
  verificada: boolean;
}

export default function OrganizationDashboard({
  nome,
  oportunidades,
  verificada,
}: OrganizationDashboardProps) {
  const publicadas = oportunidades.filter(
    (item) => item.status === "publicada"
  ).length;

  const rascunhos = oportunidades.filter(
    (item) => item.status === "rascunho"
  ).length;

  const encerradas = oportunidades.filter(
    (item) => item.status === "encerrada"
  ).length;

  const coresStatus = {
    publicada: "bg-teal-50 text-[#0D9488]",
    rascunho: "bg-slate-100 text-slate-600",
    encerrada: "bg-orange-50 text-orange-600",
  };

  const nomesStatus = {
    publicada: "Publicada",
    rascunho: "Rascunho",
    encerrada: "Encerrada",
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#F3F4F6] md:flex-row">
      <OrganizationSidebar nome={nome} />

      <main className="min-w-0 flex-1 p-5 md:p-8">
        <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#1F2937]">
              Minhas oportunidades
            </h1>

            <p
              className={`mt-2 text-[12px] font-medium ${verificada ? "text-[#0D9488]" : "text-amber-700"
                }`}
            >
              {verificada
                ? "✓ Organização verificada — publicação disponível"
                : "Organização não verificada — você pode criar rascunhos, mas ainda não pode publicar."}
            </p>
          </div>

          <Link
            href="/painel/organizacao/nova"
            className="flex items-center gap-2 rounded-lg bg-[#0D9488] px-4 py-2.5 text-[13px] font-semibold text-white transition hover:bg-[#0F766E]"
          >
            <Plus size={17} />
            Nova oportunidade
          </Link>
        </div>

        <div className="mb-5 flex flex-wrap gap-2 text-[12px]">
          <span className="rounded-full bg-teal-50 px-3 py-2 font-semibold text-[#0D9488]">
            Todas ({oportunidades.length})
          </span>

          <span className="rounded-full bg-white px-3 py-2 text-slate-500">
            Rascunhos ({rascunhos})
          </span>

          <span className="rounded-full bg-white px-3 py-2 text-slate-500">
            Publicadas ({publicadas})
          </span>

          <span className="rounded-full bg-white px-3 py-2 text-slate-500">
            Encerradas ({encerradas})
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full min-w-[600px] text-left text-[13px]">
            <thead className="border-b border-slate-100 bg-slate-50 text-[12px] text-slate-500">
              <tr>
                <th className="px-5 py-4 font-medium">
                  Título
                </th>
                <th className="px-5 py-4 font-medium">
                  Candidaturas
                </th>
                <th className="px-5 py-4 font-medium">
                  Status
                </th>
                <th className="px-5 py-4 font-medium">
                  Data de criação
                </th>
              </tr>
            </thead>

            <tbody>
              {oportunidades.map((oportunidade) => (
                <tr
                  key={oportunidade.id}
                  className="border-b border-slate-100 last:border-0"
                >

                  <td className="px-5 py-4">
                    <p className="font-medium text-[#1F2937]">
                      {oportunidade.titulo}
                    </p>

                    {oportunidade.status === "rascunho" && (
                      <div className="mt-2 flex flex-wrap items-center gap-4">
                        <Link
                          href={`/painel/organizacao/editar/${oportunidade.id}`}
                          className="inline-flex items-center gap-1 text-[12px] font-medium text-[#0D9488] transition hover:text-[#0F766E]"
                        >
                          <Pencil size={13} />
                          Editar
                        </Link>

                        <PublishOpportunityButton
                          oportunidadeId={oportunidade.id}
                          verificada={verificada}
                        />

                        <DeleteOpportunityButton
                          oportunidadeId={oportunidade.id}
                        />
                      </div>
                    )}


                    {oportunidade.status === "publicada" && (
                      <div className="mt-2 flex flex-wrap items-center gap-4">
                        <Link
                          href={`/painel/organizacao/editar/${oportunidade.id}`}
                          className="inline-flex items-center gap-1 text-[12px] font-medium text-[#0D9488] transition hover:text-[#0F766E]"
                        >
                          <Pencil size={13} />
                          Editar
                        </Link>

                        <CloseOpportunityButton
                          oportunidadeId={oportunidade.id}
                        />

                        <DeleteOpportunityButton
                          oportunidadeId={oportunidade.id}
                        />
                      </div>
                    )}

                    {oportunidade.status === "encerrada" && (
                      <div className="mt-2">
                        <DeleteOpportunityButton
                          oportunidadeId={oportunidade.id}
                        />
                      </div>
                    )}

                  </td>


                  <td className="px-5 py-4 text-slate-600">
                    {oportunidade.candidaturas ?? "—"}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-[11px] font-medium ${coresStatus[oportunidade.status]
                        }`}
                    >
                      {nomesStatus[oportunidade.status]}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-slate-500">
                    {new Date(
                      oportunidade.created_at
                    ).toLocaleDateString("pt-BR", {
                      timeZone: "America/Fortaleza",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {oportunidades.length === 0 && (
            <div className="flex flex-col items-center px-6 py-14 text-center">
              <BriefcaseBusiness
                size={30}
                className="mb-3 text-[#0D9488]"
              />

              <h2 className="text-sm font-semibold text-[#1F2937]">
                Nenhuma oportunidade encontrada
              </h2>

              <p className="mt-2 text-xs text-slate-500">
                As oportunidades da sua organização aparecerão aqui.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
