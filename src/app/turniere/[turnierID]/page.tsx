import React from 'react'
import { gameType, pb, turnierType } from '@/lib/pocketbase'
import TurnierDashboard from './TurnierDashboard'

async function page({ params }: { params: Promise<{ turnierID: string }> }) {

  const id = (await params).turnierID

  const turnier: turnierType = await pb.collection("tournaments").getOne(id, {
    expand: "groupA, groupB, groupC, groupD, groupE"
  })

  const games: gameType[] = await pb.collection("games").getFullList({
    expand: "home_team, away_team, tournament",
    sort: "-game_number",
    filter: `tournament = "${id}"`
  })


  return (
    <div className='p-3'>

      <TurnierDashboard spiele={games} turnier={turnier} />
    </div>
  )
}

export default page
