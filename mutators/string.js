module.exports = {
    constants: [
        "" 
       , "$HOME" 
       , "\n\n\n\r\n" 
       , "%s%d" 
       , "null" 
       , "' OR 1=1/*"
  //     , "bob".repeat(10000)       
    ],
    mutators: [
 //       s => s.repeat(1000),
        s => s + "\n",
        s => s.toUpperCase(),
        s => "!" + s
    ]
}
