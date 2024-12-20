import Card from '@/app/card';

export default class Workflow {
    constructor(title: string = '', cards: Card[] = [new Card()]) {
        this.title = title;
        this.cards = cards;
    }
    title: string;
    cards: Card[];
}