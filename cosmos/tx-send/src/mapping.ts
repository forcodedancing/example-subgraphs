import { cosmos } from "@graphprotocol/graph-ts";
import { MsgSend, MsgCoin, decodeMsgSend } from "./decoding";
import { Send, Coin } from "../generated/schema";

export function handleTx(data: cosmos.TransactionData): void {
  const id = `${data.block.header.hash.toHexString()}-${data.tx.index}`;
  const messages = data.tx.tx.body.messages;

  for (let i = 0; i < messages.length; i++) {
    let msgType = messages[i].typeUrl;
    let msgValue = messages[i].value as Uint8Array;

    if (msgType == "/cosmos.bank.v1beta1.MsgSend") {
      saveSend(id, decodeMsgSend(msgValue)) // The message needs to be decoded to access its attributes.
    }
  }
}

function saveSend(id: string, message: MsgSend): void {
  const msg = new Send(id);

  msg.fromAddress = message.from_address;
  msg.toAddress = message.to_address;
  msg.amount = saveCoin(id, message.amount as MsgCoin);

  msg.save();
}

function saveCoin(id: string, c: MsgCoin): string {
  const coin = new Coin(id);

  coin.amount = c.amount;
  coin.denom = c.denom;

  coin.save();

  return id;
}
