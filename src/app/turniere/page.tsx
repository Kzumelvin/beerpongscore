import React from 'react'
import { pb, turnierType } from '@/lib/pocketbase'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

async function page() {

  const turniere: turnierType[] = await pb.collection('tournaments').getFullList({
    expand: "groupA, groupB, groupC, groupD, groupE",
    sort: "-tournament_number"
  })


  return (
    <div>
      <div className='flex flex-col gap-4'>
        {turniere.filter(f => f.groupA.length > 0).map(t => (
          <Link key={t.id} href={`/turniere/${t.id}`} className='w-10 h-auto'>
            <Button>{t.tournament_name}</Button>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default page
