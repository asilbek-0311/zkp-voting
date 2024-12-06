"use client";

import { useState } from "react";
import { parseEther } from "viem";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
 // Assuming you're using wagmi for contract interaction
// import YourContract from "~~/path/to/YourContract.json"; // Adjust the path to your contract's ABI

const CreatePoll = () => {
  const [pollTitle, setPollTitle] = useState("");
  const [options, setOptions] = useState(["", ""]); // Initial two options
  const [prompt, setPrompt] = useState("");
  const [timelimit, setTimelimit] = useState(0);
  const [transactionHash, setTransactionHash] = useState<`0x${string}` | undefined>();
  const { writeContractAsync, isPending } = useScaffoldWriteContract("VotingZKP");

//   const contract = useContract({
//     address: "YOUR_CONTRACT_ADDRESS", // Replace with your contract address
//     abi: YourContract.abi,
//   });

  const handleCreatePoll = async () => {
    // Call your contract's createPoll function here
    try {
      // Get the nonce of the chain
        

        const tx = await writeContractAsync({
          functionName: "createPoll",
          args: [pollTitle,prompt,options, BigInt(timelimit)],
        });
        setTransactionHash(tx); // Store the transaction hash
        // Clear input fields
        setPollTitle("");
        setOptions(["", ""]); // Reset to initial two options
        setPrompt("");
        setTimelimit(0);
    } catch (e) {
        // Handle success or error
        console.error("Error setting greeting", e);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl mb-4">Create Poll</h1>
      <input
        type="text"
        placeholder="Poll Title"
        value={pollTitle}
        onChange={(e) => setPollTitle(e.target.value)}
        className="input rounded-sm p-2 w-1/2 mb-2"
        maxLength={256}
      />
      <input
        type="text"
        placeholder="Poll Prompt"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="input rounded p-2 w-1/2 mb-2"
      />
      {options.map((option, index) => (
        <input
          key={index}
          type="text"
          placeholder={`Option ${index + 1}`}
          value={option}
          onChange={(e) => {
            const newOptions = [...options];
            newOptions[index] = e.target.value;
            setOptions(newOptions);
          }}
          className="input rounded p-2 w-1/2 mb-2"
        />
      ))}
      {options.length < 10 && (
        <button
          onClick={() => setOptions([...options, ""])}
          className="btn mt-2 text-sm"
        >
          Add Option
        </button>
      )}
      <input
        type="number"
        placeholder="Time Limit (in minutes)"
        onChange={(e) => setTimelimit(Number(e.target.value))}
        className="input w-1/2 mb-2"
      />
      <button onClick={handleCreatePoll} className="btn mt-4">Submit Poll</button>
      {transactionHash && (
        <div className="mt-4">
          <h2>Transaction Hash:</h2>
          <p>{transactionHash}</p>
        </div>
      )}
    </div>
  );
};

export default CreatePoll;