import React from 'react'
import { pb, teamType, turnierType, gameType } from '@/lib/pocketbase'
import { matchmakingGroup } from '@/lib/beerpong'
import MatchDashboard from './MatchDashboard'

async function page({ params }: { params: Promise<{ turnierID: string }> }) {

  const id = (await params).turnierID
  const turnier: turnierType = await pb.collection("tournaments").getOne(id, {
    expand: "groupA, groupB, groupC, groupD, groupE"
  })

  const spiele: gameType[] = await pb.collection("games").getFullList({
    expand: "home_team, away_team, tournament",
    sort: "-game_number",
    filter: `tournament="${id}"`

  })


  return (
    <div className='p-4'>
      <MatchDashboard playedGames={spiele} turnier={turnier} />
    </div>
  )
}

export default page
