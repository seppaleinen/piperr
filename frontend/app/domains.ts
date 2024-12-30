export class Card {
    constructor(script: string = '', output: string | null = null, loading: boolean = false) {
        this.script = script;
        this.output = output;
        this.loading = loading;
    }

    script: string;
    output: string | null;
    loading: boolean
}

export class Workflow {
    constructor(title: string = 'Unnamed workflow', cards: Card[] = [new Card()]) {
        this.title = title;
        this.cards = cards;
    }
    title: string;
    cards: Card[];
}

export class Agent {
    constructor(id: number = 0, ip: string = '', sudo_password: string = '') {
        this.id = id;
        this.ip = ip;
        this.sudo_password = sudo_password;
    }
    id: number;
    ip: string;
    sudo_password: string;
}

export class Settings {
    constructor(agents: Agent[] = [new Agent()]) {
        this.agents = agents;
    }
    agents: Agent[];
}