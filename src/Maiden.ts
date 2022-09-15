import process from 'node:process';
import * as dotenv from 'dotenv';
import { client } from './client';

export class Maiden {
    public static readonly client = client;

    public static async init() {
        dotenv.config();
        await this.client.login(process.env.DISCORD_TOKEN);
    }
}
