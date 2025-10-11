import { gameType, pb, playerType, turnierType } from "./pocketbase"

type eloType = {
  turniernummer: number,
  values: number[],
  k_sum: number,
  offset: number,
  offsetSum: number,
  rangliste: number,
  ranglisteDiff: number,
}

export type eloListType = {
  player: playerType,
  elo: eloType[],
  turs: number,
  offTurs: number,
  offSum?: number
  offTursSum?: number,
}

export type deltaType = {
  player_id: string,
  delta: number
}

export const Q = 700
export const K = 40
export const STARTELO = 1800
export const MAX_KORREKTUR = 1200

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

export function elo_korrektur(off: number, elo: number, teilnahmen: number, aktiv: boolean) {
  let offset = 0
  let korrekturElo = 0

  if (teilnahmen == 0 || aktiv == false) {
    return { korrekturElo: elo, offset: 0 }
  }

  if (off >= 6) {
    offset = 300
  } else if (off == 5) {
    offset = 200
  } else if (off == 4) {
    offset = 150
  } else if (off == 3) {
    offset = 100
  } else if (off == 2) {
    offset = 50
  } else if (off == 1) {
    offset = 25
  } else { offset = 0 }


  if (elo > 2000) {

    offset = Math.round(offset * 2)
  }

  if (elo < MAX_KORREKTUR) {
    return { korrekturElo: elo, offset: 0 }
  } else if (elo - offset < MAX_KORREKTUR) {
    return { korrekturElo: MAX_KORREKTUR, offset: elo - MAX_KORREKTUR }
  }


  korrekturElo = elo - offset > MAX_KORREKTUR ? elo - offset : MAX_KORREKTUR

  return { korrekturElo: korrekturElo, offset: offset }
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
        k_sum: 0,
        offset: 0,
        offsetSum: 0,
        rangliste: 0,
        ranglisteDiff: 0

      }],
      offTurs: 0,
      turs: 0
    })

    deltaList.push({
      player_id: sp.id!,
      delta: 0
    })
  })

  allTurniere.filter(f => aktTurnier ? f.tournament_number <= aktTurnier.tournament_number : f).sort((a, b) => a.tournament_number - b.tournament_number).forEach(t => {

    games.filter(d => d.expand.tournament.tournament_number == t.tournament_number).sort((a, b) => a.game_number - b.game_number).forEach(g => {

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
            k_sum: k_factor(oldEloHeim),
            offset: 0,
            offsetSum: 0,
            rangliste: 0,
            ranglisteDiff: 0
          })
          eloList[indexHeim].offTurs = 0
          eloList[indexHeim].turs += 1

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
            k_sum: k_factor(oldEloAway),
            offset: 0,
            offsetSum: 0,
            rangliste: 0,
            ranglisteDiff: 0
          })
          eloList[indexAway].offTurs = 0
          eloList[indexAway].turs += 1

        } else {
          eloList[indexAway].elo[awayEloIndex].values.push(newElo)
          eloList[indexAway].elo[awayEloIndex].k_sum += k_factor(oldEloAway)
        }

        //Reset Delta

        deltaList.find(f => f.player_id == a)!.delta = 0

      })




    })

    //elo korrektur

    eloList.forEach((p, idx) => {

      p.elo.sort((a, b) => a.turniernummer - b.turniernummer)


      let eloIndex = p.elo.findIndex(f => f.turniernummer == t.tournament_number)

      if (eloIndex == -1) {

        p.turs > 0 ? p.offTurs += 1 : p.offTurs

        let alteElo = p.elo.findLast(f => f.turniernummer < t.tournament_number)!.values.at(-1)!

        const korrigierteElo = elo_korrektur(p.offTurs, alteElo, p.turs, p.player.active)


        console.log("Name: ", p.player.player_name, "#: ", t.tournament_number, "Teil:", p.turs, "Korr. Elo: ", korrigierteElo, "Alte Elo: ", alteElo, "Off Turs: ", p.offTurs)

        p.elo.push({
          turniernummer: t.tournament_number,
          values: [korrigierteElo.korrekturElo],
          k_sum: 0,
          offset: p.offTurs,
          offsetSum: korrigierteElo.offset,
          rangliste: 0,
          ranglisteDiff: 0
        })

        p.offSum = p.offSum ? p.offSum + korrigierteElo.offset : korrigierteElo.offset
        if (p.turs > 0) (
          p.offTursSum = p.offTursSum ? p.offTursSum + 1 : 1
        )


        p.elo.sort((a, b) => a.turniernummer - b.turniernummer)

      }



    })

    eloList.filter(f => f.player.active == true).sort((a, b) => b.elo.at(-1)!.values.at(-1)! - a.elo.at(-1)!.values.at(-1)!).forEach((p, idx) => {

      let eloIndex = p.elo.findIndex(f => f.turniernummer == t.tournament_number)
      let prevEloIndex = p.elo.findIndex(f => f.turniernummer == t.tournament_number - 1)

      p.elo[eloIndex].rangliste = idx + 1
      p.elo[eloIndex].ranglisteDiff = p.elo[prevEloIndex].rangliste - p.elo[eloIndex].rangliste

    })


  })



  return eloList
}
