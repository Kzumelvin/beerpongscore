import React from 'react'
import { pb, turnierType } from '@/lib/pocketbase'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

async function page() {

  const turniere: turnierType[] = await pb.collection('tournaments').getFullList({
    expand: "groupA, groupB, groupC, groupD, groupE, p1",
    sort: "-tournament_number"
  })

  console.log(turniere[10].tournament_date)

  return (

    <div className='flex flex-row 2xl:grid 2xl:grid-cols-6 justify-center items-center gap-4 flex-wrap w-full p-4'>
      {turniere.map(t => (
        <Link key={t.id} href={`/turniere/${t.id}`}>
          <Card className='basis-1 aspect-video overflow-clip'>
            <CardHeader>
              <CardTitle className='text-4xl'>{t.tournament_name}</CardTitle>
            </CardHeader>
            <CardFooter className='flex-col items-start gap-1 text-sm'>
              <div className="line-clamp-1 flex gap-2 font-medium">
                Champions
              </div>
              <div className="text-muted-foreground text-nowrap">
                {t.expand.p1 ? t.expand.p1.team_name : "Noch nicht bekannt"}
              </div>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  )
}

export default page
