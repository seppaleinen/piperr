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
    constructor(title: string = 'Unnamed workflow', cards: Card[] = [new Card()], agent: Agent = new Agent()) {
        this.agent = agent;
        this.title = title;
        this.cards = cards;
    }

    agent: Agent;
    title: string;
    cards: Card[];
}

export class Agent {
    constructor(id: number = 0,
                ip: string = '',
                sudo_password: string = '',
                os: string = '',
                nickname: string = '',
                main: boolean = false,
                shell: string = '',
                username: string = '') {
        this.id = id;
        this.ip = ip;
        this.sudo_password = sudo_password;
        this.os = os;
        this.nickname = nickname;
        this.main = main;
        this.shell = shell;
        this.username = username;
    }

    id: number;
    ip: string;
    sudo_password: string;
    os: string;
    nickname: string;
    main: boolean;
    shell: string;
    username: string;
}

export class Settings {
    constructor(agents: Agent[] = [new Agent()]) {
        this.agents = agents;
    }

    agents: Agent[];
}