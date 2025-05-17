"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UserRound, Users } from "lucide-react"
import Link from "next/link"

function Battle() {
  return (
    <div className="min-h-screenflex items-center justify-center px-6 py-24">
      <Card className="max-w-lg w-full bg-white/10 backdrop-blur-md border border-white/20 shadow-lg rounded-2xl">

        <CardContent className="flex flex-col items-center gap-8 pt-8">
          <div className="flex items-center">
          <UserRound className="text-white/70 w-16 h-16 animate-pulse" />
          Vs
          <UserRound className="text-white/70 w-16 h-16 animate-pulse" />
          </div>
          <Link href={'/waiting-area'}>
          <Button size="lg" className="w-full  font-bold">
            Start 1v1 Battle
          </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}

export default Battle
