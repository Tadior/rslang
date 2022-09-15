export interface IUserStatistics {
    userId?: string;
    learnedWords?: number;
    optional?: IOptional | object;
}

export type IOptional = {
    [key: string]: IUserDayStatistic;
};

export interface IUserDayStatistic {
    sprintRow?: number;
    sprintAccuracy?: number;
    audioRow?: number;
    audioAccuracy?: number;
    learnedWords?: number;
    sprintNewWords?: number;
    audioNewWords?: number;
}
