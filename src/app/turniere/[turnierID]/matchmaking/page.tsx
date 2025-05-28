import React from 'react'
import { pb, teamType, turnierType, gameType, playerType } from '@/lib/pocketbase'
import MatchDashboard from './MatchDashboard'
import { AdminEmails, auth0 } from '@/lib/auth0'
import { redirect } from 'next/navigation'

async function page({ params }: { params: Promise<{ turnierID: string }> }) {

  const session = await auth0.getSession()

  if (!session || !AdminEmails.some(f => session.user.email == f)) {
    return redirect('/noentry')
  }

  const id = (await params).turnierID
  const turnier: turnierType = await pb.collection("tournaments").getOne(id, {
    expand: "groupA, groupB, groupC, groupD, groupE"
  })

  const allTurniere: turnierType[] = await pb.collection("tournaments").getFullList({
    sort: "-tournament_number"
  })

  const spiele: gameType[] = await pb.collection("games").getFullList({
    expand: "home_team, away_team, tournament",
    sort: "-game_number",
  })

  const players: playerType[] = await pb.collection("players").getFullList({

  })


  return (
    <div className='p-4'>
      <MatchDashboard allTurniere={allTurniere} spieler={players} playedGames={spiele} turnier={turnier} />
    </div>
  )
}

export default page
