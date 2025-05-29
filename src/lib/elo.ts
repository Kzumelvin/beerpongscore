import { gameType, pb, playerType, turnierType } from "./pocketbase"

type eloType = {
  turniernummer: number,
  values: number[],
  k_sum: number
}

export type eloListType = {
  player: playerType,
  elo: eloType[]
}

export type deltaType = {
  player_id: string,
  delta: number
}

export const Q = 700
export const K = 40
export const STARTELO = 1800

export function Ewert_A(eloA: number, eloB: number) {
  const RES2 = 1 / (1 + Math.pow(10, ((eloB - eloA) / Q)))
  return RES2
}

export function k_factor(elo: number) {
  if (elo < 1600) {
    return 90
  }
  if (elo < 2000) {
    return 70
  }

  return 30
}

export function new_Elo(elo_Eigen: number, elo_Gegner: number, punkte: number) {
  const k = k_factor(elo_Eigen)
  const Ewert = Ewert_A(elo_Eigen, elo_Gegner)
  return Math.round(k * (punkte - Ewert))
}


export function eloBerechnung(spieler: playerType[], games: gameType[], allTurniere: turnierType[], aktTurnier?: turnierType): eloListType[] {

  let deltaList: deltaType[] = []

  let eloList: eloListType[] = []
  //Spieler in eloList einfügen
  spieler.forEach(sp => {
    eloList.push({
      player: sp,
      elo: [{
        turniernummer: 0,
        values: [STARTELO],
        k_sum: 0
      }]
    })

    deltaList.push({
      player_id: sp.id!,
      delta: 0
    })
  })

  games.filter(f => aktTurnier ? f.expand.tournament.tournament_number <= aktTurnier.tournament_number : f).sort((a, b) => a.expand.tournament.tournament_number - b.expand.tournament.tournament_number || a.game_number - b.game_number).forEach(g => {

    //console.log(g.expand.home_team.team_name, "vs.", g.expand.away_team.team_name)

    let homepoints = 0
    let awaypoints = 0
    let turNumber = g.expand.tournament.tournament_number


    if (g.home_cups! > g.away_cups!) {
      homepoints = 1
    } else if (g.away_cups! > g.home_cups!) {
      awaypoints = 1
    } else {
      homepoints = 0.5
      awaypoints = 0.5
    }


    // Betrachte Heim und Gastteam wegen Fairness
    //
    //
    //

    //Heimteam
    g.expand.home_team.members.forEach((h: string) => {

      g.expand.away_team.members.forEach((a: string) => {
        let indexHeim = eloList.findIndex(f => f.player.id == h)
        let heimEloIndex = eloList[indexHeim].elo.findIndex(f => f.turniernummer == turNumber)
        let oldEloHeim = eloList[indexHeim].elo.at(heimEloIndex)!.values.at(-1)!


        let indexAway = eloList.findIndex(f => f.player.id == a)
        let awayEloIndex = eloList[indexAway].elo.findIndex(f => f.turniernummer == turNumber)
        let oldEloAway = eloList[indexAway].elo.at(awayEloIndex)!.values.at(-1)!



        let newEloDeltaHeim = new_Elo(oldEloHeim, oldEloAway, homepoints)
        let newEloDeltaAway = new_Elo(oldEloAway, oldEloHeim, awaypoints)


        deltaList.find(f => f.player_id == h)!.delta += newEloDeltaHeim
        deltaList.find(f => f.player_id == a)!.delta += newEloDeltaAway

        //        console.log(eloList[indexHeim].playerName, oldEloHeim, "-->", newEloHeim)
        //       console.log(eloList[indexAway].playerName, oldEloAway, "-->", newEloAway)




        //Es gibt noch keine Elo im aktuellen Turnier für Heim
      })

    })

    //Delta zu eloList
    //Heim
    g.expand.home_team.members.forEach((h: string) => {
      let indexHeim = eloList.findIndex(f => f.player.id == h)
      let heimEloIndex = eloList[indexHeim].elo.findIndex(f => f.turniernummer == turNumber)
      let oldEloHeim = eloList[indexHeim].elo.at(heimEloIndex)!.values.at(-1)!

      let deltaSum = deltaList.find(f => f.player_id == h)!.delta
      let newElo = oldEloHeim + deltaSum

      //      console.log(eloList[indexHeim].player.player_name, "Alte Elo", oldEloHeim, "Delta", deltaSum, "Neue Elo", newElo)

      if (heimEloIndex == -1) {

        eloList[indexHeim].elo.push({
          turniernummer: turNumber,
          values: [newElo],
          k_sum: k_factor(oldEloHeim)
        })

      } else {

        eloList[indexHeim].elo[heimEloIndex].values.push(newElo)
        eloList[indexHeim].elo[heimEloIndex].k_sum += k_factor(oldEloHeim)

      }

      //Reset Delta
      deltaList.find(f => f.player_id == h)!.delta = 0

    })

    //Gast
    //
    g.expand.away_team.members.forEach((a: string) => {
      let indexAway = eloList.findIndex(f => f.player.id == a)
      let awayEloIndex = eloList[indexAway].elo.findIndex(f => f.turniernummer == turNumber)
      let oldEloAway = eloList[indexAway].elo.at(awayEloIndex)!.values.at(-1)!

      let deltaSum = deltaList.find(f => f.player_id == a)!.delta
      let newElo = oldEloAway + deltaSum

      //      console.log(eloList[indexAway].player.player_name, "Alte Elo", oldEloAway, "Delta", deltaSum, "Neue Elo", newElo)

      if (awayEloIndex == -1) {
        eloList[indexAway].elo.push({
          turniernummer: turNumber,
          values: [newElo],
          k_sum: k_factor(oldEloAway)
        })
      } else {
        eloList[indexAway].elo[awayEloIndex].values.push(newElo)
        eloList[indexAway].elo[awayEloIndex].k_sum += k_factor(oldEloAway)
      }

      //Reset Delta

      deltaList.find(f => f.player_id == a)!.delta = 0

    })




  })

  eloList.forEach(p => {

    p.elo.sort((a, b) => a.turniernummer - b.turniernummer)

    allTurniere.filter(f => f.next == false).filter(f => aktTurnier ? f.tournament_number <= aktTurnier.tournament_number : f).sort((a, b) => a.tournament_number - b.tournament_number).forEach((t, idx) => {

      let eloIndex = p.elo.findIndex(f => f.turniernummer == t.tournament_number)

      if (eloIndex == -1) {

        let alteElo = p.elo.findLast(f => f.turniernummer < t.tournament_number)!.values.at(-1)!


        p.elo.push({
          turniernummer: t.tournament_number,
          values: [alteElo],
          k_sum: 0
        })

        p.elo.sort((a, b) => a.turniernummer - b.turniernummer)
      }

    })

  })


  return eloList
}
