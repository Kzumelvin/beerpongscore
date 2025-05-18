'use client'

import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Table, TableRow, TableHeader, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { finaleScoreBoard } from '@/lib/beerpong'

function CompleteFinalTable({ score }: { score: finaleScoreBoard }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Finaltabelle</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Pos.</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Platz Gruppenphase</TableHead>
                            <TableHead>Stufe KO-Phase</TableHead>
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
                                <TableCell>{score.groupIndex}</TableCell>
                                <TableCell>{score.finalIndex}</TableCell>
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

export default CompleteFinalTable
