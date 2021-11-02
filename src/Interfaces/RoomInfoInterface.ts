export interface roomInfoInterface {
    ids: string[];
    grid: squareInterface[]
}

export type waitingQueueType = Record<string, {
    id: String;
}>




// Wall, Empty, Base, Base occupied by player
export interface squareInterface {
    x: number;
    y: number;
    type: "W" | "E" | "B" | "Bp";
    roads: boolean[];
    player: null | 'A' | "B";
    isHead: boolean
}
