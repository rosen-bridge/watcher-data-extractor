import { block, loadDataBase, permitAddress, RWTId } from "./utils.mock";
import { PermitExtractor } from "./permitExtractor";


describe('permitExtractor', ()=> {
    describe("getId",()=> {
        it("should return id of the extractor",async ()=>{
            const db = await loadDataBase("permit")
            const extractor = new PermitExtractor("extractorId", db, permitAddress, RWTId)
            const data = extractor.getId()
            expect(data).toBe("extractorId")
        })
    })

    describe("processTransactions", ()=> {
        it("", async ()=> {
            const db = await loadDataBase("permit")
            const extractor = new PermitExtractor("extractorId", db, permitAddress, RWTId)
            const data = extractor.processTransactions([], block)
        })
    })
})





