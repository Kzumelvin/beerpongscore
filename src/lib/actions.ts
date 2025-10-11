"use server"

import { eloListType, getEloTablePayload, tPayload } from "./elo";
import { pb } from "./pocketbase";

export async function updateElo(eloList: eloListType[]) {

  let payload: { id: string, elo: number }[] = []

  const batch = pb.createBatch()

  eloList.forEach(p => {

    try {

      let elo = p.elo.at(0)!.values.at(-1)!

      batch.collection("players").update(p.player.id!, { elo: elo })

    } catch (e) {
      console.log(e)
      return e
    }
  })

  try {
    return await batch.send()

  } catch (e) {
    console.log(e)
    return e
  }

}

export async function updateEloHist(eloList: eloListType[]) {

  type payload = { player: string, elo: tPayload[] }

  const data = getEloTablePayload(eloList)
  const batch = pb.createBatch()

  data.forEach(p => {

    try {
      let pLoad: payload = { player: p.playerID, elo: p.t }

      batch.collection("elo").create(pLoad)
    } catch (e) {
      console.log(e)
      return e
    }

  })

  try {
    return await batch.send()
  } catch (e) {
    console.log(e)
    return e
  }

}
