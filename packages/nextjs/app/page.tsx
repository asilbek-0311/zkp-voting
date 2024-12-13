"use client";

import Link from "next/link";
import type { NextPage } from "next";
import { useAccount, UseReadContractReturnType } from "wagmi";
import { useEffect, useMemo, useState } from "react";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

// Types
interface Poll {
  id: bigint;
  name: string;
  prompt: string;
  options: string[];
  endTime: bigint;
  nftAddress: string;
  exists: boolean;
  creator: string;
  voteCounts: bigint[];
}

type PollInfo = Omit<Poll, 'id' | 'voteCounts'>

type ContractReturnType<T> = Omit<UseReadContractReturnType<unknown, unknown, unknown, unknown>, "data"> & { data: T }

// Main component

const Home: NextPage = () => {

  const { address: connectedAddress } = useAccount();
  const [userPolls, setUserPolls] = useState<Poll[]>([]);

  const { data: pollIdsByCreator, isLoading: isLoadingPollIds } = useScaffoldReadContract({
    contractName: "Voting",
    functionName: "getPollsByCreator",
    args: [connectedAddress],
    watch: true,
  }) as ContractReturnType<bigint[]>;


  useEffect(() => {
    const fetchPollDetails = async () => {
      if (!pollIdsByCreator) return;

      const pollsPromises = pollIdsByCreator.map(async (pollId) => {
        const pollInfo = await useScaffoldReadContract({
          contractName: "Voting",
          functionName: "getPollById",
          args: [pollId],
        });

        const voteCounts = await useScaffoldReadContract({
          contractName: "Voting",
          functionName: "getVoteCounts",
          args: [pollId],
        });

        if (!pollInfo || !voteCounts) return null;

        return {
          id: pollId,
          ...pollInfo,
          voteCounts,
          isActive: pollInfo?.exists ?? false
        } as Poll;
      });

      const polls = (await Promise.all(pollsPromises)).filter(Boolean);
      setUserPolls(polls);
    };

    fetchPollDetails();
  }, [pollIdsByCreator]);

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-3xl mb-6">Poll Management</h1>
          <div className="flex flex-col space-y-4">
            <Link href="/create-poll">
              <button className="btn">Create Poll</button>
            </Link>
            <Link href="/vote-poll">
              <button className="btn">Vote on Poll</button>
            </Link>
          </div>
        </div>

        <div className="w-full max-w-2xl">
          <h2 className="text-2xl mb-4">Your Polls</h2>
          {isLoadingPollIds ? (
            <p>Loading polls...</p>
          ) : userPolls.length === 0 ? (
            <p>No polls found</p>
          ) : (
            <div className="space-y-4">
              {userPolls.map(poll => (
                <div key={poll.id.toString()} className="bg-base-200 p-4 rounded-lg">
                  <h3 className="text-xl font-semibold">{poll.name}</h3>
                  <p className="text-sm">Status: {poll.exists ? 'Active' : 'Finished'}</p>
                  <div className="mt-2">
                    {poll.options?.map((option, index) => (
                      <div key={index} className="flex justify-between">
                        <span>{option}:</span>
                        <span>{poll.voteCounts?.[index]?.toString() ?? '0'} votes</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </>
  );
};

export default Home;
