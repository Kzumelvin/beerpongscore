'use client'

import React, { useEffect, useState } from 'react'
import { teamType, gameType, turnierType } from '@/lib/pocketbase'
import { getScoreBoard, matchmakingGroup, matchmakingKO } from '@/lib/beerpong'
import { pb } from '@/lib/pocketbase'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import GameForm from './GameInput'

function MatchDashboard({ turnier, playedGames }: { turnier: turnierType, playedGames: gameType[] }) {

  let matches = matchmakingGroup(turnier.id!, turnier.expand.groupA, turnier.expand.groupB, turnier.expand.groupC, turnier.expand.groupD, turnier.expand.groupE)

  const [games, setGames] = useState(playedGames)
  const [openMatches, setOpenMatches] = useState<gameType[]>([])
  const [koMatches, setKOMatches] = useState<gameType[]>([])

  let alleTeams: teamType[] = []
  turnier.expand.groupA && turnier.expand.groupA.forEach((t: teamType) => alleTeams.push(t))
  turnier.expand.groupB && turnier.expand.groupB.forEach((t: teamType) => alleTeams.push(t))
  turnier.expand.groupC && turnier.expand.groupC.forEach((t: teamType) => alleTeams.push(t))
  turnier.expand.groupD && turnier.expand.groupD.forEach((t: teamType) => alleTeams.push(t))
  turnier.expand.groupE && turnier.expand.groupE.forEach((t: teamType) => alleTeams.push(t))

  useEffect(() => {
    try {
      pb.collection("games").subscribe("*", (e) => {
        console.log(e.record)
        const game: gameType = {
          home_team: e.record.home_team,
          away_team: e.record.away_team,
          expand: {
            home_team: e.record.expand!.home_team,
            away_team: e.record.expand!.away_team,
            tournament: e.record.expand!.tournament
          },
          home_cups: e.record.home_cups,
          away_cups: e.record.away_cups,
          game_type: e.record.game_type,
          groupStage: e.record.groupStage,
          tournament: e.record.tournament,
          game_number: e.record.game_number
        }

        if (e.action == "create") {
          setGames((oldArray) => [...oldArray, game])
          toast.success("Ergebnis gespeichert:", { description: `${game.expand.home_team.team_name} vs. ${game.expand.away_team.team_name} | ${game.home_cups}:${game.away_cups}` })
        }

      }, { expand: "home_team, away_team, tournament" })


    } catch (e) {
      toast.error("Fehler:", { description: `${e}` })
    }

    return () => { pb.collection("games").unsubscribe("*") }

  }, [])

  useEffect(() => {

    setOpenMatches(matches.filter(f => {
      return !games.some(sp => sp.home_team === f.home_team && sp.away_team === f.away_team)
    }))


    //KO-Phase
    if (!openMatches.some(f => f.game_type == "Gruppenphase")) {

      console.log("Alle Teams", alleTeams)

      const { allMatches, finalScoreBoard } = matchmakingKO(turnier.id!, getScoreBoard(games, alleTeams), games)

      setKOMatches(allMatches)


    }

  }, [games])



  return (
    <Card>
      <CardHeader>
        <CardTitle>{turnier.tournament_name} - {openMatches.length > 0 || koMatches.length > 0 ? `${openMatches.length + koMatches.length} Spiele offen` : "Keine Spiele offen"}</CardTitle>
        <CardContent>
          {openMatches.map(fg => <GameForm key={fg.game_number} leftGames={fg} />)}
          {koMatches.map(kg => <GameForm key={kg.game_number} leftGames={kg} />)}
        </CardContent>
      </CardHeader>
    </Card>
  )
}

export default MatchDashboard
