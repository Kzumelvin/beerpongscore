"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { gameType } from "@/lib/pocketbase"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { pb } from "@/lib/pocketbase"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"

const formSchema = z.object({
  hometeam_id: z.string().min(2).max(50),
  awayteam_id: z.string().min(2).max(50),
  hometeam_name: z.string().min(2).max(50),
  awayteam_name: z.string().min(2).max(50),
  gametype: z.enum(["Gruppenphase", "Relegation", "Achtelfinale", "Viertelfinale", "Halbfinale", "Spiel um Platz 3", "Finale"]),
  groupLetter: z.enum(["A", "KO", "B", "C", "D", "E"]),
  tournament: z.string(),
  homecups: z.coerce.number().min(0).max(10).int(),
  awaycups: z.coerce.number().min(0).max(10).int(),
  gameNumber: z.number().int()
})

export default function GameForm({ leftGames }: { leftGames: gameType }) {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      hometeam_id: leftGames.home_team,
      awayteam_id: leftGames.away_team,
      hometeam_name: leftGames.expand.home_team.team_name,
      awayteam_name: leftGames.expand.away_team.team_name,
      tournament: leftGames.tournament!,
      homecups: 0,
      awaycups: 0,
      gametype: leftGames.game_type,
      groupLetter: leftGames.groupStage,
      gameNumber: leftGames.game_number
    }
  })


  function onSubmit(values: z.infer<typeof formSchema>) {
    try {

      const game: gameType = {
        home_team: values.hometeam_id,
        away_team: values.awayteam_id,
        home_cups: values.homecups,
        away_cups: values.awaycups,
        game_type: values.gametype,
        groupStage: values.groupLetter,
        game_number: values.gameNumber,
        tournament: values.tournament,
        expand: {}
      }

      pb.collection("games").create(game)

      toast.success("Ergebnis gespeichert", { description: `${values.hometeam_name} vs. ${values.awayteam_name} | ${values.homecups}:${values.awaycups}` })

    } catch (e) {
      toast.error("Fehler:", { description: `${e}` })
    }
  }

  function onInvalid(error: any) {
    console.log(error)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="flex flex-col lg:flex-row lg:gap-x-3 gap-y-3">
        <FormField
          control={form.control}
          name="gameNumber"
          render={({ field }) => (
            <FormItem className="w-3 mb-2">
              <FormLabel>{field.value}</FormLabel>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="gametype"
          render={({ field }) => (
            <FormItem className="w-fit mb-2">
              <FormLabel><p>{field.value}</p></FormLabel>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="groupLetter"
          render={({ field }) => (
            <FormItem className="w-fit mb-2 text-left">
              <FormLabel><p>{field.value}</p></FormLabel>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="hometeam_name"
          render={({ field }) => (
            <FormItem className="w-80 mb-2">
              <FormLabel><p>{field.value}</p></FormLabel>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="awayteam_name"
          render={({ field }) => (
            <FormItem className="w-80 mb-2">
              <FormLabel><p>{field.value}</p></FormLabel>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="homecups"
          render={({ field }) => (
            <FormItem>
              <FormControl className="mb-2">
                <Input type="number" placeholder="Heimbecher" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="awaycups"
          render={({ field }) => (
            <FormItem>
              <FormControl className="mb-2">
                <Input type="number" placeholder="Gastbecher" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Speichern</Button>
      </form>
    </Form>
  )

}
