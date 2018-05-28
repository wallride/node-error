import * as util from 'util'
import {NodeErrorItem} from "./NodeErrorItem";

function addTailSpaces(str:string, maxLength:number):string {
    return str + ' '.repeat(maxLength-str.length);
}

function toUpperCase(str:string): string {
    return str.replace(/([A-Z][a-z]+)/g, (x, y)=>{ return "_" + y } )
        .replace(/([A-Z]{2,})/g, (x, y)=>{ return "_" + y })
        .replace(/^_/g, '')
        .toUpperCase();
}

export class NodeError extends Error {
    public error: Error;
    public items: NodeErrorItem[] = [];
    public values: any[] = [];
    protected namePrefix: string;

    constructor(protected context: Object|Function, protected errorMessage: string, ...args:any[] ){
        super();
        Error.captureStackTrace(this, this.constructor);

        this.name = this.getNamePrefix() + toUpperCase(this.constructor.name);

        if (args && args.length){
            for (const arg of args) {
                if (arg instanceof Error) this.setError(arg);
                else if (arg instanceof NodeErrorItem) this.items.push(arg);
                else this.values.push(arg);
            }
        }

        this.prepareMessage();
    }

    protected getContextName(): string {
        if (typeof this.context === 'function' && this.context.name) return this.context.name;
        else if (typeof this.context === 'object') return this.context.constructor.name;
        else return '--unknown '+(typeof this.context)+' context--'
    }

    protected prepareMessage():this {
        this.message = this.toString();

        return this;
    }

    addItem(name:string, value:any, depth: number = 2):this{
        this.items.push(new NodeErrorItem(name, value, depth));

        return this.prepareMessage();
    }


    setError(error:Error):this{
        this.error = error;

        return this;
    }

    /**
     * may be overridden
     * @returns {string}
     */
    protected getNamePrefix(): string { return '';}

    public toString(): string{
        let result = this.name + ' thrown at ' + this.getContextName() + ': \n       ' + this.errorMessage;

        let maxLabelLength = 0;
        for (const item of this.items) {
            if (item.name.length > maxLabelLength) maxLabelLength = item.name.length;
        }

        for (let item of this.items)   result += '\n       - ' + addTailSpaces(item.name + ': ', maxLabelLength+2) + item.getInspectValue();
        for (let value of this.values) result += '\n       - ' + util.inspect(value, true, 1, true);

        if (this.error !== undefined) {
            result += '\n   ----------------------------\n';
            if (this.error instanceof NodeError) result += this.error.toString();
            else if (this.error instanceof Error){
                result += this.error.stack;
            }
            else{
                result += util.inspect(this.error, true, 2, true);
            }
        }

        result += '\n'+this.stack;
        return result;
    }
}