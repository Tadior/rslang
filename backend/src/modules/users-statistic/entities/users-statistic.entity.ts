import { Column, Entity, PrimaryColumn } from "typeorm";
import { IUserDayStatistic } from "../interfaces/interfaces";

@Entity("userStatistic")
export class UserStatisticEntity {
    @PrimaryColumn()
    userId: string;

    @Column()
    learnedWords: number;

    @Column("simple-json")
    optional: Record<string, IUserDayStatistic>;

    toResponse() {
        const { learnedWords, optional } = this;
        return { learnedWords, optional };
    }
}
