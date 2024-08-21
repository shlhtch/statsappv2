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
  members: IMember[];
  totalMembers: number;
  previousDate: string;
}

interface ITotalsData {
  name: string;
  totals: number;
}

interface IUSD {
  value: number;
  status: boolean;
  isPay: boolean;
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

interface ITotalStat {
  date: string;
  totals: number;
}

interface IUsdRecord {
  value: number;
  isPay: boolean;
}

interface ITotalMember {
  id: string;
  name: string;
  totalSum: number;
  monthlyTotals: { month: string; total: number }[];
  usdRecords: UsdRecord[];
}

interface IAdminStat {
  firtsminus: number;
  secondminus: number;
  thirdminus: number;
}

interface IAdminMemberStat {
  id: number;
  date: string;
  deposits: number;
  fifthvalue?: number;
}

interface IAdminMember {
  id: number;
  name: string;
  stats: IAdminMemberStat[];
}

interface IAdminTeam {
  id: number;
  title: string;
  members: IAdminMember[];
}

interface IPointsStat {
  id: number;
  date: string;
  user_id: number;
  firtsminus: number;
  secondminus: number;
  thirdminus: number;
}

interface IPointsMember {
  id: number;
  name: string;
  stats: IPointsStat[];
}

interface IPointTeam {
  id: number;
  title: string;
  members: IPointsMember[];
}

interface IUsdMember {
  id: number;
  name: string;
  totalSum: number;
  monthlyTotals: { month: string; total: number }[];
  usdRecords: { id: number; value: number; isPay: boolean }[];
}