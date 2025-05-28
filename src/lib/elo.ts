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
  return Math.round(elo_Eigen + k * (punkte - Ewert))
}


export function eloBerechnung(spieler: playerType[], games: gameType[], allTurniere: turnierType[]): eloListType[] {

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
  })

  games.sort((a, b) => a.expand.tournament.tournament_number - b.expand.tournament.tournament_number || a.game_number - b.game_number).forEach(g => {


    let homepoints = 0
    let awaypoints = 0
    let turNumber = g.expand.tournament.tournament_number
    let eloDiffGast = 0


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

    //Heimteam
    g.expand.home_team.members.forEach((h: string) => {

      g.expand.away_team.members.forEach((a: string) => {
        let indexHeim = eloList.findIndex(f => f.player.id == h)
        let heimEloIndex = eloList[indexHeim].elo.findIndex(f => f.turniernummer == turNumber)
        let oldEloHeim = eloList[indexHeim].elo.at(heimEloIndex)!.values.at(-1)!

        let indexAway = eloList.findIndex(f => f.player.id == a)



        let awayEloIndex = eloList[indexAway].elo.findIndex(f => f.turniernummer == turNumber)


        let oldEloAway = eloList[indexAway].elo.at(awayEloIndex)!.values.at(-1)!



        let newEloHeim = new_Elo(oldEloHeim, oldEloAway, homepoints)
        let newEloAway = new_Elo(oldEloAway, oldEloHeim, awaypoints)

        //        console.log(eloList[indexHeim].playerName, oldEloHeim, "-->", newEloHeim)
        //       console.log(eloList[indexAway].playerName, oldEloAway, "-->", newEloAway)

        if (heimEloIndex == -1) {

          eloList[indexHeim].elo.push({
            turniernummer: turNumber,
            values: [newEloHeim],
            k_sum: k_factor(oldEloHeim)
          })

        } else {

          eloList[indexHeim].elo[heimEloIndex].values.push(newEloHeim)
          eloList[indexHeim].elo[heimEloIndex].k_sum += k_factor(oldEloHeim)

        }

        if (awayEloIndex == -1) {
          eloList[indexAway].elo.push({
            turniernummer: turNumber,
            values: [newEloAway],
            k_sum: k_factor(oldEloAway)
          })
        } else {
          eloList[indexAway].elo[awayEloIndex].values.push(newEloAway)
          eloList[indexAway].elo[awayEloIndex].k_sum += k_factor(oldEloAway)
        }

        //Es gibt noch keine Elo im aktuellen Turnier für Heim
      })


    })


    //Heim und Gastteam Elo speichern

    console.log("NACHBERECHNUNG START")

  })

  eloList.forEach(p => {

    p.elo.sort((a, b) => a.turniernummer - b.turniernummer)

    allTurniere.filter(f => f.next == false).sort((a, b) => a.tournament_number - b.tournament_number).forEach((t, idx) => {

      let eloIndex = p.elo.findIndex(f => f.turniernummer == t.tournament_number)

      if (eloIndex == -1) {

        let alteElo = p.elo.findLast(f => f.turniernummer < t.tournament_number)!.values.at(-1)!

        console.log(p.player.player_name, p.elo)


        p.elo.push({
          turniernummer: t.tournament_number,
          values: [alteElo],
          k_sum: 0
        })

        p.elo.sort((a, b) => a.turniernummer - b.turniernummer)
      }

    })

  })


  console.log("NACHBRECHNUNG ENDE")
  return eloList
}
