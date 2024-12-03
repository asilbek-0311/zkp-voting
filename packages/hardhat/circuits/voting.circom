pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/poseidon.circom";
include "../node_modules/circomlib/circuits/comparators.circom";

// Circuit to verify a vote with Poseidon-based commitment
template VoteVerifier() {
    // Public inputs (visible on-chain)
    signal input pollId;
    signal input optionIndex;
    
    // Private inputs (zero-knowledge)
    signal input voterCommitment;   // Unique voter identifier
    signal input secretSalt;        // Randomness for commitment
    signal input randomness;        // Additional vote randomness
    
    // Components for verification
    component commitmentHasher = Poseidon(2);
    component voteHasher = Poseidon(4);
    component nullifierHasher = Poseidon(3);
    component optionValidator = LessThan(32);
    
    // Validate option index
    optionValidator.in[0] <== optionIndex;
    optionValidator.in[1] <== 1000; // Max options
    optionValidator.out === 1;
    
    // Recreate voter commitment
    commitmentHasher.inputs[0] <== voterCommitment;
    commitmentHasher.inputs[1] <== secretSalt;
    
    // Create vote commitment
    voteHasher.inputs[0] <== pollId;
    voteHasher.inputs[1] <== optionIndex;
    voteHasher.inputs[2] <== voterCommitment;
    voteHasher.inputs[3] <== randomness;
    
    // Create nullifier to prevent double voting
    nullifierHasher.inputs[0] <== pollId;
    nullifierHasher.inputs[1] <== voterCommitment;
    nullifierHasher.inputs[2] <== randomness;
    
    // Public outputs
    signal output voteCommitment;
    signal output nullifierHash;
    
    // Assign outputs
    voteCommitment <== voteHasher.out;
    nullifierHash <== nullifierHasher.out;
}

// Make the circuit the main component
component main = VoteVerifier();