function repeat(arr, n)
{
    if (n == 1) { return arr }
    return arr.concat(repeat(arr, n-1))
}

module.exports = {
    constants: [
        []   
    ],
    mutators: [
        arr => repeat(arr, 100)
    ]
}
