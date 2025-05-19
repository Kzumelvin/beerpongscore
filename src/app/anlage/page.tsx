import React from 'react'
import { pb } from '@/lib/pocketbase'
import { turnierType } from '@/lib/pocketbase'

async function page() {

  const turnier: turnierType[] = await pb.collection("tournaments").getFullList({
    expand: "groupA, groupB, groupC, groupD, groupE",
    sort: "-tournament_number"
  })

  return (
    <div>

    </div>
  )
}

export default page
