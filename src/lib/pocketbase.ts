import PocketBase from "pocketbase";

export const pb = new PocketBase("https://pb1.kevinhaberl.com");
pb.autoCancellation(false);

export type gameType = {
  id?: string,
  home_team: string,
  away_team: string,
  home_cups?: number,
  away_cups?: number,
  game_type: "Gruppenphase" | "Relegation" | "Achtelfinale" | "Viertelfinale" | "Halbfinale" | "Spiel um Platz 3" | "Finale"
  groupStage: "KO" | "A" | "B" | "C" | "D" | "E"
  tournament?: string,
  game_number: number,
  expand: any
}

export type playerType = {
  id?: string,
  player_name: string,
  back_number: string | undefined,
  elo: number,
  active: boolean,
  picture_url: string,
  bio: string,
  expand?: any
}

export type teamType = {
  id?: string,
  team_name: string,
  members: playerType[]
  expand?: any
}

export type turnierType = {
  id?: string,
  tournament_name: string,
  tournament_number: number,
  tournament_participants: number,
  tournament_date?: Date,
  groupA: teamType[],
  groupB: teamType[],
  groupC: teamType[],
  groupD: teamType[],
  groupE: teamType[],
  expand: any,
  next: boolean
}

