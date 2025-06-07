"use client"
import { eloBerechnung, eloListType } from '@/lib/elo'
import { gameType, playerType, turnierType } from '@/lib/pocketbase'
import React from 'react'
import EloTable from './EloTable'
import { Button } from '@/components/ui/button'
import { updateElo } from '@/lib/actions'
import { toast } from 'sonner'

function EloDashboard({ spieler, games, turniere, elolist }: { spieler: playerType[], games: gameType[], turniere: turnierType[], elolist: eloListType[] }) {


  return (
    <div>
      <Button onClick={() => { updateElo(elolist).then(e => toast.success("Update durchgeführt", { description: `${e}` })) }}>Update Elo</Button>
      <EloTable turniere={turniere} eloList={elolist} />
    </div>
  )
}

export default EloDashboard
