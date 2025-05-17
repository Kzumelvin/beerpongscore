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

export function matchmakingKO(tournamentID: string, scoreBoard: scoreBoard, gespielteSpiele: gameType[]) {

  let allMatches: gameType[] = []
  let finalScoreBoard: finaleScoreBoard = []
  let gamesCount: number = gespielteSpiele.filter(f => f.tournament == tournamentID && f.game_type == "Gruppenphase").length + 1
  let koSpiele: gameType[] = gespielteSpiele.filter(f => f.game_type != "Gruppenphase")

  console.log("Anzahl gespielter Spiele:", gamesCount)
  console.log(koSpiele)

  //Analysiere Scoreboard für Relegation
  if (scoreBoard.length == 6 || 7 || 9 || 10 || 11 || 12) {

    let relGames: gameType[] = []

    let games: gameType[] = []
      let gamesNumber = 0
      switch(scoreBoard.length){
        case 6:
          gamesNumber = 2
        case 7:
          gamesNumber = 3
        case 9:
          gamesNumber = 1
        case 10: 
          gamesNumber = 2
        case 11:
          gamesNumber = 3
        case 12:
          gamesNumber = 4
      }
      for(let i = 0; i < gamesNumber; i++){
        games.push({
          home_team: scoreBoard.at(0 - (gamesNumber*2 - i))?.team.id! || "not found",
          away_team: scoreBoard.at(0 - (i+1))?.team.id! || "not found",
          game_type: "Relegation",
          groupStage: "KO",
          game_number: gamesCount,
          tournament: tournamentID,
          expand: {
            home_team: scoreBoard.at(0 - (gamesNumber*2 - i))?.team || "not found",
            away_team: scoreBoard.at(0 - (i+1))?.team || "not found"

          }
        })
        gamesCount += 1
      }
      games.forEach(g => relGames.push(g))



    //Abklärung ob Spiel gespielt und Update finalScoreBoard
    //
    koSpiele.filter(f => f.game_type == "Relegation").forEach(kg => {

      console.log("KO:", kg)

      const index = relGames.findIndex(f => f.home_team == kg.home_team && f.away_team == kg.away_team)
      console.log("Index", index)
      const ausscheidung = relGames.splice(index, 1)

      ausscheidung.forEach(a => {
        if (a.home_cups! > a.away_cups!) {
          let scoreIndex = scoreBoard.findIndex(f => f.team.id == a.away_team)
          finalScoreBoard.push({
            team: scoreBoard[scoreIndex].team,
            games: scoreBoard[scoreIndex].games,
            points: scoreBoard[scoreIndex].posCups,
            avePoints: scoreBoard[scoreIndex].avePoints,
            posCups: scoreBoard[scoreIndex].posCups,
            negCups: scoreBoard[scoreIndex].negCups,
            diffCups: scoreBoard[scoreIndex].diffCups,
            groupIndex: index + 1,
            finalIndex: 0
          })
          scoreBoard.splice(scoreIndex, 1)
        }
        if (a.home_cups! < a.away_cups!) {
          let scoreIndex = scoreBoard.findIndex(f => f.team.id == a.home_team)
          finalScoreBoard.push({
            team: scoreBoard[scoreIndex].team,
            games: scoreBoard[scoreIndex].games,
            points: scoreBoard[scoreIndex].posCups,
            avePoints: scoreBoard[scoreIndex].avePoints,
            posCups: scoreBoard[scoreIndex].posCups,
            negCups: scoreBoard[scoreIndex].negCups,
            diffCups: scoreBoard[scoreIndex].diffCups,
            groupIndex: index + 1,
            finalIndex: 0
          })
          scoreBoard.splice(scoreIndex, 1)
        }
      })
    })


    //Hinzufügen zu allen Spielen
    //
    if (relGames.length > 0) {
      relGames.forEach(rl => allMatches.push(rl))
    }

    console.log("relGames:", relGames)
  }

  console.log("allMatches:", allMatches)

  return { allMatches, finalScoreBoard }

}
