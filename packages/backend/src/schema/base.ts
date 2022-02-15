import { iBase } from "@inbox/shared";
import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from "typeorm";

@Entity()
export abstract class sBase implements iBase {
  @PrimaryGeneratedColumn()
  _id: number;

  @VersionColumn({ default: 1 })
  _version: number;

  @CreateDateColumn()
  _created_at?: Date;

  @UpdateDateColumn()
  _update_at?: Date;
}
