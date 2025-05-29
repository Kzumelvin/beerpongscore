"use client"
import { eloListType } from '@/lib/elo'
import { useState } from 'react'
import { Table, TableHeader, TableHead, TableRow, TableBody, TableCell } from '@/components/ui/table'
import { turnierType } from '@/lib/pocketbase'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

function EloTable({ eloList, turniere }: { eloList: eloListType[], turniere: turnierType[] }) {

  const [active, setActive] = useState(true)

  console.log(eloList)

  return (
    <div>
      <Switch id="active" checked={active} onCheckedChange={() => setActive(!active)} />
      <Label htmlFor='active'>Aktiv / Passiv</Label>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Spielername</TableHead>
            {turniere.sort((a, b) => b.tournament_number - a.tournament_number).map(p => (
              <TableHead key={p.tournament_number}>{p.tournament_name}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {eloList.sort((a, b) => b.elo.at(-1)!.values.at(-1)! - a.elo.at(-1)!.values.at(-1)!).filter(f => f.player.active == active).map(p => (
            <TableRow key={p.player.player_name}>
              <TableCell>{p.player.player_name}</TableCell>
              {p.elo.sort((a, b) => b.turniernummer - a.turniernummer).map(e => (
                <TableCell key={e.turniernummer}>{e.values.at(-1)}</TableCell>
              ))}
            </TableRow>
          ))}

        </TableBody>
      </Table>
    </div>
  )
}

export default EloTable
