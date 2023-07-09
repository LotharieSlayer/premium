/**
 * @author Lothaire Guée
 * @description
 *      Contient la commande 'color'.
 *      Change la couleur de pseudo d'un sub.
 */

const { SlashCommandBuilder } = require("@discordjs/builders");
const JsonColors = require(`../files/colors.json`);
const { get } = require("../../../utils/mongoUtils");

/* ----------------------------------------------- */
/* COMMAND BUILD                                   */
/* ----------------------------------------------- */
const slashCommand = new SlashCommandBuilder()
	.setName("color")
	.setDescription(
		"[premium] Change la couleur de votre pseudo."
	);

    // Set les warns disponibles dans le JSON
    let colors = [];
    for(let color in JsonColors){
        colors.push({ name: JsonColors[color].name, value: JsonColors[color].value });
    }
	
	// Ajouter les options
	slashCommand.addStringOption((option) =>
		option
			.setName("color")
			.setDescription("Entrez l'utilisateur.")
			.addChoices(...colors)
			.setRequired(true)
	);

/* ----------------------------------------------- */
/* FUNCTIONS                                       */
/* ----------------------------------------------- */
/**
 * Fonction appelé quand la commande est 'color'
 * @param {CommandInteraction} interaction L'interaction généré par l'exécution de la commande.
 */
async function execute(interaction, client) {

	// Vérifier si l'utilisateur a le rôle premium
	const collectionPremium = client.mongo.commons.collection("premium")
	const premiumRoles = await get(interaction.guild.id, collectionPremium);

	// Si l'utilisateur n'a pas le rôle premium
	if(!premiumRoles.value.some(role => interaction.member.roles.cache.has(role))){
		await interaction.reply({
			content: `Hey ! Désolé mais cette commande est réservé aux subs ! :weary:\nSi tu veux avoir accès à cette commande, tu peux voir comment on devient sub dans <#821079509734391848> !`,
			ephemeral: true,
		});
		return;
	}

	const member = interaction.member;
	const color = interaction.options.getString("color");

	// Retirer toutes les couleurs sauf celle choisie
	for(let color in JsonColors){
		if(member.roles.cache.has(JsonColors[color].value)){
			if(JsonColors[color].value === color) {
				await member.roles.remove(JsonColors[color].value);
				return;
			}
			await member.roles.remove(JsonColors[color].value);
		}
	}

	// Si l'utilisateur a déjà la couleur
	if(member.roles.cache.has(color)){
		await interaction.reply({
			content: `Tu as déjà cette couleur !`,
			ephemeral: true,
		});
		return;
	}

	// Ajouter la couleur
	await member.roles.add(color);

	// Répondre à l'utilisateur
	await interaction.reply({
		content: `Wow ! Tu t'es fais toute belle pour sortir !`,
		ephemeral: true,
	});
}

/* ----------------------------------------------- */
/* MODULE EXPORTS                                  */
/* ----------------------------------------------- */
module.exports = {
	data: slashCommand,
	execute,
};
