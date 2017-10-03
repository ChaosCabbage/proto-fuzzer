function pairwise(list) 
{
    if (list.length < 2) return []
    const head = list[0]
    const rest = list.slice(1)
    const headpairs = rest.map(x => [head, x])
    const restpairs = pairwise(rest)
    return [].concat(headpairs, restpairs)
}

module.exports = pairwise
