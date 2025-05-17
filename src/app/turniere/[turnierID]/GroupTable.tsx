'use client'

import React from 'react'
import { Table, TableRow, TableBody, TableCell, TableHead, TableHeader } from '@/components/ui/table'
import { scoreBoard } from '@/lib/beerpong'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

function GroupTable({ score, title }: { score: scoreBoard, title: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pos.</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className='text-right'>Spiele</TableHead>
              <TableHead className="text-right">+/- Cups</TableHead>
              <TableHead className="text-right">Punkte</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {score.map((score, idx) => (
              <TableRow key={idx}>
                <TableCell>{idx + 1}</TableCell>
                <TableCell className='font-medium'>{score.team.team_name}</TableCell>
                <TableCell className='text-right'>{score.games}</TableCell>
                <TableCell className='text-right'>{score.diffCups}</TableCell>
                <TableCell className='text-right'>{score.points}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export default GroupTable
