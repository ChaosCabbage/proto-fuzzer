const Mutate = require("./mutateProtoMessage")

function check_fatality(message, err) {
    if (err && err.code == 14) {
        console.error("Service has become UNAVAILABLE in response to the following message:")
        console.error(JSON.stringify(message, null, "  "))
        process.exit(0)
    }
}

module.exports = function run_proto_mutations(
    RequestType,
    grpc_client,
    rpc_endpoint_name,
    initial_message
) {

    grpc_client[rpc_endpoint_name](initial_message, (err, res) => {
        if (err) {
            console.error(`Unfuzzed message produced a gRPC error (${err.code}).`)
            console.error("It is likely that the service is not running correctly. Quitting.")
            return
        }

        const mutations = Mutate(RequestType, initial_message)
        call_all_serial(mutations, mutations.length)
    })

    function call_all_serial(message_list, total) {
        if (message_list.length == 0) {
            console.log("Done.")
            return
        }

        const n = total - message_list.length + 1
        const label = `Mutation [${n}/${total}]`

        console.time(label)

        const m = message_list.shift()

        grpc_client[rpc_endpoint_name](m, (err, res) => {
            console.timeEnd(label)
            check_fatality(m, err)
            call_all_serial(message_list, total)
        })

    }
}
