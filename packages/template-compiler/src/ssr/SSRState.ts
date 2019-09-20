import { Statement, BlockStatement, Expression, Program, Identifier, JSNode, Pattern } from '@endorphinjs/template-parser';
import SSROutput from './SSROutput';
import { identifier, literal } from '../lib/ast-constructor';

export interface SSROptions {
    /** List of HTML elements that should be empty */
    empty: string[];
}

interface ImportSpecifier extends JSNode {
    type: 'ImportSpecifier';
    imported: Identifier;
    local: Identifier;
}

export type SSRHelper = 'attr' | 'renderProps' | 'escape';

const defaultOptions: SSROptions = {
    empty: ['img', 'meta', 'link', 'br', 'base', 'hr', 'area', 'wbr', 'col', 'embed', 'input', 'param', 'source', 'track']
};

export default class SSRState {
    public options: SSROptions;
    public output: SSROutput;
    public program: Program = { type: 'Program', body: [], raw: '' };

    private usedHelpers = new Set<SSRHelper>();
    private _scope = identifier('scope');

    constructor(options: Partial<SSROptions>) {
        this.options = { ...defaultOptions, ...options };
    }

    /**
     * Returns symbol for referencing local scope
     */
    get scope(): Identifier {
        if (this.output) {
            this.output.mountScope(this._scope);
        }
        return this._scope;
    }

    /**
     * Marks given helper function as used
     */
    use(fn: SSRHelper): SSRHelper {
        this.usedHelpers.add(fn);
        return fn;
    }

    /**
     * Enters new output context and runs `callback` in it
     */
    enter(name: string, params: Pattern[], callback: (out: SSROutput) => void, exports?: boolean) {
        const { output } = this;
        this.output = new SSROutput(name, params);
        callback(this.output);
        const fn = this.output.finalize();
        if (exports) {
            this.program.body.push({
                type: 'ExportDefaultDeclaration',
                declaration: fn
            } as any as Statement);
        } else {
            this.program.body.push(fn);
        }
        this.output = output;
    }

    /**
     * Runs given `callback` in context of `block`. All output content will be added
     * into accumulator inside `block`
     */
    run(block: BlockStatement, callback: () => void) {
        return this.output.run(block, callback);
    }

    /**
     * Adds given statement into output block
     */
    add<T extends Statement>(statement: T) {
        return this.output.add(statement);
    }

    /**
     * Pushes given value into output
     */
    out(...args: Array<string | Expression>) {
        args.forEach(arg => this.output.out(arg));
    }

    finalize(): Program {
        if (this.usedHelpers.size) {
            // Import runtime helpers
            const specifiers: ImportSpecifier[] = Array.from(this.usedHelpers).map(id => ({
                type: 'ImportSpecifier',
                imported: identifier(id),
                local: identifier(id),
            }));

            this.program.body.unshift({
                type: 'ImportDeclaration',
                specifiers,
                source: literal('endorphin/ssr')
            } as any as Statement);
        }

        return this.program;
    }
}
