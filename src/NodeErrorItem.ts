import * as util from 'util'

export class NodeErrorItem {
    constructor(public name:string, public value:any, protected depth:number = 2) {}

    getInspectValue():string {
        try {
            return util.inspect(this.value, true, this.depth);
        }
        catch(e){
            return '-- unable to inspect value --\n' + e.message;
        }
    }
}