interface ITeamMember {
  name: string;
  role: string;
}

interface ITeamData {
  id: number;
  title: string;
  members: TeamMember[];
  totalMembers: number;
  previousDate: string;
}

interface IStat {
  id: number;
  date: string;
  user_id: number;
  deposits: number;
  redeposits: number;
  tir1: number;
  tir2: number;
  comment: string;
}

interface IMember {
  id: number;
  isAuth: boolean;
  name: string;
  telegramId: string;
  team_id: number;
  created_at: string;
  updated_at: string | null;
  role: string;
  stats: Stat[];
}

interface ITeam {
  id: number;
  title: string;
  members: Member[];
}

interface IMemberOption {
  value: number;
  label: string;
}

interface ITeamOption {
  value: number;
  label: string;
}

interface ITeamData {
  id: number;
  title: string;
  members: IMember[]; // Changed to IMember[]
  totalMembers: number;
  previousDate: string;
}

interface ITotalsData {
  name: string;
  totals: number;
}

interface IUSD {
  value: number;
  status: boolean; // Изменено на boolean
  isPay: boolean; // Добавлено
}

interface IMember {
  name: string;
  stats: { date: string; totals: number }[];
  usd: Record<string, IUSD>;
  totals: { month: string; total: number }[];
}

interface ITotalTeam {
  members: IMember[];
}