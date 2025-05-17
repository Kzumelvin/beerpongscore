import React from 'react'
import { gameType, pb, turnierType } from '@/lib/pocketbase'
import GroupDashboard from './GroupDashboard'

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
    <GroupDashboard spiele={games} turnier={turnier} />
  )
}

export default page
