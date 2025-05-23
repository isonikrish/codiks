"use client";

import React, { useEffect, useState } from "react";
 // Adjust import path
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRouter } from "next/navigation";
import { useSocket } from "@/stores/SocketProvider";

function WaitingArea() {
  const socket = useSocket();
  const [socketId, setSocketId] = useState<string | null>(null);
  const [opponent, setOpponent] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!socket) return;
    //@ts-ignore
    setSocketId(socket.id);

    socket.emit("waiting-area");

    socket.on("found-opponent", (data: { opponentSocketId: string }) => {
      setOpponent(data.opponentSocketId);
    });

    socket.on("battle-started", (data: { battleId: string }) => {
      router.push(`/battle/${data.battleId}?playerSocketId=${socket.id}`);
    });

    // Cleanup listeners on unmount
    return () => {
      socket.off("found-opponent");
      socket.off("battle-started");
    };
  }, [socket, router]);

  const handleStartGame = () => {
    if (opponent && socket) {
      socket.emit("start-battle", opponent);
    }
  };

  if (!socket) {
    return <p>Connecting to socket...</p>;
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-muted p-6">
      <div className="flex max-w-4xl w-full gap-6">
        <Card className="w-1/3 flex flex-col">
          <CardHeader>
            <CardTitle>👤 Connected User</CardTitle>
            <CardDescription>Your Socket ID</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-32 rounded-md border p-2">
              <code className="select-all break-words text-sm">
                {socketId || "Connecting..."}
              </code>
            </ScrollArea>
          </CardContent>
        </Card>

        <Separator orientation="vertical" />

        <Card className="w-2/3 flex flex-col items-center justify-center text-center">
          <CardHeader className="w-full">
            <CardTitle>
              {opponent ? "✅ Opponent Found!" : "⏳ Waiting for Opponent..."}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {opponent ? (
              <>
                <p className="mb-6 select-all break-words text-lg font-medium text-muted-foreground">
                  Opponent Socket ID: <code>{opponent}</code>
                </p>
                <Button onClick={handleStartGame} size="lg" className="w-36">
                  Start Battle
                </Button>
              </>
            ) : (
              <p className="text-muted-foreground animate-pulse text-lg">
                Searching for an opponent, please wait...
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default WaitingArea;
