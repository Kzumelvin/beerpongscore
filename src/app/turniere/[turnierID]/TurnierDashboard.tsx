'use client'

import { useEffect, useState } from 'react'
import { gameType, turnierType, teamType } from '@/lib/pocketbase'
import { toast } from 'sonner'
import { pb } from '@/lib/pocketbase'
import { scoreBoard, getScoreBoard, matchmakingGroup } from '@/lib/beerpong'
import { Card, CardTitle, CardHeader, CardContent, CardDescription, CardFooter } from '@/components/ui/card'
import Link from 'next/link'
import GroupTable from './GroupTable'
import CompleteTable from './CompleteTable'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import FinaleBoard from './FinaleBoard'
import GamesTable from './GamesTable'
import { Separator } from '@/components/ui/separator'

function TurnierDashboard({ spiele, turnier }: { spiele: gameType[], turnier: turnierType }) {


  let openGames = matchmakingGroup(turnier.id!, turnier.expand.groupA, turnier.expand.groupB, turnier.expand.groupC, turnier.expand.groupD, turnier.expand.groupE)

  const [games, setGames] = useState<gameType[]>(spiele)
  const [openMatches, setOpenMatches] = useState<gameType[]>(openGames.filter(f => !games.some(g => g.home_team == f.home_team && g.away_team == f.away_team)))

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
          try {
            setGames((oldArray) => [...oldArray, game])
            toast.success("Neues Ergebnis", {
              description: `${game.expand.home_team.team_name} vs. ${game.expand.away_team.team_name} | ${game.home_cups} : ${game.away_cups}`
            })
          } catch (e) { toast.error("Fehler bei Spielanlage", { description: `${e}` }) }
        }

      }, { expand: "home_team, away_team, tournament" })

    } catch (e) {
      toast.error("Fehler", { description: `${e}` })
    }

    return () => { pb.collection("games").unsubscribe("*") }

  })

  useEffect(() => {

    setOpenMatches(openGames.filter(f => !games.some(g => g.home_team == f.home_team && g.away_team == f.away_team)))

  }, [games])

  let alleTeams: teamType[] = []
  let scoreA: scoreBoard = []
  let scoreB: scoreBoard = []
  let scoreC: scoreBoard = []
  let scoreD: scoreBoard = []
  let scoreE: scoreBoard = []
  let gesamtScore: scoreBoard = []

  if (turnier.expand.groupA) {
    scoreA = getScoreBoard(games, turnier.expand.groupA)
    turnier.expand.groupA.forEach((t: teamType) => alleTeams.push(t))

    console.log("Score A", scoreA)

  }

  if (turnier.expand.groupB) {
    scoreB = getScoreBoard(games, turnier.expand.groupB)
    turnier.expand.groupB.forEach((t: teamType) => alleTeams.push(t))

    console.log("Score B", scoreB)

  }

  if (turnier.expand.groupC) {
    scoreC = getScoreBoard(games, turnier.expand.groupC)
    turnier.expand.groupC.forEach((t: teamType) => alleTeams.push(t))

  }

  if (turnier.expand.groupD) {
    scoreD = getScoreBoard(games, turnier.expand.groupD)
    turnier.expand.groupD.forEach((t: teamType) => alleTeams.push(t))

  }

  if (turnier.expand.groupE) {
    scoreE = getScoreBoard(games, turnier.expand.groupE)
    turnier.expand.groupE.forEach((t: teamType) => alleTeams.push(t))

  }


  gesamtScore = getScoreBoard(games, alleTeams)


  return (

    <Card className="shadow-lg w-full h-fit">
      <CardHeader>
        <CardTitle>
          Matchübersicht BPT {turnier.tournament_number}
        </CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent className="w-full space-y-2">
        <Tabs defaultValue="gruppe" className="w-full">
          <TabsList>
            <TabsTrigger value="gruppe">Gruppenphase</TabsTrigger>
            <TabsTrigger value="finale">KO-Phase</TabsTrigger>
          </TabsList>
          <TabsContent value="gruppe">
            <div className='flex flex-col gap-y-2 w-full'>
              <div className="flex flex-col basis-1 lg:grid lg:grid-cols-2 gap-4">
                <div className="w-full flex flex-col gap-3 max-h-screen overflow-auto">
                  {scoreA.length > 0 ? <GroupTable score={scoreA} title="A" /> : ""}
                  {scoreB.length > 0 ? <GroupTable score={scoreB} title="B" /> : ""}
                  {scoreC.length > 0 ? <GroupTable score={scoreC} title="C" /> : ""}
                  {scoreD.length > 0 ? <GroupTable score={scoreD} title="D" /> : ""}
                  {scoreE.length > 0 ? <GroupTable score={scoreE} title="E" /> : ""}
                </div>

                <div className="w-full">
                  <CompleteTable score={gesamtScore} />
                </div>
              </div>
              <Separator className='my-4' />
              <div className='flex flex-row gap-3 w-full'>
                <GamesTable games={openMatches} title='Kommende Spiele' />
                <GamesTable games={games} title='Gespielte Spiele' />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="finale">
            <FinaleBoard spiele={games} tournamentID={turnier.id!} groupScoreBoard={gesamtScore} />
          </TabsContent>
        </Tabs>

      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  )
}

export default TurnierDashboard
