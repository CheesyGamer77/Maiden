import { PermissionLockedSlashCommand } from 'cheesyutils.js';
import { CacheType, ChatInputCommandInteraction, PermissionFlagsBits } from 'discord.js';
import { RoleCompareMembersCommand } from './compare-members';
import { RoleListCommand } from './list';
import { RoleListMembersCommand } from './list-members';

export class RoleCommands extends PermissionLockedSlashCommand {
    constructor() {
        super('role', 'Commands for role management', PermissionFlagsBits.ManageRoles);

        this.addSubcommands(
            new RoleListMembersCommand(),
            new RoleCompareMembersCommand(),
            new RoleListCommand(),
        );
    }

    // eslint-disable-next-line max-len
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-empty-function, @typescript-eslint/no-empty-function
    override async invoke(_: ChatInputCommandInteraction<CacheType>): Promise<void> {}
}
