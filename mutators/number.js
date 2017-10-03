// It would be better to separate out numbers into individual types.
// int32, int64, double, float...
// Maybe later.

module.exports = {
    constants: [
        0, 
        -1, 
        1, 
        2, 
        10000000, 
        -10000000,
        2147483647,
        -2147483648
    ],
    mutators: [
        x => x+1,
        x => x-1,
        x => x+35,
        x => x-35,
        x => -x        
    ]
}
    
// That's Numberwang!

