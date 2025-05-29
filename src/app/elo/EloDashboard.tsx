import { eloBerechnung } from '@/lib/elo'
import { gameType, playerType, turnierType } from '@/lib/pocketbase'
import React from 'react'
import EloTable from './EloTable'

function EloDashboard({ spieler, games, turniere }: { spieler: playerType[], games: gameType[], turniere: turnierType[] }) {

  let eloList = eloBerechnung(spieler, games, turniere)

  return (
    <div>
      <EloTable turniere={turniere} eloList={eloList} />
    </div>
  )
}

export default EloDashboard
