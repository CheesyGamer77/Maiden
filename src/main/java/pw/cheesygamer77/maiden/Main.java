package pw.cheesygamer77.maiden;

import net.dv8tion.jda.api.JDA;
import net.dv8tion.jda.api.JDABuilder;
import net.dv8tion.jda.api.requests.GatewayIntent;
import net.dv8tion.jda.api.utils.ChunkingFilter;
import net.dv8tion.jda.api.utils.MemberCachePolicy;
import net.dv8tion.jda.api.utils.data.DataObject;

import javax.security.auth.login.LoginException;
import java.io.InputStream;

public final class Main {
    public static void main(String[] args) throws LoginException, InterruptedException {
        // load config json
        InputStream resource = Main.class.getResourceAsStream("/config.json");

        if (resource == null)
            throw new IllegalArgumentException("Config file is not found!");

        // retrieve config
        final String TOKEN = DataObject.fromJson(resource).getString("token");

        JDA jda = JDABuilder.createDefault(TOKEN)
                .setChunkingFilter(ChunkingFilter.ALL)
                .setMemberCachePolicy(MemberCachePolicy.ALL)
                .enableIntents(
                        GatewayIntent.GUILD_MEMBERS,
                        GatewayIntent.GUILD_MESSAGES
                )
                .build()
                .awaitReady()
                .setRequiredScopes("applications.commands");
    }
}
