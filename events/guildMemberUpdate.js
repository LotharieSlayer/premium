/**
 * @author Lothaire Guée
 * @description
 *      This event is used to track member who entered.
 */

const JsonColors = require(`../files/colors.json`);
const { get } = require("../../../utils/mongoUtils");

/* ----------------------------------------------- */
/* FUNCTIONS                                       */
/* ----------------------------------------------- */
/**
 * Function called when the event 'guildMemberUpdate' is emitted.
 * @param {GuildMember} oldMember The previous member object.
 * @param {GuildMember} newMember The new member object.
 */
async function execute( oldMember, newMember, client ) {
	removeColorRole(newMember, client)
}

async function removeColorRole(member, client) {
	const collectionPremium = client.mongo.commons.collection("premium")
	const premiumRoles = await get(member.guild.id, collectionPremium);

	// Si l'utilisateur n'a pas le rôle premium
	if(!premiumRoles.value.some(role => member.roles.cache.has(role))){
		for(let color in JsonColors){
			if(member.roles.cache.has(JsonColors[color].value)){
				member.roles.remove(JsonColors[color].value);
			}
		}
	}
}


/* ----------------------------------------------- */
/* MODULE EXPORTS                                  */
/* ----------------------------------------------- */
module.exports = {
	name: "guildMemberUpdate",
	execute
}
