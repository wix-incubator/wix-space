export interface CrewMember {
  id: string;
  name: string;
}

export interface Spaceship {
  id: string;
  name: string;
  model: string;
  imageUrl: string;
  crewMembersCount: number;
  launchDate: Date;
  lastUpdated: Date;
  code: string;
  status: 'active' | 'inactive';
  maxDistance: number;
  maxCrewMembers: number;
}

