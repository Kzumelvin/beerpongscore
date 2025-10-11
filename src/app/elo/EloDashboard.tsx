"use client"
import { eloBerechnung, eloListType } from '@/lib/elo'
import { gameType, playerType, turnierType } from '@/lib/pocketbase'
import React from 'react'
import EloTable from './EloTable'
import { Button } from '@/components/ui/button'
import { updateElo } from '@/lib/actions'
import { updateEloHist } from '@/lib/actions'
import { toast } from 'sonner'
import { description } from '@/components/dashboard/chart-area-interactive'

function EloDashboard({ spieler, games, turniere, elolist }: { spieler: playerType[], games: gameType[], turniere: turnierType[], elolist: eloListType[] }) {


  return (
    <div>
      <Button onClick={() => { updateElo(elolist).then((e) => toast.success("Update durchgeführt", { description: `${e}` })) }}>Update Elo</Button>
      <Button onClick={() => {
        updateEloHist(elolist)
          .then((p) => toast.success("Hist Update Erfolgreich", { description: `${p}` }))
          .catch((e) => toast.error("Fehler", { description: `${e}` }))
      }}>Update EloHist</Button>
      <EloTable turniere={turniere} eloList={elolist} />
    </div>
  )
}

export default EloDashboard
