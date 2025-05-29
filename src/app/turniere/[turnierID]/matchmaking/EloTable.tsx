import React from 'react'
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from '@/components/ui/table'
import { eloListType } from '@/lib/elo'
import { Card, CardContent, CardTitle, CardHeader } from '@/components/ui/card'

type eloTableType = {
  player_name: string,
  elo_neu: number,
  elo_alt: number,
  elo_delta: number,
  elo_prozent: number,
  k_sum: number
}

function EloTable({ eloList }: { eloList: eloListType[] }) {

  console.log(eloList)

  let data: eloTableType[] = []

  eloList.filter(f => f.player.active).forEach(p => {

    let eloNeu = p.elo.at(-1)!.values.at(-1)!
    let eloAlt = p.elo.at(-2)!.values.at(-1)!
    let eloDelta = eloNeu - eloAlt
    let eloProzent = (eloDelta / p.elo.at(-1)!.k_sum) ? (eloDelta / p.elo.at(-1)!.k_sum) * 100 : 0

    data.push({
      player_name: p.player.player_name,
      elo_neu: eloNeu,
      elo_alt: eloAlt,
      elo_delta: eloDelta,
      elo_prozent: eloProzent,
      k_sum: p.elo.at(-1)!.k_sum

    })

  })

  data.sort((a, b) => b.elo_prozent - a.elo_prozent)


  return (
    <Card>
      <CardHeader>
        <CardTitle>Bester Spieler des Turniers</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pos.</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>%</TableHead>
              <TableHead>Δ Elo</TableHead>
              <TableHead>Max</TableHead>
              <TableHead>Neue Elo</TableHead>
              <TableHead>Alte Elo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.filter(f => f.k_sum > 0).map((p, idx) => (
              <TableRow key={idx}>
                <TableCell>{idx + 1}</TableCell>
                <TableCell>{p.player_name}</TableCell>
                <TableCell>{p.elo_prozent.toFixed(2).replace(".", ",")}%</TableCell>
                <TableCell>{p.elo_delta}</TableCell>
                <TableCell>{p.k_sum}</TableCell>
                <TableCell>{p.elo_neu}</TableCell>
                <TableCell>{p.elo_alt}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

      </CardContent>
    </Card>
  )
}

export default EloTable
