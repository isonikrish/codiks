"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { problem } from "@/lib/problem";
import { getSocket } from "@/lib/socket";
import Editor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
//@ts-ignore
import * as vm from "vm-browserify";

export default function BattlePage() {
  const params = useParams();
  const battleId = params.battleId as string;
  const socket = getSocket();
  const searchParams = useSearchParams();

  const [code, setCode] = useState("");
  const [winnerMessage, setWinnerMessage] = useState("");
  const [testResults, setTestResults] = useState<
    { passed: boolean; expected: any; got: any }[]
  >([]);

  // Extract playerSocketId from search params (must be passed in URL)
  const playerSocketId = searchParams.get("playerSocketId");

  // Handle editor changes
  const handleEditorChange = (value?: string) => {
    if (value !== undefined) setCode(value);
  };

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

  // Submit code and test results to backend via socket
  const handleEndBattle = () => {
    const results = runTestCases();
    const passCount = results.filter((r) => r.passed).length;

    socket.emit("end-battle", {
      battleId,
      passCount,
      code,
    });
  };

  useEffect(() => {
    // Listen to battle-ended event
    socket.on("battle-ended", (data) => {
      console.log("battle-ended event data:", data); // ADD THIS

      if (!playerSocketId) return;

      if (!data.winner) {
        setWinnerMessage("🤝 It's a draw!");
      } else if (data.winner === playerSocketId) {
        setWinnerMessage("🏆 You won!");
      } else {
        setWinnerMessage("❌ You lost!");
      }
    });

    return () => {
      socket.off("battle-ended");
    };
  }, [socket, playerSocketId]);
  console.log(winnerMessage)
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
          }}
        />
      </div>

      <Button onClick={handleEndBattle}>Submit Code</Button>

      {testResults.length > 0 && (
        <div className="mt-4 p-4 bg-gray-900 rounded-lg max-h-60 overflow-y-auto">
          <h3 className="text-xl font-semibold mb-2">Test Results:</h3>
          <ul className="space-y-1">
            {testResults.map((res, idx) => (
              <li
                key={idx}
                className={`text-sm ${res.passed ? "text-green-400" : "text-red-400"
                  }`}
              >
                Test #{idx + 1}: {res.passed ? "✅ Passed" : "❌ Failed"} |{" "}
                Expected: {String(res.expected)}, Got: {String(res.got)}
              </li>
            ))}
          </ul>
        </div>
      )}

      {winnerMessage && (
        <div className="mt-4 text-2xl font-bold text-center text-yellow-400">
          {winnerMessage}
        </div>
      )}
    </div>
  );
}
