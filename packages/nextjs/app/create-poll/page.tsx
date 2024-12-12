"use client";

import { useState } from "react";
import { isAddress, parseEther } from "viem";
import { AddressInput } from "~~/components/scaffold-eth";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
 // Assuming you're using wagmi for contract interaction
// import YourContract from "~~/path/to/YourContract.json"; // Adjust the path to your contract's ABI

const CreatePoll = () => {
  const [pollTitle, setPollTitle] = useState("");
  const [options, setOptions] = useState(["", ""]); // Initial two options
  const [prompt, setPrompt] = useState("");
  const [timelimit, setTimelimit] = useState(0);

  const [useNftAddress, setUseNftAddress] = useState(false);
  const [nftAddress, setNftAddress] = useState("");
  const [addressError, setAddressError] = useState("");

  const [transactionHash, setTransactionHash] = useState<`0x${string}` | undefined>();
  const { writeContractAsync, isPending } = useScaffoldWriteContract("Voting");

  // Function to handle NFT address validation
  const handleNftAddressChange = (address: string) => {
    setNftAddress(address);
    
    // Validate address if toggle is on
    if (useNftAddress) {
      if (address === "") {
        setAddressError("NFT address cannot be empty");
        return;
      }
      
      if (!isAddress(address)) {
        setAddressError("Invalid Ethereum address");
        return;
      }
      
      // Clear any previous error if address is valid
      setAddressError("");
    }
  };

  const handleCreatePoll = async () => {
    // Determine the final NFT address to pass to contract
    const finalNftAddress = useNftAddress && !addressError ? nftAddress : "0x0000000000000000000000000000000000000000";

    try {
      const tx = await writeContractAsync({
        functionName: "createPoll",
        args: [
          pollTitle, 
          prompt, 
          options, 
          BigInt(timelimit), 
          finalNftAddress
        ],
      });
      
      setTransactionHash(tx);
      
      // Reset form
      setPollTitle("");
      setOptions(["", ""]);
      setPrompt("");
      setTimelimit(0);
      setNftAddress("");
      setUseNftAddress(false);
    } catch (e) {
      console.error("Error creating poll", e);
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

      {/* NFT Address Toggle */}
      <div className="flex items-center w-1/2 mb-2">
        <label className="mr-2">Use NFT Address Restriction:</label>
        <input 
          type="checkbox" 
          checked={useNftAddress}
          onChange={() => {
            setUseNftAddress(!useNftAddress);
            // Reset address when toggling
            setNftAddress("");
            setAddressError("");
          }}
          className="toggle"
        />
      </div>

      {/* Conditional NFT Address Input */}
      {useNftAddress && (
        <div className="w-1/2">
          <AddressInput
            placeholder="NFT Contract Address"
            value={nftAddress}
            onChange={handleNftAddressChange}
          />
          {addressError && (
            <p className="text-red-500 text-sm mt-1">{addressError}</p>
          )}
        </div>
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