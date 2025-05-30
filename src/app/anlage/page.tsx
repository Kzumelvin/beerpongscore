import React from "react";
import { pb } from "@/lib/pocketbase";
import { turnierType, gameType } from "@/lib/pocketbase";
import { writeFileSync } from "fs";
import { Buffer } from "node:buffer";
import { mkConfig, generateCsv, asString } from "export-to-csv";

type groupStage = {
  groupLetter: "KO" | "A" | "B" | "C" | "D" | "E";
  team: string;
};

type tournamentList = {
  tournament_number: number;
  groups: groupStage[];
};

type gamesOutput = {
  home_team: string;
  away_team: string;
  tournament_number: number;
  game_number: number;
  home_cups: number;
  away_cups: number;
  groupStage: "KO" | "A" | "B" | "C" | "D" | "E";
  gameType: any;
};

async function page() {
  let list: tournamentList[] = [];
  let gamesOutput: gamesOutput[] = [];

  const turnier: turnierType[] = await pb
    .collection("tournaments")
    .getFullList({
      expand: "groupA, groupB, groupC, groupD, groupE",
      sort: "-tournament_number",
    });

  const games: gameType[] = await pb.collection("games").getFullList({
    expand: "home_team, away_team, tournament",
    sort: "tournament.tournament_number",
  });

  turnier.forEach((t) => {
    list.push({
      tournament_number: t.tournament_number,
      groups: [],
    });
  });

  games.forEach((g) => {
    let listIndex = list.findIndex(
      (f) => f.tournament_number == g.expand.tournament.tournament_number,
    );

    if (
      !list[listIndex].groups.some(
        (f) => f.team == g.expand.home_team.team_name,
      )
    ) {
      list[listIndex].groups.push({
        groupLetter: g.groupStage,
        team: g.expand.home_team.team_name,
      });
    }

    if (
      !list[listIndex].groups.some(
        (f) => f.team == g.expand.away_team.team_name,
      )
    ) {
      list[listIndex].groups.push({
        groupLetter: g.groupStage,
        team: g.expand.away_team.team_name,
      });
    }
  });

  games.forEach((g) => {
    gamesOutput.push({
      home_team: g.expand.home_team.team_name,
      away_team: g.expand.away_team.team_name,
      home_cups: g.home_cups!,
      away_cups: g.away_cups!,
      groupStage: g.groupStage,
      gameType: g.game_type,
      tournament_number: g.expand.tournament.tournament_number,
      game_number: g.game_number,
    });
  });

  list.forEach((l) =>
    l.groups.sort((a, b) => a.groupLetter.localeCompare(b.groupLetter)),
  );

  gamesOutput.sort(
    (a, b) =>
      a.tournament_number - b.tournament_number ||
      a.game_number - b.game_number,
  );

  const csvConfig = mkConfig({ useKeysAsHeaders: true });

  const csv = generateCsv(csvConfig)(gamesOutput);
  const csvBuffer = new Uint8Array(Buffer.from(asString(csv)));

  function generateMatches(teamCount: number) {
    const matches: string[] = [];

    for (let i = 0; i < teamCount; i++) {
      for (let j = i + 1; j <= teamCount; j++) {
        matches.push(
          `{
home_team: group[${i}].id!, 
away_team: group[${j}].id!, 
game_type: "Gruppenphase", 
groupStage: letter, 
game_number: 0, 
expand: { 
home_team: group[${i}], 
away_team: group[${j}]
}}`,
        );
      }
    }
    return matches;
  }

  // writeFileSync("./output/test.txt", JSON.stringify(list, null, 2));

  //  writeFileSync("./output/games.csv", csvBuffer);
  writeFileSync(
    "./output/matches.txt",
    JSON.stringify(generateMatches(6), null, 2),
  );
  console.log(JSON.stringify(list, null, 2));
  return <div></div>;
}

export default page;
