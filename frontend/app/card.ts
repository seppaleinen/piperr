export default class Card {
    constructor(script: string = '', output: string | null = null, loading: boolean = false) {
        this.script = script;
        this.output = output;
        this.loading = loading;
    }

    script: string;
    output: string | null;
    loading: boolean
}