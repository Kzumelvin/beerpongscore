import { threadId } from "node:worker_threads";
import { teamType, gameType, turnierType } from "./pocketbase";

export type score = {
  team: teamType,
  points: number,
  avePoints: number,
  games: number,
  posCups: number,
  negCups: number,
  diffCups: number
}

export type scoreBoard = score[]

export type finalsScore = score & { groupIndex: number, finalIndex: number }

export type finaleScoreBoard = finalsScore[]

export function getScoreBoard(spiele: gameType[], teams: teamType[]): scoreBoard {
  let st: scoreBoard = []

  teams.forEach(t => {

    //Insert Home
    if (st.some(f => f.team.id == t.id!)) {

    } else {
      st.push({
        team: t,
        points: 0,
        avePoints: 0,
        games: 0,
        posCups: 0,
        negCups: 0,
        diffCups: 0
      })

    }

  })


  spiele.filter(f => f.game_type == "Gruppenphase").forEach(g => {

    const home = g.expand.home_team
    const away = g.expand.away_team
    const hCups = g.home_cups!
    const aCups = g.away_cups!
    let hPoints = 0
    let aPoints = 0

    hPoints = hCups > aCups ? 3 : hCups == aCups ? 1 : 0
    aPoints = aCups > hCups ? 3 : aCups == hCups ? 1 : 0

    if (st.some(f => f.team.id == home.id!)) {
      let indexHome = st.findIndex(f => f.team.id! == home.id!)
      st[indexHome].points += hPoints
      st[indexHome].games += 1
      st[indexHome].avePoints = st[indexHome].points / st[indexHome].games
      st[indexHome].posCups += hCups
      st[indexHome].negCups += aCups
      st[indexHome].diffCups = st[indexHome].posCups - st[indexHome].negCups


    }

    if (st.some(f => f.team.id == away.id)) {
      let index = st.findIndex(f => f.team.id! == away.id!)
      st[index].points += aPoints
      st[index].games += 1
      st[index].avePoints = st[index].points / st[index].games
      st[index].posCups += aCups
      st[index].negCups += hCups
      st[index].diffCups = st[index].posCups - st[index].negCups


    }



  })

  st.sort((a, b) => b.avePoints - a.avePoints || b.diffCups - a.diffCups || b.posCups - a.posCups || a.negCups - b.negCups)

  return st


}


//Matcherstellung

export function matchPerGroup(group: teamType[], letter: "KO" | "A" | "B" | "C" | "D" | "E") {

  let allGames: gameType[] = []

  if (group.length == 3) {

    allGames = [
      {
        home_team: group[0].id!,
        away_team: group[1].id!,
        game_type: "Gruppenphase",
        groupStage: letter,
        game_number: 0,
        expand: {
          home_team: group[0],
          away_team: group[1]
        }
      }, {
        home_team: group[1].id!,
        away_team: group[2].id!,
        game_type: "Gruppenphase",
        groupStage: letter,
        game_number: 0,
        expand: {
          home_team: group[1],
          away_team: group[2]
        }

      }, {
        home_team: group[0].id!,
        away_team: group[2].id!,
        game_type: "Gruppenphase",
        groupStage: letter,
        game_number: 0,
        expand: {
          home_team: group[0],
          away_team: group[2]
        }

      }, {
        home_team: group[1].id!,
        away_team: group[0].id!,
        game_type: "Gruppenphase",
        groupStage: letter,
        game_number: 0,
        expand: {
          home_team: group[1],
          away_team: group[0]
        }

      }, {
        home_team: group[2].id!,
        away_team: group[1].id!,
        game_type: "Gruppenphase",
        groupStage: letter,
        game_number: 0,
        expand: {
          home_team: group[2],
          away_team: group[1]
        }

      }, {
        home_team: group[2].id!,
        away_team: group[0].id!,
        game_type: "Gruppenphase",
        groupStage: letter,
        game_number: 0,
        expand: {
          home_team: group[2],
          away_team: group[0]
        }

      }

    ]

  }

  if (group.length == 4) {
    allGames = [
      {
        home_team: group[0].id!,
        away_team: group[1].id!,
        game_type: "Gruppenphase",
        groupStage: letter,
        game_number: 0,
        expand: {
          home_team: group[0],
          away_team: group[1]
        }

      }, {
        home_team: group[2].id!,
        away_team: group[3].id!,
        game_type: "Gruppenphase",
        groupStage: letter,
        game_number: 0,
        expand: {
          home_team: group[2],
          away_team: group[3]
        }

      }, {
        home_team: group[0].id!,
        away_team: group[2].id!,
        game_type: "Gruppenphase",
        groupStage: letter,
        game_number: 0,
        expand: {
          home_team: group[0],
          away_team: group[2]
        }

      }, {
        home_team: group[1].id!,
        away_team: group[3].id!,
        game_type: "Gruppenphase",
        groupStage: letter,
        game_number: 0,
        expand: {
          home_team: group[1],
          away_team: group[3]
        }

      }, {
        home_team: group[1].id!,
        away_team: group[2].id!,
        game_type: "Gruppenphase",
        groupStage: letter,
        game_number: 0,
        expand: {
          home_team: group[1],
          away_team: group[2]
        }

      }, {
        home_team: group[3].id!,
        away_team: group[0].id!,
        game_type: "Gruppenphase",
        groupStage: letter,
        game_number: 0,
        expand: {
          home_team: group[3],
          away_team: group[0]
        }

      }

    ]
  }

  return allGames

}

export function matchmakingGroup(tournamentID: string, groupA: teamType[], groupB?: teamType[], groupC?: teamType[], groupD?: teamType[], groupE?: teamType[]): gameType[] {

  let allMatches: gameType[] = []
  let a: gameType[] = []
  let b: gameType[] = []
  let c: gameType[] = []
  let d: gameType[] = []
  let e: gameType[] = []
  let countTeams = 0
  let gamesCount = 1


  if (groupA.length == 3 || groupA.length == 4) {
    a = matchPerGroup(groupA, "A")
    countTeams += a.length
  }

  if (groupB?.length == 3 || groupB?.length == 4) {
    b = matchPerGroup(groupB, "B")
    countTeams += b.length
  }

  if (groupC?.length == 3 || groupC?.length == 4) {
    c = matchPerGroup(groupC, "C")
    countTeams += c.length
  }
  if (groupD?.length == 3 || groupD?.length == 4) {
    d = matchPerGroup(groupD, "D")
    countTeams += d.length

  }
  if (groupE?.length == 3 || groupE?.length == 4) {
    e = matchPerGroup(groupE, "E")
    countTeams += e.length
  }

  for (let i = 0; i < 6; i++) {
    if (a.length > 0) {
      a[i].game_number = gamesCount
      a[i].tournament = tournamentID
      gamesCount += 1
      allMatches.push(a[i])
    }
    if (b.length > 0) {
      b[i].game_number = gamesCount
      b[i].tournament = tournamentID
      gamesCount += 1
      allMatches.push(b[i])
    }
    if (c.length > 0) {
      c[i].game_number = gamesCount
      c[i].tournament = tournamentID
      gamesCount += 1
      allMatches.push(c[i])
    }
    if (d.length > 0) {
      d[i].game_number = gamesCount
      d[i].tournament = tournamentID
      gamesCount += 1
      allMatches.push(d[i])
    }
    if (e.length > 0) {
      e[i].game_number = gamesCount
      e[i].tournament = tournamentID
      gamesCount += 1
      allMatches.push(e[i])
    }
  }

  return allMatches
}

export function matchmakingKO(tournamentID: string, groupScoreBoard: scoreBoard, gespielteSpiele: gameType[]) {

  let allMatches: gameType[] = []
  let finalScoreBoard: finaleScoreBoard = []
  let gamesCount: number = gespielteSpiele.filter(f => f.tournament == tournamentID && f.game_type == "Gruppenphase").length + 1
  let koSpiele: gameType[] = gespielteSpiele.filter(f => f.game_type != "Gruppenphase")
  let scoreBoard: scoreBoard = []

  groupScoreBoard.forEach(t => scoreBoard.push(t))

  console.log("Anzahl gespielter Spiele:", gamesCount)
  console.log("Bisher gespielte KO-Spiele:", koSpiele.length)

  console.log("Größe Scoreboard", scoreBoard.length)

  //Analysiere Scoreboard für Relegation
  if (scoreBoard.length == 6 || 7 || 9 || 10 || 11 || 12) {

    let relGames: gameType[] = []

    let games: gameType[] = []
    let gamesNumber = 0
    if (scoreBoard.length == 9) {
      gamesNumber = 1
    } else if (scoreBoard.length == 6 || scoreBoard.length == 10) {
      gamesNumber = 2
    } else if (scoreBoard.length == 7 || scoreBoard.length == 11) {
      gamesNumber = 3
    } else if (scoreBoard.length == 12) {
      gamesNumber = 4
    }

    console.log("Anzahl Spiele:", gamesNumber, "Größe Gesamttabelle", scoreBoard.length)

    for (let i = 0; i < gamesNumber; i++) {
      let c = i + 1
      games.push({
        home_team: scoreBoard.at(-gamesNumber * 2 + i)?.team.id! || "not found",
        away_team: scoreBoard.at(-c)?.team.id! || "not found",
        game_type: "Relegation",
        groupStage: "KO",
        game_number: gamesCount,
        tournament: tournamentID,
        expand: {
          home_team: scoreBoard.at(-gamesNumber * 2 + i)?.team || "not found",
          away_team: scoreBoard.at(-c)?.team || "not found"

        }
      })
      gamesCount += 1
    }
    games.forEach(g => relGames.push(g))



    //Abklärung ob Spiel gespielt und Update finalScoreBoard
    //
    koSpiele.filter(f => f.game_type == "Relegation").forEach(kg => {

      console.log("Begegnung Relegation")
      console.log(kg.expand.home_team.team_name, " vs. ", kg.expand.away_team.team_name)

      const index = relGames.findIndex(f => f.home_team == kg.home_team && f.away_team == kg.away_team)
      console.log("Index", index)
      relGames.splice(index, 1)

      // Übertrag von GruppenTabelel in Endtabelle
      if (kg.home_cups! > kg.away_cups!) {
        let scoreIndex = scoreBoard.findIndex(f => f.team.id == kg.away_team)

        finalScoreBoard.push({
          team: scoreBoard[scoreIndex].team,
          games: scoreBoard[scoreIndex].games,
          points: scoreBoard[scoreIndex].posCups,
          avePoints: scoreBoard[scoreIndex].avePoints,
          posCups: scoreBoard[scoreIndex].posCups,
          negCups: scoreBoard[scoreIndex].negCups,
          diffCups: scoreBoard[scoreIndex].diffCups,
          groupIndex: groupScoreBoard.findIndex(f => f.team.id == kg.away_team) + 1,
          finalIndex: 0
        })
        scoreBoard.splice(scoreIndex, 1)
      }
      if (kg.home_cups! < kg.away_cups!) {
        let scoreIndex = scoreBoard.findIndex(f => f.team.id == kg.home_team)
        finalScoreBoard.push({
          team: scoreBoard[scoreIndex].team,
          games: scoreBoard[scoreIndex].games,
          points: scoreBoard[scoreIndex].posCups,
          avePoints: scoreBoard[scoreIndex].avePoints,
          posCups: scoreBoard[scoreIndex].posCups,
          negCups: scoreBoard[scoreIndex].negCups,
          diffCups: scoreBoard[scoreIndex].diffCups,
          groupIndex: groupScoreBoard.findIndex(f => f.team.id == kg.home_team) + 1,
          finalIndex: 0
        })

        console.log("Ausscheidungsindex Relegation", scoreIndex)
        scoreBoard.splice(scoreIndex, 1)
      }
    })

    finalScoreBoard.sort((a, b) => b.finalIndex - a.finalIndex || a.groupIndex - b.groupIndex)


    //Hinzufügen zu allen Spielen
    //
    if (relGames.length > 0) {
      relGames.forEach(rl => allMatches.push(rl))
    }

    console.log("Verbleibende Relegationsspiele: ", relGames.length)
  }

  console.log("Größe Scoreboard nach Relegation", scoreBoard.length)

  //Analysiere Viertelfinale

  if (scoreBoard.length == 8) {

    let viertelGames: gameType[] = []

    let gamesNumber = 4

    console.log("Anzahl Spiele:", gamesNumber, "Größe Gesamttabelle", scoreBoard.length)

    for (let i = 0; i < gamesNumber; i++) {
      let c = i + 1
      viertelGames.push({
        home_team: scoreBoard.at(-gamesNumber * 2 + i)?.team.id! || "not found",
        away_team: scoreBoard.at(-c)?.team.id! || "not found",
        game_type: "Viertelfinale",
        groupStage: "KO",
        game_number: gamesCount,
        tournament: tournamentID,
        expand: {
          home_team: scoreBoard.at(-gamesNumber * 2 + i)?.team || "not found",
          away_team: scoreBoard.at(-c)?.team || "not found"

        }
      })
      console.log()
      gamesCount += 1
    }




    //Abklärung ob Spiel gespielt und Update finalScoreBoard
    //
    koSpiele.filter(f => f.game_type == "Viertelfinale").forEach(kg => {

      console.log("KO:", kg)

      const index = viertelGames.findIndex(f => f.home_team == kg.home_team && f.away_team == kg.away_team)
      console.log("Index", index)
      viertelGames.splice(index, 1)


      console.log("Gruppenphase", groupScoreBoard)

      // Übertrag von GruppenTabelel in Endtabelle
      if (kg.home_cups! > kg.away_cups!) {
        let scoreIndex = scoreBoard.findIndex(f => f.team.id == kg.away_team)

        finalScoreBoard.push({
          team: scoreBoard[scoreIndex].team,
          games: scoreBoard[scoreIndex].games,
          points: scoreBoard[scoreIndex].posCups,
          avePoints: scoreBoard[scoreIndex].avePoints,
          posCups: scoreBoard[scoreIndex].posCups,
          negCups: scoreBoard[scoreIndex].negCups,
          diffCups: scoreBoard[scoreIndex].diffCups,
          groupIndex: groupScoreBoard.findIndex(f => f.team.id == kg.away_team) + 1,
          finalIndex: 1
        })
        scoreBoard.splice(scoreIndex, 1)
      }
      if (kg.home_cups! < kg.away_cups!) {
        let scoreIndex = scoreBoard.findIndex(f => f.team.id == kg.home_team)
        finalScoreBoard.push({
          team: scoreBoard[scoreIndex].team,
          games: scoreBoard[scoreIndex].games,
          points: scoreBoard[scoreIndex].posCups,
          avePoints: scoreBoard[scoreIndex].avePoints,
          posCups: scoreBoard[scoreIndex].posCups,
          negCups: scoreBoard[scoreIndex].negCups,
          diffCups: scoreBoard[scoreIndex].diffCups,
          groupIndex: groupScoreBoard.findIndex(f => f.team.id == kg.home_team) + 1,
          finalIndex: 1
        })

        console.log("Ausscheidungsindex Viertelfinale", scoreIndex)
        scoreBoard.splice(scoreIndex, 1)
      }
    })

    finalScoreBoard.sort((a, b) => b.finalIndex - a.finalIndex || a.groupIndex - b.groupIndex)


    //Hinzufügen zu allen Spielen
    //
    if (viertelGames.length > 0) {
      viertelGames.forEach(rl => allMatches.push(rl))
    }

    console.log("Viertelfinale Spiele:", viertelGames)

  }

  console.log("Größe Scoreboard nach Viertelfinale", scoreBoard.length)


  // HelperScoreboard für Spiel um Platz 3
  let ThreeScoreBoard: finaleScoreBoard = []

  //Analyse Halbfinale
  if (scoreBoard.length == 4) {
    let halbGames: gameType[] = []

    let gamesNumber = 2

    console.log("Anzahl Spiele:", gamesNumber, "Größe Gesamttabelle", scoreBoard.length)

    for (let i = 0; i < gamesNumber; i++) {
      let c = i + 1
      halbGames.push({
        home_team: scoreBoard.at(-gamesNumber * 2 + i)?.team.id! || "not found",
        away_team: scoreBoard.at(-c)?.team.id! || "not found",
        game_type: "Halbfinale",
        groupStage: "KO",
        game_number: gamesCount,
        tournament: tournamentID,
        expand: {
          home_team: scoreBoard.at(-gamesNumber * 2 + i)?.team || "not found",
          away_team: scoreBoard.at(-c)?.team || "not found"

        }
      })
      gamesCount += 1
    }




    //Abklärung ob Spiel gespielt und Update ThreeScoreBoard 
    //
    koSpiele.filter(f => f.game_type == "Halbfinale").forEach(kg => {

      console.log("Begegnung Relegation")
      console.log(kg.expand.home_team.team_name, " vs. ", kg.expand.away_team.team_name)

      const index = halbGames.findIndex(f => f.home_team == kg.home_team && f.away_team == kg.away_team)
      halbGames.splice(index, 1)

      // Übertrag von GruppenTabelel in Dreiertabelle 
      if (kg.home_cups! > kg.away_cups!) {
        let scoreIndex = scoreBoard.findIndex(f => f.team.id == kg.away_team)

        ThreeScoreBoard.push({
          team: scoreBoard[scoreIndex].team,
          games: scoreBoard[scoreIndex].games,
          points: scoreBoard[scoreIndex].posCups,
          avePoints: scoreBoard[scoreIndex].avePoints,
          posCups: scoreBoard[scoreIndex].posCups,
          negCups: scoreBoard[scoreIndex].negCups,
          diffCups: scoreBoard[scoreIndex].diffCups,
          groupIndex: groupScoreBoard.findIndex(f => f.team.id == kg.away_team) + 1,
          finalIndex: 2
        })
        scoreBoard.splice(scoreIndex, 1)
      }
      if (kg.home_cups! < kg.away_cups!) {
        let scoreIndex = scoreBoard.findIndex(f => f.team.id == kg.home_team)
        ThreeScoreBoard.push({
          team: scoreBoard[scoreIndex].team,
          games: scoreBoard[scoreIndex].games,
          points: scoreBoard[scoreIndex].posCups,
          avePoints: scoreBoard[scoreIndex].avePoints,
          posCups: scoreBoard[scoreIndex].posCups,
          negCups: scoreBoard[scoreIndex].negCups,
          diffCups: scoreBoard[scoreIndex].diffCups,
          groupIndex: groupScoreBoard.findIndex(f => f.team.id == kg.home_team) + 1,
          finalIndex: 2
        })

        console.log("Ausscheidungsindex Halbfinale", scoreIndex)
        scoreBoard.splice(scoreIndex, 1)
      }
    })

    ThreeScoreBoard.sort((a, b) => b.finalIndex - a.finalIndex || a.groupIndex - b.groupIndex)


    //Hinzufügen zu allen Spielen
    //
    if (halbGames.length > 0) {
      halbGames.forEach(rl => allMatches.push(rl))
    }

    console.log("Halbfinale Spiele:", halbGames.length)
  }

  console.log("Größe Scoreboard nach Halbfinale", scoreBoard.length)

  console.log("Dreier ScoreBoard", ThreeScoreBoard)

  //Analyse Spiel um Platz 3
  if (ThreeScoreBoard.length == 2) {


    let threeGames: gameType[] = []

    let gamesNumber = 1

    console.log("Anzahl Spiele:", gamesNumber, "Größe DreierScore", ThreeScoreBoard.length)

    for (let i = 0; i < gamesNumber; i++) {
      let c = i + 1
      threeGames.push({
        home_team: ThreeScoreBoard.at(-gamesNumber * 2 + i)?.team.id! || "not found",
        away_team: ThreeScoreBoard.at(-c)?.team.id! || "not found",
        game_type: "Spiel um Platz 3",
        groupStage: "KO",
        game_number: gamesCount,
        tournament: tournamentID,
        expand: {
          home_team: ThreeScoreBoard.at(-gamesNumber * 2 + i)?.team || "not found",
          away_team: ThreeScoreBoard.at(-c)?.team || "not found"

        }
      })
      console.log()
      gamesCount += 1
    }




    //Abklärung ob Spiel gespielt und Update finalScoreBoard
    //
    koSpiele.filter(f => f.game_type == "Spiel um Platz 3").forEach(kg => {

      console.log("KO:", kg)

      const index = threeGames.findIndex(f => f.home_team == kg.home_team && f.away_team == kg.away_team)
      console.log("Index", index)
      threeGames.splice(index, 1)


      console.log("Gruppenphase", groupScoreBoard)

      console.log("ThreeScoreBoard", ThreeScoreBoard)

      // Übertrag von GruppenTabelel in Endtabelle
      if (kg.home_cups! > kg.away_cups!) {
        let scoreIndex = ThreeScoreBoard.findIndex(f => f.team.id == kg.away_team)

        finalScoreBoard.push({
          team: ThreeScoreBoard[scoreIndex].team,
          games: ThreeScoreBoard[scoreIndex].games,
          points: ThreeScoreBoard[scoreIndex].posCups,
          avePoints: ThreeScoreBoard[scoreIndex].avePoints,
          posCups: ThreeScoreBoard[scoreIndex].posCups,
          negCups: ThreeScoreBoard[scoreIndex].negCups,
          diffCups: ThreeScoreBoard[scoreIndex].diffCups,
          groupIndex: groupScoreBoard.findIndex(f => f.team.id == kg.away_team) + 1,
          finalIndex: 2
        })

        ThreeScoreBoard.splice(scoreIndex, 1)

        let scoreIndexWin = ThreeScoreBoard.findIndex(f => f.team.id == kg.home_team)
        finalScoreBoard.push({
          team: ThreeScoreBoard[scoreIndexWin].team,
          games: ThreeScoreBoard[scoreIndexWin].games,
          points: ThreeScoreBoard[scoreIndexWin].posCups,
          avePoints: ThreeScoreBoard[scoreIndexWin].avePoints,
          posCups: ThreeScoreBoard[scoreIndexWin].posCups,
          negCups: ThreeScoreBoard[scoreIndexWin].negCups,
          diffCups: ThreeScoreBoard[scoreIndexWin].diffCups,
          groupIndex: groupScoreBoard.findIndex(f => f.team.id == kg.home_team) + 1,
          finalIndex: 3
        })

        ThreeScoreBoard.splice(scoreIndexWin, 1)

      }
      if (kg.home_cups! < kg.away_cups!) {
        let scoreIndex = ThreeScoreBoard.findIndex(f => f.team.id == kg.home_team)
        finalScoreBoard.push({
          team: ThreeScoreBoard[scoreIndex].team,
          games: ThreeScoreBoard[scoreIndex].games,
          points: ThreeScoreBoard[scoreIndex].posCups,
          avePoints: ThreeScoreBoard[scoreIndex].avePoints,
          posCups: ThreeScoreBoard[scoreIndex].posCups,
          negCups: ThreeScoreBoard[scoreIndex].negCups,
          diffCups: ThreeScoreBoard[scoreIndex].diffCups,
          groupIndex: groupScoreBoard.findIndex(f => f.team.id == kg.home_team) + 1,
          finalIndex: 2
        })

        ThreeScoreBoard.splice(scoreIndex, 1)

        let scoreIndexWin = ThreeScoreBoard.findIndex(f => f.team.id == kg.away_team)
        finalScoreBoard.push({
          team: ThreeScoreBoard[scoreIndexWin].team,
          games: ThreeScoreBoard[scoreIndexWin].games,
          points: ThreeScoreBoard[scoreIndexWin].posCups,
          avePoints: ThreeScoreBoard[scoreIndexWin].avePoints,
          posCups: ThreeScoreBoard[scoreIndexWin].posCups,
          negCups: ThreeScoreBoard[scoreIndexWin].negCups,
          diffCups: ThreeScoreBoard[scoreIndexWin].diffCups,
          groupIndex: groupScoreBoard.findIndex(f => f.team.id == kg.away_team) + 1,
          finalIndex: 3
        })

        ThreeScoreBoard.splice(scoreIndexWin, 1)

        console.log("Ausscheidungsindex Spiel um Platz 3", scoreIndex)

      }
    })

    finalScoreBoard.sort((a, b) => b.finalIndex - a.finalIndex || a.groupIndex - b.groupIndex)


    //Hinzufügen zu allen Spielen
    //
    if (threeGames.length > 0) {
      threeGames.forEach(rl => allMatches.push(rl))
    }

    console.log("Spiel um Platu 3 Spiele:", threeGames)


  }

  //Analyse Finale
  console.log("Größe Scoreboard vor Finale", scoreBoard.length)

  if (scoreBoard.length == 2 && ThreeScoreBoard.length == 0) {
    let finalGames: gameType[] = []

    let gamesNumber = 1

    console.log("Anzahl Spiele:", gamesNumber, "Größe Gesamttabelle", scoreBoard.length)

    for (let i = 0; i < gamesNumber; i++) {
      let c = i + 1
      finalGames.push({
        home_team: scoreBoard.at(-gamesNumber * 2 + i)?.team.id! || "not found",
        away_team: scoreBoard.at(-c)?.team.id! || "not found",
        game_type: "Finale",
        groupStage: "KO",
        game_number: gamesCount,
        tournament: tournamentID,
        expand: {
          home_team: scoreBoard.at(-gamesNumber * 2 + i)?.team || "not found",
          away_team: scoreBoard.at(-c)?.team || "not found"

        }
      })
      console.log()
      gamesCount += 1
    }




    //Abklärung ob Spiel gespielt und Update finalScoreBoard
    //
    koSpiele.filter(f => f.game_type == "Finale").forEach(kg => {

      console.log("KO:", kg)

      const index = finalGames.findIndex(f => f.home_team == kg.home_team && f.away_team == kg.away_team)
      console.log("Index", index)
      finalGames.splice(index, 1)


      console.log("Gruppenphase", groupScoreBoard)

      // Übertrag von GruppenTabelel in Endtabelle
      if (kg.home_cups! > kg.away_cups!) {
        let scoreIndex = scoreBoard.findIndex(f => f.team.id == kg.away_team)

        finalScoreBoard.push({
          team: scoreBoard[scoreIndex].team,
          games: scoreBoard[scoreIndex].games,
          points: scoreBoard[scoreIndex].posCups,
          avePoints: scoreBoard[scoreIndex].avePoints,
          posCups: scoreBoard[scoreIndex].posCups,
          negCups: scoreBoard[scoreIndex].negCups,
          diffCups: scoreBoard[scoreIndex].diffCups,
          groupIndex: groupScoreBoard.findIndex(f => f.team.id == kg.away_team) + 1,
          finalIndex: 4
        })
        scoreBoard.splice(scoreIndex, 1)

        let scoreIndexWin = scoreBoard.findIndex(f => f.team.id == kg.home_team)
        finalScoreBoard.push({
          team: scoreBoard[scoreIndexWin].team,
          games: scoreBoard[scoreIndexWin].games,
          points: scoreBoard[scoreIndexWin].posCups,
          avePoints: scoreBoard[scoreIndexWin].avePoints,
          posCups: scoreBoard[scoreIndexWin].posCups,
          negCups: scoreBoard[scoreIndexWin].negCups,
          diffCups: scoreBoard[scoreIndexWin].diffCups,
          groupIndex: groupScoreBoard.findIndex(f => f.team.id == kg.home_team) + 1,
          finalIndex: 5
        })

      }
      if (kg.home_cups! < kg.away_cups!) {
        let scoreIndex = scoreBoard.findIndex(f => f.team.id == kg.home_team)

        finalScoreBoard.push({
          team: scoreBoard[scoreIndex].team,
          games: scoreBoard[scoreIndex].games,
          points: scoreBoard[scoreIndex].posCups,
          avePoints: scoreBoard[scoreIndex].avePoints,
          posCups: scoreBoard[scoreIndex].posCups,
          negCups: scoreBoard[scoreIndex].negCups,
          diffCups: scoreBoard[scoreIndex].diffCups,
          groupIndex: groupScoreBoard.findIndex(f => f.team.id == kg.home_team) + 1,
          finalIndex: 4
        })

        console.log("Ausscheidungsindex Finale", scoreIndex)
        scoreBoard.splice(scoreIndex, 1)

        let scoreIndexWin = scoreBoard.findIndex(f => f.team.id == kg.away_team)
        finalScoreBoard.push({
          team: scoreBoard[scoreIndexWin].team,
          games: scoreBoard[scoreIndexWin].games,
          points: scoreBoard[scoreIndexWin].posCups,
          avePoints: scoreBoard[scoreIndexWin].avePoints,
          posCups: scoreBoard[scoreIndexWin].posCups,
          negCups: scoreBoard[scoreIndexWin].negCups,
          diffCups: scoreBoard[scoreIndexWin].diffCups,
          groupIndex: groupScoreBoard.findIndex(f => f.team.id == kg.away_team) + 1,
          finalIndex: 5
        })
      }
    })

    finalScoreBoard.sort((a, b) => b.finalIndex - a.finalIndex || a.groupIndex - b.groupIndex)


    //Hinzufügen zu allen Spielen
    //
    if (finalGames.length > 0) {
      finalGames.forEach(rl => allMatches.push(rl))
    }

    console.log("Final Spiele:", finalGames)
  }

  console.log("Größe Scoreboard nach Finale", scoreBoard.length)


  console.log("Ausgabe:", allMatches)

  return { allMatches, finalScoreBoard }

}
