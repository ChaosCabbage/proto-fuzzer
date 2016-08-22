#  A (dumb) fuzz tester for gRPC and Protocol Buffers

Currently, the only functionality is the generation of random proto messages,
exported as a function from _randomProtoMessage.js_

Should produce a valid object within your protobuf message definition.

Example:
```
var randomProtoMessage = require("./randomProtoMessage"); 
var grpc = require("grpc");

var myProtos = grpc.load("myProtoFile.proto");

var randomMessage = randomProtoMessage(myProtos.SomeMessageType);
```


   