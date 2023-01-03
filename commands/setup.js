const { setupPremium } = require("../utils/enmapUtils");

async function addSetupCommand(slashCommand) {
    slashCommand.addSubcommand((subcommand) =>
    subcommand
        .setName("premium")
        .setDescription(
            "Entrez l'ID du/des rôles Premium sur votre serveur. (séparé d'une \",\" si plusieurs)"
        )
        .addStringOption((string) =>
            string
                .setName("premium_roles")
                .setDescription(
                    "Entrez l'ID du/des rôles Premium sur votre serveur. (séparé d'une \",\" si plusieurs)"
                )
        )
    );
}

/* ----------------------------------------------- */
/* FUNCTIONS                                       */
/* ----------------------------------------------- */
/**
 * Fonction appelé quand la commande est 'setup'
 * @param {CommandInteraction} interaction L'interaction généré par l'exécution de la commande.
 */
async function execute(interaction) {
    switch (interaction.options._subcommand) {
        case "premium":
            // eslint-disable-next-line no-case-declarations
            const premiumRoles = interaction.options
                .getString("premium_roles")
                .split(",");
            setupPremium.set(interaction.guild.id, premiumRoles);
            await interaction.reply({
                content: `**Setup des rôles premium terminés !**\nRôles premium : ${premiumRoles}`,
                ephemeral: true,
            });
            break;
    }
}

module.exports = {
    addSetupCommand,
    execute,
};
