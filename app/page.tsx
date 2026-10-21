
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Benefits from "@/components/Benefits";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* Cabeçalho */}
      <Header />

      {/* Apresentação */}
      <Hero />
      
      {/* Como funciona */}
      <Benefits />  

      {/* Oportunidades */}
      <section id="oportunidades" className="px-6 py-20 text-center">
        <h2 className="text-3xl font-bold text-slate-900">
          Seu próximo projeto começa aqui.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-slate-600">
          Em breve, você poderá explorar oportunidades e se conectar
          com organizações por meio do ELO.
        </p>
      </section>

      <footer className="border-t border-slate-200 px-6 py-8 text-center text-sm text-slate-500">
        © 2026 ELO — Educação, Ligação e Oportunidades.
      </footer>
    </main>
  );
}
