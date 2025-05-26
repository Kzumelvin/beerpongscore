'use client'

import React, { useEffect, useState } from 'react'
import { teamType, gameType, turnierType } from '@/lib/pocketbase'
import { finaleScoreBoard, getScoreBoard, matchmakingGroup, matchmakingKO } from '@/lib/beerpong'
import { pb } from '@/lib/pocketbase'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import GameForm from './GameInput'
import CompleteTable from '../CompleteTable'
import CompleteFinalTable from '../CompleteFinalTable'
import { Separator } from '@/components/ui/separator'
import GroupTable from '../GroupTable'
import { scoreBoard } from '@/lib/beerpong'

function MatchDashboard({ turnier, playedGames }: { turnier: turnierType, playedGames: gameType[] }) {

  let matches = matchmakingGroup(turnier.id!, turnier.expand.groupA, turnier.expand.groupB, turnier.expand.groupC, turnier.expand.groupD, turnier.expand.groupE)


  const [games, setGames] = useState(playedGames)
  const [openMatches, setOpenMatches] = useState<gameType[]>(matches.filter(f => !games.some(sp => sp.home_team == f.home_team && sp.away_team == f.away_team)))
  const [koMatches, setKOMatches] = useState<gameType[]>([])
  const [finalsScore, setFinalsScore] = useState<finaleScoreBoard>([])

  let alleTeams: teamType[] = []
  let scoreA: scoreBoard = []
  let scoreB: scoreBoard = []
  let scoreC: scoreBoard = []
  let scoreD: scoreBoard = []
  let scoreE: scoreBoard = []

  if (turnier.expand.groupA) {
    turnier.expand.groupA.forEach((t: teamType) => alleTeams.push(t))
    scoreA = getScoreBoard(games, turnier.expand.groupA)
  }
  if (turnier.expand.groupB) {
    turnier.expand.groupB.forEach((t: teamType) => alleTeams.push(t))
    scoreB = getScoreBoard(games, turnier.expand.groupB)
  }
  if (turnier.expand.groupC) {
    turnier.expand.groupC.forEach((t: teamType) => alleTeams.push(t))
    scoreC = getScoreBoard(games, turnier.expand.groupC)
  }
  if (turnier.expand.groupD) {
    turnier.expand.groupD.forEach((t: teamType) => alleTeams.push(t))
    scoreD = getScoreBoard(games, turnier.expand.groupD)
  }
  if (turnier.expand.groupE) {
    turnier.expand.groupE.forEach((t: teamType) => alleTeams.push(t))
    scoreE = getScoreBoard(games, turnier.expand.groupC)
  }


  const groupScoreBoard = getScoreBoard(games.filter(f => f.game_type === "Gruppenphase"), alleTeams)

  useEffect(() => {
    try {
      pb.collection("games").subscribe("*", (e) => {
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

    let filteredMatches = matches.filter(f => !games.some(sp => sp.home_team == f.home_team && sp.away_team == f.away_team))
    setOpenMatches(filteredMatches)

    console.log("Set Open Matches", openMatches)

    if (openMatches.length == 0) {
      const { allMatches, finalScoreBoard } = matchmakingKO(turnier.id!, groupScoreBoard, games)

      //KO-Phase


      setKOMatches(allMatches)
      setFinalsScore(finalScoreBoard)

    }

  }, [games])


  useEffect(() => {






  }, [setOpenMatches])

  return (
    <div className='flex flex-col gap-y-2'>
      <div className='flex flex-col lg:grid lg:grid-cols-2 gap-3 '>
        <div className='flex flex-col'>
          {scoreA.length > 0 ? <GroupTable score={scoreA} title="A" /> : ""}
          {scoreB.length > 0 ? <GroupTable score={scoreB} title="B" /> : ""}
          {scoreC.length > 0 ? <GroupTable score={scoreC} title="C" /> : ""}
          {scoreD.length > 0 ? <GroupTable score={scoreD} title="D" /> : ""}
          {scoreE.length > 0 ? <GroupTable score={scoreE} title="E" /> : ""}
        </div>
        <div className='flex flex-col gap-y-3'>
          <CompleteTable score={groupScoreBoard} />
          <CompleteFinalTable score={finalsScore} />
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{turnier.tournament_name} - {openMatches.length > 0 || koMatches.length > 0 ? `${openMatches.length + koMatches.length} Spiele offen` : "Keine Spiele offen"}</CardTitle>
          <CardContent className='flex flex-col gap-y-2'>
            {openMatches.map(fg => <GameForm key={fg.game_number} leftGames={fg} />)}
            <Separator className='my-4' />
            {koMatches.map(kg => <GameForm key={kg.game_number} leftGames={kg} />)}
          </CardContent>
        </CardHeader>
      </Card>

    </div>

  )
}

export default MatchDashboard
