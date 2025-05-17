"use client";

import { getSocket } from "@/lib/socket";
import React, { useEffect, useState } from "react";

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


function WaitingArea() {
  const [socketId, setSocketId] = useState<string | null>(null);
  const [opponent, setOpponent] = useState<string | null>(null);

  useEffect(() => {
    const socket = getSocket();

    socket.on("connect", () => {
      //@ts-ignore
      setSocketId(socket.id);
      socket.emit("waiting-area");
    });

    socket.on("found-opponent", (data: { opponentSocketId: string }) => {
      setOpponent(data.opponentSocketId);
    });


    return () => {
      socket.disconnect();
    };
  }, []);

  const handleStartGame = () => {
    alert("Game started!");
    // You can route to game page here or emit start game event
  };

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
              <code className="select-all break-words text-sm">{socketId || "Connecting..."}</code>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Separator */}
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
