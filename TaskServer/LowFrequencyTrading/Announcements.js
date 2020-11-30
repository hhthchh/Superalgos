exports.newAnnouncements = function (processIndex, bot, logger) {

    const MODULE_NAME = 'Announcements'

    let thisObject = {
        makeAnnoucements: makeAnnoucements,
        initialize: initialize,
        finalize: finalize
    }

    let tradingSystem
    let tradingEngine

    return thisObject

    function initialize() {
        tradingSystem = bot.simulationState.tradingSystem
        tradingEngine = bot.simulationState.tradingEngine
    }

    function finalize() {
        tradingSystem = undefined
        tradingEngine = undefined
        TS.projects.superalgos.globals.processConstants.CONSTANTS_BY_PROCESS_INDEX_MAP.get(processIndex).SESSION_NODE.messagesSent = undefined
    }

    function makeAnnoucements(node) {
        if (node.announcements !== undefined) {
            for (let i = 0; i < node.announcements.length; i++) {
                let announcement = node.announcements[i]
                let canAnnounce = true
                if (announcement.announcementCondition !== undefined) {
                    let conditionValue
                    try {
                        conditionValue = eval(announcement.announcementCondition.code)
                    } catch (err) {
                        tradingSystem.errors.push([announcement.announcementCondition.id, err.message])
                    }
                    if (conditionValue !== true) { canAnnounce = false }
                }
                if (canAnnounce === true) {
                    let text = announcement.config.text
                    if (announcement.formula !== undefined) {
                        text = tradingSystem.formulas.get(announcement.formula.id)
                    }

                    if (TS.projects.superalgos.globals.processConstants.CONSTANTS_BY_PROCESS_INDEX_MAP.get(processIndex).SESSION_NODE.socialBots !== undefined) {
                        TS.projects.superalgos.globals.processConstants.CONSTANTS_BY_PROCESS_INDEX_MAP.get(processIndex).SESSION_NODE.socialBots.announce(text)
                        tradingSystem.announcements.push([announcement.id, text])
                    } else {
                        tradingSystem.errors.push([announcement.id, 'Could not announce because session does not have Social Bots.'])
                    }
                }
            }
        }
    }
}