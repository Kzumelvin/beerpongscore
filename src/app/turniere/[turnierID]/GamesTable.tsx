import React from 'react'
import { Table, TableHead, TableRow, TableBody, TableCell, TableHeader } from '@/components/ui/table'
import { gameType } from '@/lib/pocketbase'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'

function GamesTable({ games, title }: { games: gameType[], title: string }) {
  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Spiel Nr.</TableHead>
              <TableHead>Gruppe</TableHead>
              <TableHead>Heimteam</TableHead>
              <TableHead>Gastteam</TableHead>
              <TableHead>Heimbecher</TableHead>
              <TableHead>Gastbecher</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {games.sort((a, b) => a.game_number - b.game_number).filter(f => f.game_type == "Gruppenphase").map(game => (
              <TableRow key={game.game_number}>
                <TableCell>{game.game_number}</TableCell>
                <TableCell>{game.groupStage}</TableCell>
                <TableCell>{game.expand.home_team.team_name}</TableCell>
                <TableCell>{game.expand.away_team.team_name}</TableCell>
                <TableCell>{game.home_cups}</TableCell>
                <TableCell>{game.away_cups}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export default GamesTable
