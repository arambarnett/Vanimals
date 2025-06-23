/* eslint-disable no-console */
import { createContext, useContext, useMemo, useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";

// Dynamic import for client-side only
let PWCore, RawTransaction, AddressType, Transaction, EthProvider, PwCollector, EthSigner, OutPoint, CellDep, Builder, Address, Amount, Script, Cell;

// Only import on client side
if (typeof window !== 'undefined') {
  import("@lay2/pw-core").then((module) => {
    PWCore = module.default;
    RawTransaction = module.RawTransaction;
    AddressType = module.AddressType;
    Transaction = module.Transaction;
    EthProvider = module.EthProvider;
    PwCollector = module.PwCollector;
    EthSigner = module.EthSigner;
    OutPoint = module.OutPoint;
    CellDep = module.CellDep;
    Builder = module.Builder;
    Address = module.Address;
    Amount = module.Amount;
    Script = module.Script;
    Cell = module.Cell;
  }).catch(console.error);
}
import APIEndpoints from "APIEndpoints";
import { useResource } from "hooks";
import { useSession } from "./Session";

let pwCore = null;
const NODE_URL = `${process.env.NEXT_PUBLIC_API_URL}/node`;

const parseTransaction = async (transaction) => {
  const hxShannonToCKB = (hexString) => Number(parseInt(hexString, 16) / 1.0e8);
  const { rawTransaction, filteredInputCells } = transaction;
  const inputsCells = filteredInputCells.map((cell) => new Cell(
    new Amount(hxShannonToCKB(cell.capacity), 8),
    new Script(
      cell.lock.codeHash,
      cell.lock.args,
      cell.lock.hashType,
    ),
    cell.type ? new Script(
      cell.type.codeHash,
      cell.type.args,
      cell.type.hashType,
    ) : undefined,
    new OutPoint(
      cell.outPoint.txHash,
      cell.outPoint.index,
    ),
    cell.data,
  ));
  const outputCells = rawTransaction.outputs.map((cell, i) => new Cell(
    new Amount(hxShannonToCKB(cell.capacity), 8),
    new Script(
      cell.lock.codeHash,
      cell.lock.args,
      cell.lock.hashType,
    ),
    cell.type ? new Script(
      cell.type.codeHash,
      cell.type.args,
      cell.type.hashType,
    ) : undefined,
    cell.outPoint ? new OutPoint(
      cell.outPoint.txHash,
      cell.outPoint.index,
    ) : undefined,
    rawTransaction.outputsData[i],
  ));
  const cellDeps = rawTransaction.cellDeps.map((cell) => new CellDep(
    cell.depType === "depGroup" ? "dep_group" : "code",
    new OutPoint(
      cell.outPoint.txHash,
      cell.outPoint.index,
    ),
  ));
  const { headerDeps } = rawTransaction;
  const transactionToSign = new Transaction(
    new RawTransaction(inputsCells, outputCells, cellDeps, headerDeps),
    [Builder.WITNESS_ARGS.Secp256k1],
  );
  transactionToSign.validate();
  return transactionToSign;
};
export const BlockchainContext = createContext({
  balance: 0,
  address: "",
  addressCKB: "",
});
export const useBlockchain = () => useContext(BlockchainContext);
export const BlockchainProvider = ({ children }) => {
  const { data: session } = useSession();

  const [signer, setSigner] = useState(null);
  const [address, setAddress] = useState("");
  const [addressCKB, setAddressCKB] = useState("");
  
  const { data: balance } = useResource(
    addressCKB
      ? APIEndpoints.USER.GET_BALANCE(addressCKB)
      : null,
  );

  const signTransaction = useCallback(async (transaction) => {
    if (transaction) {
      if (!window.ethereum.selectedAddress) {
        throw new Error("NO_CKB_ADDRESS");
      }

      try {
        const transactionToSign = await parseTransaction(transaction);
        return await pwCore.sendTransaction(transactionToSign, signer);
      } catch (error) {
        console.error("pwcore execution fail: ", error.message);
        throw new Error("CANNOT_PROCESS_TRANSACTION");
      }
    } else {
      console.error("transaction fail: cannot retrieve information for the current transaction");
      throw new Error("CANNOT_PROCESS_TRANSACTION");
    }
  }, [signer]);
  useEffect(() => {
    if (session) {
      (async () => {
        try {
          pwCore = await new PWCore(NODE_URL).init(
            new EthProvider(), // a built-in Provider for Ethereum env.
            new PwCollector(), // a custom Collector to retrive cells from cache server.
          );
          const metamask = session.user.authenticationMethods.find((am) => am.method === "metamask");
          const address = new Address(metamask.value, AddressType.eth);
          const signer = new EthSigner(address.addressString);
          
          setSigner(signer);
          setAddress(address.addressString);
          setAddressCKB(address.toCKBAddress());
        } catch (err) {
          console.error("pwcore execution fail: ", err.message);
        }
      })();
    }
  }, [session]);
 
  const data = useMemo(() => ({
    balance: balance?.ckb || 0.00,
    address,
    addressCKB,
    signTransaction,
  }), [balance, address, addressCKB, signTransaction]);
  return (
    <BlockchainContext.Provider value={data}>
      {children}
    </BlockchainContext.Provider>
  );
};
/* eslint-disable react/display-name */
export const withBlockchain = (Component) => (props) => (
  <BlockchainProvider>
    <Component {...props} />
  </BlockchainProvider>
);
