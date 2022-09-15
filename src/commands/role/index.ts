import { CacheType, ChatInputCommandInteraction, PermissionFlagsBits } from 'discord.js';
import { RoleListMembersCommand } from './list-members';
import { PermissionLockedSlashCommand } from '../internal/slash';
import { RoleCompareMembersCommand } from './compare-members';

export class RoleCommands extends PermissionLockedSlashCommand {
    constructor() {
        super('role', 'Commands for role management', PermissionFlagsBits.ManageRoles);

        this.addSubcommands(
            new RoleListMembersCommand(),
            new RoleCompareMembersCommand()
        );
    }

    // eslint-disable-next-line max-len
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-empty-function, @typescript-eslint/no-empty-function
    override async invoke(_: ChatInputCommandInteraction<CacheType>): Promise<void> {}
}
