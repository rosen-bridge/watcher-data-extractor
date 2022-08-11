import { DataSource } from "typeorm";
import * as wasm from 'ergo-lib-wasm-nodejs';
import { EventTriggerDB } from "../actions/EventTriggerDB";
import { AbstractExtractor, BlockEntity } from "@rosen-bridge/scanner";
import { ExtractedEventTrigger } from "../interfaces/extractedEventTrigger";

export class EventTriggerExtractor extends AbstractExtractor<wasm.Transaction>{
    id: string;
    private readonly dataSource: DataSource;
    private readonly actions: EventTriggerDB;
    private readonly eventTriggerErgoTree: string;
    private readonly RWT: string;

    constructor(id: string, dataSource: DataSource, address: string, RWT: string) {
        super();
        this.id = id;
        this.dataSource = dataSource;
        this.actions = new EventTriggerDB(dataSource);
        this.eventTriggerErgoTree = wasm.Address.from_base58(address).to_ergo_tree().to_base16_bytes();
        this.RWT = RWT;
    }

    getId = () => this.id;

    /**
     * gets block id and transactions corresponding to the block and saves if they are valid rosen
     *  transactions and in case of success return true and in case of failure returns false
     * @param block
     * @param txs
     */
    processTransactions = (txs: Array<wasm.Transaction>, block: BlockEntity): Promise<boolean> => {
        return new Promise((resolve, reject) => {
            try {
                const boxes: Array<ExtractedEventTrigger> = [];
                txs.forEach(transaction => {
                    for (let index = 0; index < transaction.outputs().len(); index++) {
                        const output = transaction.outputs().get(index);
                        const r4 = output.register_value(4);
                        const r5 = output.register_value(5);
                        try {
                            if (r4 && r5) {
                                const R5Serialized = r5.to_coll_coll_byte();
                                const R4Serialized = r4.to_coll_coll_byte();
                                if (output.tokens().len() > 0 &&
                                    output.tokens().get(0).id().to_str() == this.RWT &&
                                    R4Serialized.length >= 1 &&
                                    R5Serialized.length >= 11 &&
                                    output.ergo_tree().to_base16_bytes() === this.eventTriggerErgoTree) {
                                    const WIDs = R4Serialized.map(byteArray => {
                                        Buffer.from(byteArray).toString()
                                    }).join(',');
                                    boxes.push({
                                        boxId: output.box_id().to_str(),
                                        boxSerialized: Buffer.from(output.sigma_serialize_bytes()).toString("base64"),
                                        toChain: Buffer.from(R5Serialized[2]).toString(),
                                        toAddress: Buffer.from(R5Serialized[4]).toString(),
                                        networkFee: Buffer.from(R5Serialized[7]).toString(),
                                        bridgeFee: Buffer.from(R5Serialized[6]).toString(),
                                        amount: Buffer.from(R5Serialized[5]).toString(),
                                        sourceChainTokenId: Buffer.from(R5Serialized[8]).toString(),
                                        targetChainTokenId: Buffer.from(R5Serialized[9]).toString(),
                                        sourceTxId: Buffer.from(R5Serialized[0]).toString(),
                                        fromChain: Buffer.from(R5Serialized[1]).toString(),
                                        fromAddress: Buffer.from(R5Serialized[3]).toString(),
                                        sourceBlockId: Buffer.from(R5Serialized[10]).toString(),
                                        WIDs: WIDs,
                                    })
                                }
                            }

                        } catch {
                            return;
                        }
                    }
                });
                this.actions.storeEventTriggers(boxes, block, this.getId()).then(() => {
                    resolve(true)
                }).catch((e) => {
                    console.log(`Error in soring permits of the block ${block}`)
                    console.log(e);
                    reject(e)
                })
            } catch (e) {
                reject(e);
            }
        });
    }

    forkBlock = async (hash: string) => {
        await this.actions.deleteBlock(hash, this.getId());
    }
}
