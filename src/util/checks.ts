import { Interaction, PermissionResolvable } from 'discord.js';

type HasPermissionsOptions = {
    ctx: Interaction<'cached'>,
    perms: PermissionResolvable
}

export function hasPermissions(opts: HasPermissionsOptions) {
    const { ctx, perms } = opts;

    if (!ctx.channel) {
        return false;
    }

    return ctx.guild.members.me?.permissionsIn(ctx.channel).has(perms) ?? false;
}
