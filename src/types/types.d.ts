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
