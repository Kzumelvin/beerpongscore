import React from 'react'
import { Card, CardContent, CardTitle, CardHeader, CardDescription } from '../ui/card'
import { gameType } from '@/lib/pocketbase'

function KOMatch({ match }: { match: gameType }) {

  return (
    <Card className='w-full'>
      <CardContent>
        <div className='flex flex-col'>
          <div className={`flex flex-row justify-between ${match.home_cups && !match.away_cups || match.away_cups && match.away_cups < 1 ? "text-amber-400" : ""}`}>

            <p>{match.expand.home_team.team_name} </p>
            <p className='text-right'>{match.home_cups}</p>
          </div>
          <div className={`flex flex-row justify-between ${match.away_cups && !match.home_cups || match.home_cups && match.home_cups < 1 ? "text-amber-400" : ""}`}>
            <p>{match.expand.away_team.team_name}</p>
            <p className='text-right'>{match.away_cups}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default KOMatch
