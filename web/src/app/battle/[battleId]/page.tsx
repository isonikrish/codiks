"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { problem } from "@/lib/problem";
import Editor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
//@ts-ignore
import * as vm from "vm-browserify";
import { useSocket } from "@/stores/SocketProvider";

export default function BattlePage() {
  const params = useParams();
  const battleId = params.battleId as string;
  const searchParams = useSearchParams();
  const [code, setCode] = useState("");
  const [testResults, setTestResults] = useState<
    { passed: boolean; expected: any; got: any }[]
  >([]);
  const [battleResult, setBattleResult] = useState<{
    winner: string | null;
    player1PassCount: number;
    player2PassCount: number;
  } | null>(null);

  const playerSocketId = searchParams.get("playerSocketId");
  const socket = useSocket();

  // Listen for battle ended event
  useEffect(() => {
    if (!socket) return;

    const handleBattleEnded = (result: {
      winner: string;
      player1PassCount: number;
      player2PassCount: number;
    }) => {
      setBattleResult(result);
    };

    socket.on("battle-ended", handleBattleEnded);

    return () => {
      socket.off("battle-ended", handleBattleEnded);
    };
  }, [socket]);

  // Handle editor changes
  const handleEditorChange = (value?: string) => {
    if (value !== undefined) setCode(value);
  };
console.log(battleResult)
  // Run test cases locally in browser using vm-browserify
  const runTestCases = () => {
    if (!code) return [];

    try {
      const script = new vm.Script(`(${code})`);
      const func = script.runInNewContext();

      let results: { passed: boolean; expected: any; got: any }[] = [];

      problem.testCases.forEach((test) => {
        const result = func(test.input.a, test.input.b);
        const pass = result === test.output;
        results.push({
          passed: pass,
          expected: test.output,
          got: result,
        });
      });

      setTestResults(results);
      return results;
    } catch (err) {
      setTestResults([]);
      return [];
    }
  };

  const handleSubmit = () => {
    const results = runTestCases(); // Reuse the local runner
    if (!results.length) return;
    if (socket && battleId && playerSocketId) {
      socket.emit("submit-code", battleId, playerSocketId, results);
    }
  };

  if (!socket) {
    return <p>Connecting to socket...</p>;
  }

  return (
    <div className="h-screen w-screen p-4 flex flex-col gap-4 bg-black text-white">
      <h1 className="text-2xl font-semibold">Battle ID: {battleId}</h1>

      <div className="border p-4 rounded-lg bg-gray-900">
        <h2 className="text-xl font-bold mb-2">{problem.title}</h2>
        <p className="mb-2">{problem.description}</p>
        <pre className="bg-gray-800 p-2 rounded mb-2 whitespace-pre-wrap">
          <strong>Example:</strong>
          {"\n"}
          {problem.example}
        </pre>
        <ul className="list-disc list-inside text-sm text-gray-300">
          {problem.constraints.map((constraint, idx) => (
            <li key={idx}>{constraint}</li>
          ))}
        </ul>
      </div>

      <div className="flex-1 border rounded-lg overflow-hidden">
        <Editor
          height="100%"
          defaultLanguage="javascript"
          theme="vs-dark"
          value={code}
          onChange={handleEditorChange}
          options={{
            minimap: { enabled: false },
            fontSize: 16,
            readOnly: battleResult !== null, // disable editing after battle ends
          }}
        />
      </div>
      <div className="flex gap-3 justify-end">
        <Button variant={"outline"} onClick={runTestCases} disabled={!!battleResult}>
          Run Code
        </Button>
        <Button onClick={handleSubmit} disabled={!!battleResult}>
          Submit
        </Button>
      </div>

      {testResults.length > 0 && (
        <div className="mt-4 p-4 bg-gray-900 rounded-lg max-h-60 overflow-y-auto">
          <h3 className="text-xl font-semibold mb-2">Test Results:</h3>
          <ul className="space-y-1">
            {testResults.map((res, idx) => (
              <li
                key={idx}
                className={`text-sm ${res.passed ? "text-green-400" : "text-red-400"}`}
              >
                Test #{idx + 1}: {res.passed ? "✅ Passed" : "❌ Failed"} | Expected:{" "}
                {String(res.expected)}, Got: {String(res.got)}
              </li>
            ))}
          </ul>
        </div>
      )}

      {battleResult && (
        <div className="mt-6 p-4 rounded-lg bg-green-800 text-white font-bold text-center">
          {battleResult.winner === playerSocketId ? (
            <>🎉 You won! 🎉</>
          ) : (
            <>😞 You lost! 😞</>
          )}
          <p className="mt-2">
            Your Score:{" "}
            {battleResult.winner === playerSocketId
              ? battleResult.player1PassCount
              : battleResult.player2PassCount}
            <br />
            Opponent's Score:{" "}
            {battleResult.winner === playerSocketId
              ? battleResult.player2PassCount
              : battleResult.player1PassCount}
          </p>
        </div>
      )}
    </div>
  );
}
