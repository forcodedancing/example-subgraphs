import { Protobuf, Reader } from "as-proto";

export function decodeMsgSend(a: Uint8Array): MsgSend {
  return Protobuf.decode<MsgSend>(a, MsgSend.decode);
}

export class MsgSend {
  static decode(reader: Reader, length: i32): MsgSend {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new MsgSend();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.from_address = reader.string();
          break;

        case 2:
          message.to_address = reader.string();
          break;

        case 3:
          message.amount = MsgCoin.decode(reader, reader.uint32());
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  from_address: string;
  to_address: string;
  amount: MsgCoin | null;

  constructor(from_address: string = "", to_address: string = "", amount: MsgCoin | null = null) {
    this.from_address = from_address;
    this.to_address = to_address;
    this.amount = amount;
  }
}

export class MsgCoin {
  static decode(reader: Reader, length: i32): MsgCoin {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new MsgCoin();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.denom = reader.string();
          break;

        case 2:
          message.amount = reader.string();
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  denom: string;
  amount: string;

  constructor(denom: string = "", amount: string = "") {
    this.denom = denom;
    this.amount = amount;
  }
}
