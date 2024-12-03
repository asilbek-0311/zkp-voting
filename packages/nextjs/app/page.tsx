"use client";

import Link from "next/link";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useEffect, useMemo, useState } from "react";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";


const Home: NextPage = () => {

  // // Define the Poll type
  // interface Poll {
  //   voteCounts?: readonly bigint[];
  //   isActive?: boolean;
  //   name?: string;
  //   prompt?: string;
  //   options?: readonly string[];
  //   endTime?: bigint;
  //   exists?: boolean;
  //   creator?: string;
  //   id: bigint;
  // }

  // const { address: connectedAddress } = useAccount();
  // console.log(connectedAddress);
  // // const [userPolls, setUserPolls] = useState<Poll[]>([]);

  // const { data: pollIdsByCreator, isLoading: isLoadingPollIds } = useScaffoldReadContract({
  //   contractName: "VotingZKP",
  //   functionName: "getPollsByCreator",
  //   args: [connectedAddress],
  //   watch: true
  // });

  // // Use useMemo to create poll details more efficiently
  // const userPolls = useMemo(() => {
  //   if (!pollIdsByCreator) return [];

  //   return pollIdsByCreator.map(pollId => {
  //     // Use separate hooks for each poll detail
  //     const {data: pollInfo, isLoading: isLoadingPollInfo } = useScaffoldReadContract({
  //       contractName: "VotingZKP",
  //       functionName: "getPollById",
  //       args: [pollId],
  //       watch: true
  //     });

  //     const { data: voteCounts, isLoading: isLoadingVoteCounts } = useScaffoldReadContract({
  //       contractName: "VotingZKP",
  //       functionName: "getVoteCounts",
  //       args: [pollId],
  //       watch: true
  //     });

  //     // Only return a complete poll if all data is loaded
  //     if (isLoadingPollInfo || isLoadingVoteCounts) return null;

  //     return {
  //       id: pollId,
  //       ...pollInfo,
  //       voteCounts,
  //       isActive: pollInfo?.exists ?? false
  //     } as Poll;
  //   }).filter(Boolean);  // Remove any null entries
  // }, [pollIdsByCreator]);

  // // Loading and error states
  // if (isLoadingPollIds) {
  //   return <div>Loading polls...</div>;
  // }

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

        {/* <div>
          <h2>Your Polls</h2>
          {userPolls.length === 0 ? (
            <p>No polls found</p>
          ) : (
            userPolls.map(poll => (
              <div key={poll.id.toString()}>
                <h3>{poll.name}</h3>
                <p>Status: {poll.isActive ? 'Active' : 'Finished'}</p>
                <div>
                  {poll.options?.map((option, index) => (
                    <div key={index}>
                      {option}: {poll.voteCounts?.[index]?.toString() ?? '0'} votes
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div> */}


        <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
          <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <BugAntIcon className="h-8 w-8 fill-secondary" />
              <p>
                Tinker with your smart contract using the{" "}
                <Link href="/debug" passHref className="link">
                  Debug Contracts
                </Link>{" "}
                tab.
              </p>
            </div>
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <MagnifyingGlassIcon className="h-8 w-8 fill-secondary" />
              <p>
                Explore your local transactions with the{" "}
                <Link href="/blockexplorer" passHref className="link">
                  Block Explorer
                </Link>{" "}
                tab.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
