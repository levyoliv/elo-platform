
export type TipoOportunidade =
  | "remunerada"
  | "voluntariado";

export type Modalidade =
  | "presencial"
  | "hibrido"
  | "remoto";

export interface Opportunity {
  id: string;
  titulo: string;
  organizacao: string;
  tipo: TipoOportunidade;
  modalidade: Modalidade;
  localizacao: string;
  descricao: string;
  remuneracao: number | null;
  duracao: string | null;
  imagemUrl: string | null;
}
