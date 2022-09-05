import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity("userSettingsEntity")
export class UserSettingsEntity {
    @PrimaryColumn()
    userId: string;

    @Column()
    wordsPerDay: number;

    @Column("simple-json")
    optional: Record<string, unknown>;

    toResponse() {
        const { userId, wordsPerDay, optional } = this;
        return { userId, wordsPerDay, optional };
    }
}
