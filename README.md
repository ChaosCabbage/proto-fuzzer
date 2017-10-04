#  A fuzz tester for gRPC and proto3

Currently, the functionality is spread around a little:

- _randomProtoMessage.js_: A function to produce purely random messages
- _mutateProtoMessage.js_: Deterministic mutations of an existing message

Either should produce a valid object within your protobuf message definition.

- _runner.js_: Sends all the deterministic mutations at a running gRPC service until it crashes

## Examples

*myProtoFile.proto*
```
syntax = "proto3";

message SomeMessageType {
	message SubMessage {
		bool x = 1;
	}

	uint32          alice   = 1;
	repeated string bob     = 2;
	SubMessage      charlie = 3;  
}

service Somethingness {
	rpc DoSomething (SomeMessageType) returns (SomeMessageType);
}
```

Example usage:
```js
const grpc = require("grpc")
const protos = grpc.load("myProtoFile.proto");
const run = require("./runner")

const grpcClient = new protos.Somethingness("localhost:50001", grpc.credentials.createInsecure())

const RequestType = protos.SomeMessageType

var initialMessage = {
	alice: 3,
	bob: ["john", "paul"],
	charlie: {
		x: true	
	}
}

run(
    RequestType,
    grpcClient,
    "doSomething",
    initialMessage
)
```

## Mutation strategy
If you come up with too much random data, you probably won't get very deep into your service.
The deterministic mutators will do either one or two subtle (or unsubtle) changes to your input. 
The idea is that you will get past the obvious error checks and penetrate deeper into the code. 

Here's a few articles I read:

https://www.mwrinfosecurity.com/our-thinking/15-minute-guide-to-fuzzing/
https://lcamtuf.blogspot.co.uk/2014/08/binary-fuzzing-strategies-what-works.html

## Todo
- Finish the implementation of mutators for all protobuf types
  - Different number types, in particular
- Non-deterministic mutations
- Make it easier to specify a database of inputs or input mutators
