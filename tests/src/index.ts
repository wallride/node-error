import * as lib from './../../build/index'
import {expect} from 'chai'

describe('Errors', () => {
    it('messages', ()=>{
        abstract class AbstractError extends lib.Error {
            protected getNamePrefix(): string { return 'COMMON:';}
        }

        class CustomFooError extends AbstractError {
            constructor(context) {
                super(context, 'Some FOO error message');
            }
        }

        class CustomBarError extends AbstractError {
            constructor(context, e: Error) {
                super(context, 'Some BAR error message', e);
            }
        }

        class Foo {
            makeError(){ throw new CustomFooError(this);}
        }

        function bar(){
            try{
                new Foo().makeError();
            } catch (e) { throw new CustomBarError(this, e).addItem('Some', 'item'); }
        }

        try {
            bar();
        }catch (e){
            // console.log(e);
            // throw e;

            expect(e.name).to.eq('COMMON:CUSTOM_BAR_ERROR', 'Error.name');
            return;
        }
        throw new Error('Error has not happened');
    });
});
