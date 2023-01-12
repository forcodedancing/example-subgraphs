import { cosmos } from "@graphprotocol/graph-ts";
import { TokenTransfer, Token } from "../generated/schema";

export function handleTransfers(data: cosmos.EventData): void {
  const height = data.block.header.height;
  const sender = data.event.getAttributeValue("sender");
  const recipient = data.event.getAttributeValue("recipient");

  let transfer = new TokenTransfer(`${height}-${sender}`);
  transfer.sender = sender;
  transfer.recipient = recipient;
  transfer.token = saveToken(`${height}-${sender}-${recipient}`, data.event.getAttributeValue("amount"));

  transfer.save();
}

function saveToken(id: string, data: string): string {
  const token = new Token(id);

  // When assets are transferred through IBC, they lose their original denomination (i.e ATOM)
  // and obtain a new IBC denomination (i.e. ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2).
  // Check this page (https://docs.osmosis.zone/developing/assets/asset-info.html) for a full list of IBC denomination
  // Both amount and denomination come together in the message value (i.e. 123456uatom), so we need to separate them.
  let tokenDenomLength = data.includes('ibc') ? 68 : 5 // IBC denomination is 68 characters long, OSMO is 5 characters long.

  token.denom = data.substring(data.length - tokenDenomLength, data.length);
  token.amount = data.substring(0, data.length - tokenDenomLength);
  token.save();

  return id;
}
