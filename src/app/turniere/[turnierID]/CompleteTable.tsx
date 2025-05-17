'use client'

import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Table, TableRow, TableHeader, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { scoreBoard } from '@/lib/beerpong'

function CompleteTable({ score }: { score: scoreBoard }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gesamttabelle</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pos.</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className='text-right'>Spiele</TableHead>
              <TableHead className='text-right'>ø Punkte</TableHead>
              <TableHead className='text-right'>+/- Cups</TableHead>
              <TableHead className='text-right'>+ Cups</TableHead>
              <TableHead className='text-right'>- Cups</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {score.map((score, idx) => (
              <TableRow key={score.team.id}>
                <TableCell>{idx + 1}</TableCell>
                <TableCell>{score.team.team_name}</TableCell>
                <TableCell className='text-right'>{score.games}</TableCell>
                <TableCell className='text-right'>{score.avePoints.toFixed(2)}</TableCell>
                <TableCell className='text-right'>{score.diffCups}</TableCell>
                <TableCell className='text-right'>{score.posCups}</TableCell>
                <TableCell className='text-right'>{score.negCups}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>

  )
}

export default CompleteTable
