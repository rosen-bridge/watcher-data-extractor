import { DataSource } from "typeorm";
import * as wasm from 'ergo-lib-wasm-nodejs';
import { PermitEntityAction } from "../actions/permitDB";
import { extractedPermit } from "../interfaces/extractedPermit";
import { AbstractExtractor, BlockEntity } from "@rosen-bridge/scanner";

export class PermitExtractor extends AbstractExtractor<wasm.Transaction>{
    id: string;
    private readonly dataSource: DataSource;
    private readonly actions: PermitEntityAction;
    private readonly permitErgoTree: string;
    private readonly RWT: string;

    constructor(id: string, dataSource: DataSource, address: string, RWT: string) {
        super();
        this.id = id;
        this.dataSource = dataSource;
        this.actions = new PermitEntityAction(dataSource);
        this.permitErgoTree = wasm.Address.from_base58(address).to_ergo_tree().to_base16_bytes();
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
                const boxes: Array<extractedPermit> = [];
                txs.forEach(transaction => {
                    for (let index = 0; index < transaction.outputs().len(); index++) {
                        const output = transaction.outputs().get(index);
                        if (output.tokens().len() > 0 &&
                            output.tokens().get(0).id().to_str() == this.RWT &&
                            output.ergo_tree().to_base16_bytes() === this.permitErgoTree &&
                            output.register_value(4) &&
                            output.register_value(4)!.to_coll_coll_byte() &&
                            output.register_value(4)!.to_coll_coll_byte().length >= 1
                        ) {
                            boxes.push({
                                boxId: output.box_id().to_str(),
                                boxSerialized: Buffer.from(output.sigma_serialize_bytes()).toString("base64"),
                                WID: Buffer.from(output.register_value(4)!.to_coll_coll_byte()[0]).toString()
                            })
                        }

                    }
                });
                this.actions.storePermits(boxes, block, this.getId()).then(() => {
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
