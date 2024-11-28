"use client";

import { useState } from "react";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const VotePoll = () => {
  const [pollId, setPollId] = useState<number | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  // Fetch poll data based on pollId
  const { data: pollData, isLoading, error } = useScaffoldReadContract({
    contractName: "VotingZKP",
    functionName: "getPoll",
    args: [pollId !== null ? BigInt(pollId) : undefined],
    // enabled: pollId !== null, // Only fetch when pollId is set
  });

  const { writeContractAsync, isPending } = useScaffoldWriteContract("VotingZKP");

  const handleVote = async () => {
    if (pollId !== null && selectedOption !== null) {
      try {
        await writeContractAsync({
          functionName: "castVoteWithProof",
          args: [BigInt(pollId), selectedOption],
        });
      } catch (error) {
        console.error("Error casting vote", error);
      }
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-2xl mb-4">Vote on Poll</h1>
      
      <div className="flex items-center space-x-2 mb-4">
        <input
          type="number"
          placeholder="Enter Poll ID"
          value={pollId ?? ''}
          onChange={(e) => {
            const inputValue = e.target.value;
            setPollId(inputValue ? Number(inputValue) : null);
          }}
          className="input input-bordered w-full max-w-xs"
        />
      </div>

      {isLoading && <p>Loading poll information...</p>}
      
      {error && (
        <div className="alert alert-error">
          <p>Error fetching poll: {error.message}</p>
        </div>
      )}

      {pollData && (
        <div className="w-full max-w-md">
          <h2 className="text-xl font-bold mb-3">{pollData[0]}</h2>
          <p className="mb-3">{pollData[1]}</p>

          <div className="space-y-2">
            {pollData[2].map((option: string, index: number) => (
              <div key={index} className="flex items-center">
                <input
                  type="radio"
                  id={`option-${index}`}
                  name="poll-options"
                  value={index}
                  checked={selectedOption === index}
                  onChange={() => setSelectedOption(index)}
                  className="radio mr-2"
                />
                <label htmlFor={`option-${index}`}>{option}</label>
              </div>
            ))}
          </div>

          <button 
            onClick={handleVote}
            disabled={selectedOption === null || isPending}
            className="btn btn-primary mt-4 w-full"
          >
            {isPending ? "Voting..." : "Cast Vote with Proof"}
          </button>
        </div>
      )}
    </div>
  );
};

export default VotePoll;