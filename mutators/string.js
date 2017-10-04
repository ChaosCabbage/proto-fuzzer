module.exports = {
    constants: [
        "",
        "\0",
        "$HOME", 
        "\n\n\n\r\n", 
        "%s%d", 
        "null",
        "' OR 1=1/*",
        "bob".repeat(10000)
    ],
    mutators: [
        s => s.repeat(1000),
        s => s + "\n",
        s => "\0" + s,
        s => s.toUpperCase(),
        s => "!" + s
    ]
}
