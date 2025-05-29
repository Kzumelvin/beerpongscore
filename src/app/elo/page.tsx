import React from 'react'
import { gameType, pb, playerType, turnierType } from '@/lib/pocketbase'
import { eloBerechnung } from '@/lib/elo'
import EloDashboard from './EloDashboard'

async function page() {

  const spieler: playerType[] = await pb.collection("players").getFullList({

  })

  const games: gameType[] = await pb.collection("games").getFullList({
    expand: "home_team, away_team, tournament"
  })

  const turniere: turnierType[] = await pb.collection("tournaments").getFullList({
    expand: "groupA, groupB, groupC, groupD, groupE"
  })

  return (
    <div>
      <EloDashboard spieler={spieler} games={games} turniere={turniere} />
    </div>
  )
}

export default page
