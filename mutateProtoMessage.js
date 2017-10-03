const Mutators = require("./protoMessageMutators")
const Pairwise = require("./pairwise")

function pairMutators(mutators)
{
    const applyTwo = pair => (
        m => pair[1](pair[0](m))
    )

    const pairs = Pairwise(mutators)

    return pairs.map(applyTwo)
}

function NonNull(m) {
    return m !== null
}

module.exports = function(protoMessageSpec, originalMessage)
{
    const mutators = Mutators(protoMessageSpec)
 
    const applyMut = (mutator => mutator(originalMessage))
    
    // Each mutator function will mutate one field of the input message.
    
    // We can apply one at a time:
    const singleFieldMutations = mutators.map(applyMut)

    // We can apply two at a time with some combinatorial tricks:
    const twoFieldMutations = pairMutators(mutators).map(applyMut)
    
    // I'm not sure how much value there is in doing more elaborate combinations
    
    return [].concat(singleFieldMutations, twoFieldMutations).filter(NonNull)
}
