import KOMatch from '@/components/finaleboard/KOMatch'
import { gameType } from '@/lib/pocketbase'
import React, { useState, useEffect } from 'react'
import { pb } from '@/lib/pocketbase'
import { toast } from 'sonner'
import { matchmakingKO, scoreBoard } from '@/lib/beerpong'

function FinaleBoard({ tournamentID, spiele, groupScoreBoard }: { tournamentID: string, spiele: gameType[], groupScoreBoard: scoreBoard }) {

  const [games, setGames] = useState<gameType[]>(spiele)
  const [koMatch, setKOMatch] = useState<gameType[]>([])
  const [generatedMatches, setGeneratedMatches] = useState<gameType[]>([])

  console.log("KO Match", koMatch)
  console.log("All Matches", generatedMatches)


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

    const { allMatches, finalScoreBoard } = matchmakingKO(tournamentID, groupScoreBoard, games)
    setGeneratedMatches(allMatches)

  }, [games])

  return (

    <div className='flex flex-col lg:grid lg:grid-cols-5 gap-3 w-full py-2'>
      <div className="flex flex-col gap-y-3">
        <h2 className='text-center text-2xl'>Relegation</h2>
        {generatedMatches.filter(f => f.game_type == "Relegation").map(m => (
          <KOMatch key={m.game_number} match={m} />
        ))}
        {games.filter(f => f.game_type == "Relegation").map(m => (
          <KOMatch key={m.game_number} match={m} />
        ))}
      </div>
      <div className="flex flex-col gap-y-3">
        <h2 className='text-center text-2xl'>Viertelfinale</h2>
        {generatedMatches.filter(f => f.game_type == "Viertelfinale").map(m => (
          <KOMatch key={m.game_number} match={m} />
        ))}
        {games.filter(f => f.game_type == "Viertelfinale").map(m => (
          <KOMatch key={m.game_number} match={m} />
        ))}
      </div>
      <div className="flex flex-col gap-y-3">
        <h2 className="text-center text-2xl">Halbfinale</h2>
        {generatedMatches.filter(f => f.away_team && f.game_type == "Halbfinale").map(m => (
          <KOMatch key={m.game_number} match={m} />
        ))}
        {games.filter(f => f.game_type == "Halbfinale").map(m => (
          <KOMatch key={m.game_number} match={m} />
        ))}
      </div>
      <div className="flex flex-col gap-y-3">
        <h2 className='text-center text-2xl'>Spiel um Platz 3</h2>
        {generatedMatches.filter(f => f.away_team && f.game_type == "Spiel um Platz 3").map(m => (
          <KOMatch key={m.game_number} match={m} />
        ))}
        {games.filter(f => f.game_type == "Spiel um Platz 3").map(m => (
          <KOMatch key={m.game_number} match={m} />
        ))}
      </div>
      <div className="flex flex-col gap-y-3">
        <h2 className='text-center text-2xl'>Finale</h2>
        {generatedMatches.filter(f => f.away_team && f.game_type == "Finale").map(m => (
          <KOMatch key={m.game_number} match={m} />
        ))}
        {games.filter(f => f.game_type == "Finale").map(m => (
          <KOMatch key={m.game_number} match={m} />
        ))}
      </div>



    </div>
  )
}

export default FinaleBoard
