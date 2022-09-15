import process from 'node:process';
import { Guild, Role } from 'discord.js';
import * as dotenv from 'dotenv';
import { client } from './client';

export class Maiden {
    public static readonly client = client;

    public static async init() {
        dotenv.config();
        await this.client.login(process.env.DISCORD_TOKEN);
    }

    public static async fetchMembersWithRole(guild: Guild, role: Role) {
        const members = await guild.members.fetch();
        return members?.filter((member, _, __) => member.roles.cache.has(role.id));
    }
}
