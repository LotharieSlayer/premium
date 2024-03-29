/* eslint-disable no-case-declarations */
const { upsert, get } = require("../../../utils/mongoUtils");

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
async function execute(interaction, client) {
    switch (interaction.options._subcommand) {
        case "premium":
            const premiumRoles = interaction.options
                .getString("premium_roles")
                .split(",");

            // MongoDB
            const collectionPremium = client.mongo.commons.collection("premium")
            await upsert(interaction.guild.id, premiumRoles, collectionPremium)

			// Build string
			let premiumRolesString = "";
			for(let i = 0; i < premiumRoles.length; i++){
				premiumRolesString += `<@&${premiumRoles[i]}> `;
			}
            
            await interaction.reply({
                content: `**Setup des rôles premium terminés !**\nRôles premium : ${premiumRolesString}`,
                ephemeral: true,
            });
            break;
    }
}

module.exports = {
    addSetupCommand,
    execute,
};
